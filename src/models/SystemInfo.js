const mongoose = require('mongoose');

const systemInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  website: { type: String, required: true },
  icon: { type: String, required: true },
  category: { type: String, required: true },
  color: { type: String, default: '#000000' },
  is_active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SystemInfo', systemInfoSchema); 