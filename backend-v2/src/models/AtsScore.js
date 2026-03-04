const db = require('../database/db');

const AtsScore = {
    create: async ({ resume_id, job_id, score, confidence, analysis }) => {
        const query = `
      INSERT INTO ats_scores (resume_id, job_id, score, confidence, analysis)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
        const values = [resume_id, job_id, score, confidence, JSON.stringify(analysis)];
        const { rows } = await db.query(query, values);
        return rows[0];
    },

    getRankings: async (job_id) => {
        const query = `
      SELECT a.*, r.file_name, r.file_url, u.name as candidate_name, u.email
      FROM ats_scores a
      JOIN resumes r ON a.resume_id = r.id
      JOIN users u ON r.user_id = u.id
      WHERE a.job_id = $1
      ORDER BY a.score DESC;
    `;
        const { rows } = await db.query(query, [job_id]);
        return rows;
    }
};

module.exports = AtsScore;
