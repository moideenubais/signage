const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");

const associate = require("./routes/associate");
const group = require("./routes/group");
const player = require("./routes/player");
const login = require("./routes/login");
const user = require("./routes/user");
const content = require("./routes/content");
const media = require("./routes/media");
const playlist = require("./routes/playlist");
const schedule = require("./routes/schedule");
const log = require("./routes/log");
const fileAccess = require("./middleware/fileAccess");
const auth = require("./middleware/auth");

const app = express();

require("./policies/policy").invokeRolesPolicies();

app.use(helmet({ contentSecurityPolicy: false }));
// app.use(express.static(path.join(__dirname,'build')));
// app.use("/media",fileAccess, express.static("Media"));
// app.use("/serviceImages", express.static("serviceImages"));
// app.use("/projectImages", express.static("projectImages"));
// app.use("/slideImages", express.static("slideImages"));
// app.use("/newsImages", express.static("newsImages"));
// app.use("/testimonialImages", express.static("testimonialImages"));
app.use(bodyParser.json());
app.use(cors());
//removed fileAccess
// app.use("/Media", fileAccess, express.static("Media"));
app.use("/corevine/Media", express.static("Media"));

app.use("/corevine/api/associate", associate);
app.use("/corevine/api/group", group);
app.use("/corevine/api/player", player);
app.use("/corevine/api/login", login);
app.use("/corevine/api/user", user);
app.use("/corevine/api/content", content);
app.use("/corevine/api/media", media);
app.use("/corevine/api/playlist", playlist);
app.use("/corevine/api/schedule", schedule);
app.use("/corevine/api/log", log);
app.use("/corevine/api/tokenIsValid", auth, (req, res) => {
  res.send({ value: true, message: "success" });
});
// app.get('/',(req,res)=>{
//   res.send("Hello");
// })

const port = process.env.PORT || 4000;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to the database!");
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
