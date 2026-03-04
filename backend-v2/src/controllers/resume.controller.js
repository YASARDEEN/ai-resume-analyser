const Resume = require('../models/Resume');
const ParsedResume = require('../models/ParsedResume');
const parsingService = require('../services/parsing.service');
const openaiService = require('../services/openai.service');
const { uploadToS3 } = require('../services/s3.service');

exports.uploadResume = async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        console.log(`📂 Processing upload for user ${req.user.id}: ${req.file.originalname}`);

        const { Location } = await uploadToS3(req.file);

        const resume = await Resume.create({
            user_id: req.user.id,
            file_name: req.file.originalname,
            file_url: Location
        });

        res.status(201).json(resume);
    } catch (error) {
        console.error('❌ Upload Resume Error:', error);
        res.status(500).json({
            message: 'Failed to upload resume. ' + (error.message || ''),
            suggestion: 'Ensure your backend is running and you have write permissions to the uploads folder.'
        });
    }
};

exports.uploadAndParseResume = async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        console.log(`🔍 Analyzing resume for user ${req.user.id}: ${req.file.originalname}`);

        const { Location } = await uploadToS3(req.file);

        const resume = await Resume.create({
            user_id: req.user.id,
            file_name: req.file.originalname,
            file_url: Location
        });

        const rawText = await parsingService.extractText(req.file);
        const extractedData = await openaiService.parseResumeWithAI(rawText);

        await ParsedResume.create({
            resume_id: resume.id,
            extracted_data: extractedData,
            raw_text: rawText
        });

        res.status(201).json({
            message: 'Resume uploaded and analyzed successfully',
            resume,
            analysis: extractedData
        });
    } catch (error) {
        console.error('❌ Upload & Parse Error:', error);
        res.status(500).json({
            message: 'Analysis failed. ' + (error.message || ''),
            suggestion: 'The resume was saved, but automatic analysis failed. You can try parsing it manually later.'
        });
    }
};

exports.getMyResumes = async (req, res, next) => {
    try {
        const resumes = await Resume.findByUserId(req.user.id);
        res.status(200).json(resumes || []);
    } catch (error) {
        next(error);
    }
};

exports.getAllResumes = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only administrators can access all resumes' });
        }
        const query = `
            SELECT r.*, u.name as candidate_name, u.email as candidate_email, p.extracted_data->>'score' as score 
            FROM resumes r 
            JOIN users u ON r.user_id = u.id
            LEFT JOIN parsed_resumes p ON r.id = p.resume_id 
            ORDER BY r.created_at DESC;
        `;
        const { rows } = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        next(error);
    }
};

exports.getResumeById = async (req, res, next) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) return res.status(404).json({ message: 'Resume not found' });

        if (resume.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized access to this resume' });
        }

        res.status(200).json(resume);
    } catch (error) {
        next(error);
    }
};

exports.getAnalysis = async (req, res, next) => {
    try {
        const analysis = await ParsedResume.findByResumeId(req.params.resumeId);
        if (!analysis) return res.status(404).json({ message: 'Analysis not found' });
        res.status(200).json(analysis);
    } catch (error) {
        next(error);
    }
};
