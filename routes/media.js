const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Media");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    let ext = path.extname(file.originalname);
    if (
      ext !== ".png" &&
      ext !== ".jpg" &&
      ext !== ".gif" &&
      ext !== ".jpeg" &&
      ext !== ".mp4"
    ) {
      return callback(new Error("Only images and videos are allowed"));
    }
    callback(null, true);
  },
});

const media = require("../controllers/media");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const policy = require("../policies/policy");

router
  .route("/playlist/:id")
  .get(validateObjectId, auth, policy.isAllowed, media.getPlaylistMedia);

router
  .route("/:id")
  .all(validateObjectId, auth, policy.isAllowed)
  .get(media.getMedias)
  .post([upload.single("media_file")], media.postMedia);

router
  .route("/file/:id")
  .all(validateObjectId, auth, policy.isAllowed)
  .get(media.getSingleMedia)
  .put([upload.single("media_file")], media.updateMedia)
  .delete(media.deleteMedia);

module.exports = router;
