const googleAuthService = require('../services/googleAuthService');

class GoogleAuthController {
  static googleLogin(req, res, next) {
    try {
      const url = googleAuthService.generateAuthUrl();
      res.redirect(url);
    } catch (error) {
      next(error);
    }
  }

  static async googleCallback(req, res, next) {
    const { code } = req.query;

    try {
      const { userInfo, tokens } = await googleAuthService.getGoogleUserProfile(code);

      const { accessToken, refreshToken } = await googleAuthService.handleGoogleUser(userInfo.data, tokens);

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 5 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Login success',
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GoogleAuthController;
