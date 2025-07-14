import { useEffect, useState } from "react";

export interface Joueur {
  id: number;
  nom: string;
  image: string;
  pays: string;
  pointsFIFA: number;
  biographie?: string;
  statistiques?: {
    matchs: number;
    buts: number;
    passes: number;
    cartonsJaunes?: number;
    cartonsRouges?: number;
    [cle: string]: number | undefined;
  };
}

export function useJoueursParPoste(posteId: string | undefined) {
  const [joueurs, setJoueurs] = useState<Joueur[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!posteId) return;

    setLoading(true);
    setError(null);

    fetch(`/api/joueurs/poste/${posteId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur de réponse du serveur");
        return res.json();
      })
      .then((data: Joueur[]) => setJoueurs(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [posteId]);

  return { joueurs, loading, error };
}
