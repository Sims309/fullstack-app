import express from 'express';
import {
  createJoueur,
  getJoueurById,
  getAllJoueurs,
  getJoueursByPoste,  // ✅ Import de la nouvelle fonction
} from '@/controllers/joueurController';

const router = express.Router();

// ✅ Nouveau : GET /api/joueurs → tous les joueurs
router.get('/', getAllJoueurs);

// ✅ Nouveau : GET /api/joueurs/poste/:posteId → joueurs par poste
router.get('/poste/:posteId', getJoueursByPoste);

// GET /api/joueurs/:id → joueur par ID (attention à l'ordre)
router.get('/:id', getJoueurById);

// POST /api/joueurs → créer un joueur
router.post('/', createJoueur);

export default router;
