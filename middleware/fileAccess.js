const _ = require("lodash");
const Joi = require("joi");
const {Player} = require('../models/player')

module.exports = async function (req, res, next) {
  const { error } = validateBody(req.body);
  if (error) return res.status(400).json({ err: error.details[0].message });
  try {
      const player = await Player.findOne({device_key:req.body.device_key});
      if(!player)   
        return res.json({msg:"Player with the given key not found"});
    next();
  } catch (ex) {
    console.log("Error in fileAccess middleware", ex);
    return res.status(400).json({ msg: "Error in fileAccess" });
  }
};

function validateBody(body) {
  const schema = Joi.object({
    device_key: Joi.string().required(),
  });

  return schema.validate(body);
}
