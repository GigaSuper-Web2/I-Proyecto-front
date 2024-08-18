import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const EditarUsuario = () => {
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [email, setEmail] = useState('');
    const [passwd, setPasswd] = useState('');
    const [passwd2, setPasswd2] = useState('');
    const [lugarResidencia, setLugarResidencia] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    
    const token = location.state?.token 

    const cambios = async (e: React.FormEvent) => {
        e.preventDefault();

        // contraseñas
        if (passwd && passwd !== passwd2) {
            alert('Las contraseñas deben coincidir');
            return;
        }

        // solo los campos que se llenaron
        const userData: any = {};
        if (nombre) userData.nombre = nombre;
        if (apellidos) userData.apellidos = apellidos;
        if (email) userData.email = email;
        if (passwd) userData.passwd = passwd;
        if (lugarResidencia) userData.lugarResidencia = lugarResidencia;

        try {
            const response = await axios.put(`http://localhost:5000/editarUsuario/${token}`, userData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 200) {
                alert('se pudo xd');
                navigate('/ContenidoTienda'); 
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert('Hubo un error');
            } else {
                console.error(error);
            }
        }
    };

    return (
        <div>
            <h4>Edite su cuenta!</h4>
            <form onSubmit={cambios}>
                <div>
                    <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </div>
                <div>
                    <input type="text" placeholder="Apellidos" value={apellidos} onChange={(e) => setApellidos(e.target.value)} />
                </div>
                <div>
                    <input type="email" placeholder="Correo Electrónico" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <input type="password" placeholder="Contraseña" value={passwd} onChange={(e) => setPasswd(e.target.value)} />
                </div>
                <div>
                    <input type="password" placeholder="Confirmar contraseña" value={passwd2} onChange={(e) => setPasswd2(e.target.value)} />
                </div>
                <div>
                    <input type="text" placeholder="Lugar de Residencia" value={lugarResidencia} onChange={(e) => setLugarResidencia(e.target.value)} />
                </div>
                <button type="submit">Registrar</button>
            </form>
            <p>No es necesario que lo rellenes todo!</p>    
        </div>
    );
};

export default EditarUsuario;