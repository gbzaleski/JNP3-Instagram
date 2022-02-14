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

// Get reactions under the post
router.get('/:id', async function(req, res)
{
  http_response(res, await manager.get_count(req.params.id));
});

// Get reactions under the post
router.get('/check/:postid&:username', async function(req, res)
{
  http_response(res, await manager.check_reactions(req.params.postid, req.params.username));
});

// Add a reaction
// Variables 'post_id' and 'username' should be passed in the JSON format.
router.post('/add', async function(req, res)
{
  http_response(res, await manager.add_reaction(req.body["loggedUserName"],  req.body["postid"]));
});

// Delete reaction
// Variables 'post_id' and 'username' should be passed in the JSON format.
router.post('/delete', async function(req, res)
{
  http_response(res, await manager.delete_reaction(req.body["loggedUserName"], req.body["postid"]));
});


module.exports = router;
