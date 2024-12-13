const { google } = require('googleapis');
const { createUser, getUserByEmail } = require('../services/userService');
const generateToken = require('../utils/jwtGenerator');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET, 
  'http://localhost:3000/api/v1/auth/google/callback'
);

async function getGoogleUserProfile(code) {
  if (!code) {
    throw new Error('No code received from Google');
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2',
    });

    const userInfo = await oauth2.userinfo.get();
    return { userInfo, tokens };
  } catch (error) {
    throw new Error('Error fetching Google user info: ' + error.message);
  }
}

async function handleGoogleUser(userProfile, tokens) {
  let user = await getUserByEmail(userProfile.email);

  const userData = {
    name: userProfile.name,
    email: userProfile.email,
    password: '',
    role: 'user',
    verified: true,
    telephone_number: userProfile.phone || '-',
    address: userProfile.address || '-',
    gender: userProfile.gender || '-',
    identity_number: userProfile.identity_number || '-',
    age: userProfile.age || 0,
    auth_method: 'oauth'
  };

  if (!user) {
    user = await createUser(userData);
  }

  const accessToken = generateToken(userProfile);
  const refreshToken = tokens.refresh_token;

  return { accessToken, refreshToken };
}

function generateAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['openid', 'profile', 'email'],
  });
}

module.exports = {
  getGoogleUserProfile,
  handleGoogleUser,
  generateAuthUrl,
};
