import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SIZE_LIMIT_MB = 50;

function AddPost({ loggedUserName, token }) 
{
    const nav = useNavigate()
    const [photo, setPhoto] = useState(null)
    const [description, setDescription] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();

        if (photo.size > SIZE_LIMIT_MB * 1024 * 1024)
        {
          setDescription("")
          setPhoto(null)
          alert("Photo too large!")
          return
        }

       const reader = new FileReader();
       reader.onloadend = function() {
        const encodedPhoto = reader.result

        const data = { loggedUserName, encodedPhoto, description, token }
        console.log("Posting: ", data)

        const url = "http://localhost:9602/api/upload"
        
        axios.post(url, data)
        .then((response) => {
          console.log(response);

          alert("Photo uploaded!")
          nav("/user/" + loggedUserName)
        }, (error) => {

          console.log(error);
          alert("Error occurred!")
          setDescription("")
          setPhoto(null)
        });

       }
       reader.readAsDataURL(photo);
    }

    return (
      <div>
        <h2>Add Post Form</h2>
        <form onSubmit={handleSubmit}>
            <label>Photo:</label>
            <input
                type="file"
                required
                accept=".png, .jpg, .jpeg"
                onChange={(e) => setPhoto(e.target.files[0])}
            />
            <br/>
            <label>Description:</label>
            <textarea
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <br/>
            <button>Upload</button>
            <br />
            <button onClick={() => nav("/")}>Cancel</button>
        </form>
      </div>
    );
  }
  
  export default AddPost;
  