import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import Swal from "sweetalert2";

function DeleteRecetaModal({ isOpen, onClose, receta_id, onDelete }) {
    const { token } = useAuth("state");

    const handleDeleteReceta = (event) => {
        event.preventDefault();

        onDelete.doFetch(
            `${import.meta.env.VITE_API_BASE_URL}/reciperover/recipes/${receta_id}/`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        ).then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar la canción');
            }
            return response.json();
        }).catch(error => {
            Swal.showValidationMessage(`Error: ${error}`);
        });
        console.log("Receta eliminada: ", receta_id)
    };

    useEffect(() => {
        if (onDelete.data) {
            onClose();
        }
    }, [onDelete.data]);

    console.log("Receta eliminada:", receta_id)
    console.log("isOpen:", isOpen);
    if (!isOpen) return null;

    return (
        <div >
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Eliminar Canción</p>
                    <button
                        className="delete"
                        aria-label="close"
                        onClick={onClose}
                    ></button>
                </header>
                <section className="modal-card-body">
                    <form onSubmit={handleDeleteReceta}>
                        <div className="field">
                            <p className="subtitle">
                                Estas seguro que deseas eliminar esta canción.
                                No se podrá recuperar este recurso.
                            </p>
                        </div>
                        <button
                            className="button is-danger"
                            type="submit"
                            disabled={onDelete.isLoading}
                        >
                            {onDelete.isLoading ? "Eliminando..." : "Confirmar"}
                        </button>
                    </form>
                </section>
            </div>
        </div>

    );
}

export default DeleteRecetaModal;
