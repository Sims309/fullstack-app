import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

// Définir un type pour l'utilisateur (ajoute les champs nécessaires)
interface User {
  id: string;
  nom: string;
  email: string;
  role: string; // Ex : 'user', 'admin'
}

// Fonction pour récupérer l'utilisateur à partir du JWT (cookie)
const getUserFromToken = (token: string | undefined): User | null => {
  if (!token) return null;

  try {
    const decoded: any = JSON.parse(atob(token.split('.')[1])); // Décoder le JWT (attention à la sécurité)
    return decoded?.user || null;
  } catch (error) {
    console.error('Erreur lors du décodage du token:', error);
    return null;
  }
};

export const useAuth = () => {
  // Etat de l'utilisateur et du token JWT
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = Cookies.get('jwt'); // Récupérer le cookie 'jwt'
    
    if (token) {
      const decodedUser = getUserFromToken(token);
      setUser(decodedUser);
    }

    setLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    Cookies.set('jwt', token, { expires: 7 }); // Le cookie expire dans 7 jours
    setUser(userData);
  };

  const logout = () => {
    Cookies.remove('jwt'); // Supprimer le cookie 'jwt' pour se déconnecter
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user, // Retourne true si un utilisateur est connecté
  };
};
