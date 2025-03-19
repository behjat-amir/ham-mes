const express = require('express');
const router = express.Router();
const apiKeyController = require('../controllers/apiKeyController');
const { authenticateUser } = require('../middlewares/auth');
const { imageUpload } = require('../middlewares/upload');

// API key routes
router.post('/generate-key', authenticateUser, imageUpload.single('image'), apiKeyController.generateKey);
router.get('/keys', authenticateUser, apiKeyController.getAllKeys);

module.exports = router; 