const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function generateToken(userData) {
  try {
    const payload = {
      user_id: userData.user_id,
      user_email: userData.email,
      user_role: userData.role
    };

    const options = {
      expiresIn: '5d'
    };

    return jwt.sign(payload, JWT_SECRET, options);
  } catch (error) {
    /* istanbul ignore next */
    throw new Error('Error generating token: ' + error.message);
  }
}

module.exports = generateToken;
