// tests/protectedRoute.test.ts
import request from 'supertest';
import { app } from '../src/server';

describe('🔐 Route protégée /api/protected', () => {
  it('❌ devrait refuser l’accès sans token', async () => {
    const res = await request(app).get('/api/protected');
    expect(res.statusCode).toBe(401); // Non autorisé
    expect(res.body).toHaveProperty('error');
  });

  // Tu peux ajouter un test avec token si tu veux
});
