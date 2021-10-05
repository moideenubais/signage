const _ = require("lodash");
const fs = require("fs");
const Joi = require("joi");

const { Content, validate } = require("../models/content");
const common = require("../common/common");
const log = require("./log");

exports.getContents = async (req, res) => {
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
    const contentCount = await Content.count(query);
    const allContents = await Content.find(query)
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .select("-__v -password")
      .populate("associate")
      .populate("media")
      .lean();
    if (_.isEmpty(allContents)) return res.json({ msg: "No contents found" });
    return res.json({
      contents: allContents,
      info: {
        totalNumber: contentCount,
        hasNextPage: itemsPerPage * page < contentCount,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(contentCount / itemsPerPage),
      },
    });
    // const allContents = await Content.find(query).select("_id label associate");
    // if (_.isEmpty(allContents)) return res.json({ msg: "No contents found" });
    // res.send(allContents);
  } catch (error) {
    return res.status(500).send("Server Error in content.getContents");
  }
};

exports.postContent = async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).json({ err: error.details[0].message });
  }

  const { label, associate } = req.body;

  const accessCheckData = await common.accessCheck({
    associateId: associate,
    user: req.user,
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }

  const content = new Content({ label, associate });

  try {
    const savedcontents = await content.save();
    res.json(savedcontents);
    const logObject = {
      username: req.user.email,
      userObjectId: req.user._id,
      objectType: "content",
      objectId: savedcontents._id,
      objectName: savedcontents.label,
      action: "created",
      action_done_under: savedcontents.associate,
    };
    log.postLog(logObject);
  } catch (err) {
    console.log("Server Error in content.postContent", err);
    return res.status(400).send("Server Error in content.postContent");
  }
};

exports.getSingleContent = async (req, res) => {
  const accessCheckData = await common.accessCheck({
    contentId: req.params.id,
    user: req.user,
    item: "content",
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }
  const content = await Content.findById(req.params.id).select("-__v");

  if (!content)
    return res
      .status(404)
      .json({ msg: "The content with the given ID was not found." });

  res.send(content);
};

exports.deleteContent = async (req, res) => {
  const accessCheckData = await common.accessCheck({
    contentId: req.params.id,
    user: req.user,
    item: "content",
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }

  try {
    const content = await Content.findOne({ _id: req.params.id });
    if (!content)
      return res
        .status(404)
        .json({ msg: "The content with the given ID was not found." });

    if (Array.isArray(content.media) && content.media.length)
      return res.json({ msg: "Denied. There are content under this label" });

    await Content.findByIdAndRemove(req.params.id);
    res.json({ msg: "success", data: content });
    const logObject = {
      username: req.user.email,
      userObjectId: req.user._id,
      objectType: "content",
      objectId: content._id,
      objectName: content.label,
      action: "deleted",
      action_done_under: content.associate,
    };
    log.postLog(logObject);
  } catch (error) {
    console.log("Error while deleting the file", error);
    return res.status(400).json({
      err: "Error while deleting the file",
    });
  }
};

exports.updateContent = async (req, res) => {
  const accessCheckData = await common.accessCheck({
    contentId: req.params.id,
    user: req.user,
    item: "content",
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }
  const contentContent = {};

  if (!_.isEmpty(req.body.label)) {
    contentContent.label = req.body.label;
  }

  if (_.isEmpty(contentContent))
    return res.json({ msg: "body is empty, excluded file" });

  const content = await Content.findByIdAndUpdate(
    req.params.id,
    contentContent,
    { new: true }
  );

  if (!content)
    return res
      .status(404)
      .json({ msg: "The content with the given ID was not found." });

  res.send(content);
  const logObject = {
    username: req.user.email,
    userObjectId: req.user._id,
    objectType: "content",
    objectId: content._id,
    objectName: content.label,
    action: "updated",
    action_done_under: content.associate,
    updated_object: contentContent,
  };

  log.postLog(logObject);
};

exports.updateContentMedia = async (req, res) => {
  const { error } = mediaValidate(req.body);
  if (error) {
    return res.status(400).json({ err: error.details[0].message });
  }
  // const content = {};

  const existingMedia = await Content.findOne({ "media._id": req.params.id });
  if (!existingMedia)
    return res
      .status(404)
      .json({ msg: "The media with the given ID was not found." });

  const file = req.body;

  let currentFile = _.find(existingMedia.media, function (file) {
    return file._id == req.params.id;
  });
  if (currentFile.type == "url")
    if (!_.isEmpty(file.url)) currentFile.url = file.url;
  if (!_.isEmpty(file.transition)) currentFile.transition = file.transition;
  if (!_.isUndefined(file.active)) currentFile.active = file.active;
  if (!_.isEmpty(file.name)) currentFile.name = file.name;
  if (!_.isUndefined(file.duration)) currentFile.duration = file.duration;
  if (!_.isEmpty(file.active_date)) currentFile.active_date = file.active_date;
  if (!_.isEmpty(file.expire_date)) currentFile.expire_date = file.expire_date;

  const resContent = await Content.findByIdAndUpdate(
    existingMedia._id,
    existingMedia,
    { new: true }
  );

  if (!resContent)
    return res.status(404).json({
      msg: "The content with the given ID was not found. Error while updating",
    });

  res.send(resContent);
};
