const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: 10,
  multipleStatements: true,
};

const pool = mysql.createPool(dbConfig);

// Test DB Connection
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Database connection successful");
    conn.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
})();

async function query(sql, params) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error("❌ SQL Error:", error); // Keep this for dev
    throw error; // Pass real error to service/controller
  }
}

module.exports = { query };
