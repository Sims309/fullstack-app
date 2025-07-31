import { useState, useEffect } from 'react';

// Définir un type pour l'utilisateur
interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Au chargement, essayer de récupérer l'utilisateur connecté via /me
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include", // important pour envoyer le cookie
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur :", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Déconnexion via /logout
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // important pour supprimer le cookie
      });
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err);
    } finally {
      setUser(null);
    }
  };

  return {
    user,
    loading,
    logout,
    isAuthenticated: !!user,
  };
};
