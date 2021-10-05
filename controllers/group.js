const _ = require("lodash");

const { Group, validate } = require("../models/group");
const common = require("../common/common");
const { Player } = require("../models/player");
const { Playlist } = require("../models/playlist");
const { Schedule } = require("../models/schedule");
const log = require("./log");

exports.getGroups = async (req, res) => {
  const page = +req.query.page || 1;
  let itemsPerPage = 10000;
  const user = req.user;
  const query = {};
  query.associate = user.associate;
  if (!_.isEmpty(req.query.associate)) {
    const accessCheckData = await common.accessCheck({
      associateId: req.query.associate,
      user: req.user,
      item: "associate",
    });
    if (accessCheckData.hasError) {
      return res
        .status(accessCheckData.statusCode || 400)
        .json({ err: accessCheckData.msg });
    }
    query.associate = req.query.associate;
  }
  const accessibleAssociates = await common.getAccessibleAssociates(
    query.associate
  );
  if (accessibleAssociates.hasError) {
    return res
      .status(accessibleAssociates.statusCode || 400)
      .json({ err: accessibleAssociates.msg });
  }
  query.associate = { $in: accessibleAssociates.associateIds };
  if (!_.isEmpty(req.query.limit)) itemsPerPage = +req.query.limit;
  if (!_.isEmpty(req.query.search)) {
    query["name"] = { $regex: req.query.search, $options: "i" };
  }
  try {
    const groupCount = await Group.count(query);
    const allGroups = await Group.find(query)
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .populate("associate")
      .select("-__v -password")
      .lean();
    if (_.isEmpty(allGroups)) return res.json({ msg: "No groups found" });
    return res.json({
      groups: allGroups,
      info: {
        totalNumber: groupCount,
        hasNextPage: itemsPerPage * page < groupCount,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(groupCount / itemsPerPage),
      },
    });
    // const allGroups = await Group.find(query).select("_id name");
    // if (_.isEmpty(allGroups)) return res.json({ msg: "No groups found" });
    // res.send(allGroups);
  } catch (error) {
    return res.status(500).send("Server Error in group.getGroups");
  }
};

exports.postGroup = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ err: error.details[0].message });

  const accessCheckData = await common.accessCheck({
    associateId: req.body.associate,
    user: req.user,
    item: "associate",
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }

  const group = new Group({
    name: req.body.name,
    associate: req.body.associate,
  });

  if (!_.isEmpty(req.body.description))
    group.description = req.body.description;

  try {
    const savedgroups = await group.save();
    res.json(savedgroups);
    const logObject = {
      username: req.user.email,
      userObjectId: req.user._id,
      objectType: "group",
      objectId: group._id,
      objectName: group.name,
      action: "created",
      action_done_under: group.associate,
    };

    log.postLog(logObject);
  } catch (err) {
    console.log("Server Error in group.postGroup", err);
    return res.status(400).send("Server Error in group.postGroup");
  }
};

exports.getSingleGroup = async (req, res) => {
  const accessCheckData = await common.accessCheck({
    groupId: req.params.id,
    user: req.user,
    item: "group",
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }
  const group = await Group.findById(req.params.id).select("-__v");

  if (!group)
    return res
      .status(404)
      .json({ msg: "The group with the given ID was not found." });

  res.send(group);
};

exports.deleteGroup = async (req, res) => {
  const accessCheckData = await common.accessCheck({
    groupId: req.params.id,
    user: req.user,
    item: "group",
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }

  try {
    const groupExist = await Group.findOne({ _id: req.params.id });
    if (!groupExist)
      return res
        .status(404)
        .json({ msg: "The group with the given ID was not found." });

    const playerExist = await Player.find({ group: req.params.id });
    if (!_.isEmpty(playerExist))
      return res
        .status(400)
        .json({ msg: "Denied, The are players under this group" });

    const playListExist = await Playlist.find({ group: req.params.id });
    if (!_.isEmpty(playListExist))
      return res
        .status(400)
        .json({ msg: "Denied, The are playlists under this group" });

    const scheduleExist = await Schedule.find({ group: req.params.id });
    if (!_.isEmpty(scheduleExist))
      return res
        .status(400)
        .json({ msg: "Denied, The are schedules under this group" });

    const group = await Group.findByIdAndRemove(req.params.id);

    res.send(group);
    const logObject = {
      username: req.user.email,
      userObjectId: req.user._id,
      objectType: "group",
      objectId: group._id,
      objectName: group.name,
      action: "deleted",
      action_done_under: group.associate,
    };
    log.postLog(logObject);
  } catch (error) {
    console.log("Server Error in group.deleteGroup", error);
    return res.status(400).send("Server Error in group.deleteGroup");
  }
};

exports.updateGroup = async (req, res) => {
  const accessCheckData = await common.accessCheck({
    groupId: req.params.id,
    user: req.user,
    item: "group",
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }

  const groupContent = {};

  if (!_.isEmpty(req.body.name)) {
    groupContent.name = req.body.name;
  }
  if (!_.isEmpty(req.body.description)) {
    groupContent.description = req.body.description;
  }
  if (!_.isEmpty(req.body.associate)) {
    groupContent.associate = req.body.associate;
  }
  if (_.isEmpty(groupContent)) return res.json({ msg: "Empty body" });

  const group = await Group.findByIdAndUpdate(req.params.id, groupContent, {
    new: true,
  });

  if (!group)
    return res
      .status(404)
      .json({ msg: "The group with the given ID was not found." });

  res.send(group);
  const logObject = {
    username: req.user.email,
    userObjectId: req.user._id,
    objectType: "group",
    objectId: group._id,
    objectName: group.name,
    action: "updated",
    action_done_under: group.associate,
    updated_object: groupContent,
  };

  log.postLog(logObject);
};
