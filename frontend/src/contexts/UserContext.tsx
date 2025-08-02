// src/context/UserContext.tsx

import { createContext, useState, ReactNode, useEffect, useCallback } from "react";

export type User = {
  id: number;
  email: string;
  username: string;
  role: string;
  avatar?: string; // Optionnel, pour afficher avatar dans la Navbar
};

export type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Charger depuis localStorage si disponible
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Échec de chargement de l'utilisateur localStorage", e);
      }
    }
  }, []);

  // Synchroniser automatiquement les changements de user vers localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Déconnexion : vider user + localStorage
  const logout = useCallback(() => {
    setUser(null);
    // localStorage est nettoyé automatiquement par l'effet ci-dessus
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
