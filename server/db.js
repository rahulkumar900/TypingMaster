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

// Overwrite pool.query with robust auto-retry logic to handle pooler disconnections
const originalQuery = pool.query.bind(pool);
pool.query = async function (text, params, callback) {
  // If callbacks are used, fallback to original query directly
  if (typeof params === 'function' || typeof callback === 'function') {
    return originalQuery(text, params, callback);
  }

  let retries = 3;
  while (retries > 0) {
    try {
      return await originalQuery(text, params);
    } catch (err) {
      retries--;
      console.warn(`⚠️ DB Query failed (retries remaining: ${retries}):`, err.message);

      const isConnectionError =
        err.message.includes('terminated') ||
        err.message.includes('timeout') ||
        err.message.includes('closed') ||
        err.message.includes('connection') ||
        err.code === '57P01' || // admin_shutdown
        err.code === '57P03';   // cannot_connect_now

      if (retries === 0 || !isConnectionError) {
        throw err;
      }
      // Wait 500ms before retrying to let the pool clean up bad connections
      await new Promise(r => setTimeout(r, 500));
    }
  }
};

// Health Check Function
async function checkDb() {
  try {
    await pool.query("SELECT NOW()");
    console.log("Database healthy");
    return true;
  } catch (err) {
    console.error("❌ Database Health Check Failed:", err);
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

module.exports = pool;
