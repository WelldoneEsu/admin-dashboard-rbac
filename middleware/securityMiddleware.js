const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Set up security headers
exports.setSecurityHeaders = helmet();

// Set up rate limiting for login route
exports.loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, 
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
  standardHeaders: true, 
  legacyHeaders: false,
});
