import request from 'supertest';
import { app } from '../src/server'; // Ajuste selon ton chemin

describe('Tests des routes joueurs par poste', () => {
  // Test poste 1 (gardien) - déjà existant
  test('GET /api/joueurs/poste/1 doit retourner la liste des gardiens', async () => {
    const res = await request(app).get('/api/joueurs/poste/1');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((joueur: any) => {
      expect(joueur.posteId).toBe(1);
    });
  });

  // Exemple test poste 2 (à compléter dans tes données)
  test('GET /api/joueurs/poste/2 doit retourner la liste des joueurs du poste 2', async () => {
    const res = await request(app).get('/api/joueurs/poste/2');
    if (res.statusCode === 404) {
      expect(res.body).toHaveProperty('error', 'Aucun joueur trouvé pour ce poste.');
    } else {
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach((joueur: any) => {
        expect(joueur.posteId).toBe(2);
      });
    }
  });

  // Test poste invalide (ex: string)
  test('GET /api/joueurs/poste/abc retourne 400 pour poste invalide', async () => {
    const res = await request(app).get('/api/joueurs/poste/abc');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'ID de poste invalide');
  });

  // Test poste non existant (ex: 99)
  test('GET /api/joueurs/poste/99 retourne 404 pour poste non trouvé', async () => {
    const res = await request(app).get('/api/joueurs/poste/99');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Aucun joueur trouvé pour ce poste.');
  });
  
  // Test récupération de tous les joueurs (route getAllJoueurs)
  test('GET /api/joueurs retourne tous les joueurs', async () => {
    const res = await request(app).get('/api/joueurs');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
