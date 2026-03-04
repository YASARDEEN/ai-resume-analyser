const express = require('express');
const analyticsController = require('../controllers/analytics.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);
router.use(restrictTo('admin'));

router.get('/overview', analyticsController.getDashboardOverview);
router.get('/trends', analyticsController.getTrendData);

module.exports = router;
