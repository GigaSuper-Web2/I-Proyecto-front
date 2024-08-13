import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginEmpresa: React.FC = () => {
  const [email, setEmail] = useState('');
  const [passwd, setPasswd] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  var token_a_enviar = '';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Realizar la solicitud GET al endpoint de login de la empresa
      const response = await axios.get(`http://localhost:5000/loginEmpresa/${email}/${passwd}`);
      setMessage(`Login exitoso. Token: ${response.data.token}`);


        // intentando enviar el token a /ContenidoTienda
      token_a_enviar = response.data.token;
      
      setError('');
      //navigate('/ContenidoTienda', {state: {datoAEnviar:token_a_enviar}})

    } catch (err) {
      const error = err as AxiosError;

      if (error.response) {
        // Verificar el código de estado para determinar el tipo de error
        const statusCode = error.response.status;
        if (statusCode === 401) {
          setMessage('');
          setError('Error: Contraseña incorrecta.');
        } else if (statusCode === 404) {
          setMessage('');
          setError('Error: Correo electrónico no encontrado.');
        } else {
          // Manejo general para errores con datos disponibles
          const errorMessage = error.response.data as any;
          setMessage('');
          setError(`Error: ${errorMessage?.status_message || 'Error desconocido'}`);
        }
      } else if (error.request) {
        // La solicitud se hizo pero no se recibió respuesta
        setMessage('');
        setError('Error: No se recibió respuesta del servidor.');
      } else {
        // Algo sucedió al configurar la solicitud
        setMessage('');
        setError('Error: Problema al configurar la solicitud.');
      }
    }
  };

  return (
    <div>
      <h2>Login Empresa</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}required/>
        </div>
        <div>
          <label htmlFor="passwd">Contraseña:</label>
          <input type="password" id="passwd" value={passwd} onChange={(e) => setPasswd(e.target.value)}required/>
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
        <br />
        cuando la sesion sea exitosa, estos datos de abajo se pueden enviar por un navigate xd


      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <br />
      <br />
      <br />
      <br />
      
        <p>(Temporal, el index de la pagina es un registrar empresa, si ya hay una registrada, el lleva a la pagina de inicio donde se muestran los productos, si no hay ninguna empresa en la base de datos, el index será registrar una empresa )</p>
      <h3>No tienes creada la empresa aun?</h3>
      <button onClick={() => navigate('/RegistroTienda')}>Registrar empresa</button>
    </div>
  );
};

export default LoginEmpresa;
