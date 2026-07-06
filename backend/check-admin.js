const { pool } = require('./config/db');
const bcrypt = require('bcrypt');

async function checkAdmin() {
  try {
    const result = await pool.query('SELECT id, email, password FROM users WHERE email = $1', ['matthewdixie76@gmail.com']);
    if (result.rows.length === 0) {
      console.log('❌ Admin user not found in database.');
    } else {
      const admin = result.rows[0];
      console.log('✅ Admin found: ID=' + admin.id + ', Email=' + admin.email);
      const isMatch = await bcrypt.compare('WORKandPRAY@1', admin.password);
      console.log('Password matches? ' + (isMatch ? '✅ Yes' : '❌ No'));
    }
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkAdmin();
