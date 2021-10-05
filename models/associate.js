const mongoose = require("mongoose");
require('mongoose-long')(mongoose);
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const materializedPlugin = require("mongoose-materialized");

const AssociateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    description: {
      type: String,
      trim: true,
    },
    number_of_players: {
      type: Number,
      required: true,
    },
    storage: {
      type: Number,
      required: true,
    },
    used_storage: {
      type: mongoose.Schema.Types.Long,
      // required: true,
      default:0
    },
  },
  { timestamps: true }
);

AssociateSchema.plugin(materializedPlugin);
const Associate = mongoose.model("Associate", AssociateSchema);

function validateAssociate(associate) {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    description: Joi.string(),
    number_of_players: Joi.number().min(1).required(),
    storage: Joi.number().min(1).required(),
    parentId: Joi.objectId(),
  });

  return schema.validate(associate);
}

exports.Associate = Associate;
exports.validate = validateAssociate;
