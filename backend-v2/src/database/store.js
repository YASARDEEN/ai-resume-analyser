const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../../database.json');

const loadStore = () => {
    if (fs.existsSync(DB_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        } catch (e) {
            console.error('Error loading database.json, starting fresh.');
        }
    }
    return {
        users: [],
        resumes: [],
        jobs: [],
        atsScores: [],
        keywords: [],
        parsedResumes: [],
        sessions: []
    };
};

let store = loadStore();

// Helper to save store
store.save = () => {
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2));
};

// Helper to reload from disk
store.refresh = () => {
    const fresh = loadStore();
    Object.assign(store, fresh);
};

module.exports = store;
