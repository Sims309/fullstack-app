import { Joueur } from '@shared/types/joueurs';

let equipeIdeale: Joueur[] = [];

const addToEquipeIdeale = (joueur: Joueur) => {
  equipeIdeale.push(joueur);
};

const removeFromEquipeIdeale = (id: number) => {
  equipeIdeale = equipeIdeale.filter(j => j.id !== id);
};

const updateJoueurInEquipeIdeale = (id: number, updates: Partial<Joueur>) => {
  equipeIdeale = equipeIdeale.map(j =>
    j.id === id ? { ...j, ...updates, id: j.id } : j // ✅ corrige le bug d'écrasement
  );
};

describe('Équipe idéale - opérations locales', () => {
  const mockJoueur: Joueur = {
    id: 99,
    posteId: 1,
    name: 'Test Gardien',
    country: 'Testland',
    image: 'test.jpg',
    fifa_points: 88,
    biography: 'Test bio',
    statistics: '100 matchs',
    trophees_majeurs: 'aucun',
    age: 30,
    club: 'Test Club',
    nationalite: 'Test',
    buts: 0,
    passes: 0,
    cartons_jaunes: 0,
    cartons_rouges: 0
  };

  beforeEach(() => {
    equipeIdeale = []; // reset avant chaque test
  });

  it('ajoute un joueur à l’équipe idéale', () => {
    addToEquipeIdeale(mockJoueur);
    expect(equipeIdeale.length).toBe(1);
    expect(equipeIdeale[0].name).toBe('Test Gardien');
  });

  it('supprime un joueur de l’équipe idéale', () => {
    addToEquipeIdeale(mockJoueur);
    removeFromEquipeIdeale(99);
    expect(equipeIdeale.length).toBe(0);
  });

  it('modifie un joueur dans l’équipe idéale sans écraser son id', () => {
    addToEquipeIdeale(mockJoueur);
    updateJoueurInEquipeIdeale(99, { fifa_points: 90, name: 'Modifié', id: 100 }); // même si on essaie de modifier l'id
    expect(equipeIdeale[0].fifa_points).toBe(90);
    expect(equipeIdeale[0].name).toBe('Modifié');
    expect(equipeIdeale[0].id).toBe(99); // ✅ id reste intact
  });
});
