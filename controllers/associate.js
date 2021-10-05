const { Associate, validate } = require("../models/associate");
const _ = require("lodash");
const { User } = require("../models/user");
const { Group } = require("../models/group");
const { Content } = require("../models/content");
const common = require("../common/common");
const log = require("./log");
const mongoose = require("mongoose");
const { Player } = require("../models/player");
const Joi = require("joi");

exports.createRootNode = async (req, res, next) => {
  let query = {
    parentId: null,
  };

  try {
    const rootCategory = await Associate.findOne(query);
    if (_.isEmpty(rootCategory)) {
      Associate.Building(function () {
        // building materialized path
      });
      const newRootCategory = new Associate({
        name: "server",
        number_of_players: 1000,
        storage: 1000,
      });

      const response = await newRootCategory.save();
      req.rootCategory = response;
      next();
    } else {
      req.rootCategory = rootCategory;
      next();
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Server Error in associate.createRootNode");
  }
};

exports.createAssociate = async (req, res) => {
  const user = req.user;
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ err: error.details[0].message });

  const rootCategory = req.rootCategory;

  const parentId = req.body.parentId;
  req.body.parentId = user.associate;
  if (!_.isEmpty(parentId)) {
    // check if the use has access to the parent associate
    const accessCheckData = await common.accessCheck({
      associateId: parentId,
      user: req.user,
      item: "associate",
    });
    if (accessCheckData.hasError) {
      return res
        .status(accessCheckData.statusCode || 400)
        .json({ err: accessCheckData.msg });
    }
    req.body.parentId = parentId;
  }
  const storage = await storageCheck(req.body.parentId);
  if (storage.hasError) {
    if (storage.statusCode == 500)
      console.log("Server Error in storageCheck", storage.error);
    return res.status(storage.statusCode || 400).json({ err: storage.msg });
  }
  if (!(storage.data > 0))
    return res.json({
      msg: "There is no storage left, Add more storage for the parent",
    });

  if (req.body.storage > storage.data)
    return res.json({
      msg:
        "Storage left: " + storage.data + "GB, Add more storage for the parent",
    });
  const players = await playerCheck(req.body.parentId);
  if (players.hasError) {
    if (players.statusCode == 500)
      console.log("Server Error in playersCheck", players.error);
    return res.status(players.statusCode || 400).json({ err: players.msg });
  }
  if (!(players.data > 0))
    return res.json({
      msg: "There is no players left, Add more players to the parent",
    });

  if (req.body.number_of_players > players.data)
    return res.json({
      msg:
        "players left: " + players.data + ", Add more players for the parent",
    });
  // return;

  Associate.Building(function () {
    // building materialized path
  });

  const newAssociate = new Associate({
    name: req.body.name,
    number_of_players: req.body.number_of_players,
    storage: req.body.storage,
    parentId: req.body.parentId,
  });

  if (!_.isEmpty(req.body.description))
    newAssociate.description = req.body.description;
  try {
    await newAssociate.save();

    res.send(newAssociate);

    const logObject = {
      username: req.user.email,
      userObjectId: req.user._id,
      objectType: "associate",
      objectId: newAssociate._id,
      objectName: newAssociate.name,
      action: "created",
      action_done_under: newAssociate.parentId,
    };
    log.postLog(logObject);
  } catch (error) {
    console.log("Server Error in associate.createAssociate", error);
    res.status(500).send("Server Error in associate.createAssociate");
  }
};

exports.getRootNode = async (req, res, next) => {
  var query = {
    parentId: null,
  };

  try {
    const rootCategory = await Associate.findOne(query);
    req.rootCategory = rootCategory;
    return next();
  } catch (error) {
    console.log("Server Error in associate.getRootNode", error);
    res.status(500).send("Server Error in associate.getRootNode");
  }
};

exports.listAssociates = async (req, res) => {
  const page = +req.query.page || 1;
  let itemsPerPage = 10000;
  const user = req.user;
  const rootCategory = req.rootCategory;
  const query = {};

  query._id = user.associate;

  if (_.isEmpty(rootCategory)) {
    return res.json({ err: "No root Category Found" });
  }

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
    query._id = req.query.associate;
  }
  const accessibleAssociates = await common.getAccessibleAssociates(query._id);
  if (accessibleAssociates.hasError) {
    return res
      .status(accessibleAssociates.statusCode || 400)
      .json({ err: accessibleAssociates.msg });
  }
  //remove current user associate, change later if needed
  accessibleAssociates.associateIds = accessibleAssociates.associateIds.filter(
    (item) => item !== query._id
  );
  query._id = { $in: accessibleAssociates.associateIds };
  if (!_.isEmpty(req.query.limit)) itemsPerPage = +req.query.limit;
  if (!_.isEmpty(req.query.search)) {
    query["name"] = { $regex: req.query.search, $options: "i" };
  }
  try {
    const associateCount = await Associate.count(query);
    const allAssociates = await Associate.find(query)
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .select("-__v -password")
      .lean();
    if (_.isEmpty(allAssociates))
      return res.json({ msg: "No associates found" });
    return res.json({
      associates: allAssociates,
      info: {
        totalNumber: associateCount,
        hasNextPage: itemsPerPage * page < associateCount,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(associateCount / itemsPerPage),
      },
    });
  } catch (error) {
    console.log("Error in associate.listAssociates", error);
    return res.json({ err: "Server Error in associate.listAssociate" });
  }
  // Associate.GetArrayTree(query, function (err, categoryTree) {
  //   if (err) {
  //     return res.status(500).send("Error in associate.listAssociate");
  //   } else {
  //     return res.status(200).send(categoryTree[0]);
  //   }
  // });
};

exports.getChildren = async (req, res) => {
  const user = req.user;
  let associateId = user.associate;

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
    associateId = req.query.associate;
  }

  try {
    const children = await Associate.find({ parentId: associateId });
    return res.status(200).send(children);
  } catch (error) {
    console.log("Error in associate.listAssociate", error);
    return res.status(500).send("Error in associate.listAssociate");
  }
};

exports.getSingleAssociate = async (req, res) => {
  const accessCheckData = await common.accessCheck({
    associateId: req.params.id,
    user: req.user,
    item: "associate",
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }
  const associate = await Associate.findById(req.params.id).select("-__v");

  if (!associate)
    return res
      .status(404)
      .json({ msg: "The associate with the given ID was not found." });

  res.send(associate);
};

exports.deleteAssociate = async (req, res) => {
  const accessCheckData = await common.accessCheck({
    associateId: req.params.id,
    user: req.user,
    item: "associate",
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }

  try {
    const associateExist = await Associate.findOne({ _id: req.params.id });
    if (!associateExist)
      return res
        .status(404)
        .json({ msg: "The associate with the given ID was not found." });

    const nestedAssociates = await Associate.find({
      path: { $regex: req.params.id, $options: "i" },
    });
    if (!_.isEmpty(nestedAssociates))
      return res.status(400).json({
        msg: "Denied, There are sub associates under this association",
      });

    const groupExist = await Group.find({ associate: req.params.id });
    if (!_.isEmpty(groupExist))
      return res
        .status(400)
        .json({ msg: "Denied, There are groups under this association" });

    const userExist = await User.find({ associate: req.params.id });
    if (!_.isEmpty(userExist))
      return res
        .status(400)
        .json({ msg: "Denied, There are users under this association" });

    const contentExist = await Content.find({ associate: req.params.id });
    if (!_.isEmpty(contentExist))
      return res
        .status(400)
        .json({ msg: "Denied, There are contents under this associate" });

    const associate = await Associate.findByIdAndRemove(req.params.id);

    res.send(associate);

    const logObject = {
      username: req.user.email,
      userObjectId: req.user._id,
      objectType: "associate",
      objectId: associate._id,
      objectName: associate.name,
      action: "deleted",
      action_done_under: associate.parentId,
    };

    log.postLog(logObject);
  } catch (error) {
    console.log("Server Error in associate.deleteAssociate", error);
    return res.status(400).send("Server Error in associate.deleteAssociate");
  }
};

exports.updateAssociate = async (req, res) => {
  const { error } = validateAssociate(req.body);
  if (error) return res.status(400).json({ err: error.details[0].message });

  const accessCheckData = await common.accessCheck({
    associateId: req.params.id,
    user: req.user,
    item: "associate",
  });
  if (accessCheckData.hasError) {
    return res
      .status(accessCheckData.statusCode || 400)
      .json({ err: accessCheckData.msg });
  }

  const associateContent = {};
  const currentAssociate = await Associate.findOne({ _id: req.params.id });
  if (!currentAssociate)
    return res.json({ msg: "The parent Associate not found" });

  if (!_.isEmpty(req.body.name)) {
    associateContent.name = req.body.name;
  }
  if (!_.isUndefined(req.body.number_of_players)) {
    //check for availablity of players
    const players = await playerCheck(currentAssociate.parentId);
    if (players.hasError) {
      if (players.statusCode == 500)
        console.log("Server Error in playersCheck", players.error);
      return res.status(players.statusCode || 400).json({ err: players.msg });
    }
    if (!(players.data + currentAssociate.number_of_players > 0))
      return res.json({
        msg: "There is no players left, Add more players to the parent",
      });

    if (
      req.body.number_of_players >
      players.data + currentAssociate.number_of_players
    )
      return res.json({
        msg:
          "players left: " + players.data + ", Add more players for the parent",
      });
    //end of check

    //check for number of players under current associate
    const numberOfplayersUnder = await checkPlayerUnder(req.params.id);
    if (players.hasError) {
      if (players.statusCode == 500)
        console.log("Server Error in checkPlayerUnder", players.error);
      return res.status(players.statusCode || 400).json({ err: players.msg });
    }
    if (req.body.number_of_players < numberOfplayersUnder.data)
      return res.json({
        msg:
          "Failed, This associate has " +
          numberOfplayersUnder.data +
          " players under already",
      });
    //end of check
    associateContent.number_of_players = req.body.number_of_players;
  }

  if (!_.isUndefined(req.body.storage)) {
    //check for availablity of storage
    const storage = await storageCheck(currentAssociate.parentId);
    if (storage.hasError) {
      if (storage.statusCode == 500)
        console.log("Server Error in storageCheck", storage.error);
      return res.status(storage.statusCode || 400).json({ err: storage.msg });
    }
    if (!(storage.data + currentAssociate.storage > 0))
      return res.json({
        msg: "There is no storage left, Add more storage for the parent",
      });

    if (req.body.storage > storage.data + currentAssociate.storage)
      return res.json({
        msg:
          "Storage left: " +
          storage.data +
          "GB, Add more storage for the parent",
      });
    //end of check

    //check for storage under current associate
    const storageUnder = await checkStorageUnder(req.params.id);
    if (storageUnder.hasError) {
      if (storageUnder.statusCode == 500)
        console.log("Server Error in checkStorageUnder", storageUnder.error);
      return res
        .status(storageUnder.statusCode || 400)
        .json({ err: storageUnder.msg });
    }
    if (req.body.storage < storageUnder.data)
      return res.json({
        msg:
          "Failed, This associate has " +
          storageUnder.data +
          "GB storage under already",
      });
    //end of check

    associateContent.storage = req.body.storage;
  }
  if (!_.isEmpty(req.body.description)) {
    associateContent.description = req.body.description;
  }

  if (_.isEmpty(associateContent)) {
    return res.json({ msg: "Empty body" });
  }
  const associate = await Associate.findByIdAndUpdate(
    req.params.id,
    associateContent,
    { new: true }
  );

  if (!associate)
    return res
      .status(404)
      .json({ msg: "The associate with the given ID was not found." });

  res.send(associate);
  const logObject = {
    username: req.user.email,
    userObjectId: req.user._id,
    objectType: "associate",
    objectId: associate._id,
    objectName: associate.name,
    action: "updated",
    action_done_under: associate.parentId,
    updated_object: associateContent,
  };

  log.postLog(logObject);
};

async function storageCheck(parentId) {
  try {
    const parentAssociate = await Associate.findOne({ _id: parentId }).select(
      "storage"
    );
    if (_.isEmpty(parentAssociate))
      return {
        hasError: true,
        msg: "Associate with the given parentId not found",
        statusCode: 400,
      };
    const siblingAssociate = await Associate.aggregate([
      { $match: { parentId: mongoose.Types.ObjectId(parentId) } },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$storage",
          },
        },
      },
    ]);
    let total = 0;
    if (!_.isEmpty(siblingAssociate)) total = siblingAssociate[0].total;
    let storageLeft = parentAssociate.storage - total;
    return { hasError: false, data: storageLeft };
  } catch (error) {
    return {
      hasError: true,
      msg: "Server Error in storageCheck",
      statusCode: 500,
      error: error,
    };
  }
}

async function checkStorageUnder(parentId) {
  try {
    const childAssociate = await Associate.aggregate([
      { $match: { parentId: mongoose.Types.ObjectId(parentId) } },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$storage",
          },
        },
      },
    ]);
    let total = 0;
    if (!_.isEmpty(childAssociate)) total = childAssociate[0].total;
    // let storageLeft = parentAssociate.storage - total;
    return { hasError: false, data: total };
  } catch (error) {
    return {
      hasError: true,
      msg: "Server Error in storageCheck",
      statusCode: 500,
      error: error,
    };
  }
}

async function playerCheck(parentId) {
  try {
    const parentAssociate = await Associate.findOne({ _id: parentId }).select(
      "number_of_players"
    );
    if (_.isEmpty(parentAssociate))
      return {
        hasError: true,
        msg: "Associate with the given parentId not found",
        statusCode: 400,
      };
    let total = 0;
    const groupsUnder = await Group.find({ associate: parentId }).select("_id");
    if (!_.isEmpty(groupsUnder)) {
      const groupIds = groupsUnder.map((group) => group._id);
      const playersUnder = await Player.countDocuments({ group: { $in: groupIds } });
      total = total + playersUnder;
    }
    const siblingAssociate = await Associate.aggregate([
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
    // let total = 0;
    if (!_.isEmpty(siblingAssociate)) total = total + siblingAssociate[0].total;
    let playersLeft = parentAssociate.number_of_players - total;
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

async function checkPlayerUnder(associateId) {
  try {
    let numberOfplayersUnder = 0;
    const groupsUnder = await Group.find({ associate: associateId }).select(
      "_id"
    );
    if (!_.isEmpty(groupsUnder)) {
      const groupIds = groupsUnder.map((group) => group._id);
      const playersUnder = Player.count({ group: { $in: groupIds } });
      numberOfplayersUnder = numberOfplayersUnder + playersUnder;
    }
    const childAssociate = await Associate.aggregate([
      { $match: { parentId: mongoose.Types.ObjectId(associateId) } },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$number_of_players",
          },
        },
      },
    ]);
    // let total = 0;
    if (!_.isEmpty(childAssociate))
      numberOfplayersUnder = numberOfplayersUnder + childAssociate[0].total;
    // let playersLeft = parentAssociate.number_of_players - total;
    return { hasError: false, data: numberOfplayersUnder };
  } catch (error) {
    return {
      hasError: true,
      msg: "Server Error in playersCheck",
      statusCode: 500,
      error: error,
    };
  }
}

function validateAssociate(associate) {
  const schema = Joi.object({
    name: Joi.string().max(50),
    description: Joi.string(),
    number_of_players: Joi.number().min(1),
    storage: Joi.number().min(1),
    parentId: Joi.objectId(),
  });

  return schema.validate(associate);
}
