const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Function to test connection (used in server.js)
const connectDB = async () => {
  try {
    await pool.connect();
    console.log('✅ Supabase (PostgreSQL) Connected');
  } catch (err) {
    console.error('❌ Connection error', err.stack);
    process.exit(1);
  }
};

// Export both the pool (for models) and the connectDB function (for server)
module.exports = connectDB;
module.exports.pool = pool;
