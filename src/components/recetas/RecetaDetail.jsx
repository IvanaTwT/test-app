import useFetch from "../hooks/useFetch";
import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { formatDate } from "../hooks/utils";
import { useAuth } from "../contexts/AuthContext";
import RecetaIngrediente from "./RecetaIngrediente";
import RecetaComentario from "./RecetaComentario";
import RecetaCategoria from "./RecetaCategoria";
import RecetaLocacion from "./RecetaLocacion";
import ComentarioForm from "./ComentarioForm";
import RecetaPasos from "./RecetaPasos";
import User from "./User";
import defaultImage from "./logo.png";
import DeleteRecetaModal from "./DeleteRecetaModal";

export default function RecetaDetail() {
    const { user__id } = useAuth("state");
    console.log("USUARIO: ", user__id);

    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isAuthenticated, token } = useAuth("state");
    const [{ data, isError, isLoading }, doFetch] = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}/reciperover/recipes/${id}`,
        {}
    );

    useEffect(() => {
        if(id){
            doFetch();
        }
    }, [id]);

    if (isLoading) return <p>Cargando...</p>;
    if (isError) return <p>Error al cargar las recetas.</p>;
    if (!data) return <p>No hay recetas disponibles</p>;

    const receta = data;
    return (
        <section className="section">
            <div className="container">
                <div className="card">
                    <div className=" is-flex is-justify-content-flex-end is-align-items-flex-end">
                        {isAuthenticated && receta.owner == user__id ? (
                            <div className="buttons-container is-flex is-justify-content-start is-align-items-center">
                                <NavLink to={`../edit/${id}`} relative="path">
                                    <button className="button is-info">
                                        <ion-icon name="create-outline"></ion-icon>
                                    </button>
                                </NavLink>

                                <div
                                    className="column"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    <button className="button is-danger">
                                        <ion-icon name="trash-outline"></ion-icon>
                                    </button>
                                </div>
                            </div>
                        ) : null}
                        {isModalOpen ? (
                            <DeleteRecetaModal
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                receta_id={id}
                                onDelete={{ data, isLoading, isError, doFetch }}
                            />
                        ) : null}
                    </div>
                    <div className="columns m-1">
                        {/* imagen */}
                        <div className="column">
                            <div className="media-left">
                                <figure className="image is-square">
                                    <img
                                        src={
                                            receta.image
                                                ? receta.image
                                                : defaultImage
                                        }
                                        alt={receta.title}
                                    />
                                </figure>
                            </div>
                        </div>
                        {/* info imagen */}
                        <div className="column">
                            <div className="media-content">
                                <div className="card-content">
                                    <h2 className="title is-3">
                                        {receta.title}
                                    </h2>

                                    <hr className="hr" />
                                    <div className="is-flex is-align-items-center">
                                        <p className="mr-6">
                                            <ion-icon name="people"></ion-icon>
                                            Vistas: {receta.view_count}
                                        </p>
                                        <p className="mr-6">
                                            <ion-icon name="restaurant"></ion-icon>
                                            Preparación:{" "}
                                            {receta.preparation_time} mins
                                        </p>
                                        <p className="mr-6">
                                            <ion-icon name="time"></ion-icon>
                                            Cocción: {receta.cooking_time} mins
                                        </p>
                                    </div>
                                    <hr className="hr" />
                                    <div className="content">
                                        {receta.description}
                                    </div>

                                    <p>
                                        <strong>Locaciones:</strong>{" "}
                                        <RecetaLocacion />
                                    </p>
                                    <p>
                                        <strong>Categorías:</strong>{" "}
                                        <RecetaCategoria />
                                    </p>
                                    <p>
                                        <strong>
                                            {" "}
                                            Porciones: {receta.servings}
                                        </strong>
                                    </p>
                                </div>

                                <footer className="card-footer mt-auto">
                                    <div className="card-footer-item has-text-centered is-flex is-justify-content-center">
                                        <p>
                                            <strong>Autor: </strong>
                                            <NavLink
                                                to={`../../profile/${receta.owner}`}
                                                relative="path"
                                            >
                                                <User id={receta.owner} />
                                            </NavLink>
                                        </p>
                                    </div>
                                    <div className="card-footer-item">
                                        <p>
                                            <strong>Publicada:</strong>{" "}
                                            {formatDate(receta.created_at)}
                                        </p>
                                    </div>
                                    <div className="card-footer-item">
                                        <p>
                                            <strong>Actualizada:</strong>{" "}
                                            {formatDate(receta.updated_at)}
                                        </p>
                                    </div>
                                </footer>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card ">
                    <div className="card-content">
                        <div className="columns is-multiline">
                            <RecetaIngrediente />
                            <RecetaPasos receta={receta} />
                        </div>
                    </div>
                </div>

                <div className="container">
                    <h3 className="title is-5">Califica esta receta</h3>
                    <div className="card-content">
                        <ComentarioForm recetaId={receta.id} />
                    </div>
                    <div className="card-content">
                        <RecetaComentario receta={receta} />
                    </div>
                </div>
            </div>
        </section>
    );
}
