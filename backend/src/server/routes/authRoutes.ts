// authRoutes.ts
import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser
} from '../../controllers/authController';
import { authenticateToken } from './middleware/authMiddleware';
import loginRateLimiter from './middleware/loginRateLimiter'; // ✅ Import du middleware anti-brute-force

const router = express.Router();

// Route d'inscription
router.post('/register', registerUser);

// ✅ Route de connexion protégée par un rate limiter
router.post('/login', loginRateLimiter, loginUser);

// Route de déconnexion
router.post('/logout', logoutUser);

// ✅ Route protégée pour récupérer l'utilisateur courant
router.get('/me', authenticateToken, getCurrentUser);

export default router;
