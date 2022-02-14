const express = require('express');
const router = express.Router();

const DatabaseManager = require('../../utils/DatabaseManager');
const manager = new DatabaseManager();
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

function parse_follows(data)
{
  if(data[0]['success'] == 'true')
    for(let i = 1; i < data.length; i++)
      data[i] = data[i]['follows'];

  return data[0]['success'] == 'true' ? 
    [data[0], {'follows': data.slice(1)}] : data;
}

// Get follows 
router.get('/:username', async function(req, res)
{
  http_response(res, parse_follows(await manager.get_folllows(req.params.username)));
});

// Add a 'follows'
// Variables 'follows' and 'username' should be passed in the JSON format.
router.post('', async function(req, res)
{
  http_response(res, await manager.add_follows(req.body["loggedUserName"], req.body["username"]));
});

// Check if followed
router.get('/check/:loggedUserName&:username', async function(req, res)
{
  http_response(res, await manager.checkfollow(req.params.loggedUserName, req.params.username));
});

// Delete follows
// Variables 'follows' and 'username' should be passed in the JSON format.
router.post('/delete', async function(req, res)
{
  http_response(res, await manager.delete_follows(req.body["loggedUserName"], req.body["username"]));
});


module.exports = router;
