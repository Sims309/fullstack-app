import request from 'supertest';
import { app } from '../src/server';
import { prisma } from '../src/server/prismaClient';

describe('Intégration Auth - Test complet unique', () => {
  let uniqueEmail: string;
  let token: string;

  afterAll(async () => {
    // Nettoyage des utilisateurs créés dans ce test
    await prisma.user.deleteMany({
      where: {
        email: { contains: 'integration+' },
      },
    });
    await prisma.$disconnect();
  });

  test('Créer un utilisateur, se connecter, puis récupérer ses infos avec le token', async () => {
    // Générer un email unique
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    uniqueEmail = `integration+${randomSuffix}@test.com`;

    // 1. Enregistrer un nouvel utilisateur
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail,
        username: 'integration_user',
        password: 'test1234',
        confirmPassword: 'test1234',
      })
      .expect(201);

    expect(registerRes.body).toHaveProperty('message', 'Utilisateur créé.');
    expect(registerRes.body).toHaveProperty('userId');

    // 2. Se connecter avec cet utilisateur
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: uniqueEmail,
        password: 'test1234',
      })
      .expect(200);

    const setCookie = loginRes.headers['set-cookie'];
    expect(setCookie).toBeDefined();

    const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
    const authCookie = cookies.find((cookie: string) =>
      cookie.startsWith('auth-token='));
    expect(authCookie).toBeDefined();

    const match = authCookie!.match(/auth-token=([^;]+);/);
    token = match ? match[1] : '';
    expect(token).toBeTruthy();

    // 3. Récupérer les infos utilisateur avec le token
    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(meRes.body).toHaveProperty('user');
    expect(meRes.body.user.email).toBe(uniqueEmail);
  });
});
