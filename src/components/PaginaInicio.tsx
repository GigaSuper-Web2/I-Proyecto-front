import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const PaginaInicio = () => {
  const navigate = useNavigate();

  const Redirigir = (opcion: number) => {
    switch (opcion) {
      case 1: // opción de registrar usuario
        navigate("/RegistroUsuario");
        break;
      case 2: // opción de login usuario
        navigate("/LoginUsuario");
        break;
      case 3: // opción de iniciar sesión como empresa
        navigate("/LoginEmpresa");
        break;
    }
  };

  return (
    <div className="container text-center mt-5">
      <h2 className="mb-4">Registrarte como usuario</h2>
      <button className="btn btn-primary mb-4" onClick={() => Redirigir(1)}>
        Registrarse
      </button>
      <h2 className="mb-4">Iniciar sesión</h2>
      <button className="btn btn-primary mb-4" onClick={() => Redirigir(2)}>
        Iniciar Sesión
      </button>
      <hr className="my-4" />
      <h2 className="mb-4">Entrar como dueño de la empresa</h2>
      <button className="btn btn-primary mb-4" onClick={() => Redirigir(3)}>
        Iniciar Sesión
      </button>
      <p className="mt-4">
        Gigasuper te ofrece la posibilidad de montar tu propio negocio ji ji ji
        ja y texto de relleno Lorem ipsum, dolor sit amet consectetur
        adipisicing elit. Dolore deleniti, fugiat, ex libero suscipit beatae
        perferendis quaerat exercitationem et ipsa sed! Eveniet ad numquam saepe
        atque, blanditiis est iste deserunt.
      </p>
    </div>
  );
};

export default PaginaInicio;
