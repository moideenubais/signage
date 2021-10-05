const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const GroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    description: {
      type: String,
      trim: true,
    },
    associate: {
      type: mongoose.Schema.ObjectId,
      ref: "Associate",
      required: true,
    },
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", GroupSchema);

function validateGroup(group) {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    description: Joi.string(),
    associate: Joi.objectId().required(),
  });

  return schema.validate(group);
}

exports.Group = Group;
exports.validate = validateGroup;
