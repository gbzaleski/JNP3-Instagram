import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

function Wall({ loggedUserName, logOut }) 
{
    const nav = useNavigate()
    const myLink = "/user/" + loggedUserName
    const [nextPage, setNextPage] = useState("")
    const [wallPosts, setPosts] = useState([])

    // Pobranie postów uzytkownika:
    const getAllPosts = async (username) => {

      const url2 = `http://localhost:9602/api/allposts/${username}&100`
      //console.log("Post of ", username, " ", url2)
      const res = await axios.get(url2)
      try 
      {
        return res.data
      }
      catch (error)
      {
        return [];
      }
    }

    // Pobranie like'ów dla posta
    const getLikesForPost = async (postid) => {
      
      const urll = `http://localhost:9604/api/${postid}`
      const res = await axios.get(urll)
      try {
        const counter = res.data[0]["COUNT(*)"]
        return counter;
      }
      catch (error)
      {
        return 0;
      }
    }

    useEffect(() => {

        // Zapytanie o followuwanych
        const url = `http://localhost:9601/api/${loggedUserName}`
        axios.get(url)
        .then((response) => {
          
          const follows = response.data[0].follows;
          console.log("Followed: ", follows)
          const getPosts = follows.map((ele) => getAllPosts(ele));

          // Zapytanie o ich posty
          Promise.all(getPosts).then((posts) => { 

            const allposts = [].concat.apply([], posts).sort((a, b) => (a.post_id > b.post_id ? -1 : 1))
            console.log("All posts: ", allposts)
            
            // Zapytanie o reakcje
            const likePromises = allposts.map((ele) => getLikesForPost(ele.post_id));

            // Wstawienie tych postów
            Promise.all(likePromises).then((likes) => { 
              console.log("All likes: ", likes)

              setPosts(allposts.map((ele, i) => 
              <div style={{border: '2px solid black', padding: '4px', marginTop:'6px', width: "fit-content", maxWidth: "90vw", cursor: "pointer"}} 
                key={ele.post_id} onClick={() => nav("/post/" + ele.post_id)}>
                <img src={ele.image} style={{maxWidth: "90vw"}} alt="Loading..."></img><br/>
                <b>{ele.description}</b><div id={ele.post_id}>{likes[i]} likes.</div>
              </div> 
              ))
            })
          })

        }, (error) => {
          console.log(error);
        });
        
    }, []);

    return (
      <div>
        <h2>{loggedUserName}'s wall</h2>
        <button  onClick={logOut}>Log out</button>
        <br />
        <button onClick={() => nav(myLink)}>My profile</button>
        <br />
        <input
            type="text"
            required
            placeholder="Explore pages"
            value={nextPage}
            onChange={(e) => setNextPage(e.target.value)}
        />
        <button onClick={() => nav("user/" + nextPage.toLowerCase())}>Go</button>
        <br />
        <button onClick={() => nav("addPost/")}>Post photo</button>
        <br/>
        {wallPosts}
      </div>
    );
  }
  
  export default Wall;
  