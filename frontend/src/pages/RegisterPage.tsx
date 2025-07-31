import React, { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
  // --- Ajout du state avatar ---
  const [avatar, setAvatar] = useState<string>("");

  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const re = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
    return re.test(email.toLowerCase());
  };

  // --- Optionnel : validation simple de l'URL avatar ---
  const validateAvatarUrl = (url: string): boolean => {
    if (!url) return true; // avatar facultatif, ok si vide
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Merci de remplir tous les champs.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Merci d'entrer une adresse email valide.");
      return;
    }

    if (!validateAvatarUrl(avatar)) {
      setError("Merci d'entrer une URL d'avatar valide.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // --- Ajout de avatar dans le body ---
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, username, password, avatar }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("Cette adresse email est déjà utilisée.");
        } else if (data.errors) {
          const errorMessage = data.errors.map((err: any) => err.message).join(", ");
          throw new Error(errorMessage);
        } else {
          throw new Error(data.error || "Erreur serveur, veuillez réessayer plus tard.");
        }
      }

      setSuccess("Inscription réussie ! Vous allez être redirigé vers la page de connexion.");
      setTimeout(() => {
        // 🎯 MODIFICATION 1 : Navigation vers / au lieu de /login
        navigate("/");
      }, 2000);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Une erreur inconnue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Style commun pour tous les champs input
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px",
    marginTop: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box"
  };

  return (
    <div style={{ 
      maxWidth: 400, 
      margin: "auto", 
      marginTop: 100,
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Inscription</h2>
      
      <form onSubmit={handleSubmit} noValidate>
        
        {/* Email input */}
        <div style={{ marginBottom: 15 }}>
          <label htmlFor="email">Email :</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
            required
            style={inputStyle}
          />
        </div>

        {/* Username input */}
        <div style={{ marginBottom: 15 }}>
          <label htmlFor="username">Nom d'utilisateur :</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={loading}
            required
            style={inputStyle}
          />
        </div>

        {/* Password input */}
        <div style={{ marginBottom: 15 }}>
          <label htmlFor="password">Mot de passe :</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
            required
            style={inputStyle}
          />
        </div>

        {/* Confirm Password input */}
        <div style={{ marginBottom: 15 }}>
          <label htmlFor="confirmPassword">Confirmer le mot de passe :</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
            style={inputStyle}
          />
        </div>

        {/* Champ avatar ajouté */}
        <div style={{ marginBottom: 20 }}>
          <label htmlFor="avatar">Avatar (URL) :</label>
          <input
            id="avatar"
            type="url"
            value={avatar}
            onChange={e => setAvatar(e.target.value)}
            disabled={loading}
            placeholder="https://exemple.com/monavatar.png"
            style={inputStyle}
          />
        </div>

        {/* Messages d'erreur et de succès */}
        {error && <p style={{ color: "red", marginBottom: 15, textAlign: "center" }}>{error}</p>}
        {success && <p style={{ color: "green", marginBottom: 15, textAlign: "center" }}>{success}</p>}

        {/* 🎯 Bouton S'inscrire parfaitement aligné */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "500",
            marginBottom: 20,
            boxSizing: "border-box"
          }}
        >
          {loading ? "Inscription en cours..." : "S'inscrire"}
        </button>
      </form>
      
      <div style={{ textAlign: "center" }}>
        {/* 🎯 Navigation React Router au lieu de <a href> */}
        <p style={{ margin: 0 }}>
          Déjà un compte ?{" "}
          <span 
            onClick={() => navigate("/")}
            style={{ 
              color: "#007bff", 
              cursor: "pointer", 
              textDecoration: "underline" 
            }}
          >
            Se connecter
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;