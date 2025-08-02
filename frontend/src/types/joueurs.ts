// src/types/joueurs.ts

// ✅ Interface complète unifiée
export interface Joueur {
  id: number;
  nom: string;
  image?: string;
  imageUrl?: string; // Alias pour image
  pays?: string;
  nationalite?: string; // Alias pour pays
  pointsFIFA: number;
  biographie?: string;
  poste?: string;
  
  // Propriétés étendues
  tropheesMajeurs?: string;
  statistiques?: {
    matchs?: number;
    buts?: number;
    passes?: number;
    cartonsJaunes?: number;
    cartonsRouges?: number;
  };
  age?: number;
  club?: string;
  photos?: string[];
  
  // YouTube - les deux propriétés pour compatibilité
  youtube?: string;
  youtubeLink?: string;
}

// ✅ Type simplifié utilisé pour certains cas spécifiques
export type JoueurSimplifie = {
  id: number;
  nom: string;
  image?: string;
  posteId: number;
  pointsFIFA?: number;
};

// Types pour les réponses de l'API
export interface JoueurResponse {
  success: boolean;
  data: Joueur[];
  message?: string;
}

// Type pour un joueur individuel
export interface SingleJoueurResponse {
  success: boolean;
  data: Joueur;
  message?: string;
}

// Type pour l'équipe idéale
export interface EquipeIdeale {
  joueurs: Joueur[];
  dateCreation: Date;
}