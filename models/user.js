const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const passwordComplexity = require("joi-password-complexity").default;
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    associate: {
      type: mongoose.Schema.ObjectId,
      ref: "Associate",
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10,
    },
    active: {
      type: Boolean,
      default: false,
    },
    privileges: [
      {
        type: String,
        enum: ["view","user", "group", "player", "content", "schedule", "playlist","associate","admin"],
        required: true,
      },
    ],
  },
  { timestamps: true }
);

UserSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      address: this.address,
      associate:this.associate,
      privileges: this.privileges,
      active: this.active,
      mobile: this.mobile
    },
    process.env.JWT_KEY
  );
  return token;
};

const User = mongoose.model("User", UserSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    email: Joi.string().email().required(),
    password: passwordComplexity().required(),
    confirm_password: Joi.any().equal(Joi.ref('password'))
    .required()
    .label('Confirm password')
    .options({ messages: { 'any.only': '{{#label}} does not match'} }),
    address: Joi.string(),
    mobile: Joi.string().pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/).required(),
    associate: Joi.objectId().required(),
    active: Joi.boolean(),
    privileges: Joi.array().items(Joi.string().valid("view","user", "group", "player", "content", "schedule", "playlist","associate"))
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
