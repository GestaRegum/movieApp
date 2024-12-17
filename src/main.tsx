import { createRoot } from 'react-dom/client';
import { Header } from './Component/Header';
import { BrowserRouter } from 'react-router-dom';
import { GenresProvider } from './Component/Context';

import { App } from './App';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <GenresProvider>
      <Header />
      <App />
    </GenresProvider>
  </BrowserRouter>
);
