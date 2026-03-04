const db = require('../database/db');

exports.getDashboardOverview = async (req, res, next) => {
    try {
        const totalApplicants = await db.query('SELECT COUNT(*) FROM resumes;');
        const activeJobs = await db.query("SELECT COUNT(*) FROM jobs WHERE status = 'active';");
        const avgScore = await db.query('SELECT AVG(score) FROM ats_scores;');

        res.status(200).json({
            totalApplicants: parseInt(totalApplicants.rows[0].count),
            activeJobs: parseInt(activeJobs.rows[0].count),
            averageAtsScore: Math.round(avgScore.rows[0].avg || 0)
        });
    } catch (error) {
        next(error);
    }
};

exports.getTrendData = async (req, res, next) => {
    try {
        const query = `
      SELECT DATE_TRUNC('week', created_at) as week, COUNT(*) as count
      FROM resumes
      GROUP BY week
      ORDER BY week DESC
      LIMIT 12;
    `;
        const { rows } = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        next(error);
    }
};
