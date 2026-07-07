const express = require('express');
const { pool } = require('../config/db');
const router = express.Router();

// Get all active tiers (for public viewing)
router.get('/tiers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tiers WHERE is_active = true ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
