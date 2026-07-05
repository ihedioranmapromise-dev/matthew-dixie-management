const { pool } = require("../config/db");;

const Application = {
  // Create a new application
  create: async (userId, tier, investmentPlan, referralCode, answers) => {
    const result = await pool.query(
      `INSERT INTO applications (user_id, tier, investment_plan, referral_code, answers) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [userId, tier, investmentPlan, referralCode, answers]
    );
    return result.rows[0];
  },

  // Get application by user ID
  findByUserId: async (userId) => {
    const result = await pool.query('SELECT * FROM applications WHERE user_id = $1', [userId]);
    return result.rows[0];
  },

  // Get application by ID
  findById: async (id) => {
    const result = await pool.query('SELECT * FROM applications WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Update application status
  updateStatus: async (id, status, adminNotes, invoiceDetails) => {
    const result = await pool.query(
      `UPDATE applications 
       SET status = $1, admin_notes = $2, invoice_details = $3, updated_at = NOW() 
       WHERE id = $4 
       RETURNING *`,
      [status, adminNotes, invoiceDetails, id]
    );
    return result.rows[0];
  },

  // Get all applications (admin)
  findAll: async (status = null) => {
    let query = 'SELECT * FROM applications';
    const params = [];
    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    return result.rows;
  }
};

module.exports = Application;
