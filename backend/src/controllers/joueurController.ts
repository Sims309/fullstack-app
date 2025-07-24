import { Request, Response } from 'express';

export const createJoueur = (req: Request, res: Response) => {
  // logique création joueur (à implémenter)
  res.json({ message: 'Joueur créé' });
};

export const getJoueurById = (req: Request, res: Response) => {
  const { id } = req.params;

  // Exemple simulé de joueur, à remplacer par ta vraie logique DB
  const joueur = {
    id: Number(id),
    posteId: 1,
    name: "Buffon",
    country: "Italie",
    image: "buffon.jpg",
    fifa_points: 85,
    biography: "Gardien légendaire, plusieurs fois champion du monde.",
    statistics: {},
    trophees_majeurs: ["Coupe du Monde 2006", "Serie A x10"],
    age: 43,
    club: "Retraité",
    nationalite: "Italienne",
    buts: 0,
    passes: 0,
    cartons_jaunes: 1,
    cartons_rouges: 0,
  };

  res.json(joueur);
};
