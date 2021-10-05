const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const MediaSchema = new mongoose.Schema(
  {
    label: {
      type: mongoose.Schema.ObjectId,
      ref: "Content",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
      default: 10,
    },
    type: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    resolution: {
      // in case of url heith and width
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    active: {
      type: Boolean,
      default: false,
    },
    transition: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
      default: "fade",
    },
    active_date: {
      type: Date,
    },
    expire_date: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Media = mongoose.model("Media", MediaSchema);

function validateMedia(media) {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    url: Joi.string(),
    duration: Joi.number().required(),
    type: Joi.string().required(),
    resolution: Joi.string().required(),
    active: Joi.boolean(),
    transition: Joi.string(),
    active_date: Joi.date().greater('now'),
    expire_date: Joi.date().greater(Joi.ref('active_date')),
  });

  return schema.validate(media);
}

exports.Media = Media;
exports.validate = validateMedia;
