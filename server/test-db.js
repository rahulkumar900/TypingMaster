const path = require("path");
const { Pool } = require("pg");

require("dotenv").config({
  path: path.resolve(process.cwd(), ".env"),
});

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is missing");
  process.exit(1);
}

console.log("DATABASE_URL:", "PRESENT");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

async function testConnection() {
  try {
    console.log("🔄 Connecting...");

    const start = Date.now();

    const result = await pool.query(`
      SELECT
        current_database(),
        current_user,
        version(),
        NOW()
    `);

    console.log("✅ Connected Successfully");
    console.log("Database:", result.rows[0].current_database);
    console.log("User:", result.rows[0].current_user);
    console.log("Time:", result.rows[0].now);
    console.log(`Took ${Date.now() - start}ms`);
  } catch (error) {
    console.error("❌ Connection Failed");
    console.error(error.message);

    if (error.code) {
      console.error("Code:", error.code);
    }
  } finally {
    await pool.end();
  }
}

testConnection();
