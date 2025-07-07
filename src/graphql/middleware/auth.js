const jwt = require('jsonwebtoken');

const getUser = async (req) => {
  const token = req.headers.authorization;

  if (!token) {
    return null;
  }

  try {
    // Hapus prefix 'Bearer ' jika ada
    const cleanToken = token.replace('Bearer ', '');
    
    // Verifikasi JWT token
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET || 'your-secret-key');
    
    return {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    };
  } catch (error) {
    // Token tidak valid
    return null;
  }
};

module.exports = { getUser };
