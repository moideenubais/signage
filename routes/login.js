const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const log = require("../controllers/log");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ err: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).json({ msg: "Invalid username or password." });

  const validPassword = await bcrypt.compare((req.body.password).trim(), user.password);
  if (!validPassword)
    return res.status(400).json({ msg: "Invalid username or password." });

  const token = user.generateAuthToken();
  res.json({ token: token });
});

router.post("/resetPassword", async (req, res) => {
  if (_.isEmpty(req.body.email))
    return res.status(400).json({ err: "email is required" });

  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).json({ msg: "No account found with current id" });

  try {
    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.PASSWORD_RESET_JWT_KEY,
      {expiresIn:'5m'}
    );
    const htmlData =
      ` <div>
    <div>
      <h2>Please click on the below link to reset your password<h2>
      <a href='` +
      process.env.CLIENT_URL +
      `?token=` +
      token +
      `'>reset/` +
      token +
      `</a>
    </div>
  </div> `;
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: req.body.email,
      subject: "Reset Password",
      html: htmlData,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error while sending email", error);
        return res.status(500).json({ err: "Error while sending email[1]" });
      } else {
        return res.status(200).json({ msg: "Email sent", data: info.response });
      }
    });
  } catch (err) {
    console.log("Error while sending email", err);
    return res.status(500).json({ err: "Error while sending email[2]" });
  }
});

router.post("/confirmPassword", async (req, res) => {
  const token = req.body.token;
  if (!token) return res.status(401).json({ msg: "No token provided." });
  const password = req.body.password;
  if (!password) return res.status(400).json({ msg: "No password provided." });

  try {
    const decoded = jwt.verify(token, process.env.PASSWORD_RESET_JWT_KEY);
    let user = decoded;
    user = await User.findById(user._id);
    if (!user) return res.status(404).json({ msg: "user not found" });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    // user = User(user);
    await user.save();
    res.json({msg:"success"});
    const logObject = {
      username: user.email,
      userObjectId: user._id,
      objectType: "password",
      objectId: user._id,
      objectName: user.name,
      action: "updated",
      action_done_under: user.associate
    };
    log.postLog(logObject);
  } catch (ex) {
    console.log("Invalid token",ex)
    return res.status(500).json({ msg: "Invalid or expired token" });
  }
});

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().email().trim().required(),
    password: Joi.string().trim().required(),
  });

  return schema.validate(user);
}

module.exports = router;
