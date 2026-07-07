const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const connectDB = async () => {
  try {
    await pool.connect();
    console.log('✅ Supabase (PostgreSQL) Connected');
  } catch (err) {
    console.error('❌ Connection error', err.stack);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  pool
};
