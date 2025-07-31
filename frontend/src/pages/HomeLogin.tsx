import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext"; // ✅ Import context

type User = {
  id: number;
  email: string;
  username: string;
  role: string;
};

const HomeLogin: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // ✅ Utilisation du context
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loading state

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true); // ✅ Démarre le chargement

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur de connexion");
      }

      // ✅ Stocker l'utilisateur dans le contexte et localStorage
      const user: User = data.user;
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));

      // 🎯 MODIFICATION 1 : Redirection vers /accueil au lieu de /
      navigate("/accueil");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur inconnue");
      }
    } finally {
      setLoading(false); // ✅ Fin du chargement
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "100px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        textAlign: "center",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Connexion</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p style={{ color: "#555" }}>Connexion en cours...</p>} {/* ✅ Animation texte */}

      <form
        onSubmit={handleLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            width: "100%",
          }}
          disabled={loading} // ✅ Bloque le bouton si chargement
        >
          {loading ? "Connexion..." : "Se connecter"} {/* ✅ Texte dynamique */}
        </button>
      </form>

      <p style={{ marginTop: "15px" }}>
        Pas de compte ?{" "}
        {/* 🎯 MODIFICATION 2 : Navigation React Router au lieu de <a href> */}
        <span 
          onClick={() => navigate("/register")}
          style={{ 
            color: "#007bff", 
            cursor: "pointer", 
            textDecoration: "underline" 
          }}
        >
          Créez-en un ici
        </span>
      </p>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  padding: "10px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
};

export default HomeLogin;