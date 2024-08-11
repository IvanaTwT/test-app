import { useEffect, useState } from "react";
import useFetch from "./hooks/useFetch";
import { useNavigate } from "react-router-dom";

export default function HomeCategory() {
    //get id y nombre, 
    const [categories, setCategories] = useState([]);
    const [cont, setCont]= useState(1)
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

    useEffect(()=>{
        if(dataCategories){
            const categorias = dataCategories.results
            // console.log(...categorias)
            setCategories((prevCat) => [...prevCat, ...categorias]);

            if (dataCategories.next) {
                setCont((sumContador) => sumContador + 1)
            }
        }
    },[dataCategories])
    return (
        <>
            {categories.length > 0 ? (
                categories.map((cat,index) => (
                    <div key={index} className={`mr-3`} onClick={() => navigate(`/categories/${cat.id}`)} style={{ cursor: "pointer"}}>
                        <div className="">
                            <figure className="image is-128x128">
                                <img
                                    // className="is-rounded"
                                    style={{borderRadius:"50%"}}
                                    src={`src/assets/img/${cat.name.toLowerCase()}.jpg`}
                                    alt="Rounded image"
                                />
                            </figure>
                        </div>
                        <div className=" has-text-centered">
                            <h3 className="has-text-dark">{cat.name.toUpperCase()}</h3>
                        </div>
                    </div>
                ))
            ): <div></div>}
        </>
    );
}
