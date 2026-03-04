const db = require('../database/db');

const User = {
    create: async ({ name, email, password, role }) => {
        const query = `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at;
    `;
        const values = [name, email, password, role || 'candidate'];
        const { rows } = await db.query(query, values);
        return rows[0];
    },

    findByEmail: async (email) => {
        const query = 'SELECT * FROM users WHERE email = $1;';
        const { rows } = await db.query(query, [email]);
        return rows[0];
    },

    findById: async (id) => {
        const query = 'SELECT id, name, email, role, created_at FROM users WHERE id = $1;';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    },

    getAll: async () => {
        const query = 'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC;';
        const { rows } = await db.query(query);
        return rows;
    },

    delete: async (id) => {
        const query = 'DELETE FROM users WHERE id = $1 RETURNING id;';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }
};

module.exports = User;
