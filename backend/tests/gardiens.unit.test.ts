import { gardiens, Joueur } from '@shared/joueurs';

describe('Gardiens - données bien formées', () => {
  it('devrait contenir au moins un gardien', () => {
    expect(gardiens.length).toBeGreaterThan(0);
  });

  it('chaque gardien devrait avoir toutes les propriétés requises', () => {
    gardiens.forEach((joueur: Joueur) => {
      expect(typeof joueur.id).toBe('number');
      expect(typeof joueur.name).toBe('string');
      expect(typeof joueur.country).toBe('string');
      expect(typeof joueur.image).toBe('string');
      expect(typeof joueur.fifa_points).toBe('number');
      expect(typeof joueur.biography).toBe('string');
      expect(typeof joueur.statistics).toBe('string');
      expect(typeof joueur.trophees_majeurs).toBe('string');
      expect(typeof joueur.age).toBe('number');
      expect(typeof joueur.club).toBe('string');
      expect(typeof joueur.nationalite).toBe('string');
      expect(typeof joueur.buts).toBe('number');
      expect(typeof joueur.passes).toBe('number');
      expect(typeof joueur.cartons_jaunes).toBe('number');
      expect(typeof joueur.cartons_rouges).toBe('number');
    });
  });

  it('le premier gardien devrait être Gianluigi Buffon (valeurs de test)', () => {
    const buffon = gardiens[0];

    expect(buffon.name).toMatch(/buffon/i);
    expect(buffon.club.toLowerCase()).toBe('retraité');
    expect(buffon.posteId).toBe(1); // poste gardien
  });
});
