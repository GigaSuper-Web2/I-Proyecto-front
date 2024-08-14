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
        } else if (passwd !== passwd2){ 
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
                    alert('Si');
                    navigate('/ContenidoTienda');
                }
            } catch (error) {
                console.error(error);
                alert('Error');
            }
        };
            
    }
        

    return (
        <div>
            Registro Usuario
            <div>
                <form onSubmit={formlleno}>
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
                    <input type="password" placeholder="Repita la contraseña" value={passwd2} onChange={(e) => setPasswd2(e.target.value)} />
                    </div>
                    <div>
                    <input type="text" placeholder="Lugar de Residencia" value={lugarResidencia} onChange={(e) => setLugarResidencia(e.target.value)} />
                    </div>
                    <button type="submit">Registrar</button>
                </form>
            </div>
        </div>
    );
};

export default RegistroUsuario;
