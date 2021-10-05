const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const LogSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  userObjectId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  objectType: {
    type: String,
    enum: [
      "group",
      "user",
      "player",
      "playlist",
      "schedule",
      "associate",
      "content",
      "media",
      "password"
    ],
    required: true,
  },
  objectId: {
    //eg:created user document id for user creation
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  objectName: {
    // group name in case of group creation
    type: String,
    // required: true //cause there is no name for schedule
  },
  action_done_under: {
    //eg:user created under ....... associate
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  action: {
    type: String,
    enum: ["created", "deleted", "updated"],
    required: true,
  },
  date_of_action: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated_object: {
    type: mongoose.Schema.Types.Mixed,
  },
});

const Log = mongoose.model("Log", LogSchema);

function validateLog(log) {
  const schema = Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref("startDate")).required()
  });

  return schema.validate(log);
}

exports.Log = Log;
exports.validate = validateLog;
