const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/jwtGenerator');
const { generateResetToken } = require('../utils/jwtResetToken');

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
    return { userInfo };
  } catch (error) {
    throw new Error('Error fetching Google user info: ' + error.message);
  }
}

async function handleGoogleUser(userProfile) {
  let user = await prisma.users.findUnique({
    where: { email: userProfile.email },
  });

  if (!user) {
    user = await prisma.users.create({
      data: {
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
      },
    });
    const resetToken = generateResetToken(user.email);
    return { resetToken };
  }

  if (!user.password) {
    const resetToken = generateResetToken(user.email);
    return { resetToken };
  }

  const accessToken = generateToken(user);
  return { accessToken };
}

async function setPassword(email, password, resetToken) {
  const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

  if (decoded.email !== email) {
    throw new Error('Invalid reset token');
  }

  let user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user = await prisma.users.update({
    where: { email },
    data: { password: hashedPassword },
  });

  const accessToken = generateToken(user);
  return accessToken;
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
  setPassword,
  generateAuthUrl,
};
