const pool = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
  // Create a new user
  create: async (name, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role',
      [name, email, hashedPassword]
    );
    return result.rows[0];
  },

  // Find user by email
  findByEmail: async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  // Find user by ID
  findById: async (id) => {
    const result = await pool.query('SELECT id, name, email, role, preferred_channel FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Update notification preference
  updatePreference: async (userId, channel) => {
    await pool.query('UPDATE users SET preferred_channel = $1 WHERE id = $2', [channel, userId]);
  },

  // Update membership tier
  updateTier: async (userId, tier) => {
    await pool.query('UPDATE users SET membership_tier = $1 WHERE id = $2', [tier, userId]);
  }
};

module.exports = User;
