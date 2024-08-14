import React from 'react'
import { useNavigate } from 'react-router-dom';

const PaginaInicio = () => {

    const navigate = useNavigate();

    const Redirigir = (opcion : number) => {
        switch(opcion){
        case 1: //opcion de registrar usuario
            navigate('/RegistroUsuario');
            break;
        case 2: //opcion de login usuario
            navigate('/LoginUsuario');
            break;
        case 3: //opcion de iniciar seison como empresa 
            //navigate('/logueoempresa xddddddd');
            break;

        }//cierra switchcase
    
    }//cierra funcion   
  return (
    <div>
        <div className='contenedor_paginaInicio'> 

        <h2>Registrarte como usuario</h2>
        <button onClick={() => Redirigir(1)}> Registrarse </button>
        <br />
        <br />
        <h2>Iniciar sesion</h2>
        <button onClick={() => Redirigir(2)}> Iniciar Sesion </button>
        <br />
        <br />
        <hr />
        <h2>Entrar como dueño de la empresa</h2>
        <button onClick={() => navigate('/LoginEmpresa')}> Soy el gfe</button>

        <br />
        <br />
        <br />
        <br />
        Gigasuper te ofrece la posibilidad de montar tu propio negocio ji ji ji ja y texto de relleno Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolore deleniti, fugiat, ex libero suscipit beatae perferendis quaerat exercitationem et ipsa sed! Eveniet ad numquam saepe atque, blanditiis est iste deserunt.

        </div>
    </div>
  )
}

export default PaginaInicio