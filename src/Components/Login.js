import React, {useState, useEffect} from "react";
import "./Login.css"


function Login () {
    
    return (
        <div className="Login">
            <h1 className="Title">YOUR MUSIC PLAYER</h1>
            <h1 className="Title2">LOGIN</h1>
            <a href="http://127.0.0.1:5000/auth/login" className="LoginLink">
                <button className="LoginButton">Connect Spotify</button>
            </a>
        </div>
    )
}


export default Login;