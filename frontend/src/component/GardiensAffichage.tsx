import { useState } from "react";

const gardiens = [
  { id: 1, name: "Lev Yashin", posteId: 1, classement: 1, club: "URSS" },
  { id: 2, name: "Gianluigi Buffon", posteId: 1, classement: 2, club: "Italie" },
  { id: 3, name: "Manuel Neuer", posteId: 1, classement: 3, club: "Allemagne" },
  { id: 4, name: "Iker Casillas", posteId: 1, classement: 4, club: "Espagne" },
  { id: 5, name: "Peter Schmeichel", posteId: 1, classement: 5, club: "Danemark" },
  { id: 6, name: "Dino Zoff", posteId: 1, classement: 6, club: "Italie" },
  { id: 7, name: "Oliver Kahn", posteId: 1, classement: 7, club: "Allemagne" },
  { id: 8, name: "Raimond Aumann", posteId: 1, classement: 8, club: "Allemagne" },
  { id: 9, name: "Keylor Navas", posteId: 1, classement: 9, club: "Costa Rica" },
  { id: 10, name: "David De Gea", posteId: 1, classement: 10, club: "Espagne" }
];

// Classement décroissant : du moins bon (10) au meilleur (1)
const gardiensAffiches = [...gardiens].sort((a, b) => b.classement - a.classement);

export default function GardiensAffichage() {
  const [index, setIndex] = useState(0);
  const gardien = gardiensAffiches[index];
  const total = gardiensAffiches.length;

  const suivant = () => {
    setIndex((prevIndex) => (prevIndex + 1) % total);
  };

  const precedent = () => {
    setIndex((prevIndex) => (prevIndex - 1 + total) % total);
  };

  return (
    <div style={{
      maxWidth: "400px",
      margin: "auto",
      padding: "20px",
      textAlign: "center",
      border: "1px solid #ccc",
      borderRadius: "10px"
    }}>
      <h2>N° {gardien.classement}</h2>
      <h3>{gardien.name}</h3>
      <p><strong>Pays / Club :</strong> {gardien.club}</p>
      <p><strong>Poste :</strong> Gardien de but</p>

      <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
        <button onClick={precedent} style={buttonStyle}>⬅️ Précédent</button>
        <button onClick={suivant} style={buttonStyle}>Suivant ➡️</button>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "5px"
};
