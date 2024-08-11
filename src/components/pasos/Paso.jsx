import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
// import IngredientesList from "./IngredienteList";

export default function Paso({addStep, paginaEdit, editStepInitial,deleteStep}) {
    
    const { id } = useParams();
    const [pasoSubmit, setPasoSubmit] = useState([]);
    const [orden, setOrden]=useState(1); 
    const [paso, setPaso] = useState({order:1 , instruction : ""}); //
    const [page, setPage]= useState(1);

    const [formPaso, setFormPaso] = useState(false);
    const [lista, setLista] = useState([]);//lista inicial
    // ediciones para los ingredientes anteriores
    const [listStep, setListStep] = useState([]);
    const [stepsEdit, setStepsEdit] = useState([]);
    
    const [{ data, isError, isLoading }, doFetchStep] = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}/reciperover/steps/?page=${page}`,
        {}
      );

    useEffect(()=>{
        if(id){
            doFetchStep()
        }
    },[id,page]) ;

    useEffect(() => {        
        if(data && paginaEdit){
            const pasos = data.results;
            // console.log("hay pasos? "+pasos)
            const stepOfRecipe = pasos.filter((step) => step.recipe === parseInt(id));
            setLista((prevStep) => [...prevStep, ...stepOfRecipe]);
            
            if (data.next) {
                setPage((prevPage) => prevPage + 1)
            }else{
                setOrden((prevOrden) => prevOrden+(lista.length + 1));
            }
        }
    }, [id, paginaEdit,data]);

    useEffect(() => {
        if (lista && id) {
            setListStep(lista.sort((a, b) => a.order - b.order));
            // listStep.map((st)=>{
            //    console.log(st.order+":"+st.instruction)
            // })
        }
    }, [lista, id]);

    function handleClick() {
        setFormPaso(!formPaso);
    }

    function handleStepChange(event) {
        setPaso({
            ...paso,
            [event.target.name]: event.target.value,
        });
    }
    //para cuando se modifique la lista de los pasos debe de cambiarse el orden en el que va
    useEffect(()=>{
        setOrden(lista.length + 1);
        setPaso(prevPaso => ({
            ...prevPaso,
            order: lista.length + 1
          }));
    },[lista])

    // function para los NUEVOS elementos a cargar o asignar
    function handleSubmitPaso(event) {
        event.preventDefault();
        console.log("add "+paso.order)
        addStep(paso); // llamada desde RecetaForm
        setPasoSubmit([...pasoSubmit, paso]); //array para ir mostrando
        setPaso({ order: orden+1, instruction: "" });
        setOrden(orden + 1);//incrementamos el orden
        setFormPaso(false);
       
    }
    // funcion para modificar los pasos anteriores
    function handleStepEditChange(event) {
        setStepsEdit({
            ...stepsEdit,
            [event.target.name]: event.target.value,
        });
    }
    function handleOnClickStepEdit(id, event) {
        // para modicar un paso debo de tener el orden del paso
        const [lista] = listStep.filter((step) => step.order === id);
        //console.log(lista); //paso inicial
        //console.log(stepsEdit); //campo modificado
        editStepInitial([lista, stepsEdit]);
    }
    function handleOnClickDelete(idEliminado){
        const listaUpdate=listStep.filter(step => step.id !== parseInt(idEliminado))
        // console.log(listaUpdate)
        setListStep(listaUpdate)//actualizando lista de ingredientes    
        // setOrden(listStep.length+1)    
        deleteStep(idEliminado)//mandamos el id a RecetaForm
    }

    return (
        <div className="container is-flex is-flex-direction-column">
            <div className="is-flex is-flex-direction-row is-justify-content-space-between mb-1">
                <label className="label has-text-white">Preparación: </label>
                <p
                    className="button custom "
                    style={{ width: "40px", heigth: "30px" }}
                    onClick={handleClick}
                >
                    +
                </p>
            </div>
            {paginaEdit ? (
            <div className="container-pasos mb-1">
                {listStep.length > 0
                        ? listStep.map((step, index) => (
                              <div
                                  key={index}
                                  className="is-flex is-flex-direction-row m-1"
                              >                                 
                                  <input
                                      className="input mr-1"
                                      type="number"
                                      name="order"
                                      value={step.order}
                                      style={{width:"5em"}}
                                    //   onChange={handleStepEditChange}
                                    //   required
                                      
                                  />
                                  <input
                                      className="input mr-1 "
                                      type="text"
                                      name="instruction"
                                    //   value={step.instruction}
                                      defaultValue={step.instruction}
                                      onChange={handleStepEditChange}
                                  />
                                  <p
                                      onClick={() => handleOnClickStepEdit(step.order)}
                                      className="button is-info mr-1"
                                  >
                                      <ion-icon name="create-outline"></ion-icon>
                                  </p>
                                  <p
                                      onClick={() => handleOnClickDelete(step.id)}
                                      className="button is-danger"
                                  >
                                      
                                      <ion-icon name="trash-outline"></ion-icon>
                                  </p>
                              </div>
                          ))
                        : null
                    }
            </div>
            ): null}
            <div className="b-1">
                <h3 style={{ color: "#49ff4f" }}>Agregados: </h3>
                {pasoSubmit.length > 0 && (
                    <div className="">
                        
                        {pasoSubmit.map((p, index) => (
                            <div key={index} className="columns m-1">
                                {/* <div className=""> */}
                                    <input
                                        className="input mr-1 column is-narrow"
                                        type="number"
                                        value={p.order}
                                        readOnly
                                        style={{width:"5em"}}
                                    />
                                    <input
                                        className="input column"
                                        type="text"
                                        value={p.instruction}
                                        readOnly
                                    />
                                {/* </div> */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {formPaso ? (
                <form className="form-ingredient mb-1" >
                    <div className="columns ">
                        <div className="control column is-narrow" style={{width:"5em"}}>
                            <input
                                    className="input m-1"
                                    type="number"
                                    min="1"
                                    name="order"
                                    value={orden}
                                    readOnly
                            />
                        </div>
                        <div className="control column">
                            <input
                                className="input m-1"
                                id="instruction"
                                name="instruction"
                                value={paso.instruction}
                                // defaultValue={paso.instruction}
                                onChange={handleStepChange}
                                placeholder="instruction"
                                required
                            />
                        </div>
                        
                        
                        <div className="control column is-narrow m-1"><button
                            type="submit"
                            className="button custom"
                            onClick={handleSubmitPaso} 
                        >
                            Agregar
                        </button></div>
                    </div>
                </form>
            ) : null}
        </div>
    );
}