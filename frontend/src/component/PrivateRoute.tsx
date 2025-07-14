import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface PrivateRouteProps {
  element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();

  // Si le statut de l'authentification est en cours de vérification
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div>Chargement...</div>
        <div style={{ marginTop: '10px' }}>⏳</div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas authentifié, redirection vers login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si l'utilisateur est authentifié, rendre le composant
  return <>{element}</>;
};

export default PrivateRoute;