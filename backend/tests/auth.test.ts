// backend/tests/auth.test.ts
import { describe, test, expect } from '@jest/globals';

const baseUrl = 'http://localhost:5000/api/auth';

describe('Tests de la route /me', () => {
  let token: string | null = null;

  test('GET /me sans token doit renvoyer une erreur', async () => {
    const res = await fetch(`${baseUrl}/me`);
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body).toHaveProperty('error', 'Token manquant');
    expect(body).toHaveProperty('message');
  });

  test('POST /login doit renvoyer un token', async () => {
    const loginRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'fictif@test.com',
        password: 'test1234',
      }),
    });

    const setCookie = loginRes.headers.get('set-cookie') || '';
    const match = setCookie.match(/auth-token=([^;]+);/);
    token = match ? match[1] : null;

    expect(token).toBeTruthy();
  });

  test('GET /me avec token doit retourner les infos utilisateur', async () => {
    const res = await fetch(`${baseUrl}/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toHaveProperty('user');
    expect(body.user).toMatchObject({
      email: 'fictif@test.com',
      role: expect.any(String),
    });
  });
});
