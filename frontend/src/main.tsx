import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/index.css';

import App from './App';
import { UserProvider } from './contexts/UserContext';
import { EquipeIdealProvider } from './contexts/EquipeIdealContext'; // ✅ ajout ciblé

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <EquipeIdealProvider> {/* ✅ Ajout chirurgical ici */}
        <App />
      </EquipeIdealProvider>
    </UserProvider>
  </StrictMode>
);
