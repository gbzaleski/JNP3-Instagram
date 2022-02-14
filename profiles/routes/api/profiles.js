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

// Profile By Username
router.get('/:username', async function(req, res)
{
  http_response(res, await manager.get_profle(req.params.username));
});

// Create A Profile
router.post('/create', async function(req, res)
{
  http_response(res, await manager.create_profile(req.body["loggedUserName"], req.body["image"], req.body["bio"]));
});

// Update avatar
router.patch('/updateavatar', async function(req, res)
{
	http_response(res, await manager.update_avatar(req.body["loggedUserName"], req.body["encodedPhoto"]));
});

// Update bio
router.patch('/updatebio', async function(req, res)
{
  const v = await manager.update_bio(req.body["loggedUserName"], req.body["newBio"])
	http_response(res, v);
});


module.exports = router;
