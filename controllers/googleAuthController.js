const googleAuthService = require('../services/googleAuthService');

class GoogleAuthController {
    static async initiateGoogleLogin(req, res, next) {
        try {
            const authUrl = googleAuthService.generateAuthUrl();
            res.status(200).json({ url: authUrl });
        } catch (error) {
            next(error);
        }
    }

    static async completeGoogleLogin(req, res, next) {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({
                status: 400,
                message: 'Authorization code is required.',
            });
        }

        try {
            const tokens = await googleAuthService.exchangeCodeForToken(code);
            const userProfile = await googleAuthService.getUserInfo(tokens.access_token);
            const user = await googleAuthService.handleGoogleUser(userProfile);
            const accessToken = googleAuthService.generateJWT(user);

            return res.status(200).json({
                status: 200,
                message: 'Google login successful',
                accessToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = GoogleAuthController;
