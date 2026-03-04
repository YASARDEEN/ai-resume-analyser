const AtsScore = require('../models/AtsScore');
const reportingService = require('../services/reporting.service');

exports.exportCandidateReport = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const rankings = await AtsScore.getRankings(jobId);

        if (req.query.format === 'csv') {
            const csv = reportingService.exportToCsv(rankings);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=candidates_job_${jobId}.csv`);
            return res.status(200).send(csv);
        }

        res.status(400).json({ message: 'Invalid format requested' });
    } catch (error) {
        next(error);
    }
};
