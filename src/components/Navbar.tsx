import React from 'react';
import {Link} from 'react-router-dom';

const Navbar =  () => {
    return ( 
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="collapse navbar-collapse" id="nvbarNavAltMarkup">
                <ul className="navbar-nav m-auto">
                    <li className="nav-item">
                        <Link to="/" className="nav-link">Menu principal</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/listPokemon" className="nav-link">Pokémons</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/listTrainer" className="nav-link">Entrenadores Pokémon</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/getTeams" className="nav-link">Equipos Pokémon</Link>
                    </li> 
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;