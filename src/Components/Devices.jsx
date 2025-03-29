import React, {useState, useEffect} from "react";

function Devices(props){
    const profile_token = props.profile_token;
    const [device, setDevice] = useState([]);


    const devices = async() => {
        props.devices
        .then(data => setDevice(data.devices))
        .catch(error => console.log(error));
    }

    const deviceList = device.map((device) => <p key={device.id}>{device.name}</p>);

    return(
        <div>
            DEVICES
            <button onClick={() => devices()}>Clickeer</button>
            <button onClick={() => console.log(device)}>Clickeer2</button>

            {deviceList}
        </div>
    )
}

export default Devices;