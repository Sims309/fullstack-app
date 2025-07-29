// src/pages/HomeLogin.tsx

import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../../styles/index.css"; // Ton fichier CSS global

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

  // Reset erreur à chaque changement de champ
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
      // ✅ Utilisation de l’URL relative pour profiter du proxy Vite
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ Pour gérer cookies/session
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
      console.log("✅ Connexion réussie :", data.message);

      // Redirection vers l'accueil après login
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
    <div className="login-page">
      <div className="login-box">
        <h2>Connexion</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email :</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe :</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        <p className="register-link">
          Pas encore de compte ? <a href="/register">S'inscrire</a>
        </p>
      </div>
    </div>
  );
};

export default HomeLogin;
