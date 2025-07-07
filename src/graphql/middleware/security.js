const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');

// Rate limiting middleware
const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: {
    error: 'Terlalu banyak request dari IP ini, coba lagi setelah 15 menit.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

// Rate limiting khusus untuk login 
const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: {
    error: 'Terlalu banyak percobaan login, coba lagi setelah 15 menit.',
    code: 'LOGIN_RATE_LIMIT_EXCEEDED',
  },
  skipSuccessfulRequests: true,
});

// Security headers middleware
const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});

// Validation middleware untuk input
const validateLoginInput = [
  body('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username harus antara 3-50 karakter')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username hanya boleh mengandung huruf, angka, dan underscore'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password minimal 6 karakter'),
];

const validateEventInput = [
  body('nama_acara')
    .isLength({ min: 5, max: 200 })
    .withMessage('Nama acara harus antara 5-200 karakter'),
  
  body('penyelenggara')
    .isLength({ min: 3, max: 200 })
    .withMessage('Nama penyelenggara harus antara 3-200 karakter'),
  
  body('jumlah_peserta')
    .isInt({ min: 1, max: 10000 })
    .withMessage('Jumlah peserta harus antara 1-10000'),
  
  body('tanggal_mulai')
    .isISO8601()
    .withMessage('Format tanggal mulai harus YYYY-MM-DD'),
  
  body('tanggal_selesai')
    .isISO8601()
    .withMessage('Format tanggal selesai harus YYYY-MM-DD'),
];

// Error handler untuk validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Data input tidak valid',
      code: 'VALIDATION_ERROR',
      details: errors.array(),
    });
  }
  next();
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error middleware:', err);
  
  // GraphQL errors
  if (err.name === 'GraphQLError') {
    return res.status(400).json({
      error: err.message,
      code: err.extensions?.code || 'GRAPHQL_ERROR',
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token tidak valid',
      code: 'INVALID_TOKEN',
    });
  }
  
  // Database errors
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      error: 'Data sudah ada',
      code: 'DUPLICATE_ENTRY',
    });
  }
  
  // Default error
  res.status(500).json({
    error: 'Terjadi kesalahan server internal',
    code: 'INTERNAL_SERVER_ERROR',
  });
};

module.exports = {
  rateLimitMiddleware,
  loginRateLimit,
  securityMiddleware,
  validateLoginInput,
  validateEventInput,
  handleValidationErrors,
  requestLogger,
  errorHandler,
};
