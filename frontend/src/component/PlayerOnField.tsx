// src/components/PlayerOnField.tsx
import React from 'react';
import { Joueur } from '@/types/joueurs';

interface PlayerOnFieldProps {
  joueur: Joueur;
}

export default function PlayerOnField({ joueur }: PlayerOnFieldProps) {
  return (
    <div className="flex flex-col items-center">
      <img
        src={joueur.image || '/placeholder.jpg'}
        alt={joueur.nom}
        className="w-14 h-14 rounded-full border object-cover shadow-md bg-white"
      />
      <span className="text-xs mt-1 font-semibold text-white text-center">{joueur.nom}</span>
    </div>
  );
}
