const userController = require("./../controllers/userController");
const express = require("express");
const router = express.Router();

router.route("/").post(userController.createUser);
// NOTE: /getUserId must be registered BEFORE /:userId, otherwise the
// param route swallows it (userId = "getUserId").
// Preferred read-only lookup; POST kept as legacy alias for older clients.
router.get("/getUserId", userController.getUserId);
router.post("/getUserId", userController.getUserId);
router.get("/:userId", userController.getUserById);

// router.route("/").post((req, res) => {
//   console.log("object");
// });

module.exports = router;
