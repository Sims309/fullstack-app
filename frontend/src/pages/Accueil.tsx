import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext"; // Import du contexte
import "./Accueil.css";

const Accueil: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useContext(UserContext); // Récupération de l'utilisateur

  useEffect(() => {
    const checkAuth = async () => {
      // Si on a déjà un utilisateur dans le contexte, pas besoin d'appel API
      if (user) {
        setLoading(false);
        return;
      }

      // Sinon, vérifier avec l'API
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!res.ok) {
          navigate("/"); // Pas connecté, retour login
        } else {
          const data = await res.json();
          // Mettre à jour le contexte si l'API retourne l'utilisateur
          setUser(data.user);
          setLoading(false);
        }
      } catch (err) {
        console.error("Erreur de vérification de session:", err);
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate, user, setUser]);

  if (loading) return <p>Chargement...</p>;

  // Navigue vers la page du numéro sélectionné
  const handleNavigation = (numero: number): void => {
    navigate(`/numero/${numero}`);
  };

  // 🆕 Fonction de retour en arrière
  const handleGoBack = (): void => {
    window.history.back(); // Utilise l'historique du navigateur
  };

  // 🆕 Fonction de déconnexion propre
  const handleLogout = async (): Promise<void> => {
    try {
      // Appel API de déconnexion (si votre backend le supporte)
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
    } finally {
      // Nettoyer le contexte et localStorage
      setUser(null);
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  return (
    <div className="accueil">
      {/* 🆕 Barre de navigation en haut */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "20px",
        padding: "10px 0",
        borderBottom: "2px solid #eee"
      }}>
        <button
          onClick={handleGoBack}
          type="button"
          style={{
            padding: "8px 16px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          ← Retour
        </button>

        <button
          onClick={handleLogout}
          type="button"
          style={{
            padding: "8px 16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Se déconnecter
        </button>
      </div>

      {/* 🆕 Message personnalisé avec le nom d'utilisateur */}
      <h1>
        Bienvenue {user?.username || "Utilisateur"} au pentéhon des meilleurs joueurs du Monde
      </h1>
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

      {/* ❌ Ancien bouton retour supprimé - remplacé par la barre de navigation */}
    </div>
  );
};

export default Accueil;