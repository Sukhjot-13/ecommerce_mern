const express = require("express");
const router = express.Router();
const reviewController = require("./../controllers/reviewController");
const { requireOwner } = require("../utils/authGuard");
router
  .route("/:id?") // Make slug parameter optional by adding a question mark (?)
  .get(reviewController.getAllReviews)
  .post(requireOwner((req) => req.body && req.body.user), reviewController.createReview);

module.exports = router;
