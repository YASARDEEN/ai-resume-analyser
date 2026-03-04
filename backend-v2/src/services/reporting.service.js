const AtsScore = require('../models/AtsScore');

const exportToCsv = (data) => {
    const headers = ['Candidate Name', 'Email', 'Resume', 'ATS Score', 'Confidence'];
    const rows = data.map(row => [
        row.candidate_name,
        row.email,
        row.file_name,
        row.score,
        row.confidence
    ]);

    const csvContent = [headers, ...rows]
        .map(e => e.join(","))
        .join("\n");

    return csvContent;
};

module.exports = { exportToCsv };
