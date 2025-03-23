import logo from './logo.svg';
import './App.css';
import Login from './Components/Login';
import Player from './Components/Player';
import React, {useState, useEffect} from 'react';

function App() {
  var [tokens, setTokens] = useState({});
  
  useEffect(()=>{

    async function getToken(){
      fetch('http://127.0.0.1:5000/auth/token', {
        mode: 'cors'
      })
        .then(response => response.json())
        .then(data => setTokens(data))
        .catch(error => console.log(error));

    }

    getToken();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {(Object.keys(tokens).length === 0) ? <Login /> : <Player player_token={tokens.access_token_player} profile_token={tokens.access_token_profile}/>}
        <button onClick={()=> { console.log(Object.keys(tokens))}}>hiii </button>
      </header>
    </div>
  );
}

export default App;
