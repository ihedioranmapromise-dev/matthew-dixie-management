const express = require('express');
const auth = require('../middleware/auth');
const Application = require('../models/Application');
const FanCard = require('../models/FanCard');
const GiftKit = require('../models/GiftKit');
const User = require('../models/User');
const { pool } = require('../config/db');
const sendEmail = require('../utils/email');
const createNotification = require('../utils/notifications');
const bcrypt = require('bcrypt');
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
      billing_cycle,
      payment_type,
      gift_card_image_url,
      crypto_proof_image_url,
      crypto_currency_selected
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
      billing_cycle,
      payment_type,
      gift_card_image_url,
      crypto_proof_image_url,
      crypto_currency_selected
    });

    // Set user status to pending
    await pool.query('UPDATE users SET status = $1 WHERE id = $2', ['pending', req.user.id]);

    // Update user's membership tier
    await pool.query('UPDATE users SET membership_tier = $1 WHERE id = $2', [tier, req.user.id]);

    // In-app notification
    await createNotification(
      req.user.id,
      'application_submitted',
      `Your application for ${tier} tier has been submitted. Awaiting approval.`
    );

    // Email notification
    const user = await User.findById(req.user.id);
    await sendEmail(
      user.email,
      'Application Submitted – Matthew Dixie',
      `<h1>Application Submitted</h1>
       <p>Thank you for applying to join the Inner Circle, ${user.name}.</p>
       <p>Your application for the <strong>${tier}</strong> tier is now under review.</p>
       <p>You will receive a notification once your application is approved.</p>
       <p>— The Matthew Dixie Team</p>`
    );

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

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, address, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, req.user.id]);
    }

    await pool.query(
      'UPDATE users SET name = $1, phone = $2, address = $3 WHERE id = $4',
      [name, phone, address, req.user.id]
    );

    const updatedUser = await User.findById(req.user.id);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Notifications ----
router.get('/notifications', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/notifications/:id/read', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE notifications SET read = true WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/notifications/read-all', auth, async (req, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET read = true WHERE user_id = $1',
      [req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;