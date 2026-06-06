const { Pool } = require("pg");
const path = require("path");

// Load environment variables using absolute path
require("dotenv").config({ path: path.join(__dirname, ".env") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 1000,
  connectionTimeoutMillis: 15000,
  ssl:
    process.env.NODE_ENV === "production" ||
    (process.env.DATABASE_URL &&
      (process.env.DATABASE_URL.includes("supabase.co") ||
        process.env.DATABASE_URL.includes("supabase.com") ||
        process.env.DATABASE_URL.includes("pooler.supabase.com")))
      ? { rejectUnauthorized: false }
      : false,
});

pool.on("connect", () => {
  console.log("✅ PostgreSQL Connected");
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL Error:", err);
});

// Circuit Breaker State to prevent stalls during network/DNS downtime
let dbState = {
  status: "closed", // 'closed', 'open', 'half-open'
  failureCount: 0,
  lastFailureTime: 0,
  THRESHOLD: 2,         // Trip after 2 consecutive network connection failures
  COOLDOWN_MS: 30000,   // Cooldown period of 30 seconds before testing the DB again
};

function tripBreaker(err) {
  dbState.failureCount++;
  dbState.lastFailureTime = Date.now();
  if (dbState.failureCount >= dbState.THRESHOLD && dbState.status !== "open") {
    dbState.status = "open";
    console.error(`🚨 [Database Circuit Breaker] TRIPPED! Database is marked OFFLINE. Error: ${err.message}`);
  }
}

function resetBreaker() {
  dbState.status = "closed";
  dbState.failureCount = 0;
  console.log("✅ [Database Circuit Breaker] RESET! Database is marked ONLINE.");
}

pool.on("connect", () => {
  if (dbState.status === "open" || dbState.status === "half-open") {
    resetBreaker();
  }
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL Pool Error:", err.message);
  tripBreaker(err);
});

// Overwrite pool.query with robust auto-retry logic and Circuit Breaker fail-fast
const originalQuery = pool.query.bind(pool);
pool.query = async function (text, params, callback) {
  // If callbacks are used, fallback to original query directly
  if (typeof params === 'function' || typeof callback === 'function') {
    return originalQuery(text, params, callback);
  }

  // Circuit Breaker Fast-Fail Check
  if (dbState.status === "open") {
    const elapsed = Date.now() - dbState.lastFailureTime;
    if (elapsed > dbState.COOLDOWN_MS) {
      console.log("🔄 [Database Circuit Breaker] Cooldown expired. Testing database connection (half-open)...");
      dbState.status = "half-open";
    } else {
      const fastFailErr = new Error(`Database is currently offline (Circuit Breaker Open). Original error: ${dbState.lastFailureTime ? 'Connection timeout/DNS unresolved' : 'Unknown'}`);
      fastFailErr.code = "CIRCUIT_BREAKER_OPEN";
      throw fastFailErr;
    }
  }

  let retries = dbState.status === "half-open" ? 1 : 2;
  while (retries > 0) {
    try {
      const result = await originalQuery(text, params);
      if (dbState.status === "half-open" || dbState.failureCount > 0) {
        resetBreaker();
      }
      return result;
    } catch (err) {
      retries--;
      
      const isConnectionError =
        err.code === 'ENOTFOUND' ||
        err.code === 'ECONNREFUSED' ||
        err.code === 'ETIMEDOUT' ||
        err.code === 'EAI_AGAIN' ||
        err.message.includes('ENOTFOUND') ||
        err.message.includes('ECONNREFUSED') ||
        err.message.includes('timeout') ||
        err.message.includes('terminated') ||
        err.message.includes('connection') ||
        err.code === '57P01' || // admin_shutdown
        err.code === '57P03';   // cannot_connect_now

      if (isConnectionError) {
        tripBreaker(err);
      }

      if (retries === 0 || !isConnectionError) {
        throw err;
      }
      
      console.warn(`⚠️ DB Query failed (retries remaining: ${retries}):`, err.message);
      // Wait 500ms before retrying
      await new Promise(r => setTimeout(r, 500));
    }
  }
};

// Health Check Function
async function checkDb() {
  if (dbState.status === "open") return false;
  try {
    await originalQuery("SELECT NOW()");
    resetBreaker();
    console.log("Database healthy");
    return true;
  } catch (err) {
    tripBreaker(err);
    return false;
  }
}

// Custom Query Helper (returns rows directly)
async function queryHelper(text, params) {
  const result = await pool.query(text, params);
  return result.rows;
}

// Attach helpers to the exported pool instance
pool.checkDb = checkDb;
pool.queryHelper = queryHelper;
pool.getIsOffline = () => dbState.status === "open";

module.exports = pool;
