// src/api/joueursApi.ts
import { Joueur } from '@/types/joueurs';

// 🎯 Fonction pour récupérer les joueurs par poste
export const getJoueursByPoste = async (posteId: number): Promise<Joueur[]> => {
  try {
    // 🔍 Appel à votre API backend
    const response = await fetch(`/api/joueurs/poste/${posteId}`, {
      method: 'GET',
      credentials: 'include', // Pour inclure les cookies de session
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Aucun joueur trouvé pour le poste ${posteId}`);
      }
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    // 🔄 Adapter selon la structure de votre réponse API
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    } else if (Array.isArray(data)) {
      return data;
    } else {
      throw new Error('Format de réponse inattendu');
    }
    
  } catch (error) {
    console.error(`Erreur lors de la récupération des joueurs pour le poste ${posteId}:`, error);
    throw error;
  }
};

// 🎯 Fonction pour récupérer un joueur spécifique
export const getJoueurById = async (id: number): Promise<Joueur> => {
  try {
    const response = await fetch(`/api/joueurs/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.success ? data.data : data;
    
  } catch (error) {
    console.error(`Erreur lors de la récupération du joueur ${id}:`, error);
    throw error;
  }
};

// 🎯 Fonction pour récupérer tous les joueurs
export const getAllJoueurs = async (): Promise<Joueur[]> => {
  try {
    const response = await fetch('/api/joueurs', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.success ? data.data : data;
    
  } catch (error) {
    console.error('Erreur lors de la récupération de tous les joueurs:', error);
    throw error;
  }
};