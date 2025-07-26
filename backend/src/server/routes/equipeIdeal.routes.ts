import express, { Request, Response } from 'express';
import { EquipeIdealService } from '@services/equipeIdeal.service';



const router = express.Router();
const equipeService = new EquipeIdealService();

/**
 * GET /api/equipe
 * Récupère l’équipe idéale complète (11 titulaires + 5 remplaçants)
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const equipe = await equipeService.getEquipe();
    res.json(equipe);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Erreur serveur';
    res.status(500).json({ error: errMsg });
  }
});

/**
 * POST /api/equipe/add
 * Ajoute un joueur à l’équipe idéale
 * Body : { id: string, poste: number }
 */
router.post('/add', async (req: Request, res: Response) => {
  try {
    const result = await equipeService.addJoueur(req.body);
    res.status(201).json(result);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Erreur serveur';
    res.status(400).json({ error: errMsg });
  }
});

/**
 * POST /api/equipe/batch
 * Ajoute plusieurs joueurs en une fois (max 16)
 * Body : [{ id: string, poste: number }]
 */
router.post('/batch', async (req: Request, res: Response) => {
  try {
    const result = await equipeService.batchAddJoueurs(req.body);
    res.status(201).json(result);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Erreur serveur';
    res.status(400).json({ error: errMsg });
  }
});

/**
 * DELETE /api/equipe/:entryId
 * Supprime un joueur de l’équipe idéale
 */
router.delete('/:entryId', async (req: Request, res: Response) => {
  try {
    await equipeService.removeJoueur(req.params.entryId);
    res.status(204).send();
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Erreur serveur';
    res.status(500).json({ error: errMsg });
  }
});

/**
 * PUT /api/equipe/:entryId
 * Met à jour un joueur (ex. changement de poste)
 * Body : { poste?: number }
 */
router.put('/:entryId', async (req: Request, res: Response) => {
  try {
    const result = await equipeService.updateJoueur(req.params.entryId, req.body);
    res.json(result);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Erreur serveur';
    res.status(400).json({ error: errMsg });
  }
});

export default router;
