import React, {useState, useEffect} from "react";
import "./Login.css"


function Login () {
    
    return (
        <div className="Login">
            <h1 className="Title">LOGIN</h1>
            <a href="http://127.0.0.1:5000/auth/login" className="LoginButton">
                <button >Login using spotify <span>Premium required</span></button>
            </a>
        </div>
    )

}


export default Login;