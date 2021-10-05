const { Associate } = require("../models/associate");
const mongoose = require("mongoose");
const _ = require('lodash')


async function createRoot() {
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
      if(response)
        console.log("Created root associate");
    }
  } catch (error) {
    console.log("error", error);
  }
}
mongoose
  .connect("mongodb://localhost:27017/corevine", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then( async() => {
    console.log("Connected to the database!");
    await createRoot();
    mongoose.disconnect();
    console.log("Disconnected from the database!");

  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
