import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext"; // ✅ Import du contexte manquant

import Accueil from "./pages/Accueil";
import PosteList from "./component/PosteList";
import JoueurDetail from "./component/JoueurDetail";
import HomeLogin from "./pages/HomeLogin";       // Page de connexion
import RegisterPage from "./pages/RegisterPage"; // Page inscription
import NotFound from "./pages/NotFound";
import TestMe from "./component/TestMe";
import PrivateRoute from "./component/PrivateRoute";

function App() {
  return (
    // ✅ Wrapping avec UserProvider pour le contexte global
    <UserProvider>
      <Router>
        <Routes>
          {/* Pages publiques - accessibles sans authentification */}
          <Route path="/" element={<HomeLogin />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Routes protégées - nécessitent une authentification */}
          <Route path="/accueil" element={<PrivateRoute element={<Accueil />} />} />
          
          {/* 🎯 Route dynamique pour les postes (numéros 1-12) */}
          <Route path="/numero/:posteId" element={<PrivateRoute element={<PosteList />} />} />
          
          {/* Route dynamique pour les détails des joueurs */}
          <Route path="/joueur/:id" element={<PrivateRoute element={<JoueurDetail />} />} />
          
          {/* Route de test (développement) */}
          <Route path="/test" element={<PrivateRoute element={<TestMe />} />} />
          
          {/* Redirections pour compatibilité */}
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          
          {/* 🎯 Redirections spécifiques pour les numéros invalides */}
          <Route path="/numero" element={<Navigate to="/accueil" replace />} />
          
          {/* Page 404 - doit être en dernier */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;