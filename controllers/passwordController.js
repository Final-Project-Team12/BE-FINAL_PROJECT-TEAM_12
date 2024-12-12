require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Mailer = require('../libs/mailer');
const crypto = require('crypto');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME;

class PasswordController {
  static async forgotPassword(req, res, next) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        status: 'bad request',
        status_code: 400,
        message: 'Email is required' 
      });
    }

    try {
      const user = await prisma.users.findUnique({ where: { email } });

      if (!user) {
        return res.status(404).json({ 
          status: 'not found',
          status_code: 404,
          message: 'User not found' 
        });
      }

      const otp = crypto.randomInt(100000, 999999).toString();
      const otpExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString();

      await prisma.users.update({
        where: { email },
        data: { otp, otp_expiry: otpExpiry },
      });

      console.log(otp);
      await Mailer.sendPasswordResetEmail(email, otp);

      return res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
      next(error);
    }
  }

  static async confirmOtp(req, res, next) {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ 
        status: 'bad request',
        status_code: 400,
        message: 'Email and OTP are required' 
      });
    }

    try {
      const user = await prisma.users.findUnique({ where: { email } });

      if (!user) {
        return res.status(404).json({ 
          status: 'not found',
          status_code: 404,
          message: 'User not found' });
      }

      const currentUtcTime = new Date().toISOString(); 

      const isOtpValid = user.otp === otp && user.otp_expiry > currentUtcTime;

      if (!isOtpValid) {
        return res.status(400).json({
          status: 'bad request',
          status_code: 400,
          message: 'Invalid or expired OTP' 
        });
      }

      const resetToken = jwt.sign(
        { email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION_TIME }
      );

      await prisma.users.update({
        where: { email },
        data: { otp: null, otp_expiry: null },
      });

      return res.status(200).json({
        status: 'success',
        status_code: 200,
        message: 'OTP verified. Use reset-token to reset your password.',
        resetToken,
      });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req, res, next) {
    const { email, newPassword, confirmPassword, resetToken } = req.body;

    if (!email || !newPassword || !confirmPassword || !resetToken) {
      return res.status(400).json({
        status: 'bad request',
        status_code: 400,
        message: 'Email, new password, confirmation password, and reset-token are required',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ 
        status: 'bad request',
        status_code: 400,
        message: 'Passwords do not match' });
    }

    try {
      const decoded = jwt.verify(resetToken, JWT_SECRET);

      if (decoded.email !== email) {
        return res.status(400).json({ 
          status: 'bad request',
          status_code: 400,
          message: 'Invalid reset token' 
        });
      }

      const user = await prisma.users.findUnique({ where: { email } });

      if (!user) {
        return res.status(404).json({ 
          status: 'not found',
          status_code: 404,
          message: 'User not found' 
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.users.update({
        where: { email },
        data: { password: hashedPassword },
      });

      return res.status(200).json({ 
        status: 'success',
        status_code: 200,
        message: 'Password updated successfully' 
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PasswordController;
