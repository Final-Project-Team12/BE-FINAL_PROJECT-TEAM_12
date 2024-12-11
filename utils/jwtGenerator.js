const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function generateToken(userProfile) {
  const payload = {
    user_id: userProfile.id,
    email: userProfile.email,
    name: userProfile.name
  };

  const options = {
    expiresIn: '5d'
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

module.exports = generateToken;
