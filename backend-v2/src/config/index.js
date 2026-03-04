require('dotenv').config();

module.exports = {
    port: process.env.PORT || 5000,
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET || 'ats_secret_key',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'ats_refresh_secret_key',
    openaiApiKey: process.env.OPENAI_API_KEY,
    supabase: {
        url: process.env.SUPABASE_URL,
        anonKey: process.env.SUPABASE_ANON_KEY,
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'us-east-1',
        bucketName: process.env.AWS_S3_BUCKET_NAME || 'ats-resumes',
    },
    apiUrl: process.env.API_URL || 'http://localhost:5000',
    env: process.env.NODE_ENV || 'development',
};
