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
const { requireOwner } = require("../utils/authGuard");
const router = express.Router();

const ownCartBody = requireOwner((req) => req.body && req.body.id);
const ownCartParam = requireOwner((req) => req.params.userId);

router.post("/add", ownCartBody, cartController.addToCart);
router.get("/:userId", ownCartParam, cartController.getCart);
router.post("/remove", ownCartBody, cartController.removeFromCart);

module.exports = router;
