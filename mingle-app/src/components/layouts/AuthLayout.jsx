import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router";
import { LinearProgress } from "@mui/material";
import { useSelector } from 'react-redux';

export default function AuthLayout({auth}) {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const authStatus = useSelector((state)=>state.auth.status);
    
    useEffect(()=>{

        if((auth === true) && (authStatus !== auth)){
            navigate("/login");
        }
        else if((auth === false) && (authStatus !== auth)){
            navigate("/feed");
        }
        setLoading(false);
      
    },[authStatus, navigate, auth])

    if(loading)
    {
        return(
            <LinearProgress color="secondary"/>
        )
    }

    return (
        <>
            <Outlet/>
        </>
    )
}