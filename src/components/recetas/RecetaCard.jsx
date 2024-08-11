import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import defaultImage from "./logo.png";
import "./style.css"

export default function RecetaCard({ receta }) {
    const navigate = useNavigate();
    const [imageSrc, setImageSrc] = useState(receta.image || defaultImage);

    const handleError = () => {
        setImageSrc(defaultImage);
    };

    return (
        <div className="card " style={{borderRadius:"0"}}>{/*sin-bordes-redondeados*/}
            <div className="card-image">
                <figure className="image is-1by1">
                    <img
                        src={imageSrc}
                        alt={receta.title}
                        onError={handleError}
                        style={{borderRadius:"0"}}
                    />
                </figure>
            </div>
            <div className="card-content" >
                <p className="title is-5">{receta.title}</p>
                <div className="is-flex is-align-items-center">
                    <p className="mr-4">
                        <ion-icon name="people"></ion-icon>
                        {receta.view_count}
                    </p>
                    <p>
                        <ion-icon name="time"></ion-icon>
                        {receta.preparation_time} mins
                    </p>
                </div>
            </div>
            <footer
                className="card-footer "
                // #005eff
                style={{
                    background: "#cb356b", /* fallback for old browsers */
                    background: "-webkit-linear-gradient(to right, #cb356b, #bd3f32)" ,/* Chrome 10-25, Safari 5.1-6 */
                    background: "linear-gradient(to right, #cb356b, #bd3f32)",
                    color: "#fff",
                    cursor: "pointer",
                    borderRadius:"0"
                }}
                // style={{backgroundColor:"#6dd5ed"}}
                onClick={() => navigate(`/recetas/${receta.id}`)}
            >
                {" "}
                {/*005eff 1F75FE*/}
                <p className="card-footer-item">Más detalles</p>
            </footer>
        </div>
    );
}
