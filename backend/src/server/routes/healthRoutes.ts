// src/server/routes/healthRoutes.ts
import { Router } from 'express';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'API opérationnelle 🚀' });
});

export default router;
