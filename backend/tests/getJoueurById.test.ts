import request from 'supertest';
import { app } from '@server';

import { Joueur } from '@shared/joueurs'; // fonctionne si joueurs.ts exporte correctement l'interface


 // adapte le chemin si besoin

describe('GET /api/joueurs/:id', () => {
  it('devrait retourner un joueur complet avec toutes les propriétés attendues', async () => {
    const response = await request(app).get('/api/joueurs/1'); // Buffon

    expect(response.status).toBe(200);

    const joueur: Joueur = response.body;

    // Vérifie toutes les propriétés
    expect(joueur).toHaveProperty('id', 1);
    expect(joueur).toHaveProperty('posteId', 1);
    expect(joueur).toHaveProperty('name', 'Gianluigi Buffon');
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

    // Vérifie quelques valeurs précises (facultatif)
    expect(joueur.club).toBe('Retraité');
    expect(typeof joueur.fifa_points).toBe('number');
    expect(joueur.buts).toBe(0);
  });
});
