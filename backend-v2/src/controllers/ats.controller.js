const AtsScore = require('../models/AtsScore');
const Job = require('../models/Job');
const Keyword = require('../models/Keyword');
const ParsedResume = require('../models/ParsedResume');
const scoringService = require('../services/scoring.service');

exports.analyzeResumeForJob = async (req, res, next) => {
    try {
        const { resumeId, jobId } = req.body;

        const parsedData = await ParsedResume.findByResumeId(resumeId);
        const keywords = await Keyword.findByJobId(jobId);

        if (!parsedData) return res.status(404).json({ message: 'Parsed resume data not found' });

        const result = scoringService.calculateScore(parsedData.extracted_data, keywords);

        const scoreRecord = await AtsScore.create({
            resume_id: resumeId,
            job_id: jobId,
            score: result.score,
            confidence: result.confidence,
            analysis: result.analysis
        });

        res.status(200).json(scoreRecord);
    } catch (error) {
        next(error);
    }
};

exports.getJobRankings = async (req, res, next) => {
    try {
        const rankings = await AtsScore.getRankings(req.params.jobId);
        res.status(200).json(rankings);
    } catch (error) {
        next(error);
    }
};
