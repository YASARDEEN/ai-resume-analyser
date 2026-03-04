const db = require('../database/db');

const Keyword = {
    create: async ({ job_id, keyword, type, weight }) => {
        const query = `
      INSERT INTO keywords (job_id, keyword, type, weight)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
        const values = [job_id, keyword, type || 'preferred', weight || 5];
        const { rows } = await db.query(query, values);
        return rows[0];
    },

    findByJobId: async (job_id) => {
        const query = 'SELECT * FROM keywords WHERE job_id = $1;';
        const { rows } = await db.query(query, [job_id]);
        return rows;
    },

    delete: async (id) => {
        const query = 'DELETE FROM keywords WHERE id = $1 RETURNING id;';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }
};

module.exports = Keyword;
