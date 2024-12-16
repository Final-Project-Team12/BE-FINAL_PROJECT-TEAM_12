const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { google } = require('googleapis');
const generateToken = require('../utils/jwtGenerator');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/auth/google/callback'
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
  let user = await prisma.users.findUnique({
    where: { email: userProfile.email },
  });

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
  };

  if (!user) {
    user = await prisma.users.create({
      data: userData,
    });
  }

  const accessToken = generateToken(user);
  const refreshToken = tokens.refresh_token;

  return { accessToken, refreshToken, user };
}

async function setPassword(userId, password) {
  const userIdInt = parseInt(userId);

  if (isNaN(userIdInt)) {
    throw new Error('Invalid user_id');
  }

  let user = await prisma.users.findUnique({
    where: { user_id: userIdInt },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const saltRounds = parseInt(process.env.HASH, 10) || 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  user = await prisma.users.update({
    where: { user_id: userIdInt },
    data: { password: hashedPassword },
  });

  const accessToken = generateToken(user);

  return { accessToken, user };
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
  setPassword,
};
