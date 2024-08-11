import useFetch from "../hooks/useFetch";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Ingrediente from "../ingredientes/Ingrediente";
import Category from "../categorias/Category";
import Paso from "../pasos/Paso";

export default function RecetaForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, token } = useAuth("state");

    const [recipe, setRecipe] = useState({
        title: "",
        description: "",
        preparation_time: null,
        cooking_time: null,
        servings: null,
    });

    const [image, setImage] = useState(null);
    const [formCargado, setFormCargado] = useState(false);
    const [ingredientes, setIngredientes] = useState([]); //todos los ingredientes de la receta
    const [steps, setSteps] = useState([]); //todos los pasos de la receta
    const [categorias, setCategorias] = useState([]); //categorias de la receta
    // booleano para acceder a edit o no
    const [paginaEdit, setPagEdit] = useState(false);
    // lista para ingredientes y pasos a eliminar
    const [ingredientDelete, setIngDelete] = useState([]);
    const [stepDelete, setStepDelete] = useState([]);
    //elementos array con array[0] inicial y array[1] campo/s modificado
    const [ingInitial, setIngInitial] = useState([]);
    const [stepInitial, setStepInitial] = useState([]);
    
    const [{ data, isError, isLoading }, doFetch] = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}/reciperover/recipes/${id}`,
        {}
    );
    //paginacion para ingredientes y categories (TI)
    const [page,setPage]=useState(1)
    const [allIng, setAllIng]=useState([])
    const [pageCat, setPageCat]=useState(1)
    const [recipeCat, setRecipeCat]=useState([])

    useEffect(() => {
        doFetch();
    }, []);

    const [
        { data: dataPost, isError: isErrorPost, isLoading: isLoadingPost },
        doFetchPost,
    ] = useFetch(`${import.meta.env.VITE_API_BASE_URL}/reciperover/recipes/`, {
        method: "POST",
        headers: {
            Authorization: `Token ${token}`,
        },
    });
    const [
        {
            data: dataIngredient,
            isError: isErrorIngredient,
            isLoading: isLoadingIngredient,
        },
        doFetchIngredient,
    ] = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}/reciperover/ingredients/?page=${page}`,
        {}
    );

    const [
        { data: dataPut, isError: isErrorPut, isLoading: isLoadingPut },
        doFetchPut,
    ] = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}/reciperover/recipes/${id}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Token ${token}`,
            },
        }
    );
    //traer las categorias relacionada a esta receta
    const [
        {
            data: dataRecipeCategory,
            isError: isErrorRecipeCategory,
            isLoading: isLoadingRecipeCategory,
        },
        doFetchRecipeCategory,
    ] = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}/reciperover/recipe-categories/?page=${pageCat}`,
        {}
    );

    useEffect(() => {
        if (data && window.location.pathname !== "/recetas/new") {
            setRecipe({
                title: data.title || "",
                description: data.description || "",
                preparation_time: parseInt(data.preparation_time) || null,
                cooking_time: parseInt(data.cooking_time) || 0,
                servings: parseInt(data.servings) || null,
            });
            setPagEdit(!paginaEdit);
            setImage(data.image);
            setCategorias(data.categories);
        }
    }, [data]);

    //traer todos los ingredientes
    useEffect(()=>{
        doFetchIngredient();
    },[page])

    useEffect(() => {        
        if(id && dataIngredient){
            const list=dataIngredient.results
            setAllIng((prevLista) => [...prevLista, ...list]);
            
            if (dataIngredient.next) {
                setPage((prevPage) => prevPage + 1)
            }
        }
    }, [id]);
    //traer las categorias relacionadas a esta receta
    useEffect(()=>{
        doFetchRecipeCategory();
    },[pageCat])

    useEffect(() => {        
        if(id && dataRecipeCategory){
            const list=dataRecipeCategory.results.filter((rc) => rc.recipe === parseInt(id));
            console.log("??"+list)
            setRecipeCat((prevLista) => [...prevLista, ...list]);
            
            if (dataRecipeCategory.next) {
                setPageCat((prevPage) => prevPage + 1)
            }
        }
    }, [id]);

    useEffect(() => {
        if (formCargado && allIng && recipeCat) {
            const newForm = new FormData();
            newForm.append("title", recipe.title);
            newForm.append("description", recipe.description);
            newForm.append("preparation_time", recipe.preparation_time);
            newForm.append("cooking_time", recipe.cooking_time);
            newForm.append("servings", recipe.servings);
            console.log("ingredientes (RF): " + ingredientes); //lista de objetos, preguntar si tiene length(tamaño)
            if (image && image !== data.image) {
                newForm.append("image", image);
            }
            if (window.location.pathname === "/recetas/new") {
                console.log("peticion post");
                doFetchPost({ body: newForm });
            } else {
                console.log("peticion put-patch");
                console.log("-" + newForm);
                doFetchPut({ body: newForm });
            }
            setFormCargado(false);
        }
    }, [formCargado, recipe, image, ingredientes, categorias, allIng, recipeCat]);

    useEffect(() => {
        if (!isErrorPut && formCargado && paginaEdit && allIng && recipeCat) {
            console.log("Size all ing: "+allIng.length) //obtener el ultimo cambio de las categorias select
            // console.log("Cate:"+categorias)
            //array=[ [ {},{} ] , [ {},{} ] ]
            if (ingredientes.length > 0) {
                //ingredientes agregados
                ingredientes.forEach((ingredient) => {
                    
                    // Buscar ingrediente en la base de datos antes de crearlo
                    const existingIngredient = allIng.find(
                        (item) => item.name.toLowerCase() === ingredient.name.toLowerCase()
                    ); //devuelve el ingrediente encontrado, {id, name, description, ..}
                    console.log("Exist== "+existingIngredient)
                    if (existingIngredient) {
                        //asociar ingrediente a la receta
                        fetch(
                            `${
                                import.meta.env.VITE_API_BASE_URL
                            }/reciperover/recipe-ingredients/`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Token ${token}`,
                                },
                                body: JSON.stringify({
                                    quantity: ingredient.quantity,
                                    measure: ingredient.measure,
                                    recipe: id,
                                    ingredient: existingIngredient.id,
                                }),
                            }
                        )
                            .then((response) => response.json())
                            .then((data) => {
                                if (!data.id) {
                                    console.error(
                                        "Error al asociar el ingrediente existente:",
                                        data
                                    );
                                } else {
                                    console.log(
                                        "Ingrediente existente asociado:"
                                    );
                                }
                            })
                            .catch((error) =>
                                console.error("Error en la petición:", error)
                            );
                    } else {
                        // Si el ingrediente no existe, crearlo y luego asociarlo a la receta
                        fetch(
                            `${
                                import.meta.env.VITE_API_BASE_URL
                            }/reciperover/ingredients/`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Token ${token}`,
                                },
                                body: JSON.stringify({
                                    name: ingredient.name,
                                }),
                            }
                        )
                            .then((response) => response.json())
                            .then((newIngrediente) => {
                                if (newIngrediente.id) {
                                    fetch(
                                        `${
                                            import.meta.env.VITE_API_BASE_URL
                                        }/reciperover/recipe-ingredients/`,
                                        {
                                            method: "POST",
                                            headers: {
                                                "Content-Type":
                                                    "application/json",
                                                Authorization: `Token ${token}`,
                                            },
                                            body: JSON.stringify({
                                                quantity: ingredient.quantity,
                                                measure: ingredient.measure,
                                                recipe: parseInt(id),
                                                ingredient: newIngrediente.id,
                                            }),
                                        }
                                    )
                                        .then((response) => response.json())
                                        .then((data) => {
                                            if (!data.id) {
                                                console.error(
                                                    "Error al asociar el nuevo ingrediente:",
                                                    data
                                                );
                                            } else {
                                                console.log(
                                                    "Nuevo ingrediente asociado:"
                                                );
                                            }
                                        })
                                        .catch((error) =>
                                            console.error(
                                                "Error en la petición:",
                                                error
                                            )
                                        );
                                } else {
                                    console.error(
                                        "Error al crear al asociar el nuevo ingrediente:",
                                        ingredient
                                    );
                                }
                            })
                            .catch((error) =>
                                console.error("Error en la petición:", error)
                            );
                    }
                });
            }
            //editar el ingrediente guardado por el actualizado
            if (ingInitial.length > 0) {
                ingInitial.map((subArray) => {
                    // subArray.map(objeto => {
                    const actual = subArray[0]; //tiene {id: 30, ingredient: 33, name: 'Coco', quantity: 200, measure: 'g'}
                    const update = subArray[1]; //recorrer para cambiar el valor
                    if ("name" in update) {
                        //verificar que name tenga algo
                        if (update.name) {
                            //si el nombre se cambia hay que verificar que no exista para crearlo y referenciarlo
                            //caso contrario solo referenciar
                            const existingIngredient =
                                allIng.find(
                                    (item) =>
                                        item.name.toLowerCase() ===
                                        update.name.toLowerCase()
                                ); //devuelve el ingrediente encontrado, {id, name, description, ..}
                            console.log("Existe ing?:"+existingIngredient.id)
                            if (existingIngredient) {
                                //asociar ingrediente a la receta
                                fetch(
                                    `${
                                        import.meta.env.VITE_API_BASE_URL
                                    }/reciperover/recipe-ingredients/`,
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            Authorization: `Token ${token}`,
                                        },
                                        body: JSON.stringify({
                                            quantity: actual.quantity,
                                            measure: actual.measure,
                                            recipe: parseInt(id),
                                            ingredient: existingIngredient.id,
                                        }),
                                    }
                                )
                                    .then((response) => response.json())
                                    .then((data) => {
                                        if (!data.id) {
                                            console.error(
                                                "Error al asociar el ingrediente existente:",
                                                data
                                            );
                                        } else {
                                            console.log(
                                                "Ingrediente existente asociado:"
                                            );
                                        }
                                    })
                                    .catch((error) =>
                                        console.error(
                                            "Error en la petición:",
                                            error
                                        )
                                    );
                            } else {
                                // Si el ingrediente no existe, crearlo y luego asociarlo a la receta
                                fetch(
                                    `${
                                        import.meta.env.VITE_API_BASE_URL
                                    }/reciperover/ingredients/`,
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            Authorization: `Token ${token}`,
                                        },
                                        body: JSON.stringify({
                                            name: update.name,
                                        }),
                                    }
                                )
                                    .then((response) => response.json())
                                    .then((newIngrediente) => {
                                        if (newIngrediente.id) {
                                            fetch(
                                                `${
                                                    import.meta.env
                                                        .VITE_API_BASE_URL
                                                }/reciperover/recipe-ingredients/`,
                                                {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type":
                                                            "application/json",
                                                        Authorization: `Token ${token}`,
                                                    },
                                                    body: JSON.stringify({
                                                        quantity:
                                                            actual.quantity,
                                                        measure: actual.measure,
                                                        recipe: parseInt(id),
                                                        ingredient:
                                                            newIngrediente.id,
                                                    }),
                                                }
                                            )
                                                .then((response) =>
                                                    response.json()
                                                )
                                                .then((data) => {
                                                    if (!data.id) {
                                                        console.error(
                                                            "Error al asociar el nuevo ingrediente:",
                                                            data
                                                        );
                                                    } else {
                                                        console.log(
                                                            "Nuevo ingrediente asociado:"
                                                        );
                                                    }
                                                })
                                                .catch((error) =>
                                                    console.error(
                                                        "Error en la petición:",
                                                        error
                                                    )
                                                );
                                        } else {
                                            console.error(
                                                "Error al crear el ingrediente:",
                                                data
                                            );
                                        }
                                    })
                                    .catch((error) =>
                                        console.error(
                                            "Error en la petición:",
                                            error
                                        )
                                    );
                            }
                        }
                    } else {
                        Object.entries(update).map(([clave, valor]) => {
                            //console.log(`${clave}: ${valor}`); //quantity: 120
                            actual[clave] = valor;
                        });
                        fetch(
                            `${
                                import.meta.env.VITE_API_BASE_URL
                            }/reciperover/recipe-ingredients/${actual.id}/`,
                            {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Token ${token}`,
                                },
                                body: JSON.stringify({
                                    quantity: actual.quantity,
                                    measure: actual.measure,
                                    recipe: parseInt(id),
                                    ingredient: actual.ingredient,
                                }),
                            }
                        )
                            .then((response) => response.json())
                            .then((data) => {
                                if (!data.id) {
                                    console.error(
                                        "Error al asociar el ingrediente editado:",
                                        data
                                    );
                                } else {
                                    console.log("Ingrediente asociado:");
                                }
                            })
                            .catch((error) =>
                                console.error("Error en la petición:", error)
                            );
                    }
                });
            }
            //eliminar ingrediente
            if (ingredientDelete.length > 0) {
                ingredientDelete.map((id) => {
                    fetch(
                        `${
                            import.meta.env.VITE_API_BASE_URL
                        }/reciperover/recipe-ingredients/${id}`,
                        {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Token ${token}`,
                            },
                        }
                    )
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(
                                    `HTTP error! Status: ${response.status}`
                                );
                            }
                            console.log("Ingrediente Eliminado....");
                        })
                        .catch((error) =>
                            console.error("Error en la petición:", error)
                        );
                });
            }
            //pasos agregados
            if (steps.length > 0) {
                steps.map((paso) => {
                    console.log(paso); //{order: int, instruction: string}
                    fetch(
                        `${
                            import.meta.env.VITE_API_BASE_URL
                        }/reciperover/steps/`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Token ${token}`,
                            },
                            body: JSON.stringify({
                                order: paso.order,
                                instruction: paso.instruction,
                                recipe: id,
                            }),
                        }
                    )
                        .then((response) => response.json())
                        .then((data) => {
                            if (!data.id) {
                                console.error(
                                    "Error al crear paso existente:",
                                    data
                                );
                            } else {
                                console.log("Paso creado asociado:");
                            }
                        })
                        .catch((error) =>
                            console.error("Error en la petición:", error)
                        );
                });
            }
            //pasos editados
            if (stepInitial.length > 0) {
                stepInitial.map((subArray) => {
                    // subArray.map(objeto => {
                    const actual = subArray[0]; //tiene {order: int , instruction : string}
                    const update = subArray[1]; //recorrer para cambiar el valor
                    console.log(actual)
                    console.log(update)
                    fetch(
                        `${
                            import.meta.env.VITE_API_BASE_URL
                        }/reciperover/steps/${actual.id}/`,
                        {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Token ${token}`,
                            },
                            body: JSON.stringify({
                                recipe: id,
                                order: actual.order,
                                instruction: update.instruction,
                            }),
                        }
                    )
                        .then((response) => response.json())
                        .then((data) => {
                            if (!data.id) {
                                console.error(
                                    "Error al editar preparacion:",
                                    data
                                );
                            } else {
                                console.log("Preparacion editada!");
                            }
                        })
                        .catch((error) =>
                            console.error("Error en la petición:", error)
                        );
                });
            }
            //pasos eliminados
            if (stepDelete.length > 0) {
                stepDelete.map((id) => {
                    fetch(
                        `${
                            import.meta.env.VITE_API_BASE_URL
                        }/reciperover/steps/${id}/`,
                        {
                            method: "DELETE",
                            headers: {
                                Authorization: `Token ${token}`,
                            },
                        }
                    )
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(
                                    `HTTP error! Status: ${response.status}`
                                );
                            }
                            console.log("Paso Eliminado");
                        })
                        .catch((error) =>
                            console.error("Error en la petición:", error)
                        );
                });
            }
            //cargar categorias
            const listCate = categorias[categorias.length - 1];
            console.log("lc"+listCate)
            let tipoList=String(typeof listCate) 
            console.log(tipoList)
            //si es lista, deberemos de cambiar la categoria/s, de lo contrario el usu no actualizo apartado categories
            if (categorias.length > 0 && (tipoList==='object' )) {
                 //trae el ultimo par de objetos en una lista
                //si el usuario no hizo nuevamenete una seleccion,solo tiene numeros porque es la inicial, ids
                listCate.forEach((category) => {
                    // console.log(category) // object
                    fetch(
                        `${import.meta.env.VITE_API_BASE_URL}/reciperover/recipe-categories/`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Token ${token}`,
                            },
                            body: JSON.stringify({
                                recipe: id,
                                category: category.id,
                            }),
                        }
                    ).then(response => response.json())
                    .then(data => {
                        if (!data.id) {
                            console.error("Error en la creación de la categoría:", data);
                        }
                    }).catch(error => console.error("Error en la petición:", error));
                });
            }else{
                //eliminamos las categorias que existen
                console.log("Size (RC): "+recipeCat.length)
                if(recipeCat){
                    recipeCat.map((rp) => {
                        fetch(
                            `${
                                import.meta.env.VITE_API_BASE_URL
                            }/reciperover/recipe-categories/${rp.id}/`,
                            {
                                method: "DELETE",
                                headers: {
                                    Authorization: `Token ${token}`,
                                },
                            }
                        )
                            .then((response) => {
                                if (!response.ok) {
                                    throw new Error(
                                        `HTTP error! Status: ${response.status}`
                                    );
                                }
                                console.log("Categoria Eliminada");
                            })
                            .catch((error) =>
                                console.error("Error en la petición:", error)
                            );
                    })
                }
            }
            return navigate(`/recetas/${id}`);
        }
    }, [
        formCargado,
        paginaEdit,
        dataPut,
        ingredientes,
        ingInitial,
        steps,
        categorias
    ]);

    useEffect(() => {
        if (dataPost) {
            console.log("Nueva receta creada con ID:", dataPost.id); // ID de la NUEVA RECETA
            setCategorias(categorias[categorias.length - 1]); //el ultimo cambio de categoria
            console.log("Categorias reset: " + categorias);
            if (ingredientes.length > 0) {
                ingredientes.forEach((ingredient) => {
                    // Buscar ingrediente en la base de datos antes de crearlo
                    const existingIngredient = allIng.find(
                        (item) =>
                            item.name.toLowerCase() ===
                            ingredient.name.toLowerCase()
                    );
                    // console.log("Existe? "+existingIngredient);
                    if (existingIngredient) {
                        // Si el ingrediente existe, asociarlo a la receta
                        fetch(
                            `${
                                import.meta.env.VITE_API_BASE_URL
                            }/reciperover/recipe-ingredients/`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Token ${token}`,
                                },
                                body: JSON.stringify({
                                    quantity: ingredient.quantity,
                                    measure: ingredient.measure,
                                    recipe: dataPost.id,
                                    ingredient: existingIngredient.id,
                                }),
                            }
                        )
                            .then((response) => response.json())
                            .then((data) => {
                                if (!data.id) {
                                    console.error(
                                        "Error al asociar el ingrediente existente:",
                                        data
                                    );
                                } else {
                                    console.log(
                                        "Ingrediente existente asociado:",
                                        data
                                    );
                                }
                            })
                            .catch((error) =>
                                console.error("Error en la petición:", error)
                            );
                    } else {
                        // Si el ingrediente no existe, crearlo y luego asociarlo a la receta
                        fetch(
                            `${
                                import.meta.env.VITE_API_BASE_URL
                            }/reciperover/ingredients/`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Token ${token}`,
                                },
                                body: JSON.stringify({
                                    name: ingredient.name,
                                }),
                            }
                        )
                            .then((response) => response.json())
                            .then((data) => {
                                if (data.id) {
                                    fetch(
                                        `${
                                            import.meta.env.VITE_API_BASE_URL
                                        }/reciperover/recipe-ingredients/`,
                                        {
                                            method: "POST",
                                            headers: {
                                                "Content-Type":
                                                    "application/json",
                                                Authorization: `Token ${token}`,
                                            },
                                            body: JSON.stringify({
                                                quantity: ingredient.quantity,
                                                measure: ingredient.measure,
                                                recipe: dataPost.id,
                                                ingredient: data.id,
                                            }),
                                        }
                                    )
                                        .then((response) => response.json())
                                        .then((data) => {
                                            if (!data.id) {
                                                console.error(
                                                    "Error al asociar el nuevo ingrediente:",
                                                    data
                                                );
                                            } else {
                                                console.log(
                                                    "Nuevo ingrediente asociado:",
                                                    data
                                                );
                                            }
                                        })
                                        .catch((error) =>
                                            console.error(
                                                "Error en la petición:",
                                                error
                                            )
                                        );
                                } else {
                                    console.error(
                                        "Error al crear el ingrediente:",
                                        data
                                    );
                                }
                            })
                            .catch((error) =>
                                console.error("Error en la petición:", error)
                            );
                    }
                });
            }
            if (steps.length > 0) {
                steps.forEach((paso) => {
                    fetch(
                        `${
                            import.meta.env.VITE_API_BASE_URL
                        }/reciperover/steps/`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Token ${token}`,
                            },
                            body: JSON.stringify({
                                recipe: dataPost.id,
                                order: paso.order,
                                instruction: paso.instruction,
                            }),
                        }
                    )
                        .then((response) => response.json())
                        .then((data) => {
                            if (!data.id) {
                                console.error(
                                    "Error en la creación de la step:",
                                    data
                                );
                            }
                        })
                        .catch((error) =>
                            console.error("Error en la petición step:", error)
                        );
                });
            }
            if (categorias.length > 0 && categorias.length > 2) {
                categorias.forEach((category) => {
                    fetch(
                        `${
                            import.meta.env.VITE_API_BASE_URL
                        }/reciperover/recipe-categories/`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Token ${token}`,
                            },
                            body: JSON.stringify({
                                recipe: dataPost.id,
                                category: category.id,
                            }),
                        }
                    )
                        .then((response) => response.json())
                        .then((data) => {
                            if (!data.id) {
                                console.error(
                                    "Error en la creación de la categoría:",
                                    data
                                );
                            }
                        })
                        .catch((error) =>
                            console.error("Error en la petición:", error)
                        );
                });
            }
        }
    }, [dataPost, allIng]);

    // INGREDIENTE - funcion para agregar ingrediente cada vez
    function addIngrediente(ingrediente) {
        // console.log(ingrediente)//{name: string, measure: string, quantity: int}
        setIngredientes([...ingredientes, ingrediente]);
    }

    // funcion para editar ingrediente, dentro de lista anidada tendra el objeto inical(ingrediente), y el otro sera el/los campo a modificar
    // [ [ {} , {} ] , [ {}, {} ] .....]   de la primera tomaremos el id y el nombre para poder realizar los cambios
    function editIngredientInitial(listIngsEdit) {
        setIngInitial((prevInicial) => [...ingInitial, listIngsEdit]);
        // console.log(ingInitial);
    }
    function deleteIngredients(idEliminado) {
        //id para eliminarlo de la receta
        // console.log("Eliminando ingrediente id: "+idEliminado)
        setIngDelete([...ingredientDelete, idEliminado]);
    }
    // funcion para eliminar ingrediente
    function addCategorias(categoria) {
        setCategorias([...categorias, categoria]);
    }
    function editCategories() {
        setCategorias(categorias[categorias.length - 1]); //el ultimo cambio de categoria
        return categorias;
    }

    // PASO - funcion para agregar paso cada vez
    function addStep(step) {
        setSteps((prevStep) => [...prevStep, step]);
    }
    // funcion para editar ingrediente, dentro de lista anidada tendra el objeto inical(ingrediente), y el otro sera el/los campo a modificar
    // [ [ {} , {} ] , [ {}, {} ] .....]   de la primera tomaremos el id y el nombre para poder realizar los cambios
    function editStepInitial(listStepsEdit) {
        //(prevInicial)=> [...ingInitial, listIngsEdit]
        setStepInitial((prevStep) => [...prevStep, listStepsEdit]);
        console.log(ingInitial);
    }
    function deleteStep(idEliminado) {
        console.log("step elimninado (RF) : " + idEliminado);
        setStepDelete((prevStep) => [...prevStep, idEliminado]);
    }

    if (isLoading) return <p>Cargando...</p>;
    if (isError) return <p>Error al cargar las recetas.</p>;
    if (!data) return <p>No hay recetas disponibles</p>;

    function handleSubmit(event) {
        event.preventDefault();
        setFormCargado(true);
    }

    function handleImageChange(event) {
        setImage(event.target.files[0]);
    }

    function handleRecipeChange(event) {
        setRecipe({
            ...recipe,
            [event.target.name]: event.target.value,
        });
    }
    // al presionar enter
    function handleKeyDown(event) {
        if (event.key === "Enter") {
            event.preventDefault();
        }
    }
    return (
        <section className="">
            <form
                onSubmit={handleSubmit}
                onKeyDown={handleKeyDown}
                className=" is-flex is-flex-direction-column box m-4 p-4 has-background-dark"
            >
                <div className="columns is-centered">
                    {paginaEdit ? (
                        <figure className="column is-one-third">
                            <img
                                src={image}
                                alt={recipe.title}
                                className="is-128x128"
                            />
                        </figure>
                    ) : null}
                </div>
                <div className="field ">
                    <label className="label has-text-white">Imagen:</label>
                    <div className="control">
                        <input
                            className="input"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="title" className="label has-text-white">
                        Nombre receta: (*)
                    </label>
                    <div className="control">
                        <input
                            className="input"
                            type="text"
                            id="title"
                            name="title"
                            defaultValue={recipe.title}
                            onChange={handleRecipeChange}
                            required
                        />
                    </div>
                </div>

                <div className="field">
                    <label
                        htmlFor="preparation_time"
                        className="label has-text-white"
                    >
                        Tiempo Preparación (min): (*)
                    </label>
                    <div className="control">
                        <input
                            className="input"
                            type="number"
                            min="0"
                            rows={3}
                            id="preparation_time"
                            name="preparation_time"
                            defaultValue={recipe.preparation_time}
                            onChange={handleRecipeChange}
                            required
                        />
                    </div>
                </div>

                <div className="field">
                    <label
                        htmlFor="cooking_time"
                        className="label has-text-white"
                    >
                        Tiempo Cocción (min): (*)
                    </label>
                    <div className="control">
                        <input
                            className="input"
                            type="number"
                            min="0"
                            rows={3}
                            id="cooking_time"
                            name="cooking_time"
                            defaultValue={recipe.cooking_time}
                            onChange={handleRecipeChange}
                            required
                        />
                    </div>
                </div>

                <div className="field">
                    <label
                        htmlFor="description"
                        className="label has-text-white"
                    >
                        Descripción:
                    </label>
                    <div className="control">
                        <textarea
                            className="textarea"
                            id="description"
                            name="description"
                            defaultValue={recipe.description}
                            onChange={handleRecipeChange}
                        />
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="servings" className="label has-text-white">
                        Raciones:
                    </label>
                    <div className="control">
                        <input
                            className="input"
                            type="number"
                            id="servings"
                            min="1"
                            name="servings"
                            defaultValue={recipe.servings}
                            onChange={handleRecipeChange}
                        />
                    </div>
                </div>
                <div className="ingredientes">
                    <Ingrediente
                        addIngrediente={addIngrediente}
                        editIngredientInitial={editIngredientInitial}
                        paginaEdit={paginaEdit}
                        deleteIngredients={deleteIngredients} //lista de id de ingrediente
                    ></Ingrediente>
                </div>

                <div className="pasos">
                    <Paso
                        addStep={addStep}
                        editStepInitial={editStepInitial}
                        paginaEdit={paginaEdit}
                        deleteStep={deleteStep}
                    ></Paso>
                </div>

                <div className="categories">
                    <Category
                        receta={data}
                        addCategorias={addCategorias}
                        paginaEdit={paginaEdit}
                        editCategoria={editCategories}
                    ></Category>
                </div>
                <div className="field">
                    <div className="control">
                        <button
                            type="submit"
                            className="button is-primary is-fullwidth"
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            </form>
        </section>
    );
}
