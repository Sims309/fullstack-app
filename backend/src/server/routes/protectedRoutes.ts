// src/server/routes/protectedRoutes.ts
import express from 'express';
import { checkUserRole } from '@middleware/checkUserRole';
import { AuthenticatedRequest } from '@/types/express/AuthenticatedRequest';

const router = express.Router();

/**
 * ✅ Route protégée par rôle admin
 */
router.get('/api/protected', checkUserRole(['admin']), (req: AuthenticatedRequest, res) => {
  res.json({ message: `Bienvenue admin ${req.user?.email || ''}` });
});

export default router;
