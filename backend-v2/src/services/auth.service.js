const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

const authService = {
    hashPassword: async (password) => {
        return await bcrypt.hash(password, 12);
    },

    comparePassword: async (password, hashedPassword) => {
        return await bcrypt.compare(password, hashedPassword);
    },

    generateTokens: (user) => {
        const accessToken = jwt.sign(
            { id: user.id, role: user.role },
            config.jwtSecret,
            { expiresIn: '24h' }
        );
        const refreshToken = jwt.sign(
            { id: user.id },
            config.jwtRefreshSecret,
            { expiresIn: '7d' }
        );
        return { accessToken, refreshToken };
    },

    verifyAccessToken: (token) => {
        return jwt.verify(token, config.jwtSecret);
    },

    verifyRefreshToken: (token) => {
        return jwt.verify(token, config.jwtRefreshSecret);
    }
};

module.exports = authService;
