const express = require("express");
const router = express.Router();

const group = require("../controllers/group");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const policy = require("../policies/policy");

router
  .route("/").all(auth, policy.isAllowed)
  .get(group.getGroups)
  .post(group.postGroup);

router
  .route("/:id").all(validateObjectId,auth, policy.isAllowed)
  .get(group.getSingleGroup)
  .put(group.updateGroup)
  .delete(group.deleteGroup);

module.exports = router;
