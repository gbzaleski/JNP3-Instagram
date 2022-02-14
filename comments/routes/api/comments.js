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

// Get comments under the post
router.get('/:id', async function(req, res)
{
  http_response(res, await manager.get_comments(req.params.id));
});

// Add a comment
// Variables 'text', 'post_id' and 'username' should be passed in the JSON format.
router.post('/add', async function(req, res)
{
  http_response(res, await manager.add_comment(req.body["loggedUserName"], req.body["postid"], req.body["newCommentContent"]));
});


module.exports = router;
