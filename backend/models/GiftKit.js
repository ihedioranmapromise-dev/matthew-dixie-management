const { pool } = require("../config/db");;

const GiftKit = {
  // Create a new gift kit for a fan card
  create: async (fanCardId) => {
    const result = await pool.query(
      'INSERT INTO gift_kits (fan_card_id) VALUES ($1) RETURNING *',
      [fanCardId]
    );
    return result.rows[0];
  },

  // Get gift kit by fan card ID
  findByFanCardId: async (fanCardId) => {
    const result = await pool.query('SELECT * FROM gift_kits WHERE fan_card_id = $1', [fanCardId]);
    return result.rows[0];
  },

  // Update gift kit status
  updateStatus: async (id, status, trackingNumber = null) => {
    const query = trackingNumber
      ? 'UPDATE gift_kits SET status = $1, tracking_number = $2 WHERE id = $3 RETURNING *'
      : 'UPDATE gift_kits SET status = $1 WHERE id = $2 RETURNING *';
    const params = trackingNumber ? [status, trackingNumber, id] : [status, id];
    const result = await pool.query(query, params);
    return result.rows[0];
  },

  // Mark as shipped
  markShipped: async (id, trackingNumber) => {
    const result = await pool.query(
      'UPDATE gift_kits SET status = $1, tracking_number = $2, shipped_at = NOW() WHERE id = $3 RETURNING *',
      ['shipped', trackingNumber, id]
    );
    return result.rows[0];
  },

  // Mark as delivered
  markDelivered: async (id) => {
    const result = await pool.query(
      'UPDATE gift_kits SET status = $1, delivered_at = NOW() WHERE id = $2 RETURNING *',
      ['delivered', id]
    );
    return result.rows[0];
  }
};

module.exports = GiftKit;
