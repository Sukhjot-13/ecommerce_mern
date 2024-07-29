const express = require("express");
const router = express.Router();
const reviewController = require("./../controllers/reviewController");
router
  .route("/:id?") // Make slug parameter optional by adding a question mark (?)
  .get(reviewController.getAllReviews)
  .post(reviewController.createReview);

module.exports = router;
