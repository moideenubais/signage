const express = require("express");
const router = express.Router();

const content = require("../controllers/content");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const policy = require("../policies/policy");

router
  .route("/")
  .all(auth, policy.isAllowed)
  .get(content.getContents)
  .post(content.postContent);

router
  .route("/:id")
  .all(validateObjectId, auth, policy.isAllowed)
  .get(content.getSingleContent)
  .put(content.updateContent)
  .delete(content.deleteContent);

module.exports = router;
