const common = require("../common/common");
const { Content } = require("../models/content");
const { Playlist } = require("../models/playlist");
const { Group } = require("../models/group");
const { Media, validate } = require("../models/media");
const log = require("./log");

const _ = require("lodash");
const fs = require("fs");
const Joi = require("joi");
const { Associate } = require("../models/associate");
const { isEmpty } = require("lodash");

exports.getPlaylistMedia = async (req, res) => {
  const accessCheckData = await common.accessCheck({
    playlistId: req.params.id,
    user: req.user,
    item: "playlist",
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }
  const currentPlaylist = await Playlist.findOne({ _id: req.params.id });
  if (isEmpty(currentPlaylist))
    return res.status(400).json({ err: "No playlist found with the given id" });
  const currentGroup = await Group.findOne({ _id: currentPlaylist.group });
  if (isEmpty(currentGroup))
    return res
      .status(400)
      .json({ err: "No group found for the given playlist" });

  const contentsUnder = await Content.find({
    associate: currentGroup.associate,
  });
  if (isEmpty(contentsUnder))
    return res
      .status(400)
      .json({ err: "No associate found for the given playlist" });
  const labelsUnder = contentsUnder.map((content) => content._id);
  const medias = await Media.find({ label: { $in: labelsUnder } });
  if (isEmpty(medias))
    return res
      .status(400)
      .json({ err: "No medias found for the given playlist" });
  return res.json({ medias });
};

exports.getMedias = async (req, res) => {
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
    const media = await Media.find({
      label: req.params.id,
    });
    if (_.isEmpty(media)) return res.json({ msg: "No media found" });
    res.send(media);
  } catch (error) {
    console.log("Server Error in media.getMedia", error);
    return res.status(500).send("Server Error in media.getMedia");
  }
};

exports.postMedia = async (req, res) => {
  const label = req.params.id;
  const { error } = validate(req.body);
  if (error) {
    try {
      if (req.file) fs.unlinkSync(req.file.path);
    } catch (error) {
      console.log("Error while deleting the file [1]", error);
      return res.status(400).json({
        err: "Error while deleting the file [1]",
      });
    }
    return res.status(400).json({ err: error.details[0].message });
  }

  const accessCheckData = await common.accessCheck({
    contentId: label,
    user: req.user,
    item: "content",
  });
  if (accessCheckData.hasError) {
    try {
      if (req.file) fs.unlinkSync(req.file.path);
    } catch (error) {
      return res.status(400).json({
        err: "Error while deleting the file [2]",
      });
    }
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }
  const data = req.body;

  const { name, duration, type, resolution } = data;

  const media = new Media({ label, name, duration, type, resolution });

  if (type == "url" && _.isEmpty(data.url))
    return res.status(404).json({ msg: "url is required" });

  if (type != "url" && _.isEmpty(req.file))
    return res.status(400).json({ err: "media_file required" });

  if (type == "url") media.url = data.url;
  else media.url = req.file.path;
  if (!_.isUndefined(data.active)) media.active = data.active;
  if (!_.isEmpty(data.transition)) media.transition = data.transition;
  if (!_.isEmpty(data.active_date)) media.active_date = data.active_date;
  if (!_.isEmpty(data.expire_date)) media.expire_date = data.expire_date;

  // return

  try {
    const currentContent = await Content.findOne({ _id: req.params.id });
    if (!currentContent)
      return res
        .status(404)
        .json({ msg: "The content with the given ID was not found." });

    const associate = await Associate.findOne({
      _id: currentContent.associate,
    });
    if (!associate)
      return res
        .status(404)
        .json({ msg: "The associate with the given ID was not found." });
    if (type !== "url") {
      if (
        !(
          associate.used_storage.toNumber() + req.file.size <=
          associate.storage * 1024 * 1024 * 1024
        )
      ) {
        try {
          if (req.file) fs.unlinkSync(req.file.path);
        } catch (error) {
          console.log("Error while deleting the file [1]", error);
          return res.status(400).json({
            err: "Error while deleting the file [1]",
          });
        }
        return res.json({ msg: "Storage Exceeded" });
      }

      await Associate.findOneAndUpdate(
        { _id: associate._id },
        { $inc: { used_storage: req.file.size } }
      );
    }
    // return;
    const content = await Content.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { media: media._id } }
    );

    const savedMedia = await media.save();
    res.json(savedMedia);
    let pathArray = associate.path.split(",");
    pathArray = pathArray.filter((item) => item !== "");
    if (!_.isEmpty(pathArray)) {
      await Promise.all(
        pathArray.map(async (associateId) => {
          await Associate.findOneAndUpdate(
            { _id: associateId },
            { $inc: { used_storage: req.file.size } }
          );
        })
      );
    }

    const logObject = {
      username: req.user.email,
      userObjectId: req.user._id,
      objectType: "media",
      objectId: savedMedia._id,
      objectName: savedMedia.name,
      action: "created",
      action_done_under: savedMedia.label,
    };
    log.postLog(logObject);
  } catch (err) {
    console.log("Server Error in media.postMedia", err);
    return res.status(400).send("Server Error in media.postMedia");
  }
};

exports.getSingleMedia = async (req, res) => {
  const accessCheckData = await common.accessCheck({
    mediaId: req.params.id,
    user: req.user,
    item: "media",
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }
  const media = await Media.findById(req.params.id).select("-__v");

  if (!media)
    return res
      .status(404)
      .json({ msg: "The media with the given ID was not found." });

  res.send(media);
};

exports.deleteMedia = async (req, res) => {
  const accessCheckData = await common.accessCheck({
    mediaId: req.params.id,
    user: req.user,
    item: "media",
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }
  const media = await Media.findByIdAndRemove(req.params.id);

  if (!media)
    return res
      .status(404)
      .json({ msg: "The media with the given ID was not found." });

  try {
    const currentContent = await Content.findOne({ media: req.params.id });
    if (!currentContent)
      return res
        .status(404)
        .json({ msg: "The content with the given media was not found." });

    const associate = await Associate.findOne({
      _id: currentContent.associate,
    });
    if (!associate)
      return res
        .status(404)
        .json({ msg: "The associate for the given media is not found." });

    if (!(media.type == "url"))
      if (media.url) {
        let pathArray = associate.path.split(",");
        pathArray = pathArray.filter((item) => item !== "");
        pathArray.push(associate._id.toString());
        if (!_.isEmpty(pathArray)) {
          fs.stat(media.url, async (err, fileStats) => {
            if (err) {
              throw err;
            } else {
              await Promise.all(
                pathArray.map(async (associateId) => {
                  await Associate.findOneAndUpdate(
                    { _id: associateId },
                    { $inc: { used_storage: -fileStats.size } }
                  );
                })
              );
              fs.unlinkSync(media.url);
            }
          });
        }
      }
    await Content.updateOne(
      { _id: media.label },
      { $pull: { media: req.params.id } }
    );
  } catch (error) {
    console.log("Error while deleting the file", error);
    return res.status(400).json({
      err: "Error while deleting the file",
    });
  }

  res.send(media);
  const logObject = {
    username: req.user.email,
    userObjectId: req.user._id,
    objectType: "media",
    objectId: media._id,
    objectName: media.name,
    action: "deleted",
    action_done_under: media.label,
  };
  log.postLog(logObject);
};

exports.updateMedia = async (req, res) => {
  try {
    if (req.file) fs.unlinkSync(req.file.path);
  } catch (error) {
    console.log("Error while deleting the file [1]", error);
    return res.status(400).json({
      err: "Error while deleting the file [1]",
    });
  }
  const { error } = mediaValidate(req.body);
  if (error) {
    return res.status(400).json({ err: error.details[0].message });
  }
  const accessCheckData = await common.accessCheck({
    mediaId: req.params.id,
    user: req.user,
    item: "media",
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }

  const existingMedia = await Media.findOne({ _id: req.params.id });
  if (!existingMedia)
    return res
      .status(404)
      .json({ msg: "The media with the given ID was not found." });

  const data = req.body;

  if (existingMedia.type == "url")
    if (!_.isEmpty(data.url)) existingMedia.url = data.url;
  if (!_.isEmpty(data.transition)) existingMedia.transition = data.transition;
  if (!_.isUndefined(data.active)) existingMedia.active = data.active;
  if (!_.isEmpty(data.name)) existingMedia.name = data.name;
  if (!_.isUndefined(data.duration)) existingMedia.duration = data.duration;
  if (!_.isEmpty(data.active_date))
    existingMedia.active_date = data.active_date;
  if (!_.isEmpty(data.expire_date))
    existingMedia.expire_date = data.expire_date;

  if (_.isEmpty(data)) return res.json({ msg: "Empty body" });

  try {
    const resContent = await Media.findByIdAndUpdate(
      existingMedia._id,
      existingMedia,
      { new: true }
    );

    if (!resContent)
      return res.status(404).json({
        msg: "The content with the given ID was not found. Error while updating",
      });

    res.send(resContent);
    const logObject = {
      username: req.user.email,
      userObjectId: req.user._id,
      objectType: "media",
      objectId: resContent._id,
      objectName: resContent.name,
      action: "updated",
      action_done_under: resContent.label,
      updated_object: data,
    };
    log.postLog(logObject);
  } catch (error) {
    console.log("Server Error in media.updateMedia", error);
    return res.status(500).send("Server Error in media.updateMedia");
  }
};

function mediaValidate(media) {
  const schema = Joi.object({
    name: Joi.string().max(50),
    url: Joi.string(),
    type: Joi.string(),
    resolution: Joi.string(),
    duration: Joi.number(),
    active: Joi.boolean(),
    transition: Joi.string(),
    active_date: Joi.date().greater("now"),
    expire_date: Joi.date().greater(Joi.ref("active_date")),
  });

  return schema.validate(media);
}
