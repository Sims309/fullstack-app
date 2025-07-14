import React, { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
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
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, username, password }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("Cette adresse email est déjà utilisée.");
        } else {
          throw new Error("Erreur serveur, veuillez réessayer plus tard.");
        }
      }

      const data = await response.json();
      setSuccess("Inscription réussie ! Vous allez être redirigé vers la page de connexion.");
      
      // Redirection vers la page de connexion après 2 secondes
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue est survenue.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", marginTop: 100 }}>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="email">Email :</label><br />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
            disabled={loading}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        
        <div style={{ marginTop: 10 }}>
          <label htmlFor="username">Nom d'utilisateur :</label><br />
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            disabled={loading}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        
        <div style={{ marginTop: 10 }}>
          <label htmlFor="password">Mot de passe :</label><br />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            disabled={loading}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        
        <div style={{ marginTop: 10 }}>
          <label htmlFor="confirmPassword">Confirmer le mot de passe :</label><br />
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            disabled={loading}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        
        {error && (
          <p style={{ color: "red", marginTop: 10 }} role="alert">
            {error}
          </p>
        )}
        
        {success && (
          <p style={{ color: "green", marginTop: 10 }} role="alert">
            {success}
          </p>
        )}
        
        <button
          type="submit"
          style={{ 
            marginTop: 15, 
            width: "100%", 
            padding: "10px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
          disabled={loading}
        >
          {loading ? "Inscription en cours..." : "S'inscrire"}
        </button>
      </form>
      
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <p>Déjà un compte ? <a href="/">Se connecter</a></p>
      </div>
    </div>
  );
};

export default RegisterPage;