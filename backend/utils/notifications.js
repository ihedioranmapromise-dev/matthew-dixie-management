const { pool } = require('../config/db');

const createNotification = async (userId, type, message) => {
  try {
    await pool.query(
      'INSERT INTO notifications (user_id, type, message) VALUES ($1, $2, $3)',
      [userId, type, message]
    );
    console.log(`✅ Notification created for user ${userId}: ${type}`);
    return { success: true };
  } catch (err) {
    console.error('❌ Notification error:', err.message);
    return { success: false, error: err.message };
  }
};

module.exports = createNotification;
