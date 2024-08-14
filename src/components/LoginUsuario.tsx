import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginUsuario = () => {
    const [correo, setCorreo] = useState('');
    const [pass, setPassword] = useState('');
    const navigate = useNavigate();

    const verificar = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = `http://localhost:5000/loginUsuario/${correo}/${pass}`;
            const verifyResponse = await axios.get(url);

            if (verifyResponse.status === 200) {
                const token = verifyResponse.data.token; // Suponiendo que el token se devuelve como 'token'

                // Guardar el token en el localStorage
                localStorage.setItem('userToken', token);

                // Navegar a ContenidoTienda pasando el token
                navigate('/ContenidoTienda', { state: { token } });
            }
        } catch (err) {
            console.error('Error al iniciar sesión:', err);
        }
    };

    return (
        <div>
            <form onSubmit={verificar}>
                <div>
                    <input
                        required
                        type="email"
                        placeholder="Correo"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        required
                        type="password"
                        placeholder="Contraseña"
                        value={pass}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Iniciar Sesion</button>
            </form>
        </div>
    );
};

export default LoginUsuario;
