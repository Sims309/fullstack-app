// backend/tests/auth.integration.test.ts
import request from 'supertest';
import { app } from '../src/server';

describe('Intégration Auth', () => {
  const testUser = {
    email: 'integration@test.com',
    username: 'integration_user',
    password: 'test1234',
    confirmPassword: 'test1234',
  };

  let token: string | null = null;

  test('POST /api/auth/register crée un utilisateur', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser)
      .expect(201);

    expect(res.body).toHaveProperty('message', 'Utilisateur créé.');
    expect(res.body).toHaveProperty('userId');
  });

  test('POST /api/auth/login renvoie un token via cookie', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);

    const setCookie = res.headers['set-cookie'];
    expect(setCookie).toBeDefined();

    // Toujours traiter setCookie comme un tableau, même si c’est une string unique
    const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];

    const authCookie = cookies.find(cookie => cookie.startsWith('auth-token='));
    expect(authCookie).toBeDefined();

    // Extraire le token du cookie
    const match = authCookie!.match(/auth-token=([^;]+);/);
    token = match ? match[1] : null;

    expect(token).toBeTruthy();
  });

  test('GET /api/auth/me renvoie les infos utilisateur avec token', async () => {
    expect(token).toBeTruthy();

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toMatchObject({
      email: testUser.email,
      username: testUser.username,
      role: expect.any(String),
    });
  });
});
