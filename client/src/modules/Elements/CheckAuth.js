import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



export default function CheckAuth(){
  const [ token ,setToken] = useState(null);
  const navigate = useNavigate();
  useEffect(()=>{
    const gettoken = localStorage.getItem("user:token");
    setToken(gettoken);
  },[]);

  if(!token){
    return navigate("/");
  }
}