const express = require("express");
const orderController = require("../controllers/orderController");

const router = express.Router();

router
  .route("/")
  .post(orderController.createOrder)
  .get(orderController.getAllOrders);

module.exports = router;
