const fs = require('fs');
const path = require('path');
const config = require('../config');
const supabase = require('./supabase.service');

// We only import AWS if we really need it, to avoid greedy credential checks
let AWS = null;
try {
    if (config.aws.accessKeyId && config.aws.secretAccessKey && config.aws.accessKeyId !== 'YOUR_ACCESS_KEY') {
        AWS = require('aws-sdk');
    }
} catch (e) {
    console.warn('AWS SDK not found or could not be loaded.');
}

let s3 = null;
const getS3 = () => {
    if (s3) return s3;
    const key = config.aws.accessKeyId;
    const secret = config.aws.secretAccessKey;

    // Strictly check for valid-looking credentials
    const isValid = key && secret &&
        key !== 'YOUR_ACCESS_KEY' &&
        secret !== 'YOUR_SECRET_KEY' &&
        key.length > 5;

    if (AWS && isValid) {
        try {
            s3 = new AWS.S3({
                accessKeyId: key,
                secretAccessKey: secret,
                region: config.aws.region
            });
            return s3;
        } catch (e) {
            console.warn('❌ Failed to initialize S3:', e.message);
            return null;
        }
    }
    return null;
};

const uploadToSupabase = async (file) => {
    if (!supabase) return null;

    try {
        const fileName = `${Date.now()}-${file.originalname}`;
        const { data, error } = await supabase.storage
            .from('resumes')
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: true
            });

        if (error) {
            console.error('❌ Supabase Storage Error:', error.message);
            return null;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('resumes')
            .getPublicUrl(fileName);

        return {
            Location: publicUrl,
            Key: fileName
        };
    } catch (err) {
        console.error('❌ Supabase Upload Exception:', err.message);
        return null;
    }
};

const uploadToS3 = async (file) => {
    const s3Instance = getS3();

    if (s3Instance) {
        const params = {
            Bucket: config.aws.bucketName,
            Key: `resumes/${Date.now()}-${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype
        };
        return await s3Instance.upload(params).promise();
    }

    // Try Supabase Storage
    const supabaseResult = await uploadToSupabase(file);
    if (supabaseResult) {
        console.log('🚀 Using Supabase Storage for resume upload.');
        return supabaseResult;
    }

    // If no Cloud instance, use local storage
    console.log('🚀 Using Local Storage for resume upload.');
    const fileName = `${Date.now()}-${file.originalname}`;
    const uploadDir = path.join(__dirname, '../../public/uploads');
    const filePath = path.join(uploadDir, fileName);

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFileSync(filePath, file.buffer);
    const baseUrl = config.apiUrl || 'http://localhost:5000';

    return {
        Location: `${baseUrl}/uploads/${fileName}`,
        Key: fileName
    };
};

const getSignedUrl = (key) => {
    const s3Instance = getS3();
    if (s3Instance) {
        return s3Instance.getSignedUrl('getObject', {
            Bucket: config.aws.bucketName,
            Key: key,
            Expires: 60 * 60 // 1 hour
        });
    }

    // Supabase public URLs don't strictly need signing if bucket is public, 
    // but we can return the public URL stored in Key if it's already a URL
    if (key && (key.startsWith('http://') || key.startsWith('https://'))) {
        return key;
    }

    // Fallback helper
    const baseUrl = config.apiUrl || 'http://localhost:5000';
    return `${baseUrl}/uploads/${key}`;
};

module.exports = { uploadToS3, getSignedUrl };
