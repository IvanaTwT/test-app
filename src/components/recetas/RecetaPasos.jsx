import useFetch from "../hooks/useFetch";
import { useEffect, useState } from "react";
import { formatDateTime } from "../hooks/utils";

export default function RecetaPasos({ receta }) {
    const [contador, setContador]= useState(1)
    const [{ data, isError, isLoading }, doFetch] = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}/reciperover/steps/?page=${contador}`,
        {}
    );

    const [pasos, setPasos] = useState([]);

    //traer todos los pasos
    useEffect(() => {
        if(receta.id){
            doFetch()
        }
    }, [receta.id, contador]);

    useEffect(()=>{
        if(data){
            const stepOfRecipe = data.results.filter((step) => step.recipe === receta.id);
            
            setPasos((prevStep) => [...prevStep, ...stepOfRecipe]);

            if (data.next) {
                setContador((sumContador) => sumContador + 1)
            }
        }
    },[data])
    //ordenar
    useEffect(() => {
        if (pasos && receta.id) {
            const pasosOrdenados=pasos.sort((a, b) => a.order - b.order)
            setPasos(pasosOrdenados);
        }
    }, [pasos, receta.id]);

    if (isLoading) return <p>Cargando pasos...</p>;
    if (isError) return <p>Error al cargar los pasos.</p>;

    return (
        <div className="column" style={{ margin: "1em" }}>
            <h3 className="title is-5 ">Preparación:</h3>
            <div className="steps">
                {pasos.length > 0 ? (
                    <ol>
                        {pasos.map((paso) => (
                            <li key={paso.id} className="m-1">{paso.instruction}</li>
                        ))}
                    </ol>
                ) : (
                    <p>No hay pasos disponibles para esta receta</p>
                )}
            </div>
        </div>
    );
}
