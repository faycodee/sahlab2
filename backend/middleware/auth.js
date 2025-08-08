const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
exports.authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Middleware to check if user is admin
exports.requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Error checking admin status' });
  }
};

// Middleware to check if user is active
exports.requireActiveUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.isActive) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Error checking user status' });
  }
};
