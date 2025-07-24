// src/server/routes/joueurRoutes.ts
import express from 'express';
import { createJoueur, getJoueurById } from '@/controllers/joueurController';

const router = express.Router();

// Route POST pour créer un joueur
router.post('/', createJoueur);

// Route GET pour récupérer un joueur par ID
router.get('/:id', getJoueurById);

export default router;
