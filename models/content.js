const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const ContentSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    associate: {
      type: mongoose.Schema.ObjectId,
      ref: "Associate",
      required: true,
    },
    media: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Media",
      },
    ],
  },
  { timestamps: true }
);

const Content = mongoose.model("Content", ContentSchema);

function validateContent(content) {
  const schema = Joi.object({
    label: Joi.string().max(50).required(),
    associate: Joi.objectId().required(),
  });

  return schema.validate(content);
}

exports.Content = Content;
exports.validate = validateContent;
