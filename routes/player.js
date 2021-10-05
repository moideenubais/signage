const express = require("express");
const router = express.Router();

const player = require("../controllers/player");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const policy = require("../policies/policy");

router
  .route("/")
  // .all(auth, policy.isAllowed)
  .get([auth, policy.isAllowed], player.getPlayers)
  .post(player.postPlayer)
  .put([auth, policy.isAllowed], player.createPlayerContent);

router
  .route("/getMedia")
  // .all(auth, policy.isAllowed)
  .get(player.getPlayerMedia);

router
  .route("/:id")
  .all(validateObjectId, auth, policy.isAllowed)
  .get(player.getSinglePlayer)
  .put(player.updatePlayer)
  .delete(player.deletePlayer);

module.exports = router;
