import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const LoginEmpresa: React.FC = () => {
  const [email, setEmail] = useState("");
  const [passwd, setPasswd] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Realizar la solicitud GET al endpoint de login de la empresa
      const response = await axios.get(
        `http://10.90.31.123:5015/loginEmpresa/${email}/${passwd}`
      );
      const token = response.data.token;
      setMessage("Login exitoso.");

      setError("");

      // Navegar a AdminTienda enviando el token
      navigate("/AdminTienda", { state: { token } });
    } catch (err) {
      const error = err as AxiosError;

      if (error.response) {
        const statusCode = error.response.status;
        if (statusCode === 401) {
          setMessage("");
          setError("Error: Contraseña incorrecta.");
        } else if (statusCode === 404) {
          setMessage("");
          setError("Error: Correo electrónico no encontrado.");
        } else {
          const errorMessage = error.response.data as any;
          setMessage("");
          setError(
            `Error: ${errorMessage?.status_message || "Error desconocido"}`
          );
        }
      } else if (error.request) {
        setMessage("");
        setError("Error: No se recibió respuesta del servidor.");
      } else {
        setMessage("");
        setError("Error: Problema al configurar la solicitud.");
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Login Empresa</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="passwd">Contraseña:</label>
            <input
              type="password"
              id="passwd"
              className="form-control"
              value={passwd}
              onChange={(e) => setPasswd(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Iniciar Sesión
          </button>
        </form>
        <br />
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <br />
      </div>
    </div>
  );
};

export default LoginEmpresa;
