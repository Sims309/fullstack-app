// routes/joueurRoutes.ts
import express from 'express';
import { createJoueur, getJoueurById } from '../../controllers/controller';

const router = express.Router();

router.post('/joueurs', createJoueur);
// La route PUT est supprimée car updateJoueur n'existe pas encore
// router.put('/joueurs/:id', updateJoueur);
router.get('/joueurs/:id', getJoueurById);

export default router;
