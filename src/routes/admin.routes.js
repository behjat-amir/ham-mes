const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateUser } = require('../middlewares/auth');

// Admin routes
router.post('/update-user-status', authenticateUser, adminController.updateUserStatus);
router.post('/update-apikey-status', authenticateUser, adminController.updateApiKeyStatus);

module.exports = router; 