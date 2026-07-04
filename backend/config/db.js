const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log('✅ Supabase (PostgreSQL) Connected'))
  .catch(err => console.error('❌ Connection error', err.stack));

module.exports = pool;
