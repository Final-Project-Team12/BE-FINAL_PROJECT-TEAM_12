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

    if (!code) {
      return res.status(400).json({
        status: 400,
        message: 'No code received from Google. Please try again.',
      });
    }

    try {
      const { userInfo } = await googleAuthService.getGoogleUserProfile(code);

      const response = await googleAuthService.handleGoogleUser(userInfo.data);
      console.log('Handle Google User Response:', response);
      
      res.cookie('token', response.accessToken, {
        httpOnly: true, 
        sameSite: 'Strict', 
      });
      
      
      return res.redirect('https://www.web-quickfly.my.id/'); 
    } catch (error) {
      next(error);
    }
  }

  static async updatePassword(req, res, next) {
    const { email, password, resetToken } = req.body;

    if (!email || !password || !resetToken) {
      return res.status(400).json({
        status: 400,
        message: 'Email, password, and resetToken are required.',
      });
    }

    try {
      const accessToken = await googleAuthService.setPassword(email, password, resetToken);

      return res.status(200).json({
        status: 200,
        message: 'Password updated successfully',
        accessToken: accessToken,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GoogleAuthController;
