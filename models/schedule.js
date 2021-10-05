const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const ScheduleSchema = new mongoose.Schema(
  {
    recurrency_type: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
      default: "daily",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    // startTime: {
    //   type: Date,
    //   required: true,
    // },
    // endTime: {
    //   type: Date,
    //   required: true,
    // },
    group: {
      type: mongoose.Schema.ObjectId,
      ref: "Group",
      required: true,
    },
    playlist_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Playlist",
      required: true,
    },
  },
  { timestamps: true }
);

const Schedule = mongoose.model("Schedule", ScheduleSchema);

function validateSchedule(schedule) {
  const schema = Joi.object({
    recurrency_type: Joi.string().max(50).required(),
    startDate: Joi.date().greater('now').required(),
    endDate: Joi.date().greater(Joi.ref('startDate')).required(),
    // startTime: Joi.date().greater('now').required(),
    // endTime: Joi.date().greater(Joi.ref('startTime')).required(),
    playlist_id: Joi.objectId().required(),
    group: Joi.objectId().required(),
  });

  return schema.validate(schedule);
}

exports.Schedule = Schedule;
exports.validate = validateSchedule;
