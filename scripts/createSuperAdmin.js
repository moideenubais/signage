const _ = require("lodash");
const bcrypt = require("bcrypt");

const { User } = require("../models/user");
const { Associate } = require("../models/associate");
const mongoose = require("mongoose");

createSuperAdmin = async () => {
  const userExist = await User.findOne({ email: "superadmin@gmail.com" });

  if (userExist) {
    console.log("user exists with email id");
    return;
  }

  const rootAssociate = await Associate.findOne({ parentId: null });
  if (!rootAssociate) {
    console.log("No root associate found");
    return;
  }

  const user = new User({
    name: "super admin",
    email: "superadmin@gmail.com",
    password: "superAdmin",
    address: "",
    associate: rootAssociate._id,
    mobile: "1234567890",
    active: true,
    privileges: [
      "view",
      "user",
      "group",
      "player",
      "content",
      "schedule",
      "playlist",
      "associate",
      "admin",
    ],
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  try {
    await user.save();
  } catch (err) {
    console.log("Server Error in user.postUser", err);
  }
};

mongoose
  .connect("mongodb://localhost:27017/corevine", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then( async() => {
    console.log("Connected to the database!");
    await createSuperAdmin();
    mongoose.disconnect();
    console.log("Disconnected from the database!");

  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });