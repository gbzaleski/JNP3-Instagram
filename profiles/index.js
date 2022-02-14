const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 8080;
const cors = require('cors');

const SIZE_LIMIT = '50mb'
const AUTH_URL = "http://users:8080/api/auth";
const LOGGED_USER = 'loggedUserName';

app.use(cors({"origin": "*"}))

app.use(express.json({limit: SIZE_LIMIT}))

async function get_token_username(token) {
  return  (await axios.post(AUTH_URL, {'token': token})).data[0]['username'];
}

async function validate_token(data){
try
  {
    return data[LOGGED_USER] === await get_token_username(data['token']);
  }
  catch 
  {
    return false;
  }
}

app.use(async function(req, res, next) {
  if (req.method == 'GET' || await validate_token(req.body))
    next();
  else
      res.status(403).send();
});

app.use('/api', require('./routes/api/profiles'));

// Listen
app.listen(PORT)
