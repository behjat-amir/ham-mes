const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authorization required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // If user is admin, let them pass directly
    if (decoded.isAdmin) {
      req.user = decoded;
      return next();
    }

    const user = await User.findById(decoded.userId);
    if (!user || !user.is_active) return res.status(403).json({ error: 'Access denied' });

    req.user = { ...decoded, mobile: user.mobile };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const validateApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) return res.status(401).json({ error: 'API key required' });

  try {
    const { ApiKey } = require('../models');
    const keyDoc = await ApiKey.findOne({ key: apiKey, is_active: true });
    if (!keyDoc) return res.status(403).json({ error: 'Invalid API key' });

    req.sender = keyDoc.senderName;
    next();
  } catch (err) {
    res.status(500).json({ error: 'API key validation failed' });
  }
};

module.exports = {
  authenticateUser,
  validateApiKey
}; 