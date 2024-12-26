const { google } = require('googleapis');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI // Redirect ke backend
);

const googleAuthService = {
    generateAuthUrl() {
        return oauth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
        });
    },

    async exchangeCodeForToken(code) {
        const { tokens } = await oauth2Client.getToken(code);
        return tokens;
    },

    async getUserInfo(accessToken) {
        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        oauth2Client.setCredentials({ access_token: accessToken });
        const userInfo = await oauth2.userinfo.get();
        return userInfo.data;
    },

    async handleGoogleUser(userProfile) {
        let user = await prisma.users.findUnique({
            where: { email: userProfile.email },
        });

        if (!user) {
            user = await prisma.users.create({
                data: {
                    name: userProfile.name,
                    email: userProfile.email,
                    password: '',
                    role: 'user',
                    verified: true,
                    telephone_number: '-',
                    address: '-',
                    gender: '-',
                    identity_number: '-',
                    age: 0,
                },
            });
        }

        return user;
    },

    generateJWT(user) {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    },
};

module.exports = googleAuthService;
