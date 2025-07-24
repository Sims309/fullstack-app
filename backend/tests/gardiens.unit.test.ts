// tests/gardiens.unit.test.ts
import { gardiens, Joueur } from '@shared/types/joueurs';

describe('Gardiens - données bien formées', () => {
  it('devrait contenir exactement 10 gardiens', () => {
    expect(gardiens.length).toBe(10);
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

  it("les ID des gardiens devraient être de 1 à 10", () => {
    const ids = gardiens.map((g) => g.id);
    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('les gardiens devraient être dans le bon ordre avec les bons noms', () => {
    const nomsAttendus = [
      'Lev Yashin',
      'Gianluigi Buffon',
      'Manuel Neuer',
      'Dino Zoff',
      'Peter Schmeichel',
      'Iker Casillas',
      'Oliver Kahn',
      'Raimond Aumann',
      'Keylor Navas',
      'David De Gea',
    ];

    nomsAttendus.forEach((nom, index) => {
      expect(gardiens[index].name).toBe(nom);
    });
  });

  it('🧾 Affiche les noms de tous les gardiens dans la console', () => {
    const noms = gardiens.map((g) => g.name);
    console.log('📋 Noms des gardiens détectés :', noms);
    expect(noms.length).toBe(10);
  });

  it('🧪 Le premier gardien contient toutes les données prêtes à être affichées', () => {
    const gardien: Joueur = gardiens[0]; // Lev Yashin normalement

    console.log('📋 Premier gardien complet :', gardien);

    expect(gardien).toBeDefined();
    expect(gardien).toHaveProperty('id', 1);
    expect(typeof gardien.posteId).toBe('number');
    expect(typeof gardien.name).toBe('string');
    expect(typeof gardien.country).toBe('string');
    expect(typeof gardien.image).toBe('string');
    expect(typeof gardien.fifa_points).toBe('number');
    expect(typeof gardien.biography).toBe('string');
    expect(typeof gardien.statistics).toBe('string');
    expect(typeof gardien.trophees_majeurs).toBe('string');
    expect(typeof gardien.age).toBe('number');
    expect(typeof gardien.club).toBe('string');
    expect(typeof gardien.nationalite).toBe('string');
    expect(typeof gardien.buts).toBe('number');
    expect(typeof gardien.passes).toBe('number');
    expect(typeof gardien.cartons_jaunes).toBe('number');
    expect(typeof gardien.cartons_rouges).toBe('number');
  });
});
