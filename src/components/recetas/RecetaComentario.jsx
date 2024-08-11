import useFetch from "../hooks/useFetch";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { formatDate, formatDateTime } from "../hooks/utils";
import User from "./User";
import { useParams, NavLink } from "react-router-dom";
import Swal from "sweetalert2";

export default function RecetaComentario({ receta }) {

    const { user__id } = useAuth("state");
    const { isAuthenticated, token } = useAuth("state");

    const [contador, setContador] = useState(1)
    const [comentarios, setComentarios] = useState([]);

    const [{ data, isError, isLoading }, doFetch] = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}/reciperover/comments/?page=${contador}`,
        {}
    );

    useEffect(() => {
        doFetch();
    }, [contador]);

    useEffect(() => {
        if (data) {
            if(receta.id){
                const comentariosReceta = data.results.filter(
                    (comentario) => comentario.recipe === receta.id,
                );
                comentariosReceta.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
                setComentarios((prevRecipe) => [...prevRecipe, ...comentariosReceta]);
            }

            setComentarios((prevRecipes) => [...prevRecipes]);

            if (data.next) {
                setContador((prevContador) => prevContador + 1);
            }
           
        }
    }, [data, receta.id]);

    const handleDelete = (comentarioId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminarlo!'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${import.meta.env.VITE_API_BASE_URL}/reciperover/comments/${comentarioId}/`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Token ${token}`
                    }
                }).then(response => {
                    if (response.ok) {
                        setComentarios(prevComentarios => prevComentarios.filter(comentario => comentario.id !== comentarioId));
                        Swal.fire(
                            'Eliminado!',
                            'El comentario ha sido eliminado.',
                            'success'
                        );
                    } else {
                        Swal.fire(
                            'Error!',
                            'Hubo un problema al eliminar el comentario.',
                            'error'
                        );
                    }
                }).catch(() => {
                    Swal.fire(
                        'Error!',
                        'Hubo un problema al eliminar el comentario.',
                        'error'
                    );
                });
            }
        });
    };

    if (isLoading) return <p>Cargando comentarios...</p>;
    if (isError) return <p>Error al cargar los comentarios.</p>;
    
    return (
        <div className="comments">
            <h3 className="title is-6">
                Calificaciones ({comentarios.length})
            </h3>
            {comentarios.length > 0 ? (
                comentarios.map((comentario) => (
                    
                    <div key={comentario.id} className="box">

                        <div className="media">

                            <div className="media-left">
                                <ion-icon name="person" size="large"></ion-icon>
                            </div>

                            <div className="media-content">
                                <p className="title is-6">
                                    <NavLink to={`../../profile/${comentario.author}`} relative="path">
                                        <User id={comentario.author} />
                                    </NavLink>
                                </p>
                                <p>{comentario.content}</p>
                                <p>
                                    <small className="has-text-grey-light">
                                        {formatDateTime(comentario.created_at)}
                                    </small>
                                </p>
                            </div>

                            {isAuthenticated && comentario.author == user__id ? (
                                <div className="media-right is-flex is-justify-content-start is-align-items-center">      
                                    <div className="buttons-container is-flex"> 
                                        <div className="column">
                                            <button className="button is-danger" onClick={() => handleDelete(comentario.id)}>
                                                <ion-icon name="trash-outline"></ion-icon>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                        </div>
                    </div>
                ))
            ) : (
                <p className="has-text-grey">
                    Sé el primero en dar una calificación
                </p>
            )}
        </div>
    );
}
