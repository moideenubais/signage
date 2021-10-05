const express = require("express");
const router = express.Router();

const playlist = require("../controllers/playlist");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const policy = require("../policies/policy");

router
  .route("/")
  .all(auth, policy.isAllowed)
  .get(playlist.getPlaylists)
  .post(playlist.postPlaylist);

router
  .route("/:id")
  .all(validateObjectId, auth, policy.isAllowed)
  .get(playlist.getSinglePlaylist)
  .put(playlist.updatePlaylist)
  .delete(playlist.deletePlaylist);

module.exports = router;
