import { Request, Response } from 'express';
import { db } from '../db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import type { MilieuDefensif } from '@shared/types/milieuxDefensifs';

export const getJoueurById = async (req: Request, res: Response) => {
  const joueurId = Number(req.params.id);
  if (isNaN(joueurId)) {
    return res.status(400).json({ error: 'ID invalide' });
  }

  const sql = 'SELECT * FROM milieux_defensifs WHERE id = ? LIMIT 1';

  try {
    const [results] = await db.query<RowDataPacket[]>(sql, [joueurId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Milieu défensif non trouvé.' });
    }

    const joueur: MilieuDefensif = {
      id: results[0].id,
      posteId: results[0].posteId,
      name: results[0].name,
      country: results[0].country,
      image: results[0].image,
      fifa_points: results[0].fifa_points,
      biography: results[0].biography,
      statistics: results[0].statistics,
      trophees_majeurs: results[0].trophees_majeurs,
      age: results[0].age,
      club: results[0].club,
      nationalite: results[0].nationalite,
      buts: results[0].buts,
      passes: results[0].passes,
      cartons_jaunes: results[0].cartons_jaunes,
      cartons_rouges: results[0].cartons_rouges
    };

    res.json({ joueur });
  } catch (err) {
    console.error('❌ Erreur serveur (getJoueurById):', (err as Error).message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

export const createJoueur = async (req: Request, res: Response) => {
  const {
    posteId,
    name,
    country,
    image,
    fifa_points,
    biography,
    statistics,
    trophees_majeurs,
    age,
    club,
    nationalite,
    buts,
    passes,
    cartons_jaunes,
    cartons_rouges
  } = req.body;

  if (
    !posteId || !name || !country || !image || fifa_points === undefined || !biography || !statistics ||
    !trophees_majeurs || age === undefined || !club || !nationalite ||
    buts === undefined || passes === undefined || cartons_jaunes === undefined || cartons_rouges === undefined
  ) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  const sql = `
    INSERT INTO milieux_defensifs (
      posteId, name, country, image, fifa_points, biography, statistics,
      trophees_majeurs, age, club, nationalite, buts, passes, cartons_jaunes, cartons_rouges
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.query<ResultSetHeader>(sql, [
      posteId, name, country, image, fifa_points, biography, statistics,
      trophees_majeurs, age, club, nationalite, buts, passes, cartons_jaunes, cartons_rouges
    ]);

    res.status(201).json({ message: 'Milieu défensif créé.', joueurId: result.insertId });
  } catch (err) {
    console.error('❌ Erreur serveur (createJoueur):', (err as Error).message);
    res.status(500).json({ error: 'Erreur lors de la création du milieu défensif.' });
  }
};
