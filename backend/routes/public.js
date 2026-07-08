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

// Public investments
router.get('/investments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM investments WHERE is_active = true ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public blog posts (published only)
router.get('/blog-posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blog_posts WHERE is_published = true ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public media (featured only)
router.get('/media', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM media WHERE is_featured = true ORDER BY created_at DESC LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public site content
router.get('/site-content', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM site_content');
    const content = {};
    result.rows.forEach(row => { content[row.key] = row.value; });
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
