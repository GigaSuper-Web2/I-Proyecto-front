import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';


const EditarTienda = () => {
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [propietarioEmpresa, setPropietarioEmpresa] = useState('');
  const [email, setEmail] = useState('');
  const [logoTienda, setLogoTienda] = useState<File | null>(null);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const Idtienda = location.state?.Idtienda


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoTienda(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('nombreEmpresa', nombreEmpresa);
    formData.append('propietarioEmpresa', propietarioEmpresa);
    formData.append('email', email);
    if (logoTienda) {
      formData.append('logoTienda', logoTienda);
    }

    try {
      const response = await axios.put(`http://localhost:5000/editarTienda/${Idtienda}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.status === 200) {
        setMensaje('Tienda actualizada correctamente');
        navigate('/AdminTienda');
      } else {
        setMensaje('Error al actualizar la tienda');
      }
    } catch (error) {
      console.error('Error al enviar los datos', error);
      setMensaje('Error al actualizar la tienda');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="text-center">Editar Tienda</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre de la Empresa</label>
            <input type="text" className="form-control"value={nombreEmpresa} onChange={(e) => setNombreEmpresa(e.target.value)} required/>
          </div>
          <div className="form-group">
            <label>Propietario de la Empresa</label>
            <input type="text" className="form-control"value={propietarioEmpresa} onChange={(e) => setPropietarioEmpresa(e.target.value)} required/>
          </div>
          <div className="form-group">
            <label>Email de la Empresa</label>
            <input type="email" className="form-control"value={email} onChange={(e) => setEmail(e.target.value)} required/>
          </div>
          <div className="form-group">
            <label>Logo de la Empresa</label>
            <input type="file" className="form-control"accept=".svg"onChange={handleFileChange} />
          </div>
          <button type="submit" className="btn btn-primary btn-block mt-3">Guardar Cambios</button>
        </form>
        {mensaje && <p className="text-center mt-3">{mensaje}</p>}
      </div>
    </div>
  );
}

export default EditarTienda;
