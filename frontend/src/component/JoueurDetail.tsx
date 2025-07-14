import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// --- Interfaces robustes ---
interface Statistiques {
  matchs: number;
  buts: number;
  passes: number;
  cartonsJaunes?: number;
  cartonsRouges?: number;
}

interface Joueur {
  id: number;
  nom: string;
  pays: string;
  image: string;
  pointsFIFA: number;
  biographie?: string;
  statistiques?: Statistiques;
}

// --- Composant principal ---
const JoueurDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [joueur, setJoueur] = useState<Joueur | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError("Identifiant de joueur manquant.");
      setLoading(false);
      return;
    }

    fetch(`/api/joueurs/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: Joueur non trouvé.`);
        }
        return response.json();
      })
      .then((data: Joueur) => {
        setJoueur(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div style={{ color: "red" }}>❌ Erreur : {error}</div>;
  if (!joueur) return <div>Joueur introuvable.</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
        ← Retour
      </button>

      <h2>{joueur.nom}</h2>
      <img 
        src={joueur.image} 
        alt={joueur.nom} 
        width={200} 
        style={{ borderRadius: "8px" }}
        onError={(e) => {
          e.currentTarget.src = "/placeholder-image.jpg"; // Image de fallback
        }}
      />
      <p><strong>Pays :</strong> {joueur.pays}</p>
      <p><strong>Note FIFA :</strong> {joueur.pointsFIFA}</p>

      {joueur.biographie && (
        <div style={{ marginTop: "1rem" }}>
          <h4>📝 Biographie :</h4>
          <p>{joueur.biographie}</p>
        </div>
      )}

      {joueur.statistiques && (
        <div style={{ marginTop: "1rem" }}>
          <h4>📊 Statistiques :</h4>
          <ul>
            <li>Matchs : {joueur.statistiques.matchs}</li>
            <li>Buts : {joueur.statistiques.buts}</li>
            <li>Passes : {joueur.statistiques.passes}</li>
            <li>Cartons jaunes : {joueur.statistiques.cartonsJaunes ?? 0}</li>
            <li>Cartons rouges : {joueur.statistiques.cartonsRouges ?? 0}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default JoueurDetail;