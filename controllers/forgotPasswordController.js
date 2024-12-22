const ForgotPasswordService = require('../services/forgotPasswordService');

class ForgotPasswordController {
  static async forgotPassword(req, res, next) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'bad request',
        message: 'Email is required',
      });
    }

    try {
      const response = await ForgotPasswordService.sendOtp(email);
      return res.status(200).json(response);
    } catch (error) {
      /* istanbul ignore next */
      next(error);
    }
  }

  static async confirmOtp(req, res, next) {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        status: 'bad request',
        message: 'Email and OTP are required',
      });
    }

    try {
      const response = await ForgotPasswordService.verifyOtp(email, otp);
      return res.status(200).json({
        status: 'success',
        message: 'OTP verified. Use reset-token to reset your password.',
        resetToken: response.resetToken,
      });
    } catch (error) {
      /* istanbul ignore next */
      next(error);
    }
  }

  static async resetPassword(req, res, next) {
    const { email, newPassword, confirmPassword, resetToken } = req.body;

    if (!email || !newPassword || !confirmPassword || !resetToken) {
      return res.status(400).json({
        status: 'bad request',
        message: 'Email, new password, confirmation password, and reset-token are required',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: 'bad request',
        message: 'Passwords do not match',
      });
    }

    try {
      const response = await ForgotPasswordService.resetPassword(email, newPassword, resetToken);
      return res.status(200).json(response);
    } catch (error) {
      /* istanbul ignore next */
      next(error);
    }
  }
}

module.exports = ForgotPasswordController;
