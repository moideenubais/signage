const { Associate } = require("../models/associate");
const { Group } = require("../models/group");
const _ = require("lodash");
const { Content } = require("../models/content");
const { Media } = require("../models/media");
const { Player } = require("../models/player");
const { Playlist } = require("../models/playlist");
const { Schedule } = require("../models/schedule");
const { User } = require("../models/user");

exports.accessCheck = async (content) => {
  try {
    if (
      content.item == "group" ||
      content.item == "player" ||
      content.item == "playlist" ||
      content.item == "schedule"
    ) {
      if (content.item == "player") {
        const currentPlayer = await Player.findOne({
          _id: content.playerId,
        }).select("group");
        if (_.isEmpty(currentPlayer))
          return {
            hasError: true,
            msg: "Player with the given ID not found",
            statusCode: 400,
          };
        content.groupId = currentPlayer.group;
      }
      if (content.item == "playlist") {
        const currentPlaylist = await Playlist.findOne({
          _id: content.playlistId,
        }).select("group");
        if (_.isEmpty(currentPlaylist))
          return {
            hasError: true,
            msg: "Playlist with the given ID not found",
            statusCode: 400,
          };
        content.groupId = currentPlaylist.group;
      }
      if (content.item == "schedule") {
        const currentSchedule = await Schedule.findOne({
          _id: content.scheduleId,
        }).select("group");
        if (_.isEmpty(currentSchedule))
          return {
            hasError: true,
            msg: "Schedule with the given ID not found",
            statusCode: 400,
          };
        content.groupId = currentSchedule.group;
      }
      const currentGroup = await Group.findOne({ _id: content.groupId }).select(
        "associate"
      );
      if (_.isEmpty(currentGroup))
        return {
          hasError: true,
          msg: "Group with the given ID not found",
          statusCode: 400,
        };
      content.associateId = currentGroup.associate.toString();
    } else if (content.item == "content" || content.item == "media") {
      if (content.item == "media") {
        const currenMedia = await Media.findOne({
          _id: content.mediaId,
        }).select("label");
        if (_.isEmpty(currenMedia))
          return {
            hasError: true,
            msg: "Media with the given ID not found",
            statusCode: 400,
          };
        content.contentId = currenMedia.label;
      }
      const currentLabel = await Content.findOne({
        _id: content.contentId,
      }).select("associate");
      if (_.isEmpty(currentLabel))
        return {
          hasError: true,
          msg: "Content with the given ID not found",
          statusCode: 400,
        };
      content.associateId = currentLabel.associate.toString();
    } else if (content.item == "user") {
      const currentUser = await User.findOne({ _id: content.userId }).select(
        "associate"
      );
      if (_.isEmpty(currentUser))
        return {
          hasError: true,
          msg: "User with the given ID not found",
          statusCode: 400,
        };
      content.associateId = currentUser.associate.toString();
    }
    const currentAssociate = await Associate.findOne({
      _id: content.associateId,
    }).select("path");
    if (_.isEmpty(currentAssociate))
      return {
        hasError: true,
        msg: "Associate with the given ID not found",
        statusCode: 404,
      };
    const pathArray = currentAssociate.path.split(",");
    pathArray.push(content.associateId);

    if (!pathArray.includes(content.user.associate))
      return { hasError: true, msg: "Access Denied", statusCode: 403 };
    if (content.item == "player")
      return { hasError: false, data: content.groupId };
    return { hasError: false, data: content.associateId };
  } catch (error) {
    return {
      hasError: true,
      msg: "Server Error in common.AccessCheck",
      statusCode: 500,
      error: error,
    };
  }
};

exports.getAccessibleAssociates = async (associateId) => {
  const totalAssociateIds = [associateId];
  const associate = await Associate.findById(associateId);
  if (_.isEmpty(associate))
    return {
      hasError: true,
      msg: "Associate with the given id not found",
      statusCode: 400,
    };
  const children = await associate.getChildren();
  if (!_.isEmpty(children)) {
    children.forEach((child) => {
      totalAssociateIds.push(child._id.toString());
    });
  }
  return { hasError: false, associateIds: totalAssociateIds };
};

exports.getAccessibleGroups = async (associateId) => {
  const totalAssociateIds = [associateId];
  const associate = await Associate.findById(associateId);
  if (_.isEmpty(associate))
    return {
      hasError: true,
      msg: "Associate with the given id not found",
      statusCode: 400,
    };
  const children = await associate.getChildren();
  if (!_.isEmpty(children)) {
    children.forEach((child) => {
      totalAssociateIds.push(child._id.toString());
    });
  }
  const groups = await Group.find({ associate: { $in: totalAssociateIds } });
  if (_.isEmpty(groups))
    return {
      hasError: true,
      msg: "No Groups found with access",
      statusCode: 400,
    };
  else {
    const totalGroupIds = groups.map((group) => {
      return group._id.toString();
    });
    return { hasError: false, groupIds: totalGroupIds };
  }
};
