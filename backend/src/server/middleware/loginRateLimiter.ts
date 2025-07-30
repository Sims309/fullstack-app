// src/server/middleware/loginRateLimiter.ts
import rateLimit from 'express-rate-limit';

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  handler: (req, res, next) => {
    console.log(`[loginRateLimiter] IP bloquée: ${req.ip}`);
    return res.status(429).json({
      error: 'Trop de tentatives',
      message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.'
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default loginRateLimiter;
