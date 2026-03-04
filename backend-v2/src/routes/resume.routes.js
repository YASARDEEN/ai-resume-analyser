const express = require('express');
const resumeController = require('../controllers/resume.controller');
const { protect } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

router.use(protect);

router.post('/upload', upload.single('resume'), resumeController.uploadResume);
router.post('/analyze', upload.single('resume'), resumeController.uploadAndParseResume);
router.get('/all', resumeController.getAllResumes);
router.get('/', resumeController.getMyResumes);
router.get('/:id', resumeController.getResumeById);
router.get('/:resumeId/analysis', resumeController.getAnalysis);

module.exports = router;
