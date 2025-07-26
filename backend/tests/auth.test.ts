// backend/tests/auth.test.ts
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../src/server'; // Import nommé correspondant à export const app

describe('Tests de la route /me', () => {
  let token: string | null = null;
  let server: any;

  beforeAll(async () => {
    // Démarrer le serveur pour les tests si nécessaire
    // server = app.listen(0); // Port automatique pour les tests
  });

  afterAll(async () => {
    // Fermer le serveur après les tests
    // if (server) {
    //   server.close();
    // }
  });

  test('GET /me sans token doit renvoyer une erreur', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .expect(401);

    expect(res.body).toHaveProperty('error', 'Token manquant');
    expect(res.body).toHaveProperty('message');
  });

  test('POST /login doit renvoyer un token', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'fictif@test.com',
        password: 'test1234',
      })
      .expect(200);

    // Récupérer le token depuis les cookies
    const setCookie = loginRes.headers['set-cookie'];
    if (setCookie && Array.isArray(setCookie)) {
      const authCookie = setCookie.find(cookie => cookie.includes('auth-token='));
      if (authCookie) {
        const match = authCookie.match(/auth-token=([^;]+);/);
        token = match ? match[1] : null;
      }
    }

    expect(token).toBeTruthy();
  });

  test('GET /me avec token doit retourner les infos utilisateur', async () => {
    // S'assurer qu'on a un token du test précédent
    expect(token).toBeTruthy();

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toMatchObject({
      email: 'fictif@test.com',
      role: expect.any(String),
    });
  });
});