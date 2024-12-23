import { createRoot } from 'react-dom/client';
import { Header } from './Component/Header';
import { BrowserRouter } from 'react-router-dom';

import { App } from './App';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Header />
    <App />
  </BrowserRouter>
);
