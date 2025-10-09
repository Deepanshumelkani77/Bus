const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const secret = process.env.JWT_SECRET || 'your_super_secret_jwt_key_for_bus_app_2024_development_only';
  
  jwt.verify(token, secret, (err, user) => {
    if (err) {
      console.error('JWT verification error:', err.message);
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken
};
