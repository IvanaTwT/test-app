import { useState } from "react";
import useFetch from "../hooks/useFetch";
import { useAuth } from "../contexts/AuthContext";

export default function ComentarioForm({ recetaId }) {
    const { token } = useAuth("state");
    const [content, setContent] = useState("");

    const [{ isError, isLoading }, doFetch] = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}/reciperover/comments/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
        }
    );

    function handleSubmit(event) {
        event.preventDefault();

        if (content.trim() === "") return;

        doFetch({
            body: JSON.stringify({
                content: content,
                recipe: recetaId,
                parent: null,
            }),
        });
        console.log("Contenido comments: " + content);
        console.log("Receta: " + recetaId);
        setContent("");
    }

    function handleChange(event) {
        setContent(event.target.value);
    }

    return (
        <div className="comments">
            <form
                onSubmit={handleSubmit}
                className="is-flex is-align-items-center"
            >
                <ion-icon name="person" size="large"></ion-icon>
                <div className="field is-flex-grow-1 mx-2">
                    <div className="control">
                        <textarea
                            className="textarea"
                            id="content"
                            name="content"
                            rows="2"
                            value={content}
                            onChange={handleChange}
                            placeholder="Agrega un comentario"
                        />
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <button type="submit" className="button is-primary" disabled={content.trim() === ""}>
                            Calificar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
