import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GenresProvider } from './Component/GenresContext';
import './index.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GenresProvider>
      <App />
    </GenresProvider>
  </StrictMode>
);
