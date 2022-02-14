const express = require('express');
const router = express.Router();
const redis = require('ioredis');
const { promisify } = require("util");

const DatabaseManager = require('../../utils/DatabaseManager');
const manager = new DatabaseManager();
manager.init_db();


const client = redis.createClient({host: 'redis', port: 6379});
const redisGet = promisify(client.get).bind(client);
const redisSetex = promisify(client.setex).bind(client);

const REDIS_EXPIRE = 600

function format_data(data)
{
  return data.slice(1)
}

function http_response(res, data) 
{
  if(data[0]['success'] == 'true')
    res.status(200).json(format_data(data));
  else
    res.status(400).send(format_data(data));
}

// Returns the token associated with the username.
// The post data should contain fields 'username' and 'password'
router.post('/login', async function(req, res)
{
  http_response(res, await manager.get_token(req.body["username"], req.body["password"]))
});

// Check if the token is valid.
// Upon a succcessful call the username is returned.
router.post('/auth', async function(req, res)
{
  try
  {
    const cached = await redisGet(req.body["token"]);
    
    if (cached)
    {
      http_response(res, JSON.parse(cached));
    }
    else
    {
      const uname = await manager.user_by_token(req.body["token"]);
      redisSetex(req.body["token"], REDIS_EXPIRE, JSON.stringify(uname));
      http_response(res, uname);
    }
  }
  catch {
    res.status(500).send();
  }
});

// Check if user exists
// Upon a succcessful call the username is returned.
router.post('/check', async function(req, res)
{
  http_response(res, await manager.check_username(req.body["username"]))
});

// New user
// The post data should contain fields 'username' and 'password'
router.post('/register', async function(req, res)
{
  http_response(res, await manager.create_user(req.body["username"], req.body["password"]))
});


module.exports = router;
