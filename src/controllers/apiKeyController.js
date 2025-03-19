const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { ApiKey } = require('../models');

// Generate a new API key
const generateKey = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { senderName } = req.body;
    if (!senderName || !req.file) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Invalid data' });
    }

    const apiKey = uuidv4();
    const imageUrl = `/download/${req.file.filename}`;

    await ApiKey.create({
      key: apiKey,
      senderName,
      image: imageUrl,
      createdBy: req.user.userId
    });

    res.json({ apiKey, imageUrl });
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    console.error('API key generation error:', err);
    res.status(500).json({ error: 'Key generation failed' });
  }
};

// Get all API keys
const getAllKeys = async (req, res) => {
  try {
    const keys = await ApiKey.find({}).populate('createdBy', 'mobile');
    res.json(keys);
  } catch (err) {
    console.error('Get API keys error:', err);
    res.status(500).json({ error: 'Failed to fetch keys' });
  }
};

module.exports = {
  generateKey,
  getAllKeys
}; 