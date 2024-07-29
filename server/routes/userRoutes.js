const userController = require("./../controllers/userController");
const express = require("express");
const router = express.Router();

router.route("/").post(userController.createUser);
router.get("/:userId", userController.getUserById);
router.post("/getUserId", userController.getUserId);

// router.route("/").post((req, res) => {
//   console.log("object");
// });

module.exports = router;
