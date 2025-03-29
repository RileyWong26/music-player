import React, {useState, useEffect} from "react";
import "./Style/Device.css"


function Device(props){
    return(
        <div className="Device">
            {props.type}, {props.name}
        </div>
    );
}

export default Device;