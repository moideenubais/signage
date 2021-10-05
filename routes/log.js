const express = require("express");
const router = express.Router();

const log = require("../controllers/log");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const policy = require("../policies/policy");

router
  .route("/").all(auth, policy.isAllowed)
  .get(log.getLogs)
  .delete(log.deleteLog);

// router
//   .route("/:id").all(validateObjectId,auth, policy.isAllowed)
//   .get(log.getSingleLog)
//   .put(log.updateLog)
//   .delete(log.deleteLog);

module.exports = router;
