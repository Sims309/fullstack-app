export interface Joueur {
  id: number;
  name: string;
  image: string;        // garde ce nom pour l’image
  country: string;
  fifa_points: number;
  age?: number;
  club?: string;
  nationalite?: string;
  biography?: string;   // texte simple, peut être du JSON ou du texte brut
  trophees_majeurs?: string;
  statistics?: {
    matchs: number;
    buts: number;
    passes: number;
    cartonsJaunes?: number;
    cartonsRouges?: number;
  };
}
