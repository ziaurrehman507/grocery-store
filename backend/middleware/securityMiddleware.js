const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Security headers with Helmet
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

// Auth rate limiting (stricter for auth endpoints)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth
  message: {
    error: 'Too many authentication attempts, please try again later.'
  }
});

// Prevent NoSQL injection
const preventNoSQLInjection = (req, res, next) => {
  const checkForNoSQL = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string' && obj[key].includes('$')) {
        throw new Error('Potential NoSQL injection detected');
      }
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        checkForNoSQL(obj[key]);
      }
    }
  };

  try {
    checkForNoSQL(req.body);
    checkForNoSQL(req.query);
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid request' });
  }
};

// XSS protection
const xssProtection = (req, res, next) => {
  // Simple XSS protection by sanitizing user input
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].replace(/</g, '&lt;').replace(/>/g, '&gt;');
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  next();
};

module.exports = {
  securityHeaders,
  limiter,
  authLimiter,
  preventNoSQLInjection,
  xssProtection
};