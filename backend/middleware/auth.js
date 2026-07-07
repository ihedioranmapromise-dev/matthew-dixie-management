const jwt = require('jsonwebtoken');
const pool = require('../config/db');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // If the token is for admin (id: 999), skip database lookup
    if (decoded.id === 999 && decoded.role === 'admin') {
      req.user = { id: 999, role: 'admin' };
      return next();
    }
    
    const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [decoded.id]);
    if (result.rows.length === 0) throw new Error();
    req.user = result.rows[0];
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};
