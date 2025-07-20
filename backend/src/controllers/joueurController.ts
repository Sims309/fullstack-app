import { Request, Response } from 'express';

export const createJoueur = (req: Request, res: Response) => {
  // logique création joueur
  res.json({ message: 'Joueur créé' });
};

export const getJoueurById = (req: Request, res: Response) => {
  const { id } = req.params;
  // logique récupération joueur par id
  res.json({ joueurId: id });
};
