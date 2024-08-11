import useFetch from "../hooks/useFetch";
import { useEffect, useState } from "react";
// import { useAuth } from "../contexts/AuthContext";
import "./style.css";
import { useParams, NavLink } from "react-router-dom";

export default function RecetaLocacion() {
    const { id } = useParams();//id de receta
    const [locaciones, setLocaciones] = useState([]);

    const [
        {
            data: dataLocaciones,
            isError: isErrorLocaciones,
            isLoading: isLoadingLocaciones,
        },
        doFetchLocaciones,
    ] = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}/reciperover/locations/`,
        {}
    );

    const recipeLocacionesUrl = `${
        import.meta.env.VITE_API_BASE_URL
    }/reciperover/recipes/${id}/locations`;

    useEffect(() => {
        doFetchLocaciones();
    }, []);

    useEffect(() => {
        if (dataLocaciones) {
            fetch(recipeLocacionesUrl)
                .then((response) => response.json())
                .then((recipeLocaciones) => {
                    console.log("Recipe Locaciones: ", recipeLocaciones.results);
                    const listLoc = [];
                    dataLocaciones.results.forEach((locacion) => {
                        const [loc] = recipeLocaciones.filter(
                            (rp) => locacion.id === rp.location
                        );
                        if (loc) {
                            listLoc.push({
                                id: locacion.id,
                                name: locacion.name,
                            });
                        }
                    });
                    console.log("Filtered Locaciones: ", listLoc);
                    setLocaciones(listLoc);
                })
                .catch((error) =>
                    console.error("Error fetching locaciones:", error)
                );
        }
        console.log("Data Locaciones: ", dataLocaciones);
    }, [dataLocaciones, id]);

    return (
        <div className="column">
            <div className="tags">
                {locaciones.length > 0 ? (
                    locaciones.map((locacion) => (
                        <NavLink
                            to={`/location/${locacion.id}`}
                            key={locacion.id}
                            className="tag is-link"
                        >
                            #{locacion.name}
                        </NavLink>
                    ))
                ) : (
                    <p>Sin especificar</p>
                )}
            </div>
        </div>
    );
}
