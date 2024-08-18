import React from 'react';
import {Link} from 'react-router-dom';

const Navbar =  () => {
    return ( 
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="collapse navbar-collapse" id="nvbarNavAltMarkup">
                <ul className="navbar-nav m-auto">
                    <li className="nav-item">
                        <Link to="/" className="nav-link">Volver a Inicio</Link>
                    </li>
                    
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;