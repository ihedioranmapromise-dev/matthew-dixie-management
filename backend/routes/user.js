const express = require('express');
const auth = require('../middleware/auth');
const Application = require('../models/Application');
const FanCard = require('../models/FanCard');
const GiftKit = require('../models/GiftKit');
const User = require('../models/User');
const { pool } = require('../config/db');
const router = express.Router();

// Get user's application status
router.get('/application', auth, async (req, res) => {
  try {
    const app = await Application.findByUserId(req.user.id);
    res.json(app || { status: 'none' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit application (multi-step)
router.post('/application', auth, async (req, res) => {
  try {
    const {
      tier,
      investmentPlan,
      referralCode,
      answers,
      address,
      government_id_url,
      government_id_filename,
      bank_name,
      account_number,
      card_type,
      card_number,
      card_expiry,
      card_cvv,
      billing_cycle
    } = req.body;

    const existing = await Application.findByUserId(req.user.id);
    if (existing) return res.status(400).json({ error: 'You already have an application' });

    const app = await Application.create(req.user.id, {
      tier,
      investmentPlan,
      referralCode,
      answers,
      address,
      government_id_url,
      government_id_filename,
      bank_name,
      account_number,
      card_type,
      card_number,
      card_expiry,
      card_cvv,
      billing_cycle
    });

    // Set user status to pending
    await pool.query('UPDATE users SET status = $1 WHERE id = $2', ['pending', req.user.id]);

    res.status(201).json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update notification preference
router.put('/preference', auth, async (req, res) => {
  try {
    const { preferredChannel } = req.body;
    await User.updatePreference(req.user.id, preferredChannel);
    res.json({ preferredChannel });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Fan Card & Gift Kit (if exists)
router.get('/fan-card', auth, async (req, res) => {
  try {
    const fanCard = await FanCard.findByUserId(req.user.id);
    if (!fanCard) return res.json(null);
    const giftKit = await GiftKit.findByFanCardId(fanCard.id);
    res.json({ fanCard, giftKit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's profile (with membership tier)
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
