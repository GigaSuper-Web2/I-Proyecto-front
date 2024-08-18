import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegistroUsuario = () => {
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [email, setEmail] = useState('');
    const [passwd, setPasswd] = useState('');
    const [passwd2, setPasswd2] = useState('');
    const [lugarResidencia, setLugarResidencia] = useState('');

    const navigate = useNavigate();

    const formlleno = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwd.trim() === "" || passwd2.trim() === "") {
            alert("Las contraseñas no pueden estar vacías.");
        } else if (passwd !== passwd2) {
            alert("Las contraseñas no coinciden.");
        } else {
            const userData = {
                nombre,
                apellidos,
                email,
                passwd,
                lugarResidencia
            };

            try {
                const response = await axios.post('http://localhost:5000/registrarUsuario', userData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log(response.data);
                if (response.data.status_code === 201) {
                    alert('Registro Exitoso!');
                    navigate('/PaginaInicio');
                }
            } catch (error) {
                console.error(error);
                alert('Error');
            }
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="card p-4" style={{ maxWidth: '500px', width: '100%' }}>
                <h2 className="text-center mb-4">Registro de Usuario</h2>
                <form onSubmit={formlleno}>
                    <div className="form-group">
                        <label style={{ marginLeft: '5px' }}>Nombre</label>
                        <input
                            required
                            type="text"
                            placeholder="Nombre"
                            className="form-control"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            style={{ marginBottom: '15px' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ marginLeft: '5px' }}>Apellidos</label>
                        <input
                            required
                            type="text"
                            placeholder="Apellidos"
                            className="form-control"
                            value={apellidos}
                            onChange={(e) => setApellidos(e.target.value)}
                            style={{ marginBottom: '15px' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ marginLeft: '5px' }}>Correo Electrónico</label>
                        <input
                            required
                            type="email"
                            placeholder="Correo Electrónico"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ marginBottom: '15px' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ marginLeft: '5px' }}>Contraseña</label>
                        <input
                            required
                            type="password"
                            placeholder="Contraseña"
                            className="form-control"
                            value={passwd}
                            onChange={(e) => setPasswd(e.target.value)}
                            style={{ marginBottom: '15px' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ marginLeft: '5px' }}>Repita la Contraseña</label>
                        <input
                            required
                            type="password"
                            placeholder="Repita la Contraseña"
                            className="form-control"
                            value={passwd2}
                            onChange={(e) => setPasswd2(e.target.value)}
                            style={{ marginBottom: '15px' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ marginLeft: '5px' }}>Lugar de Residencia</label>
                        <input
                            required
                            type="text"
                            placeholder="Lugar de Residencia"
                            className="form-control"
                            value={lugarResidencia}
                            onChange={(e) => setLugarResidencia(e.target.value)}
                            
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block mt-3">Registrar</button>
                </form>
            </div>
        </div>
    );
};

export default RegistroUsuario;
