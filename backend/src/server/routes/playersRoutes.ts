import express, { Request, Response } from 'express';
import { db } from '../../db';
import { authenticateToken } from './middleware/authMiddleware';

const router = express.Router();

// Interface pour les joueurs
interface Player {
  id: number;
  name: string;
  position: string;
  rating: number;
  image_url: string;
  biography?: string;
  statistics?: string;
}

// GET /api/players - Récupérer tous les joueurs
router.get('/', authenticateToken, (req: Request, res: Response) => {
  const sql = 'SELECT * FROM players ORDER BY rating DESC';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des joueurs:', err);
      return res.status(500).json({ error: 'Erreur serveur lors de la récupération des joueurs.' });
    }
    
    // caster le résultat en Player[]
    const players = results as Player[];
    res.json({ players });
  });
});

// GET /api/players/position/:position - Récupérer les joueurs par poste
router.get('/position/:position', authenticateToken, (req: Request, res: Response) => {
  const { position } = req.params;

  const positionMapping: { [key: string]: string } = {
    '1': 'Gardien',
    '2': 'Défenseur droit',
    '3': 'Défenseur gauche', 
    '4': 'Défenseur central',
    '5': 'Milieu défensif',
    '6': 'Milieu central',
    '7': 'Milieu offensif',
    '8': 'Ailier droit',
    '9': 'Ailier gauche',
    '10': 'Attaquant',
    '11': 'Buteur',
    '12': 'Polyvalent'
  };

  const positionName = positionMapping[position];

  if (!positionName) {
    return res.status(400).json({ error: 'Position invalide.' });
  }

  const sql = 'SELECT * FROM players WHERE position = ? ORDER BY rating DESC LIMIT 10';

  db.query(sql, [positionName], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des joueurs par poste:', err);
      return res.status(500).json({ error: 'Erreur serveur lors de la récupération des joueurs.' });
    }

    const players = results as Player[];
    res.json({ players, position: positionName });
  });
});

// GET /api/players/:id - Récupérer un joueur spécifique
router.get('/:id', authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'ID de joueur invalide.' });
  }

  const sql = 'SELECT * FROM players WHERE id = ? LIMIT 1';

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération du joueur:', err);
      return res.status(500).json({ error: 'Erreur serveur lors de la récupération du joueur.' });
    }

    const players = results as Player[];

    if (players.length === 0) {
      return res.status(404).json({ error: 'Joueur non trouvé.' });
    }

    res.json({ player: players[0] });
  });
});

// GET /api/players/top/:limit - Récupérer le top N des joueurs
router.get('/top/:limit', authenticateToken, (req: Request, res: Response) => {
  const { limit } = req.params;
  const limitNum = Number(limit);

  if (!limitNum || limitNum <= 0 || limitNum > 100) {
    return res.status(400).json({ error: 'Limite invalide (doit être entre 1 et 100).' });
  }

  const sql = 'SELECT * FROM players ORDER BY rating DESC LIMIT ?';

  db.query(sql, [limitNum], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération du top joueurs:', err);
      return res.status(500).json({ error: 'Erreur serveur lors de la récupération des joueurs.' });
    }

    const players = results as Player[];
    res.json({ players });
  });
});

export default router;
