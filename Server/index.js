const express = require('express');
const dotenv = require('dotenv');
const request = require('request');
const cors = require('cors')

const port = 5000

dotenv.config()

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET

var app = express();

var access_token_player;
var access_token_profile;

var generateRandomString = function(length) {
    var text = '';
    var possible = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for(let i = 0; i<length; i++){
        text += possible.charAt(Math.floor(Math.random()*possible.length));
    }
    return text;
};

// ------ USE CORS -----
app.use(cors());


// ---- AUTHENTICATE LOGIN --------
app.get('/auth/login', (req, res)=>{
    var scope = "streaming \
    user-read-email\
     user-read-private"

    var state = generateRandomString(16);

    var auth_query_params = new URLSearchParams({
        response_type: "code",
        client_id: spotify_client_id,
        scope: scope,
        redirect_uri : 'http://127.0.0.1:5000/auth/callback',
        state: state,
    })

    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_params.toString());

})


// ----- LOGGING IN, GETTING THE USER TOKEN AND PUSHING TO AN API -------------
app.get('/auth/callback', (req, res) => {
    var code = req.query.code;
    
    var auth_opts = {
        url: "https://accounts.spotify.com/api/token",
        method: "POST",
        form: {
            code: code,
            redirect_uri:"http://127.0.0.1:5000/auth/callback",
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization':'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials',
        json: true
    };

    request.post(
        auth_opts, 
        function(error, response, body){
            if(!error && response.statusCode === 200){
                access_token_player = body.access_token;
                res.redirect('http://127.0.0.1:5000/auth/login/user')
        }
    });
});


// --- AUTHENTICATE THE USER -----
const code_verifier = generateRandomString(64)
app.get('/auth/login/user', async (req, res)=>{
    
    const base64 = async(input) =>{
        const data = new TextEncoder().encode(input);
        const digest = await crypto.subtle.digest('SHA-256', data)
        return btoa(String.fromCharCode.apply(null,[...new Uint8Array(digest)]))
            .replace(/=+$/, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    }
    
    const codechallenge = await base64(code_verifier)
    const state = generateRandomString(16)
    const scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state'

    var auth_query_params = new URLSearchParams({
        client_id: spotify_client_id,
        response_type: 'code',
        redirect_uri: 'http://127.0.0.1:5000/auth/callback/user',
        scope: scope,
        code_challenge_method : 'S256',
        code_challenge : codechallenge,
        state: state
    })

    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_params.toString());

})

// --------- CALLBACK FOR USER PROFILE -------
app.get('/auth/callback/user', (req,res) =>{
    var code = req.query.code;
    
    // ----- ACCESS TOKEN FOR USER'S PROFILE ------------
    fetch('https://accounts.spotify.com/api/token', {
        method: "POST",
        headers: {
            "Content-Type":"application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            client_id: spotify_client_id,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'http://127.0.0.1:5000/auth/callback/user',
            code_verifier: code_verifier
        })
    })
    .then(response=>response.json())
    .then(data => access_token_profile = data.access_token)
    .catch(error => console.log('error',error))
    res.redirect('http://127.0.0.1:3000')
})



// ---- API FOR TOKEN ------
app.get('/auth/token', (req,res) =>{
    res.json(
        {
            access_token_player: access_token_player,
            access_token_profile: access_token_profile
        }
    )
})




app.listen(port, () => {
  console.log(`Listening at http://127.0.0.1:${port}`)
})
