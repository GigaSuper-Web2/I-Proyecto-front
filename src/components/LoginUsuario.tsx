import React from 'react'
import { useState } from 'react';
import axios from 'axios';

const LoginUsuario = () => {
  
    const [correo, setCorreo] = useState('');
    const [pass, setPassword] = useState('');
  
    const verificar = async (e: React.FormEvent) => {
        e.preventDefault();

        try{
            const url = `http://localhost:5001/${correo}/${pass}`;
            const verifyResponse = await axios.get(url);

            // Manejar la respuesta de la verificación
            if (verifyResponse.status === 200) {
                alert('Bienvenido.');
                //navigate pa la compra o algo

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
        </form>
    </div>
  )
}

export default LoginUsuario