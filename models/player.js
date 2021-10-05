const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const PlayerSchema = new mongoose.Schema(
  {
    display_name: {
      type: String,
      // required: true,
      trim: true,
      maxlength: 255,
    },
    device_address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    device_key: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    description: {
      type: String,
      trim: true,
    },
    group: {
      type: mongoose.Schema.ObjectId,
      ref: "Group",
      // required: true,
    },
    valid_from: {
      type: Date,
      // required: true,
    },
    valid_to: {
      type: Date,
      // required: true,
    },
    sleep_time: Date,
    wakeup_time: Date,
  },
  { timestamps: true }
);

// PlayerSchema.pre("validate", async function (next) {
//   this.valid_to = new Date(+this.valid_from + 365 * 24 * 60 * 60 * 1000);
//   next();
// });

const Player = mongoose.model("Player", PlayerSchema);

function validatePlayer(player) {
  const schema = Joi.object({
    display_name: Joi.string().max(50).required(),
    description: Joi.string(),
    device_key: Joi.string().required(),
    group: Joi.objectId().required(),
    valid_from: Joi.date().greater("now").required(),
    sleep_time: Joi.date(),
    wakeup_time: Joi.date(),
  });

  return schema.validate(player);
}

exports.Player = Player;
exports.validate = validatePlayer;
