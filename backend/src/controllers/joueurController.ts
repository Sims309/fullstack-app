import { Request, Response } from 'express';
import { Joueur } from '@shared/types/joueurs'; // Vérifie le chemin si tu utilises un alias

const gardiens: Joueur[] = [
  {
    id: 1,
    name: "Lev Yashin",
    posteId: 1,
    country: "URSS",
    image: "lev_yashin.jpg",
    fifa_points: 94,
    biography: "Le seul gardien à avoir remporté le Ballon d’Or.",
    statistics: "812 matchs, 270 clean sheets",
    trophees_majeurs: "Ballon d’Or 1963",
    age: 60,
    club: "Retraité",
    nationalite: "Russe",
    buts: 0,
    passes: 1,
    cartons_jaunes: 0,
    cartons_rouges: 0
  },
  {
    id: 2,
    name: "Gianluigi Buffon",
    posteId: 1,
    country: "Italie",
    image: "buffon.jpg",
    fifa_points: 93,
    biography: "L’un des meilleurs gardiens de tous les temps.",
    statistics: "1100+ matchs",
    trophees_majeurs: "Coupe du Monde 2006",
    age: 45,
    club: "Retraité",
    nationalite: "Italien",
    buts: 0,
    passes: 3,
    cartons_jaunes: 12,
    cartons_rouges: 1
  },
  {
    id: 3,
    name: "Manuel Neuer",
    posteId: 1,
    country: "Allemagne",
    image: "neuer.jpg",
    fifa_points: 91,
    biography: "Spécialiste du jeu au pied.",
    statistics: "700+ matchs",
    trophees_majeurs: "Coupe du Monde 2014",
    age: 38,
    club: "Bayern Munich",
    nationalite: "Allemand",
    buts: 0,
    passes: 10,
    cartons_jaunes: 5,
    cartons_rouges: 0
  },
  {
    id: 4,
    name: "Dino Zoff",
    posteId: 1,
    country: "Italie",
    image: "zoff.jpg",
    fifa_points: 89,
    biography: "Champion du monde à 40 ans.",
    statistics: "570 matchs",
    trophees_majeurs: "Coupe du Monde 1982",
    age: 82,
    club: "Retraité",
    nationalite: "Italien",
    buts: 0,
    passes: 2,
    cartons_jaunes: 0,
    cartons_rouges: 0
  },
  {
    id: 5,
    name: "Peter Schmeichel",
    posteId: 1,
    country: "Danemark",
    image: "schmeichel.jpg",
    fifa_points: 90,
    biography: "Leader du Danemark champion d’Europe 1992.",
    statistics: "600+ matchs",
    trophees_majeurs: "EURO 1992",
    age: 60,
    club: "Retraité",
    nationalite: "Danois",
    buts: 1,
    passes: 5,
    cartons_jaunes: 4,
    cartons_rouges: 0
  },
  {
    id: 6,
    name: "Iker Casillas",
    posteId: 1,
    country: "Espagne",
    image: "casillas.jpg",
    fifa_points: 91,
    biography: "Capitaine du triplé historique Espagne 2008‑2012.",
    statistics: "725 matchs",
    trophees_majeurs: "Coupe du Monde 2010",
    age: 43,
    club: "Retraité",
    nationalite: "Espagnol",
    buts: 0,
    passes: 4,
    cartons_jaunes: 8,
    cartons_rouges: 0
  },
  {
    id: 7,
    name: "Oliver Kahn",
    posteId: 1,
    country: "Allemagne",
    image: "kahn.jpg",
    fifa_points: 89,
    biography: "Gardien charismatique du Bayern et de l'Allemagne.",
    statistics: "780 matchs",
    trophees_majeurs: "Finaliste Coupe du Monde 2002",
    age: 55,
    club: "Retraité",
    nationalite: "Allemand",
    buts: 0,
    passes: 2,
    cartons_jaunes: 10,
    cartons_rouges: 1
  },
  {
    id: 8,
    name: "Raimond Aumann",
    posteId: 1,
    country: "Allemagne",
    image: "aumann.jpg",
    fifa_points: 85,
    biography: "Gardien solide du Bayern Munich dans les années 80‑90.",
    statistics: "250+ matchs",
    trophees_majeurs: "Championnat d'Allemagne",
    age: 61,
    club: "Retraité",
    nationalite: "Allemand",
    buts: 0,
    passes: 1,
    cartons_jaunes: 1,
    cartons_rouges: 0
  },
  {
    id: 9,
    name: "Keylor Navas",
    posteId: 1,
    country: "Costa Rica",
    image: "navas.jpg",
    fifa_points: 88,
    biography: "Héros du Real Madrid en Ligue des Champions.",
    statistics: "450+ matchs",
    trophees_majeurs: "3 Ligues des Champions",
    age: 37,
    club: "PSG",
    nationalite: "Costaricien",
    buts: 0,
    passes: 6,
    cartons_jaunes: 3,
    cartons_rouges: 0
  },
  {
    id: 10,
    name: "David De Gea",
    posteId: 1,
    country: "Espagne",
    image: "de_gea.jpg",
    fifa_points: 87,
    biography: "Ancien numéro 1 de Manchester United.",
    statistics: "600+ matchs",
    trophees_majeurs: "Europa League",
    age: 34,
    club: "Libre",
    nationalite: "Espagnol",
    buts: 0,
    passes: 2,
    cartons_jaunes: 4,
    cartons_rouges: 0
  }
];

export const getJoueurById = (req: Request, res: Response) => {
  const idParam = req.params.id;
  const joueurId = Number(idParam);
  if (Number.isNaN(joueurId)) {
    return res.status(400).json({ error: 'ID invalide' });
  }
  const joueur = gardiens.find(g => g.id === joueurId);
  if (!joueur) {
    return res.status(404).json({ error: 'Joueur introuvable.' });
  }
  res.json(joueur);
};

export const createJoueur = (_req: Request, res: Response) => {
  // À implémenter selon ta logique DB
  res.status(201).json({ message: 'Joueur créé' });
};
