import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const toLowerCase = (s) => s.toLowerCase()

function UserPage({ loggedUserName, token }) 
{
    const nav = useNavigate()
    const { username } = useParams()
    const [ifFollowed, setFollowed] = useState(false)
    const [userExists, setUserExists] = useState(false)
    const [userBio, setUserBio] = useState("")
    const [avatar, setAvatar] = useState(null)

    const getAvatarAndBio = async () =>
    {
      const url = `http://localhost:9603/api/${username}`
      const res = await axios.get(url)

      try {
        const image = res.data[0].image
        const bio = res.data[0].bio
        const blank = require('../blank-avatar.jpg')
        console.log("User info: ", image, blank, bio, image.startsWith("data"))

        setUserBio(bio)
        setAvatar(
          <img src={image.startsWith("data") ? image : blank} 
            style={{width: "120px", height: "120px", border: '2px solid lime', borderRadius: '50%'}} alt="Loading...">
          </img>)
      }
      catch (err)
      {
        console.log(err)
        setUserBio("")
        setAvatar(null)
        return
      }
    }

    const InfoBonner = userExists ? <div>{username}'s page</div> : <div>User does not exist</div>
    
    // Zapytanie o wzajemny follow
    useEffect(() => {

      getAvatarAndBio()
      
      const data = { username }

      console.log("Sending to check: ", data)
      const url = "http://localhost:9605/api/check"

      axios.post(url, data)
      .then((response) => {
        console.log(response);

        if (response.data.length === 1)
        {
          setUserExists(true)
          getMutualFollow()
        }
        else
        {
          setUserExists(false)
        }
      }, (error) => {
        console.log(error);
      });
    }, []);

    const getMutualFollow = () => {

      const data = { username, loggedUserName }

      console.log("Sending for follows: ", data)
      const url = `http://localhost:9601/api/check/${loggedUserName}&${username}`

      axios.get(url)
      .then((response) => {
        console.log(response);

        if (response.data.length === 1) // loggedUser follows username
        {
          setFollowed(true)
          getPosts();
        }
        else
        {
          setFollowed(false)
        }

        getPosts();

      }, (error) => {
        console.log(error);
      });
    }

    // Pobrane postów użytkownika {username}
    const [userPosts, setPosts] = useState([])
    const getPosts = () => {

      //console.log("Getting posts:")
      const url = `http://localhost:9602/api/allposts/${username}&100`

      axios.get(url)
      .then((response) => { // responde.data = posts

        console.log("Posts:\n ", response.data);

        const likePromises = response.data.map((ele) => getLikesForPost(ele.post_id));
        Promise.all(likePromises).then((likes) => { 
          setPosts(response.data.map((ele, i) => 
          <div style={{border: '2px solid black', padding: '4px', marginTop:'6px', width: "fit-content", maxWidth: "90vw", cursor: "pointer"}} 
            key={ele.post_id} onClick={() => nav("/post/" + ele.post_id)}>
            <img src={ele.image} style={{maxWidth: "90vw"}} alt="Loading..."></img><br/>
            <b>{ele.description}</b><div id={ele.post_id}>{likes[i]} likes.</div>
          </div> 
          ))
        })
      }, (error) => {
        console.log(error);
      });
    }

    // Pobranie ilosci reakcji pod postem
    const getLikesForPost = async (postid) => {
      
      const url = `http://localhost:9604/api/${postid}`
      //console.log(url)
      const res = await axios.get(url)
      try {
        const counter = res.data[0]["COUNT(*)"]
        //console.log(counter)
        return counter;
      }
      catch (error)
      {
        return 0;
      }
    }
    
    const followUser = () =>
    {
      const data = { username, loggedUserName, token }

      console.log("Sending follow: ", data)
      const url = "http://localhost:9601/api/"

      axios.post(url, data)
      .then((response) => {
        console.log(response);
        setFollowed(true)

      }, (error) => {
        console.log(error);
      });
    }

    const unfollowUser = () =>
    {
      const data = { username, loggedUserName, token }

      console.log("Sending unfollow: ", data)
      const url = "http://localhost:9601/api/delete"

      axios.post(url, data)
      .then((response) => {
        console.log(response);
        setFollowed(false)
        
      }, (error) => {
        console.log(error);
      });
    }

    const FollowButton = ifFollowed ? <button onClick={unfollowUser}>Unfollow</button> : <button onClick={followUser}>Follow</button>
    const ActionButton = toLowerCase(username) === toLowerCase(loggedUserName) ? <button onClick={() => nav("/settings")}>Settings</button> : FollowButton

    return (
      <div>
        {InfoBonner}<br/>
        {userExists ? <>{avatar}{userBio}{userBio ? <b> ~{username}</b> : ""}<br/></> : ""}
        {userExists ? <>{ActionButton}<br/></> : ""}
        <br/><button onClick={() => nav("/")}>Back to Wall</button><br/>
        {userPosts}
        <br/><br/>
      </div>
    );
  }
  
  export default UserPage;
  