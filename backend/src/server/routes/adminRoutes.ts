// src/server/routes/adminRoutes.ts
import express from 'express';
import { cookieSessionChecker } from './middleware/cookieSessionChecker';
import { checkUserRole } from './middleware/checkUserRole';
import { readFraudLogs } from '../../utils/auditLogger'; // ✅ Import du logger

const router = express.Router();

// 🛡️ Middleware combiné : utilisateur connecté + rôle autorisé
const adminOnly = [cookieSessionChecker, checkUserRole(['admin'])];
const adminOrMod = [cookieSessionChecker, checkUserRole(['admin', 'moderator'])];

// 🎯 Route accessible uniquement aux admins
router.get('/dashboard', ...adminOnly, (req, res) => {
  res.json({
    message: 'Bienvenue sur le tableau de bord administrateur.',
    user: req.user,
  });
});

// 🎯 Route accessible aux admins et modérateurs
router.get('/moderation-zone', ...adminOrMod, (req, res) => {
  res.json({
    message: 'Bienvenue dans la zone de modération.',
    user: req.user,
  });
});

// 🕵️‍♂️ Route d’audit log des fraudes (admin uniquement)
router.get('/audit-log', ...adminOnly, (req, res) => {
  const logs = readFraudLogs();
  res.setHeader('Content-Type', 'text/plain');
  res.send(logs);
});

export default router;
