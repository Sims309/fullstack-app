import { useParams } from "react-router-dom";
import { useJoueursParPoste } from "../hooks/useJoueursParPoste";
import "./PosteList.css";

function PosteList() {
  const { posteId } = useParams<{ posteId?: string }>();

  if (!posteId || isNaN(Number(posteId))) {
    return <div className="poste-error">❌ Poste invalide ou manquant.</div>;
  }

  const { joueurs, loading, error } = useJoueursParPoste(posteId);

  if (loading) return <div className="poste-loading">⏳ Chargement des joueurs...</div>;
  if (error) return <div className="poste-error">Erreur : {error}</div>;
  if (joueurs.length === 0) return <div className="poste-empty">Aucun joueur trouvé pour le poste {posteId}</div>;

  return (
    <div className="poste-container">
      <h2>Joueurs du poste {posteId}</h2>
      <div className="grid">
        {joueurs.map((j) => (
          <div key={j.id} className="card">
            <img src={j.image} alt={j.nom} />
            <h3>{j.nom}</h3>
            <p><strong>Pays :</strong> {j.pays}</p>
            <p><strong>Note FIFA :</strong> {j.pointsFIFA}</p>

            {j.biographie && (
              <p className="bio">
                <strong>Biographie :</strong> {j.biographie}
              </p>
            )}

            {j.statistiques && (
              <div className="stats">
                <p>Matchs : {j.statistiques.matchs}</p>
                <p>Buts : {j.statistiques.buts}</p>
                <p>Passes : {j.statistiques.passes}</p>
                <p>⚠ Jaunes : {j.statistiques.cartonsJaunes ?? 0}</p>
                <p>🟥 Rouges : {j.statistiques.cartonsRouges ?? 0}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PosteList;