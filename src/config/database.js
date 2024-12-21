import pg from "pg";
import dotenv from "dotenv";

function db_config() {
  dotenv.config(); 

  const { Pool } = pg;
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  // Establish the connection
  pool.connect((err) => {
    if (err) {
      console.error("Failed to connect to the database:", err.message);
      process.exit(1); // Exit the process if the connection fails
    } else {
      console.log("Database connection established successfully.");
    }
  });

  return pool;
}

export default db_config;
