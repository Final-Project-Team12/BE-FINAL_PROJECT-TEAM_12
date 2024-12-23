const googleAuthService = require('../services/googleAuthService');

class GoogleAuthController {
  /* istanbul ignore next */
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

    if (!code) {
      return res.status(400).json({
        status: 400,
        message: 'No code received from Google. Please try again.',
      });
    }

    try {
      const { userInfo } = await googleAuthService.getGoogleUserProfile(code);
      const response = await googleAuthService.handleGoogleUser(userInfo.data);

      if (response.resetToken) {
        return res.status(401).json({
          status: 401,
          message: 'Please set your password',
          resetToken: response.resetToken,
        });
      }

      return res.status(200).json({
        status: 200,
        message: 'Login success',
        accessToken: response.accessToken,
      });
    } catch (error) {
      /* istanbul ignore next */
      next(error);
    }
  }

  static async updatePassword(req, res, next) {
    /* istanbul ignore next */
    const { email, password, resetToken } = req.body;

    /* istanbul ignore next */
    if (!email || !password || !resetToken) {
      /* istanbul ignore next */
      return res.status(400).json({
        status: 400,
        message: 'Email, password, and resetToken are required.',
      });
    }

    /* istanbul ignore next */
    try {
      const accessToken = await googleAuthService.setPassword(email, password, resetToken);

      return res.status(200).json({
        status: 200,
        message: 'Password updated successfully',
        accessToken: accessToken      
      });
    } catch (error) {
      /* istanbul ignore next */
      next(error);
    }
  }
}

module.exports = GoogleAuthController;
