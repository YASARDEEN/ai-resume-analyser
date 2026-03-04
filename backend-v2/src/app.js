const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger');

const app = express();

// Base Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public/uploads
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', require('./routes'));

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', environment: config.env });
});

// Root Route
app.get('/', (req, res) => {
    res.status(200).send(`
        <div style="font-family: sans-serif; padding: 40px; text-align: center;">
            <h1 style="color: #4f46e5;">🚀 AI Resume Analyser API</h1>
            <p style="color: #64748b;">The professional backend server is running successfully.</p>
            <div style="margin-top: 20px;">
                <a href="/api-docs" style="display: inline-block; padding: 10px 20px; background: #4f46e5; color: white; text-decoration: none; rounded: 8px; font-weight: bold;">View API Documentation</a>
            </div>
            <p style="margin-top: 20px; font-size: 14px; color: #94a3b8;">Frontend is running on <a href="http://localhost:5173" style="color: #4f46e5; text-decoration: none;">http://localhost:5173</a></p>
        </div>
    `);
});

// Centralized Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: config.env === 'development' ? err : {},
    });
});

module.exports = app;
