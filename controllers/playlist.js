const _ = require("lodash");
const Joi = require("joi");
const { Group } = require("../models/group");
const common = require("../common/common");
const log = require("./log");

const { Playlist, validate } = require("../models/playlist");

exports.getPlaylists = async (req, res) => {
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
  //set group as $in accessible groups
  try {
    const playlistCount = await Playlist.count(query);
    const allPlaylists = await Playlist.find(query)
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .populate("group")
      .populate("playlist.media_id")
      .select("-__v -password")
      .lean();
    if (_.isEmpty(allPlaylists)) return res.json({ msg: "No playlists found" });
    return res.json({
      playlists: allPlaylists,
      info: {
        totalNumber: playlistCount,
        hasNextPage: itemsPerPage * page < playlistCount,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(playlistCount / itemsPerPage),
      },
    });
    // const allPlaylists = await Playlist.find(query).select("_id name");
    // if (_.isEmpty(allPlaylists)) return res.json({ msg: "No playlists found" });
    // res.send(allPlaylists);
  } catch (error) {
    return res.status(500).send("Server Error in playlist.getPlaylists");
  }
};

exports.postPlaylist = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ err: error.details[0].message });

  const data = req.body;

  const { name, width, height, group } = data;

  const accessCheckData = await common.accessCheck({
    groupId: group,
    user: req.user,
    item: "group",
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }

  const playlist = new Playlist({ name, width, height, group });

  if (!_.isEmpty(data.description)) playlist.description = data.description;
  if (!_.isEmpty(data.type)) playlist.type = data.type;
  if (!_.isUndefined(data.default)) playlist.default = data.default;

  try {
    const savedplaylists = await playlist.save();
    res.json(savedplaylists);
    const logObject = {
      username: req.user.email,
      userObjectId: req.user._id,
      objectType: "playlist",
      objectId: playlist._id,
      objectName: playlist.name,
      action: "created",
      action_done_under: playlist.group,
    };
    log.postLog(logObject);
  } catch (err) {
    console.log("Server Error in playlist.postPlaylist", err);
    return res.status(400).send("Server Error in playlist.postPlaylist");
  }
};

exports.getSinglePlaylist = async (req, res) => {
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
  const playlist = await Playlist.findById(req.params.id).select("-__v");

  if (!playlist)
    return res
      .status(404)
      .json({ msg: "The playlist with the given ID was not found." });

  res.send(playlist);
};

exports.deletePlaylist = async (req, res) => {
  try {
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

    if (Array.isArray(playlist.playlist) && playlist.playlist.length)
      return res.json({ msg: "Denied. There are content under this label" });

    await Playlist.findByIdAndRemove(req.params.id);

    res.json({ msg: "success", data: playlist });
    const logObject = {
      username: req.user.email,
      userObjectId: req.user._id,
      objectType: "playlist",
      objectId: playlist._id,
      objectName: playlist.name,
      action: "deleted",
      action_done_under: playlist.group,
    };
    log.postLog(logObject);
  } catch (error) {
    console.log("Error while deleting the playlist", error);
    return res.status(400).json({
      err: "Error while deleting the playlist",
    });
  }
};

exports.updatePlaylist = async (req, res) => {
  let playlist = {};
  let status = {};
  let playlistContent = {};
  const { error } = validatePlaylist(req.body);
  if (error) return res.status(400).send(error.details[0].message);

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

  const existingPlaylist = await Playlist.findOne({ _id: req.params.id });
  if (!existingPlaylist)
    return res
      .status(404)
      .json({ msg: "The playlist with the given ID was not found." });

  if (req.body.delete_id) {
    playlist = await Playlist.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { playlist: { media_id: req.body.delete_id } } }
    );
    const deleted = playlist.playlist.find(
      (media) => media.media_id == req.body.delete_id
    );
    status = { removed: deleted };
  } else {
    if (!_.isEmpty(req.body.name)) {
      playlistContent.name = req.body.name;
    }
    if (!_.isEmpty(req.body.description)) {
      playlistContent.description = req.body.description;
    }
    if (!_.isUndefined(req.body.width)) {
      playlistContent.width = req.body.width;
    }
    if (!_.isEmpty(req.body.group)) {
      playlistContent.group = req.body.group;
    }
    if (!_.isUndefined(req.body.height)) {
      playlistContent.height = req.body.height;
    }
    if (!_.isEmpty(req.body.type)) {
      playlistContent.type = req.body.type;
    }
    if (!_.isUndefined(req.body.default)) {
      if (req.body.default) {
        existingPlaylist.group;
        try {
          await Playlist.updateMany(
            { group: existingPlaylist.group },
            { $set: { default: false } }
          );
        } catch (error) {
          console.log("Error in playlist.updatePlaylist", error);
          return res
            .status(500)
            .json({ err: "Server error in playlist.updatePlaylist" });
        }
      }
      playlistContent.default = req.body.default;
    }
    if (!_.isUndefined(req.body.playlist)) {
      playlistContent.playlist = req.body.playlist;
      // const mediaArray = [];
      // _.forEach(req.body.playlist, function (incomingMedia) {
      //   const existInPlaylist = _.find(
      //     existingPlaylist.playlist,
      //     function (media) {
      //       return media.media_id == incomingMedia.media_id;
      //     }
      //   );
      //   if (!existInPlaylist) mediaArray.push(incomingMedia);
      // });
      // playlistContent["$push"] = {
      //   playlist: mediaArray,
      // };
    }
    if (_.isEmpty(playlistContent)) return res.json({ msg: "Empty body" });
    playlist = await Playlist.findByIdAndUpdate(
      req.params.id,
      playlistContent,
      {
        new: true,
      }
    );
  }

  res.send(playlist);
  const logObject = {
    username: req.user.email,
    userObjectId: req.user._id,
    objectType: "playlist",
    objectId: playlist._id,
    objectName: playlist.name,
    action: "updated",
    action_done_under: playlist.group,
    updated_object: status,
  };
  if (_.isEmpty(status)) logObject.updated_object = playlistContent;

  log.postLog(logObject);
};

function validatePlaylist(playlist) {
  const schema = Joi.object({
    name: Joi.string().max(50),
    descripton: Joi.string(),
    delete_id: Joi.objectId(),
    width: Joi.number(),
    height: Joi.number(),
    type: Joi.string(),
    default: Joi.boolean(),
    group: Joi.objectId(),
    playlist: Joi.array().items(
      Joi.object({
        media_id: Joi.objectId().required(),
        position: Joi.number(),
      })
    ),
  });

  return schema.validate(playlist);
}
