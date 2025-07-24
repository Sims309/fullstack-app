// tests/getJoueurById.test.ts
import request from 'supertest';
import { app } from '@server';

import { Joueur } from '@shared/types/joueurs';

describe('GET /api/joueurs/:id', () => {
  it('devrait retourner un joueur complet avec toutes les propriétés attendues', async () => {
    const response = await request(app).get('/api/joueurs/2'); // Buffon a maintenant id 2

    expect(response.status).toBe(200);

    const joueur: Joueur = response.body;

    expect(joueur).toHaveProperty('id', 2);
    expect(joueur).toHaveProperty('posteId', 1);
    expect(joueur).toHaveProperty('name', expect.stringMatching(/buffon/i));
    expect(joueur).toHaveProperty('country', 'Italie');
    expect(joueur).toHaveProperty('image');
    expect(joueur).toHaveProperty('fifa_points');
    expect(joueur).toHaveProperty('biography');
    expect(joueur).toHaveProperty('statistics');
    expect(joueur).toHaveProperty('trophees_majeurs');
    expect(joueur).toHaveProperty('age');
    expect(joueur).toHaveProperty('club');
    expect(joueur).toHaveProperty('nationalite');
    expect(joueur).toHaveProperty('buts');
    expect(joueur).toHaveProperty('passes');
    expect(joueur).toHaveProperty('cartons_jaunes');
    expect(joueur).toHaveProperty('cartons_rouges');

    expect(joueur.club.toLowerCase()).toBe('retraité');
    expect(typeof joueur.fifa_points).toBe('number');
    expect(joueur.buts).toBe(0);
  });
});
