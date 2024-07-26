import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';
import App from './App';
import Tiendas from './components/IndexTiendas';
import RegistroTienda from './components/RegistroTienda';
import RegistroUsuario from './components/RegistroUsuario';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
    <Route path="/" element={<App />} />
    <Route path='/IndexTiendas' element={<Tiendas />} />
    <Route path='/RegistroTienda' element={<RegistroTienda />} />
    <Route path='/RegistroUsuario' element={<RegistroUsuario />} />
    </Routes>
    
  </BrowserRouter>
);
