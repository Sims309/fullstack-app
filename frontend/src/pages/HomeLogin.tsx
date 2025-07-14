import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface LoginResponse {
  message: string;
  user?: any;
}

const HomeLogin: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (error) setError("");
  }, [email, password]);

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Merci de remplir tous les champs.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Merci d'entrer une adresse email valide.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // URL corrigée pour votre backend local
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Important pour les cookies
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Email ou mot de passe incorrect.");
        } else {
          throw new Error("Erreur serveur, veuillez réessayer plus tard.");
        }
      }

      const data: LoginResponse = await response.json();

      // Le token est maintenant dans les cookies HTTP-only
      console.log("Connexion réussie:", data.message);
      
      // Redirection vers la page accueil
      navigate("/accueil");
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
      <h2>Connexion</h2>
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
            aria-invalid={!!error}
            aria-describedby="email-error"
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
            autoComplete="current-password"
            disabled={loading}
            aria-invalid={!!error}
            aria-describedby="password-error"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        {error && (
          <p
            id="form-error"
            style={{ color: "red", marginTop: 10 }}
            role="alert"
            aria-live="assertive"
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          style={{ 
            marginTop: 15, 
            width: "100%", 
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Connexion en cours..." : "Se connecter"}
        </button>
      </form>
      
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <p>Pas encore de compte ? <a href="/register">S'inscrire</a></p>
      </div>
    </div>
  );
};

export default HomeLogin;