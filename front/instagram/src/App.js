import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Wall from './pages/Wall';
import Login from './pages/Login';
import AddPost from './pages/AddPost';
import Settings from './pages/Settings';
import UserPage from './pages/UserPage';
import ShowPost from './pages/ShowPost';
import Register from './pages/Register';

import { useState } from 'react';

function App() 
{
  const [loggedUserName, setloggedUserName] = useState("");
  const [loggedToken, setToken] = useState("");


  const today = new Date()
  const [tim, setT] = useState(today.toString())

  const logOut = () => {
    alert("Logged out!")
    setloggedUserName("")
    setToken("")
  }

  return (
    loggedUserName ?
      (<><h1>INSTAGRAMME</h1><Router>
        <Routes>
          <Route path='/' element={<Wall loggedUserName={loggedUserName} logOut={logOut} token={loggedToken} />} />
          <Route path='/addPost' element={<AddPost loggedUserName={loggedUserName} token={loggedToken} />} />
          <Route path='/settings' element={<Settings loggedUserName={loggedUserName} token={loggedToken} />} />

          <Route path='/user/:username' element={<UserPage loggedUserName={loggedUserName} token={loggedToken} />} />
          <Route path='/post/:postid' element={<ShowPost loggedUserName={loggedUserName} token={loggedToken} />} />
          
          <Route path='*' element={<Wall loggedUserName={loggedUserName} logOut={logOut} token={loggedToken} />}></Route>
        </Routes>
      </Router></>) 
      :
      (<Router>
        <Routes>
          <Route path='register/' element={<Register time={tim} />} />
          <Route path='*' element={<Login time={tim} setloggedUserName={setloggedUserName} setToken={setToken} />} />
        </Routes>
      </Router>)
  )
}

export default App;
