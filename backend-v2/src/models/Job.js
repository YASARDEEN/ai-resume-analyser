const db = require('../database/db');

const Job = {
    create: async ({ title, description, department, status }) => {
        const query = `
      INSERT INTO jobs (title, description, department, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
        const values = [title, description, department, status || 'active'];
        const { rows } = await db.query(query, values);
        return rows[0];
    },

    getAll: async () => {
        const query = 'SELECT * FROM jobs ORDER BY created_at DESC;';
        const { rows } = await db.query(query);
        return rows;
    },

    findById: async (id) => {
        const query = 'SELECT * FROM jobs WHERE id = $1;';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    },

    update: async (id, { title, description, department, status }) => {
        const query = `
      UPDATE jobs
      SET title = $1, description = $2, department = $3, status = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *;
    `;
        const values = [title, description, department, status, id];
        const { rows } = await db.query(query, values);
        return rows[0];
    },

    delete: async (id) => {
        const query = 'DELETE FROM jobs WHERE id = $1 RETURNING id;';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }
};

module.exports = Job;
