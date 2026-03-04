const Job = require('../models/Job');
const Keyword = require('../models/Keyword');

exports.createJob = async (req, res, next) => {
    try {
        const { title, description, department, status, keywords } = req.body;

        const job = await Job.create({ title, description, department, status });

        if (keywords && Array.isArray(keywords)) {
            for (const kw of keywords) {
                await Keyword.create({
                    job_id: job.id,
                    keyword: kw.name,
                    type: kw.type,
                    weight: kw.weight
                });
            }
        }

        const jobWithKeywords = { ...job, keywords: await Keyword.findByJobId(job.id) };
        res.status(201).json(jobWithKeywords);
    } catch (error) {
        next(error);
    }
};

exports.getJobs = async (req, res, next) => {
    try {
        const jobs = await Job.getAll();
        const jobsWithKw = await Promise.all(jobs.map(async (j) => ({
            ...j,
            keywords: await Keyword.findByJobId(j.id)
        })));
        res.status(200).json(jobsWithKw);
    } catch (error) {
        next(error);
    }
};

exports.getJobById = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        const keywords = await Keyword.findByJobId(job.id);
        res.status(200).json({ ...job, keywords });
    } catch (error) {
        next(error);
    }
};
