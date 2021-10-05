const _ = require("lodash");
const { Group } = require("../models/group");
const common = require("../common/common");
const log = require("./log");
const Joi = require("joi");

const { Schedule, validate } = require("../models/schedule");

exports.getSchedules = async (req, res) => {
  const page = +req.query.page || 1;
  let itemsPerPage = 10000;
  const user = req.user;
  const query = {};
  if (!_.isEmpty(req.query.limit)) itemsPerPage = +req.query.limit;
  if (!_.isEmpty(req.query.search)) {
    query["name"] = { $regex: req.query.search, $options: "i" };
  }
  if (_.isEmpty(req.query.group)) {
    const accessibleGroups = await common.getAccessibleGroups(
      req.user.associate
    );
    if (accessibleGroups.hasError) {
      return res
        .status(accessibleGroups.statusCode || 400)
        .json({ err: accessibleGroups.msg });
    }
    query.group = { $in: accessibleGroups.groupIds };
  } else {
    const accessCheckData = await common.accessCheck({
      groupId: req.query.group,
      user: req.user,
      item: "group",
    });
    if (accessCheckData.hasError) {
      return res
        .status(accessCheckData.statusCode || 400)
        .json({ err: accessCheckData.msg });
    }
    query.group = req.query.group;
  }

  try {
    const scheduleCount = await Schedule.count(query);
    const allSchedules = await Schedule.find(query)
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .select("-__v -password")
      .populate("group")
      .populate("playlist_id")
      .lean();
    if (_.isEmpty(allSchedules)) return res.json({ msg: "No schedules found" });
    return res.json({
      schedules: allSchedules,
      info: {
        totalNumber: scheduleCount,
        hasNextPage: itemsPerPage * page < scheduleCount,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(scheduleCount / itemsPerPage),
      },
    });
    // const allSchedules = await Schedule.find(query).select("__v");
    // if (_.isEmpty(allSchedules)) return res.json({ msg: "No schedules found" });
    // res.send(allSchedules);
  } catch (error) {
    return res.status(500).send("Server Error in schedule.getSchedules");
  }
};

exports.postSchedule = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ err: error.details[0].message });

  const data = req.body;

  const accessCheckData = await common.accessCheck({
    groupId: data.group,
    user: req.user,
    item: "group",
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }

  const {
    recurrency_type,
    startDate,
    endDate,
    // startTime,
    // endTime,
    group,
    playlist_id,
  } = data;

  const schedule = new Schedule({
    recurrency_type,
    startDate,
    endDate,
    // startTime,
    // endTime,
    group,
    playlist_id,
  });

  try {
    const savedschedules = await schedule.save();

    res.json(savedschedules);
    const logObject = {
      username: req.user.email,
      userObjectId: req.user._id,
      objectType: "schedule",
      objectId: schedule._id,
      action: "created",
      action_done_under: schedule.group,
    };
    log.postLog(logObject);
  } catch (err) {
    console.log("Server Error in schedule.postSchedule", err);
    return res.status(400).send("Server Error in schedule.postSchedule");
  }
};

exports.getSingleSchedule = async (req, res) => {
  const accessCheckData = await common.accessCheck({
    scheduleId: req.params.id,
    user: req.user,
    item: "schedule",
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }
  const schedule = await Schedule.findById(req.params.id).select("-__v");

  if (!schedule)
    return res
      .status(404)
      .json({ msg: "The schedule with the given ID was not found." });

  res.send(schedule);
};

exports.deleteSchedule = async (req, res) => {
  const accessCheckData = await common.accessCheck({
    scheduleId: req.params.id,
    user: req.user,
    item: "schedule",
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }
  const schedule = await Schedule.findByIdAndRemove(req.params.id);

  if (!schedule)
    return res
      .status(404)
      .json({ msg: "The schedule with the given ID was not found." });

  res.send(schedule);
  const logObject = {
    username: req.user.email,
    userObjectId: req.user._id,
    objectType: "schedule",
    objectId: schedule._id,
    action: "deleted",
    action_done_under: schedule.group,
  };
  log.postLog(logObject);
};

exports.updateSchedule = async (req, res) => {
  const schedule = {};
  const { error } = validateSchedule(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const accessCheckData = await common.accessCheck({
    scheduleId: req.params.id,
    user: req.user,
    item: "schedule",
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }

  if (!_.isEmpty(req.body.recurrency_type)) {
    schedule.recurrency_type = req.body.recurrency_type;
  }
  if (!_.isEmpty(req.body.startDate)) {
    schedule.startDate = req.body.startDate;
  }
  if (!_.isEmpty(req.body.endDate)) {
    schedule.endDate = req.body.endDate;
  }
  if (!_.isEmpty(req.body.group)) {
    schedule.group = req.body.group;
  }
  if (!_.isEmpty(req.body.playlist_id)) {
    schedule.playlist_id = req.body.playlist_id;
  }
  // if (!_.isEmpty(req.body.startTime)) {
  //   schedule.startTime = req.body.startTime;
  // }
  // if (!_.isEmpty(req.body.endTime)) {
  //   schedule.endTime = req.body.endTime;
  // }
  if (_.isEmpty(schedule)) return res.json({ msg: "Empty body" });
  resSchedule = await Schedule.findByIdAndUpdate(req.params.id, schedule, {
    new: true,
  });

  if (!resSchedule)
    return res
      .status(404)
      .json({ msg: "The schedule with the given ID was not found." });

  res.send(resSchedule);
  const logObject = {
    username: req.user.email,
    userObjectId: req.user._id,
    objectType: "schedule",
    objectId: resSchedule._id,
    action: "updated",
    action_done_under: resSchedule.group,
    updated_object: schedule,
  };
  log.postLog(logObject);
};

function validateSchedule(schedule) {
  const schema = Joi.object({
    recurrency_type: Joi.string().max(50),
    startDate: Joi.date().greater("now"),
    endDate: Joi.date().greater(Joi.ref("startDate")),
    // startTime: Joi.number(),
    // endTime: Joi.string(),
    playlist_id: Joi.objectId(),
    group: Joi.objectId(),
  });

  return schema.validate(schedule);
}
