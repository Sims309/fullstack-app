import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/index.css';

import App from './App';
import { UserProvider } from './context/UserContext'; // 🆕 import du Provider

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider> {/* 🧩 Ajout ici */}
      <App />
    </UserProvider>
  </StrictMode>
);
