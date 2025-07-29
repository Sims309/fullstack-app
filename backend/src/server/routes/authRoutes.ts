// src/server/routes/authRoutes.ts

import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser
} from '@/controllers/authController';

import { authenticateToken } from '@middleware/authenticateToken';
import loginRateLimiter from '@middleware/loginRateLimiter';
import { validateRequest } from '@middleware/validateRequest';
import { loginSchema, registerSchema } from '@schemas/user.schema';

const router = express.Router();

// ────────────── REGISTER ──────────────
// ✅ Inscription avec validation Zod
router.post(
  '/register',
  validateRequest(registerSchema, 400),
  registerUser
);

// ────────────── LOGIN ─────────────────
// ✅ Connexion avec anti-brute-force + validation Zod
router.post(
  '/login',
  loginRateLimiter,
  validateRequest(loginSchema, 400),
  loginUser
);

// ────────────── LOGOUT ────────────────
// ✅ Déconnexion (ex. suppression cookie JWT)
router.post('/logout', logoutUser);

// ────────────── ME ────────────────────
// ✅ Retourne l'utilisateur courant avec JWT
router.get('/me', authenticateToken, getCurrentUser);

export default router;
