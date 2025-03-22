import React,{useEffect, useState} from "react";

const cb = require('cb');



function Player(props) {

    const [player, setPlayer] = useState(undefined)

    useEffect(() => {
        
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () =>{

            const token = props.token
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({device_id})=>{
                console.log('Ready with device id', device_id)
            });

            player.addListener('not_ready', ({device_id})=>{
                console.log('Not ready with device ', device_id)
            });

            player.connect();
        };
    }, []);


    const devices = () => {
        
    }

    return(
        <div>
            Logged in
            <button>Devices</button>
        </div>
    )

}

export default Player;