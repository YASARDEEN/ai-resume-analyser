const express = require('express');
const atsController = require('../controllers/ats.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.post('/analyze', atsController.analyzeResumeForJob);
router.get('/rankings/:jobId', restrictTo('admin'), atsController.getJobRankings);

module.exports = router;
