const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const Mailer = require('../libs/mailer');
const crypto = require('crypto');

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

class PasswordController {
  static async forgotPassword(req, res) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    try {
      const user = await prisma.users.findUnique({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

      await prisma.users.update({
        where: { email },
        data: { 
            otp, 
            otp_expiry: otpExpiry },
      });
      console.log(otp)
      await Mailer.sendPasswordResetEmail(email, otp);

      return res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
      console.error('Error sending OTP:', error);
      return res.status(500).json({ message: 'Error sending OTP' });
    }
  }

  static async confirmEmail(req, res) {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isOtpValid = user.otp === otp && user.otp_expiry > new Date();

      if (!isOtpValid) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }

      await prisma.user.update({
        where: { email },
        data: { otp: null, otp_expiry: null },
      });

      return res.status(200).json({
        status: 'success',
        message: 'OTP verified. Proceed to reset-password',
      });
    } catch (error) {
      console.error('Error confirming OTP:', error);
      return res.status(500).json({ message: 'Error confirming OTP' });
    }
  }

  static async resetPassword(req, res) {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: 'Email, new password, and confirmation password are required',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      });

      return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error resetting password:', error);
      return res.status(500).json({ message: 'Error resetting password' });
    }
  }
}

module.exports = PasswordController;