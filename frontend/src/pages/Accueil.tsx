import React from "react";
import { useNavigate } from "react-router-dom";
import "./Accueil.css";

const Accueil: React.FC = () => {
  const navigate = useNavigate();

  // Navigue vers la page du numéro sélectionné
  const handleNavigation = (numero: number): void => {
    navigate(`/numero/${numero}`);  // Note le "/" entre "numero" et le numéro
  };

  // Retourne à la page de connexion ("/")
  const handleRetourHomeLogin = (): void => {
    console.log("Retour à la page de connexion");
    navigate("/");
  };

  return (
    <div className="accueil">
      <h1>Bienvenue au pentéhon des meilleurs joueurs du Monde</h1>
      <h2>Par poste, choisissez un numéro :</h2>

      <div className="button-container">
        {[...Array(12)].map((_, index) => {
          const numero = index + 1;
          return (
            <button
              key={numero}
              onClick={() => handleNavigation(numero)}
              className="numero-button"
              type="button"
            >
              Numéro {numero}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleRetourHomeLogin}
        className="retour-button"
        type="button"
      >
        Retour à la page de connexion
      </button>
    </div>
  );
};

export default Accueil;
