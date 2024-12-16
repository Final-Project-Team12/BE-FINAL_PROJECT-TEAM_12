const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function generateToken(userData) {
  try {
    const payload = {
      user_id: userData.id,
      email: userData.email,
      role: userData.role
    };

    const options = {
      expiresIn: '5d'
    };

    return jwt.sign(payload, JWT_SECRET, options);
  } catch (error) {
    throw new Error('Error generating token: ' + error.message);
  }
}

module.exports = generateToken;
