const express = require('express');
const jobController = require('../controllers/job.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.post('/', restrictTo('admin'), jobController.createJob);
router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobById);

module.exports = router;
