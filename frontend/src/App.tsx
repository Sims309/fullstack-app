import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";

import Accueil from "@/pages/Accueil";
import PosteList from "@/component/PosteList";
import JoueurDetail from "@/component/JoueurDetail";
import HomeLogin from "@/pages/HomeLogin";       // Page de connexion
import RegisterPage from "@/pages/RegisterPage"; // Page inscription
import NotFound from "@/pages/NotFound";
import TestMe from "@/component/TestMe";
import PrivateRoute from "@/component/PrivateRoute";

import PostePage from "@/pages/PostePage"; // Import du carrousel poste dynamique

// 🔥 Composant temporaire pour l'équipe idéale
const EquipeIdealePage = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Équipe Idéale</h1>
      <p>Page pour l'équipe idéale - Poste 12</p>
      <p>Cette page affichera l'équipe idéale composée des meilleurs joueurs.</p>
    </div>
  );
};

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Pages publiques - accessibles sans authentification */}
          <Route path="/" element={<HomeLogin />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Routes protégées - nécessitent authentification */}
          <Route path="/accueil" element={<PrivateRoute element={<Accueil />} />} />
          
          {/* Route dynamique avec carrousel des joueurs par poste (1-12) */}
          <Route path="/poste/:posteId" element={<PrivateRoute element={<PostePage />} />} />

          {/* Routes avec ancien format /numero/:posteId */}
          <Route path="/numero/:posteId" element={<PrivateRoute element={<PosteList />} />} />

          {/* Détail joueur */}
          <Route path="/joueur/:id" element={<PrivateRoute element={<JoueurDetail />} />} />

          {/* Test développement */}
          <Route path="/test" element={<PrivateRoute element={<TestMe />} />} />

          {/* Route spécifique pour l'équipe idéale (poste 12) */}
          <Route path="/poste/12" element={<PrivateRoute element={<EquipeIdealePage />} />} />
          <Route path="/numero/12" element={<PrivateRoute element={<EquipeIdealePage />} />} />

          {/* Redirections */}
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/numero" element={<Navigate to="/accueil" replace />} />

          {/* Page 404 - doit être en dernier */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
