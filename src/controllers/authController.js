const jwt = require('jsonwebtoken');
const axios = require('axios');
const { User, OTP } = require('../models');

// Send OTP to user mobile
const sendOTP = async (req, res) => {
  try {
    const { mobile } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date(Date.now() + 600000); // 10 minutes

    await OTP.create({ mobile, code, expiresAt, used: false });

    const message = `کد ورود شما: ${code}\n\nمسیار`;
    const payload = new URLSearchParams({
      Username: process.env.SMS_USERNAME,
      Password: process.env.SMS_PASSWORD,
      Mobile: mobile,
      Message: message
    });

    await axios.post(process.env.SMS_API_URL, payload);
    res.json({ success: true });
  } catch (err) {
    console.error('OTP send error:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

// Verify OTP and issue tokens
const verifyOTP = async (req, res) => {
  try {
    const { mobile, code } = req.body;
    const otp = await OTP.findOneAndUpdate(
      { mobile, code, used: false, expiresAt: { $gt: new Date() } },
      { $set: { used: true } }
    );

    if (!otp) return res.status(400).json({ error: 'Invalid OTP' });

    let user = await User.findOne({ mobile });
    if (!user) user = await User.create({ mobile });

    const accessToken = jwt.sign(
      { userId: user._id, mobile },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ error: 'Verification failed' });
  }
};

// Refresh access token using refresh token
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ error: 'رفرش توکن الزامی است' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findOne({ _id: decoded.userId, refreshToken });
    
    if (!user) {
      return res.status(401).json({ error: 'رفرش توکن نامعتبر' });
    }

    const newAccessToken = jwt.sign(
      { userId: user._id, mobile: user.mobile },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const newRefreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(403).json({ error: 'رفرش توکن نامعتبر یا منقضی شده' });
  }
};

// Generate admin token
const generateAdminToken = async (req, res) => {
  const { mobile } = req.body;
  if (mobile !== process.env.ADMIN_MOBILE) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = jwt.sign(
    { mobile, isAdmin: true },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
};

module.exports = {
  sendOTP,
  verifyOTP,
  refreshToken,
  generateAdminToken
}; 