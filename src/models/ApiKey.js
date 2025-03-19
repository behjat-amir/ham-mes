const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  key: String,
  senderName: String,
  image: String,
  is_active: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ApiKey', apiKeySchema); 