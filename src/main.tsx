import { createRoot } from 'react-dom/client';
import { Header } from './Component/Header';
import { BrowserRouter } from 'react-router-dom';
import { GenresProvider } from './Utils/hooks/useGenres';
import { App } from './App';

import './index.css';


createRoot(document.getElementById('root')!).render(
  <GenresProvider>
    <BrowserRouter>
      <Header />
      <App />
    </BrowserRouter>
  </GenresProvider>
);
