// src/contexts/EquipeIdealContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { Joueur } from '@/types/joueurs';

type EquipeIdealContextType = {
  equipe: Joueur[];
  ajouterJoueur: (joueur: Joueur) => void;
};

const EquipeIdealContext = createContext<EquipeIdealContextType | undefined>(undefined);

export const EquipeIdealProvider = ({ children }: { children: ReactNode }) => {
  const [equipe, setEquipe] = useState<Joueur[]>([]);

  const ajouterJoueur = (joueur: Joueur) => {
    setEquipe((prev) => [...prev, joueur]);
  };

  return (
    <EquipeIdealContext.Provider value={{ equipe, ajouterJoueur }}>
      {children}
    </EquipeIdealContext.Provider>
  );
};

// ✅ Hook d’accès au contexte (extraction chirurgicale)
export const useEquipeIdeal = () => {
  const context = useContext(EquipeIdealContext);
  if (!context) {
    throw new Error('useEquipeIdeal doit être utilisé dans un EquipeIdealProvider');
  }
  return context;
};
