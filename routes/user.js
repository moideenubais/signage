const express = require("express");
const router = express.Router();

const user = require("../controllers/user");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const policy = require("../policies/policy");

router
  .route("/").all(auth, policy.isAllowed) //.all(kHubPolicy.isAllowed) need to include policy
  .get(user.getUsers)
  .post(user.postUser);

router
  .route("/:id").all(validateObjectId,auth, policy.isAllowed)
  .get(user.getSingleUser)
  .put(user.updateUser)
  .delete(user.deleteUser);

module.exports = router;
