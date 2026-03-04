const db = require('../database/db');

const ParsedResume = {
    create: async ({ resume_id, extracted_data, raw_text }) => {
        const query = `
      INSERT INTO parsed_resumes (resume_id, extracted_data, raw_text)
      VALUES ($1, $2, $3)
      ON CONFLICT (resume_id) 
      DO UPDATE SET extracted_data = $2, raw_text = $3
      RETURNING *;
    `;
        const values = [resume_id, JSON.stringify(extracted_data), raw_text];
        const { rows } = await db.query(query, values);
        return rows[0];
    },

    findByResumeId: async (resume_id) => {
        const query = 'SELECT * FROM parsed_resumes WHERE resume_id = $1;';
        const { rows } = await db.query(query, [resume_id]);
        return rows[0];
    }
};

module.exports = ParsedResume;
