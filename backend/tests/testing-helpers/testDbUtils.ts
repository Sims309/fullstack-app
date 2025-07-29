import { db } from '../../src/db';

/**
 * Nettoie les tables principales utilisées en test.
 */
export const cleanTestDatabase = async () => {
  await db.query('DELETE FROM users');
  await db.query('DELETE FROM joueurs');
  // ajoute d’autres tables si besoin
};

/**
 * Ferme proprement la connexion pool MySQL après les tests.
 */
export const closeTestDatabase = async () => {
  await db.end();
};
