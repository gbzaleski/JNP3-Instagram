const express = require('express');
const router = express.Router();
const redis = require('ioredis');
const { promisify } = require("util");

const DatabaseManager = require('../../utils/DatabaseManager');
const manager = new DatabaseManager();

const client = redis.createClient({host: 'redis', port: 6379});
const redisGet = promisify(client.get).bind(client);
const redisSetex = promisify(client.setex).bind(client);
const redisDel = promisify(client.del).bind(client);

const REDIS_EXPIRE = 600


manager.init_db();

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

// Post By ID
router.get('/post/:postid', async function(req, res)
{
  try
  {
    const cached = await redisGet(`postid-${req.params.postid}`);

    if (cached)
    {
      http_response(res, JSON.parse(cached));
    }
    else
    { 
      const uname = await manager.get_post(req.params.postid);
      redisSetex(`postid-${req.params.postid}`, REDIS_EXPIRE, JSON.stringify(uname));

      http_response(res, uname);
    }
  }
  catch {res.status(500).send();}
});

// Get up to 'limit' posts created by the user
// Variables limit and username must be provided as the query string parameters.
router.get('/allposts/:username&:limit', async function(req, res)
{
  try
  {
    const cached = await redisGet(`allposts-${req.params.username}`);

    if(cached)
    {
      http_response(res, JSON.parse(cached));
    }
    else
    {
      const uname = await manager.get_posts(req.params.username, req.params.limit);
      redisSetex(`allposts-${req.params.username}`, REDIS_EXPIRE, JSON.stringify(uname));

      http_response(res, uname);
    }
  }
  catch {res.status(500).send()}
});

// Create A Post
router.post('/upload', async function(req, res)
{
  try
  {
    redisDel(`allposts-${req.body["loggedUserName"]}`);
    http_response(res, await manager.create_post(req.body["loggedUserName"], req.body["encodedPhoto"], req.body["description"]));
  }
  catch {res.status(500).send()}
});



module.exports = router;
