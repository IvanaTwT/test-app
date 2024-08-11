import useFetch from "../hooks/useFetch";
import { useEffect, useState } from "react";
import RecetaCard from "./RecetaCard";

import { useParams, useNavigate } from "react-router-dom";
import "./style.css";

export default function Recetas({ algunas = false }) {
  const { id } = useParams(); // id de categoria
  const [contador, setContador] = useState(1);
  const [recetas, setRecetas] = useState([]);
  const [recetasByCate, setRecetasByCate] = useState([]);
  // export default function Recetas() {
  const [categories, setCategories] = useState([]);
  const [cont, setCont] = useState(1);
  const path = window.location.pathname; //ruta
  const navigate = useNavigate();
  const [
    {
      data: dataCategories,
      isError: isErrorCateogories,
      isLoading: isLoadingCategories,
    },
    doFetchCategories,
  ] = useFetch(
    `${import.meta.env.VITE_API_BASE_URL}/reciperover/categories/?page=${cont}`,
    {}
  );
  useEffect(() => {
    doFetchCategories();
  }, [cont]);

  useEffect(() => {
    if (dataCategories) {
      const rta = dataCategories.results;
      setCategories((prevRecipes) => [...prevRecipes, ...rta]);

      if (dataCategories.next) {
        setCont((cont) => cont + 1);
      }
    }
  }, [dataCategories]);

  const [{ data, isError, isLoading }, doFetch] = useFetch(
    `${
      import.meta.env.VITE_API_BASE_URL
    }/reciperover/recipes/?page=${contador}`,
    {}
  );

  useEffect(() => {
    doFetch();
  }, [contador]); // El efecto se dispara cada vez que cambia el contador

  useEffect(() => {
    if (data) {
      // console.log("ID of category (RL): "+id)
      // console.log("Algunas: "+algunas)
      const newRecipe = data.results;

      setRecetas((prevRecipes) => [...prevRecipes, ...newRecipe]);
      // Si hay una siguiente página, incrementar el contador
      if (data.next) {
        setContador((prevContador) => prevContador + 1);
      }
    }
  }, [data]);
  useEffect(() => {
    if (id && recetas && path !== "/recetas") {
      //hacer un filtrado para agregar solo las recetas que tengan esa categoria
      const recipeByCategory = recetas.filter((recipe) =>
        recipe.categories.includes(parseInt(id))
      );
      setRecetasByCate(recipeByCategory);
    }
  }, [id, recetas]);

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar las recetas.</p>;
  if (!data && data.results) return <p>No hay recetas disponibles</p>;

  return (
    // is-full m-1  >
    <div className="columns m-1">
      <div className="column is-3"
      style={{background:"#d66d75", 
      background: "-webkit-linear-gradient(to right, #d66d75, #e29587)",
      background: "linear-gradient(to right, #d66d75, #e29587)"}}>
        <div className=" m-1">
          <ul className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
            <li
              className="is-size-4 p-1 label"
              style={{ border: "1px solid #000" }}
            >
              <span>CATEGORIAS</span>
            </li>

            {categories.length > 0 ? (
              categories.map((cat) => (
                <li
                  key={cat.id}
                  className="has-text-dark category-item"
                  onClick={() => {
                    navigate(`/categories/${cat.id}`);
                  }}
                >
                  {cat.name.toUpperCase()}
                </li>
              ))
            ) : (
              <li>No hay categorias</li>
            )}
          </ul>
        </div>
      </div>
      <div className="column is-9">
        <div
          className="columns is-multiline recetas m-1"
          style={{ overflow: "auto", width: "100% ", height: "600px" }}
        >
          {path === "/recetas" ? (
            // Caso para cuando la ruta es "/recetas"
            recetas && recetas.length > 0 ? (
              recetas.map((receta) => (
                <div
                  key={receta.id}
                  className="column is-one-quarter-tablet is-two-thirds-mobile"
                >
                  <RecetaCard receta={receta} />
                </div>
              ))
            ) : (
              <div>No hay recetas</div>
            )
          ) : // Caso para cuando la ruta no es "/recetas"
          recetasByCate.length > 0 ? (
            recetasByCate.map((receta) => (
              <div
                key={receta.id}
                className="column is-one-quarter-tablet is-two-thirds-mobile"
              >
                <RecetaCard receta={receta} />
              </div>
            ))
          ) : (
            <div>No hay recetas para esta categoria</div>
          )}
        </div>
      </div>
    </div>
  );
}
