import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom'; //prueba navigate

const RegistroTienda = () => {
    const [nombre, setNombre] = useState('');
    const [propietarioEmpresa, setPropietarioEmpresa] = useState('');
    const [cedEmpresa, setCedEmpresa] = useState('');
    const [categoria, setCategoria] = useState('');
    const [datoFirma, setDatoFirma] = useState<File | null>(null);
    const [correo, setCorreo] = useState('');
    const [pass, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState(''); // Estado para la confirmación de la contraseña
    const [logo, setLogo] = useState<File | null>(null);

    const location = useLocation(); //prueba navigate
    const mensajeNavigate = location.state?.enviarDato; // Acceder a los datos enviados

    const navigate = useNavigate();

    const leerArchivoComoTexto = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.onerror = () => reject(new Error('Error reading file'));
            reader.readAsText(file);
        });
    };

    const formlleno = async (e: React.FormEvent) => {
        e.preventDefault();

        if (pass !== confirmPass) { // Verificar que las contraseñas coincidan
            alert('Las contraseñas no coinciden.');
            return;
        }

        if (!logo) {
            alert('Please upload a logo.');
            return;
        }

        try {
            // Leer el archivo PEM como texto porque se recibe como json
            let signature: string | null = null;
            if (datoFirma) {
                signature = await leerArchivoComoTexto(datoFirma);
            }
            alert(signature);
            // Crear el objeto JSON con la cadena de texto del archivo PEM si existe
            const json = {
                idNumber: cedEmpresa,
                idType: categoria,
                signature: signature
            };
            alert(JSON.stringify(json));
            // Enviar el JSON para verificación si pemTexto existe
            const verifyResponse = await axios.post('http://localhost:5001/bank/validate-signature', json);

            // Manejar la respuesta de la verificación
            if (verifyResponse.status === 200) {
                alert('Signature is valid.');

                // Crear FormData para enviar todos los datos del formulario
                const formData = new FormData();
                formData.append('nombreEmpresa', nombre);
                formData.append('propietarioEmpresa', propietarioEmpresa);
                formData.append('cedulaEmpresa', cedEmpresa);
                formData.append('categoria', categoria);
                formData.append('email', correo);
                formData.append('passwd', pass);
                formData.append('logoTienda', logo);
                if (datoFirma) {
                    formData.append('datoFirmaDigital', datoFirma);
                }

                // Enviar FormData al servidor para registrar la tienda
                const registerResponse = await axios.post('http://localhost:5000/registrarTienda', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (registerResponse.status === 201) {
                    alert('Tienda registrada :)');
                    navigate('/App'); // Redirigir a otra página si es necesario
                } else {
                    alert('Error al registrar la tienda.');
                }
            } else {
                alert('La firma no es válida.');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                alert(`Error: ${error.response.data.message}, es posible que haya una tienda registrada. \nSolo se admite una tienda en la base de datos.`);
            } else {
                alert('An error occurred while verifying the signature.');
            }
        }
    };

    return (
        <div>
            Registro Tienda
            <div>
                <form onSubmit={formlleno}> 
                    <div>
                        <input required type="text" placeholder="Nombre Empresa" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    </div>
                    <div>
                        <input required type="text" placeholder="Propietario Empresa" value={propietarioEmpresa} onChange={(e) => setPropietarioEmpresa(e.target.value)} />
                    </div>
                    <div>
                        <input required type="text" placeholder="Cédula Empresa" value={cedEmpresa} onChange={(e) => setCedEmpresa(e.target.value)} />
                    </div>
                    <div>
                        <input required type="text" placeholder="Categoría" value={categoria} onChange={(e) => setCategoria(e.target.value)} />
                    </div>
                    <div>
                        <p>Firma digital</p>
                        <input required type="file" accept=".pem" placeholder="Firma Digital" onChange={(e) => setDatoFirma(e.target.files?.[0] || null)} />
                    </div>
                    <div>
                        <input required type="email" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} />
                    </div>
                    <div>
                        <input required type="password" placeholder="Contraseña" value={pass} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div>
                        <input required type="password" placeholder="Confirmar Contraseña" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
                    </div>
                    <div>
                        <p>Logo .svg</p>
                        <input type="file" accept=".svg" onChange={(e) => setLogo(e.target.files?.[0] || null)} //no siempre tienen logo xd 
                        /> 
                    </div>
                    <button type="submit">Registrar</button>
                </form>
            </div>
            
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <p className='saludo'>el navigate devolvio: {mensajeNavigate}</p>
        </div>
    );
};

export default RegistroTienda;
