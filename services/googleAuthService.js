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
  'http://localhost:3000/api/v1/auth/google/callback'
);

/* istanbul ignore next */
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

/* istanbul ignore next */
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
  /* istanbul ignore next */
  const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

  /* istanbul ignore next */
  if (decoded.email !== email) {
    /* istanbul ignore next */
    throw new Error('Invalid reset token');
  }

  /* istanbul ignore next */
  let user = await prisma.users.findUnique({
    where: { email },
  });

  /* istanbul ignore next */
  if (!user) {
    /* istanbul ignore next */
    throw new Error('User not found');
  }

  /* istanbul ignore next */
  const hashedPassword = await bcrypt.hash(password, 10);

  /* istanbul ignore next */
  user = await prisma.users.update({
    /* istanbul ignore next */
    where: { email },
    data: { password: hashedPassword },
  });

  /* istanbul ignore next */
  const accessToken = generateToken(user);
  /* istanbul ignore next */
  return accessToken;
}

/* istanbul ignore next */
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
