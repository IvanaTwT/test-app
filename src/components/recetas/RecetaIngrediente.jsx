import useFetch from "../hooks/useFetch";
import { useEffect, useState } from "react";
// import { useAuth } from "../contexts/AuthContext";
import "./style.css";
import { useParams, NavLink } from "react-router-dom";

export default function RecetaIngrediente() {
    // const { isAuthenticated, token } = useAuth("state");
    const { id } = useParams();
    const [ingredients, setIngredients] = useState([]);
    const [listIng, setListIng] = useState([]);
    const [contador, setContador] = useState(1);

    const [{ data, isError, isLoading }, doFetch] = useFetch(
        `${
            import.meta.env.VITE_API_BASE_URL
        }/reciperover/ingredients/?page=${contador}`,
        {}
    );

    const reciperIngredienteUrl = `${
        import.meta.env.VITE_API_BASE_URL
    }/reciperover/recipes/${id}/ingredients/`;
    const [finalizo, setFinalizo] = useState(false);

    useEffect(() => {
        if (id) {
            doFetch();
        }
    }, [id, contador]);

    useEffect(() => {
        if (data) {
            const ingOfRecipe = data.results.filter((ingredient) =>
                ingredient.recipes.includes(parseInt(id))
            );

            setListIng((prevListIng) => [...prevListIng, ...ingOfRecipe]);
            // Si hay una siguiente página, incrementar el contador
            if (data.next) {
                setContador((prevContador) => prevContador + 1);
            } else {
                setFinalizo(!finalizo);
            }
        }
    }, [data]);

    useEffect(() => {
        if (listIng.length > 0 && finalizo) {
            console.log("tamaño: " + listIng.length);
            fetch(reciperIngredienteUrl)
                .then((response) => response.json())
                .then((recipeIngredient) => {
                    //quantity, measure, ingredient (integer) recipe (integer)
                    const listIngredientes = [];
                    listIng.forEach((ingrediente) => {
                        const [ing] = recipeIngredient.results.filter(
                            (rp) => rp.ingredient === ingrediente.id
                        ); //
                        // console.log("(RI): "+ing.id)
                        if (ing) {
                            listIngredientes.push({
                                id: ingrediente.id,
                                name:
                                    ingrediente.name.charAt(0).toUpperCase() +
                                    ingrediente.name.slice(1).toLowerCase(),
                                quantity: ing.quantity,
                                measure: ing.measure,
                            });
                        }
                    });
                    setIngredients(listIngredientes);
                })
                .catch((error) =>
                    console.error("Error fetching ingredients:", error)
                );
        }
    }, [listIng, id, finalizo]);

    if (isLoading) return <p>Cargando...</p>;
    if (isError) return <p>Error al cargar esta receta.</p>;

    return (
        <div className="column is-narrow-mobile is-narrow-tablet is-3 columna-ingredients">
            <h3 className="title is-5 has-text-centered">Ingredientes</h3>

            {ingredients.length > 0 ? (
                <ul className="">
                    {ingredients.map((ingrediente) => (
                        <li key={ingrediente.id} className="ingredient-item">
                            <strong className="">{ingrediente.name}:</strong>
                            <span className="ingredient-details">
                                {ingrediente.quantity}
                                {ingrediente.measure}
                            </span>
                            <hr />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay ingredientes disponibles para esta receta</p>
            )}
        </div>
    );
}
