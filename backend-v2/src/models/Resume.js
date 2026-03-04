const db = require('../database/db');

const Resume = {
    create: async ({ user_id, file_name, file_url, version }) => {
        const query = `
      INSERT INTO resumes (user_id, file_name, file_url, version)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
        const values = [user_id, file_name, file_url, version || 1];
        const { rows } = await db.query(query, values);
        return rows[0];
    },

    findByUserId: async (user_id) => {
        const query = `
            SELECT r.*, p.extracted_data->>'score' as score 
            FROM resumes r 
            LEFT JOIN parsed_resumes p ON r.id = p.resume_id 
            WHERE r.user_id = $1 
            ORDER BY r.created_at DESC;
        `;
        const { rows } = await db.query(query, [user_id]);
        return rows;
    },

    findById: async (id) => {
        const query = 'SELECT * FROM resumes WHERE id = $1;';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    },

    delete: async (id) => {
        const query = 'DELETE FROM resumes WHERE id = $1 RETURNING id;';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }
};

module.exports = Resume;
