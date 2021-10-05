const _ = require("lodash");
const nanoid = require("nanoid").nanoid;
const { Group } = require("../models/group");
const { Playlist } = require("../models/playlist");
const { Schedule } = require("../models/schedule");
const { Associate } = require("../models/associate");
const common = require("../common/common");
const log = require("./log");
const mongoose = require("mongoose");

const { Player, validate } = require("../models/player");

exports.getPlayers = async (req, res) => {
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
    const playerCount = await Player.count(query);
    const allPlayers = await Player.find(query)
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .populate("group")
      .select("-__v -password")
      .lean();
    if (_.isEmpty(allPlayers)) return res.json({ msg: "No players found" });
    return res.json({
      players: allPlayers,
      info: {
        totalNumber: playerCount,
        hasNextPage: itemsPerPage * page < playerCount,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(playerCount / itemsPerPage),
      },
    });
    // const allPlayers = await Player.find(query).select("_id display_name");
    // if (_.isEmpty(allPlayers)) return res.json({ msg: "No players found" });
    // res.send(allPlayers);
  } catch (error) {
    console.log("Server Error in player.getPlayers", error);
    return res.status(500).send("Server Error in player.getPlayers");
  }
};

exports.createPlayerContent = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ err: error.details[0].message });

  const accessCheckData = await common.accessCheck({
    groupId: req.body.group,
    user: req.user,
    item: "group",
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }

  const players = await playerCheck(req.body.group);
  if (players.hasError) {
    if (players.statusCode == 500)
      console.log("Server Error in playersCheck", players.error);
    return res.status(players.statusCode || 400).json({ err: players.msg });
  }
  if (!(players.data > 0))
    return res.json({
      msg: "player limit exceeded",
    });
  // return;

  // if(_.isEmpty(req.body.device_address))
  //   return res.json({msg:"No MAC address provided"});
  let validFrom = new Date(req.body.valid_from);
  const playerContent = {
    display_name: req.body.display_name,
    group: req.body.group,
    valid_from: req.body.valid_from,
    valid_to: validFrom.setFullYear(validFrom.getFullYear() + 1),
  };

  if (!_.isEmpty(req.body.description))
    playerContent.description = req.body.description;
  if (req.body.sleep_time) playerContent.sleep_time = req.body.sleep_time;
  if (req.body.wakeup_time) playerContent.wakeup_time = req.body.wakeup_time;

  try {
    const player = await Player.findOneAndUpdate(
      { device_key: req.body.device_key },
      playerContent,
      {
        new: true,
      }
    );

    if (!player)
      return res
        .status(404)
        .json({ msg: "The player with the given device key was not found." });

    res.json(player);
    const logObject = {
      username: req.user.email,
      userObjectId: req.user._id,
      objectType: "player",
      objectId: player._id,
      objectName: player.display_name,
      action: "created",
      action_done_under: player.group,
    };
    log.postLog(logObject);
  } catch (err) {
    console.log("Server Error in player.postPlayer", err);
    return res.status(400).send("Server Error in player.postPlayer");
  }
};

exports.postPlayer = async (req, res) => {
  if (_.isEmpty(req.body.device_address))
    return res.json({ msg: "No MAC address provided" });

  const existingPlayer = await Player.findOne({
    device_address: req.body.device_address,
  });
  if (existingPlayer)
    return res
      .status(200)
      .json({ msg: "success", data: existingPlayer.device_key });

  const player = new Player({
    device_address: req.body.device_address,
    device_key: nanoid(),
  });

  try {
    const savedPlayer = await player.save();
    res.json({ msg: "success", data: savedPlayer.device_key });
  } catch (err) {
    console.log("Server Error in player.postPlayer", err);
    return res.status(400).send("Server Error in player.postPlayer");
  }
};

exports.getSinglePlayer = async (req, res) => {
  const accessCheckData = await common.accessCheck({
    playerId: req.params.id,
    user: req.user,
    item: "player",
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }
  const player = await Player.findById(req.params.id).select("-__v");

  if (!player)
    return res
      .status(404)
      .json({ msg: "The player with the given ID was not found." });

  res.send(player);
};

exports.deletePlayer = async (req, res) => {
  const accessCheckData = await common.accessCheck({
    playerId: req.params.id,
    user: req.user,
    item: "player",
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }
  const player = await Player.findByIdAndRemove(req.params.id);

  if (!player)
    return res
      .status(404)
      .json({ msg: "The player with the given ID was not found." });

  res.send(player);
  const logObject = {
    username: req.user.email,
    userObjectId: req.user._id,
    objectType: "player",
    objectId: player._id,
    objectName: player.display_name,
    action: "deleted",
    action_done_under: player.group,
  };
  log.postLog(logObject);
};

exports.updatePlayer = async (req, res) => {
  const accessCheckData = await common.accessCheck({
    playerId: req.params.id,
    user: req.user,
    item: "player",
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }

  const playerContent = {};

  if (!_.isEmpty(req.body.display_name)) {
    playerContent.display_name = req.body.display_name;
  }
  if (!_.isEmpty(req.body.description)) {
    playerContent.description = req.body.description;
  }
  // if (!_.isEmpty(req.body.device_address)) {
  //   playerContent.device_address = req.body.device_address;
  // }
  if (!_.isEmpty(req.body.group)) {
    playerContent.group = req.body.group;
  }
  if (!_.isEmpty(req.body.valid_from)) {
    playerContent.valid_from = req.body.valid_from;
  }
  if (req.body.sleep_time) {
    playerContent.sleep_time = req.body.sleep_time;
  }
  if (req.body.wakeup_time) {
    playerContent.wakeup_time = req.body.wakeup_time;
  }
  if (_.isEmpty(playerContent)) return res.json({ msg: "Empty body" });

  const player = await Player.findByIdAndUpdate(req.params.id, playerContent, {
    new: true,
  });

  if (!player)
    return res
      .status(404)
      .json({ msg: "The player with the given ID was not found." });

  res.send(player);
  const logObject = {
    username: req.user.email,
    userObjectId: req.user._id,
    objectType: "player",
    objectId: player._id,
    objectName: player.display_name,
    action: "updated",
    action_done_under: player.group,
    updated_object: playerContent,
  };
  log.postLog(logObject);
};

async function playerCheck(groupId) {
  try {
    const group = await Group.findOne({ _id: groupId }).select("associate");
    if (_.isEmpty(group))
      return {
        hasError: true,
        msg: "Group with the given ID not found",
        statusCode: 400,
      };
    let parentId = group.associate;
    const parentAssociate = await Associate.findOne({ _id: parentId }).select(
      "number_of_players"
    );
    if (_.isEmpty(parentAssociate))
      return {
        hasError: true,
        msg: "Associate with the given parentId not found",
        statusCode: 400,
      };
    const otherGroups = await Group.find({ associate: parentId }).select("_id");
    // if (_.isEmpty(otherGroups))
    //   return {
    //     hasError: true,
    //     msg: "Error: No groups found with the given parentId",
    //     statusCode: 400,
    //   };
    let totalPlayers = 0;
    await Promise.all(
      otherGroups.map(async (group) => {
        let player = await Player.count({ group: group._id });
        totalPlayers = totalPlayers + player;
      })
    );

    // const otherAssociates = await Associate.find({ parentId: parentId }).select("_id");
    const otherAssociates = await Associate.aggregate([
      { $match: { parentId: mongoose.Types.ObjectId(parentId) } },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$number_of_players",
          },
        },
      },
    ]);

    if (!_.isEmpty(otherAssociates))
      totalPlayers = totalPlayers + otherAssociates[0].total;

    let playersLeft = parentAssociate.number_of_players - totalPlayers;
    return { hasError: false, data: playersLeft };
  } catch (error) {
    return {
      hasError: true,
      msg: "Server Error in playersCheck",
      statusCode: 500,
      error: error,
    };
  }
}

exports.getPlayerMedia = async (req, res) => {
  if (_.isEmpty(req.body.device_key))
    return res.json({ msg: "Device key requied" });

  const player = await Player.findOne({ device_key: req.body.device_key });

  if (!player)
    return res
      .status(404)
      .json({ msg: "The player with the given device key was not found." });

  const groupId = player.group;
  // const responseData = {};
  const playlist = await Playlist.find({ group: groupId, default: true })
    .select("playlist")
    .populate({
      path: "playlist.media_id",
      select: "-_id",
      match: { active: true },
    });
  const schedule = await Schedule.find({
    group: groupId,
    startDate: { $lte: Date.now() },
    endDate: { $gte: Date.now() },
  }).select("playlist_id");
  const schedulePlaylist = [];
  if (!_.isEmpty(schedule)) {
    await Promise.all(
      schedule.map(async (thisSchedule) => {
        let playlist = await Playlist.find({ _id: thisSchedule.playlist_id })
          .select("playlist")
          .populate({
            path: "playlist.media_id",
            select: "-_id",
            match: { active: true },
          });
        schedulePlaylist.push(playlist);
      })
    );
  }

  res.json({ playlist, schedulePlaylist });
};
