// // routes/cartRoutes.js
// const express = require("express");
// const cartController = require("../controllers/cartController");
// const router = express.Router();

// router.post("/add", cartController.addToCart);
// router.get("/:userId", cartController.getCart);
// router.delete("/remove", cartController.removeFromCart);

// module.exports = router;

// routes/cartRoutes.js
const express = require("express");
const cartController = require("../controllers/cartController");
const router = express.Router();

router.post("/add", cartController.addToCart);
router.get("/:userId", cartController.getCart);
router.post("/remove", cartController.removeFromCart);

module.exports = router;
