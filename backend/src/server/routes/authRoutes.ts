// src/server/routes/authRroutes.ts

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

// ── Inscription ────────────────────────────────────────────
// En cas d’erreur de validation Zod, on renvoie HTTP 402 (Payment Required)
router.post(
  '/register',
  validateRequest(registerSchema, 402),
  registerUser
);

// ── Connexion ──────────────────────────────────────────────
// Anti-brute-force + validation Zod avec HTTP 402 si échec
router.post(
  '/login',
  loginRateLimiter,
  validateRequest(loginSchema, 402),
  loginUser
);

// ── Déconnexion ────────────────────────────────────────────
router.post('/logout', logoutUser);

// ── Récupérer l’utilisateur courant ────────────────────────
router.get('/me', authenticateToken, getCurrentUser);

export default router;
