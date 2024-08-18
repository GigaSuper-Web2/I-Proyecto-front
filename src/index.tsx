import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';
import App from './App';
import RegistroTienda from './components/RegistroTienda';
import RegistroUsuario from './components/RegistroUsuario';
import LoginUsuario from './components/LoginUsuario';
import Navbar from './components/Navbar';
import PruebaNav from './components/PruebaNav';
import ContenidoTienda from './components/ContenidoTienda';
import LoginEmpresa from './components/LoginEmpresa';
import BotonPaypal2 from './components/BotonPaypal2';
import PaginaInicio from './components/PaginaInicio';
import AdminTienda from './components/AdminTienda';
import EditarTienda from './components/EditarTienda';
import EditarUsuario from './components/EditarUsuario';
import PrimerProducto from './components/PrimerProducto';






const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <Navbar></Navbar>
    <Routes>
    <Route path="/" element={<App />} />
    <Route path='/RegistroTienda' element={<RegistroTienda />} />
    <Route path='/RegistroUsuario' element={<RegistroUsuario />} />
    <Route path='/LoginUsuario' element={<LoginUsuario />} />
    <Route path='/PruebaNav' element={<PruebaNav />} />
    <Route path='/ContenidoTienda' element={<ContenidoTienda />} />
    <Route path='/LoginEmpresa' element={<LoginEmpresa />} />
    <Route path='/BotonPaypal2' element={<BotonPaypal2 />} />
    <Route path='/PaginaInicio' element={<PaginaInicio />} />
    <Route path='/AdminTienda' element={<AdminTienda />} />
    <Route path='/EditarTienda' element={<EditarTienda />} />
    <Route path='/EditarUsuario' element={<EditarUsuario />} />
    <Route path='/PrimerProducto' element={<PrimerProducto />} />
    
    
    </Routes>
    
  </BrowserRouter>
);
