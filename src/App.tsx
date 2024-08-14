import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarTienda = async () => {
      try {
        const response = await axios.get('http://localhost:5000/obtenerEmpresa');
        
        if (response.data.status_code === 200) {
          navigate('/PaginaInicio');
        } else {            // si hay una tienda existente en la base de datos o no, redirige a donde debe
          navigate('/RegistroTienda');
        }
      } catch (error) {
        console.error('Error al verificar la tienda:', error);
        navigate('/RegistroTienda');
      } finally {
        setLoading(false);
      }
    };

    verificarTienda();
  }, [navigate]);

  return (
    <div className="App">
      <header className="App-header">
        {loading ? <p>Verificando...</p> : null}
      </header>
    </div>
  );
}

export default App;
