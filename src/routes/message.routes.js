const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticateUser, validateApiKey } = require('../middlewares/auth');

// Message routes
router.post('/send', validateApiKey, messageController.sendMessage);
router.get('/', authenticateUser, messageController.getMessages);

module.exports = router; 