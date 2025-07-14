import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Accueil from "./pages/Accueil";
import PosteList from "./component/PosteList";
import JoueurDetail from "./component/JoueurDetail";
import HomeLogin from "./pages/HomeLogin";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import TestMe from "./component/TestMe";
import PrivateRoute from "./component/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Page de connexion */}
        <Route path="/" element={<HomeLogin />} />
        
        {/* Page d'inscription */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Page d'accueil après connexion - protégée */}
        <Route path="/accueil" element={<PrivateRoute element={<Accueil />} />} />

        {/* Liste des joueurs par poste - protégée */}
        <Route path="/numero/:posteId" element={<PrivateRoute element={<PosteList />} />} />

        {/* Détail d'un joueur - protégée */}
        <Route path="/joueur/:id" element={<PrivateRoute element={<JoueurDetail />} />} />

        {/* Route test utilisateur connecté - protégée */}
        <Route path="/test" element={<PrivateRoute element={<TestMe />} />} />

        {/* Redirection */}
        <Route path="/home" element={<Navigate to="/" />} />

        {/* Page 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;