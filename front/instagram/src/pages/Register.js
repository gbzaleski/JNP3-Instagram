import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const toLowerCase = (s) => s.toLowerCase()

function Register({ time }) 
{
    const [errorMessage, setErrorMessage] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const nav = useNavigate()

    const createProfile = () => {

      // Wziecie tokena
      const data = { username, password }

      console.log("Sending: ", data)
      const url = "http://localhost:9605/api/login"

      axios.post(url, data)
      .then((response) => {
        
        const userinfo = response.data[0]
        const token = userinfo.token
        const image = "Default image"
        const bio = "Default bio"
        const loggedUserName = username

        // Stworzenie profilu dla nowego uzytkownika
        const datap = { loggedUserName, image, bio, token }
        console.log("Info for new profile ", userinfo, datap);
        const urlp = "http://localhost:9603/api/create"

        axios.post(urlp, datap)
        .then((response) => {

        console.log("Created profile ", response)

        }, (error) => {
          console.log(error);
        });

        
      }, (error) => {
        console.log(error);
      });
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const data_check = { username }
        console.log("Sending to check: ", data_check)
        const url_check = "http://localhost:9605/api/check"

        axios.post(url_check, data_check)
        .then((response) => {
          console.log(response);

          if (response.data.length !== 0)
          {
            setErrorMessage("User already exists!")
            setPassword("")
            return;
          }
          else // user does not exists
          {
            const data = { username, password } // Tu można dostawić hashowanie

            console.log("Registering: ", data)
            const url = "http://localhost:9605/api/register"

            axios.post(url, data)
            .then((response) => {
              console.log(response);

              createProfile();           

              alert("Successfully created account!")
              nav("/login")
            }, (error) => {

              console.log(error);
              setErrorMessage("Error occured!")
              setPassword("")
            });
              }
          }, (error) => {
            console.log(error);
            setErrorMessage("Error occured!")
            setPassword("")
        });
      }

    return (
      <div>
         {time} <br/> Registry Form
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
            {errorMessage}
            <br/><button>Register</button>
        </form>
      </div>
    );
  }
  
  export default Register;
  