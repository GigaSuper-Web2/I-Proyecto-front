import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

const LoginUsuario = () => {
  
    const [correo, setCorreo] = useState('');
    const [pass, setPassword] = useState('');
    const navigate = useNavigate();
  
    const verificar = async (e: React.FormEvent) => {
        e.preventDefault();

        try{
            const url = `http://localhost:5000/loginUsuario/${correo}/${pass}`;
            const verifyResponse = await axios.get(url);

            // Manejar la respuesta de la verificación
            if (verifyResponse.status === 200) {
                alert('Bienvenido.');
                //navigate pa la compra o algo
                
                navigate('/ContenidoTienda');

                //trying navigate (spoiler, it works)
                //navigate('/RegistroTienda', {state: {enviarDato: 'Soy Kevin'}});


            }
        }catch{

        }
    }

    return (
    <div>
        <form onSubmit={verificar} >
            <div>
                <input required type="email" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} />
            </div>
            <div>
                <input required type="password" placeholder="Contraseña" value={pass} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className='saludo'>hola</div>
        
            <button type="submit">Iniciar Sesion</button>
        
        </form>
    </div>
  )
}

export default LoginUsuario