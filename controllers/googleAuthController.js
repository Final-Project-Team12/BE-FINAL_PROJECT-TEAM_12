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
      const { accessToken, refreshToken, user } = await googleAuthService.handleGoogleUser(userInfo.data, tokens);

      if (!user.email || !user.password) {
        return res.status(400).json({
          status: 'fail',
          message: 'Please set your password',
          userId: user.user_id,
        });
      }

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 5 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        status: 'success',
        message: 'Login success',
        accessToken,
        userId: user.user_id,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updatePassword(req, res, next) {
    const { user_id } = req.params;
    const { password } = req.body;

    try {
      if (!password) {
        return res.status(400).json({ message: 'Password is required' });
      }

      const { accessToken, user } = await googleAuthService.setPassword(user_id, password);

      res.status(200).json({
        status: 'success',
        message: 'Password updated successfully',
        accessToken,
        userId: user.user_id,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GoogleAuthController;
