import useFetch from "../hooks/useFetch";
import { useEffect, useState } from "react";
import RecetaCard from "./RecetaCard";
import { useAuth } from "../contexts/AuthContext";

export default function RecetasMias() {
    const { user__id } = useAuth("state");
    

    return (
        <div className="columns is-multiline recetas m-1">
            
        </div>
    );
}