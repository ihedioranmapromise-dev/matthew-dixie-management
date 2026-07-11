const { pool } = require("../config/db");;
const bcrypt = require('bcrypt');

const User = {
  create: async (name, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, status) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, status',
      [name, email, hashedPassword, 'pending']
    );
    return result.rows[0];
  },

  findByEmail: async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  findById: async (id) => {
    const result = await pool.query('SELECT id, name, email, role, status, membership_tier FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  updatePreference: async (userId, channel) => {
    await pool.query('UPDATE users SET preferred_channel = $1 WHERE id = $2', [channel, userId]);
  },

  updateTier: async (userId, tier) => {
    await pool.query('UPDATE users SET membership_tier = $1 WHERE id = $2', [tier, userId]);
  },

  updateStatus: async (userId, status) => {
    const result = await pool.query(
      'UPDATE users SET status = $1 WHERE id = $2 RETURNING id, name, email, role, status, membership_tier',
      [status, userId]
    );
    return result.rows[0];
  }
};

module.exports = User;
