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

// ✅ Ce schéma NE DEMANDE PAS confirmPassword
import { loginSchema, registerBackendSchema } from '@schemas/user.schema';

const router = express.Router();

// ────────────── REGISTER ──────────────
router.post(
  '/register',
  validateRequest(registerBackendSchema, 400),
  registerUser
);

// ────────────── LOGIN ─────────────────
router.post(
  '/login',
  loginRateLimiter,
  validateRequest(loginSchema, 400),
  loginUser
);

// ────────────── LOGOUT ────────────────
router.post('/logout', logoutUser);

// ────────────── ME ────────────────────
router.get('/me', authenticateToken, getCurrentUser);

export default router;
