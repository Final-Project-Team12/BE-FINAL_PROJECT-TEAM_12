const nodemailer = require('nodemailer');

class Mailer {
  static transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  static async sendVerificationEmail(toEmail, otp) {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: #6a0dad;
            padding: 20px;
            text-align: center;
            color: white;
            border-radius: 8px 8px 0 0;
          }
          .content {
            padding: 20px;
            text-align: center;
          }
          .otp {
            font-size: 36px; 
            font-weight: bold;
            color: #007bff;
            margin-top: 20px;
            padding: 10px;
            background-color: #f0f0f0;
            border-radius: 8px;
          }
          .footer {
            text-align: center;
            padding: 20px 0;
            color: #888;
            font-size: 12px;
            margin-top: 20px;
            border-top: 1px solid #ddd;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Account</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>To confirm your email, simply go back to the browser window where you started creating your placeholder account and enter this OTP code:</p>
            <div class="otp">${otp}</div>
            <p>If you didn’t create an account in placeholder, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 placeholder. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>`;
  
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'Verify your placeholder password',
        html: htmlContent,
      });
    } catch (error) {
      /* istanbul ignore next */
      throw new Error('Failed to send account verification email');
    }
  }

  static async sendPasswordResetEmail(toEmail, otp) {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: #6a0dad;
            padding: 20px;
            text-align: center;
            color: white;
            border-radius: 8px 8px 0 0;
          }
          .content {
            padding: 20px;
            text-align: center;
          }
          .otp {
            font-size: 36px; 
            font-weight: bold;
            color: #007bff;
            margin-top: 20px;
            padding: 10px;
            background-color: #f0f0f0;
            border-radius: 8px;
          }
          .footer {
            text-align: center;
            padding: 20px 0;
            color: #888;
            font-size: 12px;
            margin-top: 20px;
            border-top: 1px solid #ddd;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Your Password</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset your password. Your OTP is:</p>
            <div class="otp">${otp}</div>
            <p>If you didn’t request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2023 Your Company. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>`;
  
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'Reset your password',
        html: htmlContent,
      });
    } catch (error) {
      /* istanbul ignore next */
      console.error('Error sending password reset email:', error);
              /* istanbul ignore next */
      throw new Error('Failed to send password reset email');
    }
  }
  
  
              /* istanbul ignore next */

  static async sendWelcomeNotification(toEmail, name) {
                  /* istanbul ignore next */

    const htmlContent = `
      <p>Hello ${name},</p>
      <p>Welcome to our service! We’re excited to have you with us.</p>
    `;
              /* istanbul ignore next */

    try {
                    /* istanbul ignore next */

      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'Welcome!',
        html: htmlContent,
      });
              /* istanbul ignore next */

    } catch (error) {
              /* istanbul ignore next */

      console.error('Error sending welcome email:', error);
      throw new Error('Failed to send welcome email');
    }
  }
              /* istanbul ignore next */

  static async sendPasswordChangeNotification(toEmail) {
                  /* istanbul ignore next */

    const htmlContent = `
      <p>Hello,</p>
      <p>Your password has been changed successfully. If this was not you, please contact support immediately.</p>
    `;
              /* istanbul ignore next */

    try {
                    /* istanbul ignore next */

      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'Password Changed',
        html: htmlContent,
      });
                    /* istanbul ignore next */

    } catch (error) {
      /* istanbul ignore next */
      console.error('Error sending password change notification:', error);
              /* istanbul ignore next */

      throw new Error('Failed to send password change notification');
    }
  }
}

module.exports = Mailer;