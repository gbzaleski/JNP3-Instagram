import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const POST404 = "Post does not exist";

function ShowPost({ loggedUserName, token }) 
{
  const nav = useNavigate()
  const { postid } = useParams()
  const [thisPost, setPost] = useState(null)
  const [comments, setComments] = useState(null)
  const [newCommentContent, setNewCommentContent] = useState("")
  const [isPostLiked, setPostLiked] = useState(false)
  const [reset, exececuteReset] = useState(0)

  // Pobranie informacji o poscie tj. zdjęcie, lajki, komentarze.
  useEffect(() => {

  const url3 = `http://localhost:9604/api/check/${postid}&${loggedUserName}`
  axios.get(url3)
    .then((response) => {
      console.log("Check liked: ", response);

      if (response.data.length === 1) // loggedUser liked postid
      {
        setPostLiked(true)
      }
      else
      {
        setPostLiked(false)
      }
    }, (error) => {
      console.log(error);
    }); 

  const url = `http://localhost:9602/api/post/${postid}`
  axios.get(url)
    .then((response) => { // responde.data = posts

      console.log("Post:\n ", response.data);
      if (response.data.length === 0)
      {
        setPost(POST404)
        return;
      }

      // Wczytanie zdjęcia
      const lro = async(ele) => {

        const url2 = `http://localhost:9604/api/${ele.post_id}`
        const res = await axios.get(url2)
        let counter;
        try 
        {
          counter = res.data[0]["COUNT(*)"]
        }
        catch (error)
        {
          counter = 0;
        }

        setPost(
        <div style={{marginTop:'6px', width: "fit-content", maxWidth: "90vw"}} key={ele.post_id}>
          <img src={ele.image} style={{maxWidth: "90vw"}} alt="Loading..."></img><br/>
          <b>{ele.description}</b><div id={ele.post_id}>{counter} likes.</div>
        </div> 
        )
      }

      // Wczytanie komentarzy 
      const lco = async(postid) =>
      {
        const url2 = `http://localhost:9600/api/${postid}`
        axios.get(url2)
        .then((response) => {
          console.log("Comments: ", response.data);

          setComments(response.data.map((ele, i) => {
            return (
            <div style={{border: '2px solid black', padding: '2px', marginTop:'4px', width: "fit-content", hight: "fit-content", maxWidth: "90vw"}} key={i}>
              <b>{ele.username}: </b>{ele.content}
            </div>) 
          }))          
  
        }, (error) => {
          console.log(error);
        });

      }

      lro(response.data[0]);
      lco(response.data[0].post_id);
    }

    ,(error) => {
    console.log(error);
    });



  }, [reset]);


  const likePost = () => {
    const data = {loggedUserName, postid, token}
    const url = "http://localhost:9604/api/add"
    console.log("Liking post: ", data)

    axios.post(url, data)
      .then((response) => {
        
        console.log(response);
        exececuteReset(reset + 1)

      }, (error) => {
        console.log(error);
      });
  }
  const likeButton = <button onClick={likePost}>Like</button>

  const unLikePost = () =>
  {
    const data = {loggedUserName, postid, token}
    const url = "http://localhost:9604/api/delete"
    console.log("Unliking post: ", data)

    axios.post(url, data)
    .then((response) => {
      
      console.log(response);
      exececuteReset(reset + 1)

    }, (error) => {
      console.log(error);
    });
  }
  const unLikeButton = <button onClick={unLikePost}>Unlike</button>
  
  const commentOnPost = () =>
  {
    if (newCommentContent === "")
      return

    const data = {loggedUserName, postid, newCommentContent, token}
    const url = "http://localhost:9600/api/add"
    console.log("Adding comment: ", data)

    axios.post(url, data)
    .then((response) => {
      
      console.log(response);
      setNewCommentContent("")
      alert("Comment added")
      exececuteReset(reset + 1)

    }, (error) => {
      console.log(error);
    });
  }

    return (
      <>
        {thisPost === POST404 ? 
          thisPost 
          : 
          <>
          {thisPost}
          {isPostLiked ? unLikeButton : likeButton}<br/>
          {comments}
          <textarea
            type="text"
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
          />
          <button onClick={commentOnPost}>Post comment</button>
          </>
        }
        <br/><button onClick={() => nav("/")}>Go back</button>
      </>
    );
  }
  
  export default ShowPost;
  