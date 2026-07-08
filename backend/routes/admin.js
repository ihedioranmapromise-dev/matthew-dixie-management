const express = require('express');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { pool } = require('../config/db');
const Application = require('../models/Application');
const FanCard = require('../models/FanCard');
const GiftKit = require('../models/GiftKit');
const User = require('../models/User');
const router = express.Router();

// Admin login – password only
router.post('/login', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'WORKandPRAY@1';
  
  if (password === adminPassword) {
    const token = jwt.sign(
      { id: 999, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ 
      token, 
      user: { id: 999, name: 'Admin', email: 'admin@matthewdixie.com', role: 'admin' } 
    });
  } else {
    res.status(401).json({ error: 'Invalid admin password' });
  }
});

// All other admin routes require auth + admin role
router.use(auth, admin);

// ---- Applications ----
router.get('/applications', async (req, res) => {
  try {
    const { status } = req.query;
    const apps = await Application.findAll(status);
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/applications/:id', async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ error: 'Application not found' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/applications/:id', async (req, res) => {
  try {
    const { status, adminNotes, invoiceDetails } = req.body;
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ error: 'Application not found' });

    const updated = await Application.updateStatus(req.params.id, status, adminNotes, invoiceDetails);

    if (status === 'approved') {
      const user = await User.findById(app.user_id);
      const cardNumber = `MD${Date.now().toString(36).toUpperCase()}`;
      const fanCard = await FanCard.create(user.id, cardNumber, app.tier, null);
      await User.updateTier(user.id, app.tier);
      await GiftKit.create(fanCard.id);
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Tiers ----
router.get('/tiers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tiers ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/tiers/:id', async (req, res) => {
  try {
    const { name, price_monthly, price_yearly, benefits, is_active } = req.body;
    const id = req.params.id;
    const result = await pool.query(
      `UPDATE tiers 
       SET name = $1, price_monthly = $2, price_yearly = $3, benefits = $4, is_active = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [name, price_monthly, price_yearly, benefits, is_active, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tier not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Users ----
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role, membership_tier, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Support ----
router.get('/support-info', async (req, res) => {
  res.json({
    email: process.env.SUPPORT_EMAIL || 'support@matthewdixie.com',
    whatsapp: process.env.WHATSAPP_NUMBER || '+1234567890'
  });
});

module.exports = router;

// ---- User Management ----
// Update user tier
router.put('/users/:id/tier', async (req, res) => {
  try {
    const { tier } = req.body;
    const userId = req.params.id;
    const result = await pool.query(
      'UPDATE users SET membership_tier = $1 WHERE id = $2 RETURNING id, name, email, membership_tier',
      [tier || null, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
