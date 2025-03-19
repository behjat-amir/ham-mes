const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');
const { authenticateUser } = require('../middlewares/auth');
const { imageUpload } = require('../middlewares/upload');

// System routes
router.post('/info', authenticateUser, imageUpload.single('icon'), systemController.addSystemInfo);
router.get('/info', systemController.getSystemInfo);
router.patch('/info/:id/status', authenticateUser, systemController.updateSystemStatus);
router.put('/info/:id', authenticateUser, systemController.updateSystemInfo);

// Banner routes
router.post('/banners', authenticateUser, imageUpload.single('image'), systemController.addBanner);
router.delete('/banners/:id', authenticateUser, systemController.deleteBanner);
router.get('/banners', systemController.getBanners);

module.exports = router; 