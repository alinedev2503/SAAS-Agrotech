import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { OfflineProvider } from './contexts/OfflineContext';
import { AuthProvider } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TenantProvider>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <LanguageProvider>
            <OfflineProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </OfflineProvider>
          </LanguageProvider>
        </ThemeProvider>
      </TenantProvider>
    </BrowserRouter>
  </StrictMode>,
);
