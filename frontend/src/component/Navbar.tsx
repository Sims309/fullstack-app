// src/component/Navbar.tsx

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext, UserContextType } from '../contexts/UserContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  // Récupération du contexte utilisateur avec typage strict
  const { user, logout } = useContext<UserContextType>(UserContext);

  // Gestionnaire retour en arrière
  const handleBack = () => {
    navigate(-1);
  };

  // Gestionnaire déconnexion
  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="w-full flex items-center justify-between bg-gray-900 text-white px-6 py-3 shadow-md">
      <button
        onClick={handleBack}
        aria-label="Retour"
        className="text-lg hover:text-gray-300 transition"
      >
        ← Retour
      </button>

      <div className="flex items-center space-x-4">
        {user?.avatar && (
          <img
            src={user.avatar}
            alt={`${user.username} avatar`}
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
          />
        )}
        <span className="font-semibold text-lg">{user?.username || 'Utilisateur'}</span>
        <button
          onClick={handleLogout}
          aria-label="Déconnexion"
          className="ml-4 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
