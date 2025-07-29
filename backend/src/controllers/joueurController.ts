// src/server/controllers/joueurController.ts
import { Request, Response } from 'express';
import { Joueur } from '@shared/types/joueurs';
import { Poste, postes } from '@shared/types/postes';

import { gardiens } from '@shared/types/gardiens';
import { defenseursCentraux } from '@shared/types/defenseursCentraux';
import { defenseursDroits } from '@shared/types/defenseursDroits';
import { defenseursGauches } from '@shared/types/defenseursGauches';
import { milieuxDefensifs } from '@shared/types/milieuxDefensifs';
import { milieuxRelayeurs } from '@shared/types/milieuxRelayeurs';
import { milieuxOffensifs } from '@shared/types/milieuxOffensifs';
import { ailiersDroits } from '@shared/types/ailiersDroits';
import { ailiersGauches } from '@shared/types/ailiersGauches';
import { attaquantsDeSoutien } from '@shared/types/attaquantsDeSoutien';
import { buteurs } from '@shared/types/buteurs';

const allJoueurs: Joueur[] = [
  ...gardiens,
  ...defenseursCentraux,
  ...defenseursDroits,
  ...defenseursGauches,
  ...milieuxDefensifs,
  ...milieuxRelayeurs,
  ...milieuxOffensifs,
  ...ailiersDroits,
  ...ailiersGauches,
  ...attaquantsDeSoutien,
  ...buteurs,
];

export const getJoueursParPoste = (_req: Request, res: Response) => {
  const joueursParPoste = postes.map((poste: Poste) => {
    const joueurs: Joueur[] = allJoueurs
      .filter(j => j.posteId === poste.id)
      .sort((a, b) => b.fifa_points - a.fifa_points);

    return {
      poste: poste.nom,
      joueurs,
    };
  });

  res.json(joueursParPoste);
};

export const getAllJoueurs = (_req: Request, res: Response) => {
  const sorted = [...allJoueurs].sort((a, b) => {
    if (a.posteId === b.posteId) return b.fifa_points - a.fifa_points;
    return a.posteId - b.posteId;
  });

  res.json(sorted);
};

export const getJoueurById = (req: Request, res: Response) => {
  const joueurId = Number(req.params.id);
  if (isNaN(joueurId)) {
    return res.status(400).json({ error: 'ID invalide' });
  }

  const joueur = allJoueurs.find(j => j.id === joueurId);
  if (!joueur) {
    return res.status(404).json({ error: 'Joueur introuvable' });
  }

  res.json(joueur);
};

export const getJoueursByPoste = (req: Request, res: Response) => {
  const posteId = Number(req.params.posteId);
  if (isNaN(posteId)) {
    return res.status(400).json({ error: 'ID de poste invalide' });
  }

  const joueurs = allJoueurs
    .filter(j => j.posteId === posteId)
    .sort((a, b) => b.fifa_points - a.fifa_points);

  if (joueurs.length === 0) {
    return res
      .status(404)
      .json({ error: 'Aucun joueur trouvé pour ce poste.' }); // point final ajouté
  }

  res.json(joueurs);
};

export const createJoueur = (_req: Request, res: Response) => {
  res.status(201).json({ message: 'Joueur créé (fonction à implémenter)' });
};
