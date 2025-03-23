import React,{useEffect, useState} from "react";

const cb = require('cb');



function Player(props) {

    const player_token = props.player_token;
    const profile_token = props.profile_token;

    const [player, setPlayer] = useState(undefined)

    useEffect(() => {
        
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () =>{

            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(player_token); },
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

    // ---- USER DATA ----
    var user = () => {
        fetch('https://api.spotify.com/v1/me', {
            method: 'GET',
            headers:{
                Authorization: 'Bearer ' + profile_token
            }
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.log(error));
    }
    // --- DEVICE DATA 
    var device = () => {
        fetch('https://api.spotify.com/v1/me/player/devices', {
            method: 'GET',
            headers:{
                Authorization: 'Bearer ' + profile_token
            }
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.log(error));
    }
    return(
        <div>
            Logged in
            <button onClick={user}>User</button>
            <button onClick={device}>device</button>
        </div>
    )

}

export default Player;