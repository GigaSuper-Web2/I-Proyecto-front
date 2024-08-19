import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginUsuario = () => {
  const [correo, setCorreo] = useState("");
  const [pass, setPassword] = useState("");
  const navigate = useNavigate();

  const verificar = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = `http://10.90.31.123:5015/loginUsuario/${correo}/${pass}`;
      const verifyResponse = await axios.get(url);

      if (verifyResponse.status === 200) {
        const token = verifyResponse.data.token;

        // Navegar a ContenidoTienda pasando el token
        navigate("/ContenidoTienda", { state: { token } });
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Iniciar Sesión</h2>
        <form onSubmit={verificar}>
          <div className="form-group">
            <input
              required
              type="email"
              placeholder="Correo"
              className="form-control"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              style={{ marginBottom: "15px" }}
            />
          </div>
          <div className="form-group">
            <input
              required
              type="password"
              placeholder="Contraseña"
              className="form-control"
              value={pass}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginBottom: "15px" }}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginUsuario;
