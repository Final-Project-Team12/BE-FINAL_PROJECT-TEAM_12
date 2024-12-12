const { google } = require('googleapis');
const { createUser, getUserByEmail } = require('../services/userService');
const generateToken = require('../utils/jwtGenerator');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/auth/google/callback'
);

class GoogleController {
  static googleLogin(req, res, next) {
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['openid', 'profile', 'email'],
    });

    res.redirect(url);
  }

  static async googleCallback(req, res) {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        status: false,
        message: 'No code received from Google',
      });
    }

    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2',
      });

      const userInfo = await oauth2.userinfo.get();
      const userProfile = userInfo.data;

      let user = await getUserByEmail(userProfile.email);

      if (!user) {
        user = await createUser({
          name: userProfile.name,
          email: userProfile.email,
          password: '',
          role: 'user',
          verified: true,
          telephone_number: '-',
          address: '-',
          gender: '-',
          identity_number: '-',
          age: 0,
        });
      }

      const accessToken = generateToken(userProfile);
      const refreshToken = tokens.refresh_token;

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 5 * 24 * 60 * 60 * 1000,
      });

      res.json({
        status: true,
        message: 'Login success',
        accessToken,
        refreshToken
      });
    } catch (error) {
        next(error);
    }
  }
}

module.exports = GoogleController;
