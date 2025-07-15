// fullstack-app/shared/types/milieuxDefensifs.ts

import { Joueur } from './joueurs';

// ✅ Type dédié au cas où tu veux spécialiser plus tard
export type MilieuDefensif = Joueur;

// ✅ Tableau exporté pour usage global
export const milieuxDefensifs: MilieuDefensif[] = [
  // Exemple de joueur si besoin :
  // {
  //   posteId: 5,
  //   id: 1,
  //   name: 'Jean Dupont',
  //   country: 'France',
  //   image: 'image_url',
  //   fifa_points: 85,
  //   biography: 'Milieu défensif solide et expérimenté',
  //   statistics: '120 matchs, 50 passes décisives',
  //   trophees_majeurs: 'Coupe du monde 2018',
  //   age: 28,
  //   club: 'Paris FC',
  //   nationalite: 'Française',
  //   buts: 3,
  //   passes: 7,
  //   cartons_jaunes: 2,
  //   cartons_rouges: 0,
  // }
];
