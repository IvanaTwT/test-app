import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "./recetas/logo.png";
import { useAuth } from "./contexts/AuthContext";
import User from "./recetas/User";

export default function Navbar() {
    const { isAuthenticated } = useAuth("state");
    const { user__id } = useAuth("state");
    const { logout } = useAuth("actions");
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();

    const toggleNavbar = () => {
        setIsActive(!isActive);
    };

    const handleLogout = () => {
        logout();
        setIsActive(false);
        navigate("/");
    };

    const closeNavbar = () => {
        setIsActive(false);
    };

    return (
        <header>
            <nav
                className="navbar is-fixed-top has-shadow"
                role="navigation"
                aria-label="main navigation"
                style={{background:"#d66d75", 
                background: "-webkit-linear-gradient(to right, #d66d75, #e29587)",
                background: "linear-gradient(to right, #d66d75, #e29587)"}}
            >
                <div className="navbar-brand">
                    <a className="navbar-item" href="/">
                        <img src={logo} alt="Recipe" />
                    </a>
                    <div
                        role="button"
                        className={`navbar-burger burger ${isActive ? "is-active" : ""}`}
                        aria-label="menu"
                        aria-expanded="false"
                        data-target="navbarBasicExample"
                        onClick={toggleNavbar}
                    >
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </div>
                </div>

                <div id="navbarBasicExample" className={`navbar-menu ${isActive ? "is-active" : ""}`}>
                    <div className="navbar-start">
                        <NavLink to="/" className="navbar-item" onClick={closeNavbar}>
                            Home
                        </NavLink>

                        <NavLink to="/recetas" className="navbar-item" onClick={closeNavbar}>
                            Recetas
                        </NavLink>

                        <NavLink to="/contact" className=" navbar-item" onClick={closeNavbar}>
                            Contacto
                        </NavLink>
                    </div>

                    <div className="navbar-end">
                        {isAuthenticated ? (
                            <div className="navbar-item has-text-white">
                                HOLA
                                <span>&nbsp;</span>
                                <User id={user__id} showFullName={false}/>!
                            </div>
                        ) : (
                            <div className="navbar-item">
                                <NavLink to="/login" className="has-text-white" onClick={closeNavbar}>
                                    CONÉCTATE
                                </NavLink>
                            </div>
                        )}

                        <div className="navbar-item has-dropdown is-hoverable">
                            <div className="navbar-link">
                                <button
                                    className="button is-primary is-rounded"
                                    style={{ padding: "0px" }}
                                >
                                    <ion-icon
                                        name="person-circle-outline"
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            color: "white",
                                        }}
                                    ></ion-icon>
                                </button>
                            </div>

                            <div className="navbar-dropdown is-right">
                            {isAuthenticated ? (
                                <div className="navbar-item">
                                    <NavLink className="navbar-link " to={`../profile/${user__id}`} relative="path" onClick={closeNavbar}>
                                        Mi Perfil
                                    </NavLink>
                                </div>
                            ) : null}       
                                <div className="navbar-item">
                                    <NavLink className="navbar-link " to="../recetas/mis-recetas" onClick={closeNavbar}>
                                        Mis recetas
                                    </NavLink>
                                </div>
                                <div className="navbar-item">
                                    <NavLink className="navbar-link" to={`../recetas/new`} relative="path" onClick={closeNavbar}>
                                        Subir una receta
                                    </NavLink>
                                </div>
                                <hr className="navbar-divider" />
                                {!isAuthenticated ? (
                                    <NavLink className="navbar-item" to="/login" onClick={closeNavbar}>
                                        <button className="button custom">
                                            Iniciar sesión
                                        </button>
                                    </NavLink>
                                ) : (
                                    <Link to="#" className="navbar-item" onClick={handleLogout}>
                                        Cerrar sesión
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}
