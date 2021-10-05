const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const PlaylistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    descripton: {
      type: String,
      trim: true,
    },
    width: {
      type: Number,
      min:[100,'minimum value for width is 100'],
      required: true,
    },
    height: {
      type: Number,
      min:[100,'minimum value for height is 100'],
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: "simple",
      enum: ["simple", "template"],
    },
    default: {
      type: Boolean,
      required: true,
      default: false,
    },
    group: {
      type: mongoose.Schema.ObjectId,
      ref: "Group",
      required: true,
    },
    playlist: [
      {
        media_id: {
          type: mongoose.Schema.ObjectId,
          ref: "Media",
          required: true,
        },
        postion: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

const Playlist = mongoose.model("Playlist", PlaylistSchema);

function validatePlaylist(playlist) {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    descripton: Joi.string(),
    width: Joi.number().min(100).required(),
    height: Joi.number().min(100).required(),
    type: Joi.string(),
    default: Joi.boolean(),
    group: Joi.objectId().required(),
    playlist: Joi.object({
      media_id: Joi.objectId().required(),
      postion: Joi.number(),
    }),
  });

  return schema.validate(playlist);
}

exports.Playlist = Playlist;
exports.validate = validatePlaylist;
