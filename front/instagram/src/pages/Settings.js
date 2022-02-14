import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SIZE_LIMIT_MB = 50;

function Settings({ loggedUserName, token }) 
{
    const nav = useNavigate()
    const myLink = "/user/" + loggedUserName;
    const [photo, setPhoto] = useState(null)
    const [newBio, setNewBio] = useState("")

    // Wysyłanie updejtu do mikroserwisa od danych o profila

    const handleSubmitAvatar = (e) =>
    {
      e.preventDefault();

      if (photo.size > SIZE_LIMIT_MB * 1024 * 1024)
      {
        setPhoto(null)
        alert("Photo too large!")
        return
      }

      const reader = new FileReader();
      reader.onloadend = function() {
        const encodedPhoto = reader.result

        const data = { loggedUserName, encodedPhoto, token }
        console.log("Updating avatar: ", data)

        const url = "http://localhost:9603/api/updateavatar"

        axios.patch(url, data)
          .then((response) => {
          console.log(response);

          alert("Avatar updated")
          nav(myLink)
        }, (error) => {

        alert("Error!")
        console.log(error);
        setPhoto(null)
        });
      }

      reader.readAsDataURL(photo);
    }

    const handleSubmitBio = (e) =>
    {
      e.preventDefault();
      if (newBio === "")
        return

        const data = { loggedUserName, newBio, token }
        console.log("Updating bio: ", data)

        const url = "http://localhost:9603/api/updatebio"

        axios.patch(url, data)
        .then((response) => {
          console.log(response);

          alert("Bio updated")
          nav(myLink)
        }, 

        (error) => {
          alert("Error!")
          console.log(error);
          setPhoto(null)
        });
    }

    return (
      <div>
        <h2>Settings</h2>
        <form onSubmit={handleSubmitBio}>
        <textarea
                type="text"
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
            />
            <br/>
            <button>Update Bio</button>
        </form>
        <br/>
        <form onSubmit={handleSubmitAvatar}>
        <input
                type="file"
                required
                accept=".png, .jpg, .jpeg"
                onChange={(e) => setPhoto(e.target.files[0])}
            />
            <br/>
            <button>Update profile picture</button>
        </form>
        <br/>
        <button onClick={() => nav(myLink)}>Return</button>
      </div>
    );
  }
  
  export default Settings;
  