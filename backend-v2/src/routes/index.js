const express = require('express');
const authRoutes = require('./auth.routes');
const resumeRoutes = require('./resume.routes');
const atsRoutes = require('./ats.routes');
const jobRoutes = require('./job.routes');
const analyticsRoutes = require('./analytics.routes');
const reportRoutes = require('./report.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/resumes', resumeRoutes);
router.use('/ats', atsRoutes);
router.use('/jobs', jobRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
