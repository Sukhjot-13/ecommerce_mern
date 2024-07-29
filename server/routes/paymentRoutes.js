const express = require("express");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

router
  .route("/create-checkout-session")
  .post(paymentController.createCheckoutSession);
router.route("/success").get(paymentController.successPayment);
router.route("/intent").post(paymentController.paymentIntent);
module.exports = router;
