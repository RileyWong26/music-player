import React, {useState, useEffect} from "react";

function Devices(props){
    const profile_token = props.profile_token;

    const devices = async() => {
        props.devices
        .then(data => console.log(data))
        .catch(error => console.log(error));
    }

    return(
        <div>
            DEVICES
            <button onClick={() => console.log(devices())}>Clickeer</button>
        
        </div>
    )
}

export default Devices;