import express from 'express';
import {
  createJoueur,
  getJoueurById,
  getAllJoueurs,
  getJoueursByPoste,  // ✅ Import de la nouvelle fonction
} from '@/controllers/joueurController';

// 🔒 Import du middleware d'authentification si nécessaire
// import { authenticateToken } from '@/middleware/authenticateToken';

const router = express.Router();

// ✅ GET /api/joueurs → tous les joueurs
router.get('/', getAllJoueurs);

// ✅ IMPORTANT: Route spécifique AVANT la route générique /:id
// GET /api/joueurs/poste/:posteId → joueurs par poste (1-11)
router.get('/poste/:posteId', getJoueursByPoste);

// ✅ GET /api/joueurs/:id → joueur par ID (doit être après /poste/:posteId)
router.get('/:id', getJoueurById);

// ✅ POST /api/joueurs → créer un joueur
// router.post('/', authenticateToken, createJoueur); // 🔒 Avec auth si nécessaire
router.post('/', createJoueur);

// 🆕 Routes supplémentaires utiles (optionnelles)

// PUT /api/joueurs/:id → mettre à jour un joueur
// router.put('/:id', authenticateToken, updateJoueur);

// DELETE /api/joueurs/:id → supprimer un joueur  
// router.delete('/:id', authenticateToken, deleteJoueur);

// GET /api/joueurs/search/:query → rechercher des joueurs
// router.get('/search/:query', searchJoueurs);

// GET /api/joueurs/stats/top → top joueurs par points FIFA
// router.get('/stats/top', getTopJoueurs);

export default router;