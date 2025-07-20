// src/server/middleware/loginRateLimiter.ts
import rateLimit from 'express-rate-limit';

// Middleware spécifique à la route de login pour bloquer les attaques par force brute
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 tentatives par IP
  message: {
    error: 'Trop de tentatives',
    message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default loginRateLimiter;
