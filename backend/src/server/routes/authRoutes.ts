// authRoutes.ts
import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser
} from '../../controllers/authController';
import { authenticateToken } from './middleware/authMiddleware';

const router = express.Router();

// Route d'inscription
router.post('/register', registerUser);

// Route de connexion
router.post('/login', loginUser);

// Route de déconnexion
router.post('/logout', logoutUser);

// Récupération de l'utilisateur courant (protégée)
router.get('/me', authenticateToken, getCurrentUser);

export default router;