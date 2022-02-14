import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const toLowerCase = (s) => s.toLowerCase()

function Login({time, setloggedUserName, setToken}) 
{
    //<br/><Link to="/addPost">Dodaj post</Link> // Testowy link wewntarz komponentu (działa)
    const [errorMessage, setErrorMessage] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const nav = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = { username, password } // Tu można dostawić hashowanie

        console.log("Sending: ", data)
        const url = "http://localhost:9605/api/login"

        axios.post(url, data)
        .then((response) => {
          console.log(response);

          if (response.data.length === 1)
          {
            const user = response.data[0]
            console.log("Logged: ", user)
            setloggedUserName(user.username)
            setToken(user.token)
            nav("/")
          }
          else
          {
            setErrorMessage("Wrong credentials!")
            setPassword("")
          }
        }, (error) => {
          console.log(error);

          setErrorMessage("Error on connection!")
          setPassword("")
        });
      }

    return (
      <div>
         {time} <br/> Login Form
         <form onSubmit={handleSubmit}>
            <label>Username:</label>
            <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(toLowerCase(e.target.value))}
            />
            <label>Password:</label>
            <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {errorMessage ? <br/> : ""}
            {errorMessage}
            <br/><button>Log in</button>
        </form>
        <button onClick={() => nav("register/")}>Register</button>
      </div>
    );
  }
  
  export default Login;
  