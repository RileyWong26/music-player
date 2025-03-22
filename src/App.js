import logo from './logo.svg';
import './App.css';
import Login from './Components/Login';
import Player from './Components/Player';
import React, {useState, useEffect} from 'react';

function App() {
  var [token, setToken] = useState('');
  
  useEffect(()=>{

    async function getToken(){
      fetch('http://127.0.0.1:5000/auth/token', {
        mode: 'cors'
      })
        .then(response => response.json())
        .then(data => setToken(data.access_token))
        .catch(error => console.log(error));

    }

    getToken();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {(token === '') ? <Login /> : <Player token={token} />}
        <button onClick={()=> {console.log(token)}}>hiii </button>
      </header>
    </div>
  );
}

export default App;
