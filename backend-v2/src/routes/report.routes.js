const express = require('express');
const reportController = require('../controllers/report.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);
router.use(restrictTo('admin'));

router.get('/export/:jobId', reportController.exportCandidateReport);

module.exports = router;
