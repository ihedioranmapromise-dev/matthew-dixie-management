require('dotenv').config();
const { pool } = require('./config/db');
const bcrypt = require('bcrypt');

async function createAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL || 'matthewdixie76@gmail.com';
    const password = process.env.ADMIN_PASSWORD || 'WORKandPRAY@1';
    
    console.log(`Creating admin user with email: ${email}`);
    
    // Check if admin already exists
    const check = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (check.rows.length > 0) {
      console.log('✅ Admin already exists. ID:', check.rows[0].id);
      return;
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert the admin user
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id',
      ['Super Admin', email, hashedPassword, 'admin']
    );
    
    console.log('✅ Admin created successfully! ID:', result.rows[0].id);
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
  process.exit(0);
}

createAdmin();
