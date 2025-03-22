const express = require('express');
const dotenv = require('dotenv');
const request = require('request');

const port = 5000

dotenv.config()

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET

var app = express();

var access_token;

var generateRandomString = function(length) {
    var text = '';
    var possible = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for(let i = 0; i<length; i++){
        text += possible.charAt(Math.floor(Math.random()*possible.length));
    }
    return text;
};

app.get('/auth/login', (req, res)=>{
    var scope = "streaming \
    user-read-email\
     user-read-private"

    var state = generateRandomString(16);

    var auth_query_params = new URLSearchParams({
        response_type: "code",
        client_id: spotify_client_id,
        scope: scope,
        redirect_uri : 'http://127.0.0.1:3000/auth/callback',
        state: state,
    })

    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_params.toString());

})

app.get('/auth/callback', (req, res) => {
    var code = req.query.code;
    
    var auth_opts = {
        url: "https://accounts.spotify.com/api/token",
        method: "POST",
        // form: {
        //     code: code,
        //     redirect_uri:"http://127.0.0.1:3000/auth/callback",
        //     grant_type: 'authorization_code'
        // },
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
            console.log(error, response.statusCode, body);
            if(!error && response.statusCode === 200){
                access_token = body.access_token;
                res.redirect('http://127.0.0.1:3000')
        }
    });
});

app.get('/auth/token', (req,res) =>{
    res.json(
        {
            access_token: access_token
        }
    )
})


app.listen(port, () => {
  console.log(`Listening at http://127.0.0.1:${port}`)
})
