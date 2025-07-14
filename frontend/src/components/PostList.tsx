import { useParams } from "react-router-dom";
import { useJoueursParPoste } from "../hooks/useJoueursParPoste";

function PosteList() {
  const { posteId } = useParams<{ posteId: string }>();
  const { joueurs, loading, error } = useJoueursParPoste(posteId);

  if (error) return <div style={{ color: "red" }}>Erreur : {error}</div>;
  if (loading) return <div>Chargement...</div>;
  if (joueurs.length === 0) return <div>Aucun joueur trouvé</div>;

  return (
    <div>
      <h2>Joueurs du poste {posteId}</h2>
      <div className="grid">
        {joueurs.map((j) => (
          <div key={j.id} className="card">
            <img src={j.image} alt={j.nom} width={150} />
            <h3>{j.nom}</h3>
            <p>Pays : {j.pays}</p>
            <p>Note FIFA : {j.pointsFIFA}</p>

            {j.biographie && (
              <p>
                <strong>Biographie :</strong> {j.biographie}
              </p>
            )}

            {j.statistiques && (
              <div className="stats">
                <p>Matchs : {j.statistiques.matchs}</p>
                <p>Buts : {j.statistiques.buts}</p>
                <p>Passes : {j.statistiques.passes}</p>
                <p>Cartons jaunes : {j.statistiques.cartonsJaunes ?? 0}</p>
                <p>Cartons rouges : {j.statistiques.cartonsRouges ?? 0}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PosteList;
