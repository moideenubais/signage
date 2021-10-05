const express = require("express");
const router = express.Router();

const schedule = require("../controllers/schedule");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const policy = require("../policies/policy");

router
  .route("/")
  .all(auth, policy.isAllowed)
  .get(schedule.getSchedules)
  .post(schedule.postSchedule);

router
  .route("/:id")
  .all(validateObjectId, auth, policy.isAllowed)
  .get(schedule.getSingleSchedule)
  .put(schedule.updateSchedule)
  .delete(schedule.deleteSchedule);

module.exports = router;
