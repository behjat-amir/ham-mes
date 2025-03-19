const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  mobile: String,
  code: String,
  expiresAt: Date,
  used: Boolean
});

module.exports = mongoose.model('OTP', otpSchema); 