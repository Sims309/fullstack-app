import express, { Request, Response } from 'express';
import { db } from '../../db';
import { authenticateToken } from '@middleware/authMiddleware';
import type { RowDataPacket } from 'mysql2';

const router = express.Router();

interface Player extends RowDataPacket {
  id: number;
  name: string;
  position: string;
  rating: number;
  image_url: string;
  biography?: string;
  statistics?: string;
}

router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const [results] = await db.query<RowDataPacket[]>('SELECT * FROM players ORDER BY rating DESC');
    const players = results as Player[];
    res.json({ players });
  } catch (err) {
    console.error('Erreur récupération joueurs:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/position/:position', authenticateToken, async (req: Request, res: Response) => {
  const { position } = req.params;

  const positionMapping: Record<string, string> = {
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
    '12': 'Polyvalent',
  };

  const positionName = positionMapping[position];
  if (!positionName) {
    return res.status(400).json({ error: 'Position invalide.' });
  }

  try {
    const [results] = await db.query<RowDataPacket[]>('SELECT * FROM players WHERE position = ? ORDER BY rating DESC LIMIT 10', [positionName]);
    const players = results as Player[];
    res.json({ players, position: positionName });
  } catch (err) {
    console.error('Erreur récupération par poste:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'ID invalide.' });
  }

  try {
    const [results] = await db.query<RowDataPacket[]>('SELECT * FROM players WHERE id = ? LIMIT 1', [id]);
    const players = results as Player[];
    if (players.length === 0) {
      return res.status(404).json({ error: 'Joueur non trouvé.' });
    }
    res.json({ player: players[0] });
  } catch (err) {
    console.error('Erreur récupération joueur:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/top/:limit', authenticateToken, async (req: Request, res: Response) => {
  const limit = Number(req.params.limit);
  if (!limit || limit <= 0 || limit > 100) {
    return res.status(400).json({ error: 'Limite invalide (1-100).' });
  }

  try {
    const [results] = await db.query<RowDataPacket[]>('SELECT * FROM players ORDER BY rating DESC LIMIT ?', [limit]);
    const players = results as Player[];
    res.json({ players });
  } catch (err) {
    console.error('Erreur récupération top joueurs:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
