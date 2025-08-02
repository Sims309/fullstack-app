import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/contexts/UserContext";
import "@/pages/Accueil.css";

const Accueil: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const checkAuth = async () => {
      if (user) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!res.ok) {
          navigate("/");
        } else {
          const data = await res.json();
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

  // 🔥 CORRECTION : Utiliser /poste/ pour tous les numéros (cohérence)
  const handleNavigation = (numero: number): void => {
    navigate(`/poste/${numero}`);
  };

  const handleGoBack = (): void => {
    window.history.back();
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  // 🆕 Labels des postes pour une meilleure UX
  const postesLabels: { [key: number]: string } = {
    1: "Gardiens",
    2: "Défenseurs centraux",
    3: "Latéraux droits", 
    4: "Latéraux gauches",
    5: "Milieux défensifs",
    6: "Milieux centraux",
    7: "Milieux offensifs",
    8: "Ailiers droits",
    9: "Ailiers gauches", 
    10: "Seconds attaquants",
    11: "Attaquants"
  };

  return (
    <div className="accueil">
      {/* Barre de navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          padding: "10px 0",
          borderBottom: "2px solid #eee",
        }}
      >
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
            fontSize: "14px",
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
            fontSize: "14px",
          }}
        >
          Se déconnecter
        </button>
      </div>

      {/* Message de bienvenue */}
      <h1>
        Bienvenue {user?.username || "Utilisateur"} au panthéon des meilleurs
        joueurs du Monde
      </h1>
      <h2>Par poste, choisissez un numéro :</h2>

      {/* 🆕 Grille des postes avec labels */}
      <div className="button-container">
        {[...Array(11)].map((_, index) => {
          const numero = index + 1;
          return (
            <div key={numero} style={{ textAlign: "center", margin: "10px" }}>
              <button
                onClick={() => handleNavigation(numero)}
                className="numero-button"
                type="button"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "15px 10px",
                  marginBottom: "5px",
                  fontSize: "16px",
                  fontWeight: "bold"
                }}
              >
                Numéro {numero}
              </button>
              <small style={{ 
                color: "#666", 
                fontSize: "12px",
                display: "block"
              }}>
                {postesLabels[numero]}
              </small>
            </div>
          );
        })}
      </div>

      {/* Bouton équipe idéale */}
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <h3>Équipe Idéale</h3>
        <button
          onClick={() => navigate("/poste/12")}
          type="button"
          style={{
            padding: "15px 30px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          🏆 Voir l'Équipe Idéale
        </button>
        <p style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
          Découvrez la composition de l'équipe parfaite
        </p>
      </div>
    </div>
  );
};

export default Accueil;