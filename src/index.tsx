import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';
import App from './App';
import Tiendas from './components/IndexTiendas';
import RegistroTienda from './components/RegistroTienda';
import RegistroUsuario from './components/RegistroUsuario';
import LoginUsuario from './components/LoginUsuario';
import Navbar from './components/Navbar';
import PruebaNav from './components/PruebaNav';
import ContenidoTienda from './components/ContenidoTienda';
import LoginEmpresa from './components/LoginEmpresa';
import BotonPaypal2 from './components/BotonPaypal2';




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
    <Route path='/LoginUsuario' element={<LoginUsuario />} />
    <Route path='/PruebaNav' element={<PruebaNav />} />
    <Route path='/ContenidoTienda' element={<ContenidoTienda />} />
    <Route path='/LoginEmpresa' element={<LoginEmpresa />} />
    <Route path='/BotonPaypal2' element={<BotonPaypal2 />} />
    
    
    </Routes>
    
  </BrowserRouter>
);
