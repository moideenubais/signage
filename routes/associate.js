const express = require("express");
const router = express.Router();

const associate = require("../controllers/associate");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const policy = require("../policies/policy");

// router.get("/", service.getServices);
// router.post("/", [ upload.single("serviceImage")], service.postService);
// router.get("/:id", validateObjectId, service.getSingleService);
// router.delete("/:id", validateObjectId, service.deleteService);
// router.put("/:id", [upload.single("serviceImage")], service.updateService);

router
  .route("/")
  .all(auth,policy.isAllowed)
  .get(associate.getRootNode, associate.listAssociates)
  .post(associate.createRootNode, associate.createAssociate);

router
  .route("/children/")
  .all(auth,policy.isAllowed)
  .get(associate.getChildren);

router
  .route("/:id")
  .all(validateObjectId, auth, policy.isAllowed)
  .get(associate.getSingleAssociate)
  .put(associate.updateAssociate)
  .delete(associate.deleteAssociate);

module.exports = router;
