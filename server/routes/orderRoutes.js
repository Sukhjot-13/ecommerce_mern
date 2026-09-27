const express = require("express");
const orderController = require("../controllers/orderController");
const { requireOwner } = require("../utils/authGuard");

const router = express.Router();

router
  .route("/")
  .post(requireOwner((req) => req.body && req.body.userId), orderController.createOrder)
  .get(requireOwner((req) => req.query.userId), orderController.getAllOrders);

module.exports = router;
