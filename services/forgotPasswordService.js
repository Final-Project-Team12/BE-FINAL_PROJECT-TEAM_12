require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Mailer = require('../libs/mailer');
const { generateResetToken } = require('../utils/jwtResetToken');

const prisma = new PrismaClient();

class ForgotPasswordService {
  static async sendOtp(email) {
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      throw new Error('User not found');
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    await prisma.users.update({
      where: { email },
      data: { otp, otp_expiry: otpExpiry },
    });

    console.log(otp);
    await Mailer.sendPasswordResetEmail(email, otp);
    return { message: 'OTP sent to your email' };
  }

  static async verifyOtp(email, otp) {
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      throw new Error('User not found');
    }

    const currentUtcTime = new Date().toISOString();
    const isOtpValid = user.otp === otp && user.otp_expiry > currentUtcTime;

    if (!isOtpValid) {
      throw new Error('Invalid or expired OTP');
    }

    const resetToken = generateResetToken(user.email);

    await prisma.users.update({
      where: { email },
      data: { otp: null, otp_expiry: null },
    });

    return { resetToken };
  }

  static async resetPassword(email, newPassword, resetToken) {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    
    if (decoded.email !== email) {
      throw new Error('Invalid reset token');
    }

    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      throw new Error('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.users.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return { message: 'Password updated successfully' };
  }
}

module.exports = ForgotPasswordService;
