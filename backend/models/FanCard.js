const pool = require('../config/db');

const FanCard = {
  // Create a new fan card
  create: async (userId, cardNumber, tier, address) => {
    const result = await pool.query(
      `INSERT INTO fan_cards (user_id, card_number, tier, address) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [userId, cardNumber, tier, address]
    );
    return result.rows[0];
  },

  // Get fan card by user ID
  findByUserId: async (userId) => {
    const result = await pool.query('SELECT * FROM fan_cards WHERE user_id = $1', [userId]);
    return result.rows[0];
  },

  // Update fan card status
  updateStatus: async (id, status) => {
    const result = await pool.query(
      'UPDATE fan_cards SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  },

  // Update shipping address
  updateAddress: async (id, address) => {
    const result = await pool.query(
      'UPDATE fan_cards SET address = $1 WHERE id = $2 RETURNING *',
      [address, id]
    );
    return result.rows[0];
  }
};

module.exports = FanCard;
