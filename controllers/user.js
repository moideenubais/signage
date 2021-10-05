const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const { User, validate } = require("../models/user");
const { Associate } = require("../models/associate");
const common = require("../common/common");
const log = require("./log");

exports.getUsers = async (req, res) => {
  const page = +req.query.page || 1;
  let itemsPerPage = 10000;
  const user = req.user;
  const query = {};
  if (!_.isEmpty(req.query.limit)) itemsPerPage = +req.query.limit;
  if (!_.isEmpty(req.query.search)) {
    query["name"] = { $regex: req.query.search, $options: "i" };
  }
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
  //do not need the current user data
  accessibleAssociates.associateIds = accessibleAssociates.associateIds.filter(item => item !== query.associate)
  query.associate = { $in: accessibleAssociates.associateIds };
  try {
    const userCount = await User.count(query);
    const allUsers = await User.find(query)
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .populate("associate")
      .select("-__v -password")
      .lean();
    if (_.isEmpty(allUsers)) return res.json({ msg: "No users found" });
    return res.json({
      users: allUsers,
      info: {
        totalNumber: userCount,
        hasNextPage: itemsPerPage * page < userCount,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(userCount / itemsPerPage),
      },
    });
    // const allUsers = await User.find(query).select("_id email");
    // if (_.isEmpty(allUsers)) return res.json({ msg: "No users found" });
    // res.send(allUsers);
  } catch (error) {
    console.log("Error in user.getUsers", error);
    return res.status(500).send("Server Error in user.getUsers");
  }
};

exports.postUser = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ err: error.details[0].message });

  const accessCheckData = await common.accessCheck({
    associateId: req.body.associate,
    user: req.user,
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }

  const userExist = await User.findOne({ email: req.body.email });

  if (userExist)
    return res
      .status(400)
      .json({ msg: "User already exists with the same email" });

  const {
    name,
    email,
    password,
    address,
    associate,
    mobile,
    active,
    privileges,
  } = req.body;

  const user = new User({
    name,
    email,
    associate,
    mobile,
    password,
  });

  //default privilege value
  user.privileges = ["view"];

  if (!_.isEmpty(address)) user.address = address;
  if (!_.isEmpty(active)) user.active = active;
  if (!_.isEmpty(privileges)) {
    if (
      !privileges.every((privilege) => req.user.privileges.includes(privilege))
    )
      return res.json({ msg: "You cannot set these privileges" });

    user.privileges = privileges;
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  try {
    await user.save();
    const token = user.generateAuthToken();
    res.json({ token: token });
    const logObject = {
      username: req.user.email,
      userObjectId: req.user._id,
      objectType: "user",
      objectId: user._id,
      objectName: user.name,
      action: "created",
      action_done_under: user.associate,
    };
    log.postLog(logObject);
  } catch (err) {
    console.log("Server Error in user.postUser", err);
    return res.status(400).send("Server Error in user.postUser");
  }
};

exports.getSingleUser = async (req, res) => {
  const accessCheckData = await common.accessCheck({
    userId: req.params.id,
    user: req.user,
    item: "user",
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }
  const user = await User.findById(req.params.id).select("-__v -password");

  if (!user)
    return res
      .status(404)
      .json({ msg: "The user with the given ID was not found." });

  res.send(user);
};

exports.deleteUser = async (req, res) => {
  if (req.user._id === req.params.id)
    return res.json({ err: "You cannot delete your own account" });
  const accessCheckData = await common.accessCheck({
    userId: req.params.id,
    user: req.user,
    item: "user",
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user)
    return res
      .status(404)
      .json({ msg: "The user with the given ID was not found." });

  res.send(user);
  const logObject = {
    username: req.user.email,
    userObjectId: req.user._id,
    objectType: "user",
    objectId: user._id,
    objectName: user.name,
    action: "deleted",
    action_done_under: user.associate,
  };
  log.postLog(logObject);
};

exports.updateUser = async (req, res) => {
  if (req.user._id === req.params.id)
    return res.status(400).json({ err: "You cannot delete your own account" });
  const { error } = validateUpdate(req.body);
  if (error) return res.status(400).json({ err: error.details[0].message });

  const accessCheckData = await common.accessCheck({
    userId: req.params.id,
    user: req.user,
    item: "user",
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }

  const { name, address, associate, mobile, active, privileges } = req.body;

  const userContent = {};

  if (!_.isEmpty(name)) userContent.name = name;
  if (!_.isEmpty(address)) userContent.address = address;
  //move user to another association
  if (!_.isEmpty(associate)) userContent.associate = associate;
  if (!_.isEmpty(mobile)) userContent.mobile = mobile;
  if (!_.isEmpty(active)) userContent.active = active;
  if (!_.isEmpty(privileges)) {
    const existingUser = await User.findOne({ _id: req.params.id });
    if (!existingUser)
      return res
        .status(404)
        .json({ msg: "The user with the given ID was not found." });

    userContent["$addToSet"] = {
      privileges: privileges,
    };
  }
  if (_.isEmpty(userContent)) return res.json({ msg: "Empty body" });

  const user = await User.findByIdAndUpdate(req.params.id, userContent, {
    fields: { password: 0 },
    new: true,
  });

  if (!user)
    return res
      .status(404)
      .json({ msg: "The user with the given ID was not found." });

  res.send(user);
  const logObject = {
    username: req.user.email,
    userObjectId: req.user._id,
    objectType: "user",
    objectId: user._id,
    objectName: user.name,
    action: "updated",
    action_done_under: user.associate,
    updated_object: userContent,
  };
  log.postLog(logObject);
};

function validateUpdate(user) {
  const schema = Joi.object({
    name: Joi.string(),
    address: Joi.string(),
    mobile: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/),
    associate: Joi.objectId(),
    active: Joi.boolean(),
    privileges: Joi.array().items(
      Joi.string().valid(
        "view",
        "user",
        "group",
        "player",
        "content",
        "schedule",
        "playlist",
        "associate"
      )
    ),
  });

  return schema.validate(user);
}
