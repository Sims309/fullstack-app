// src/server/services/joueurService.ts
import { Joueur } from '@shared/types/joueurs'; // ✅ utilise l'alias @shared configuré
import { db } from '@/db'; // ✅ utilise l'alias @ qui pointe vers ./src
import { RowDataPacket } from 'mysql2'; // ✅ import du type MySQL

export const getAllJoueurs = async (): Promise<Joueur[]> => {
  const sql = `
    SELECT 
      posteId, id, name, country, image, fifa_points,
      biography, statistics, trophees_majeurs, age,
      club, nationalite, buts, passes,
      cartons_jaunes, cartons_rouges 
    FROM joueurs
  `;
  
  const [rows] = await db.query<(Joueur & RowDataPacket)[]>(sql);
  return rows;
};