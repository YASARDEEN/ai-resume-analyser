const { PDFParse } = require('pdf-parse');
const mammoth = require('mammoth');

const extractText = async (file) => {
    if (file.mimetype === 'application/pdf') {
        const parser = new PDFParse({ data: file.buffer });
        const data = await parser.getText();
        await parser.destroy();
        return data.text;
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const { value } = await mammoth.extractRawText({ buffer: file.buffer });
        return value;
    }
    throw new Error('Unsupported file format for text extraction');
};

module.exports = { extractText };
