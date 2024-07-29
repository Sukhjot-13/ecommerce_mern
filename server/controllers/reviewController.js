const Review = require("./../models/reviewModel");
const Product = require("./../models/productModel");

exports.getAllReviews = (req, res) => {
  res.json({
    message: "All reviews",
  });
};
// Example function to create a review and associate it with a product
exports.createReview = async (req, res) => {
  try {
    // Create a new review
    const review = await Review.create({
      rating: req.body.rating,
      comment: req.body.comment,
      user: req.body.user,
      product: req.params.id,
    });

    // Add the review ID to the product's reviews array
    await Product.findByIdAndUpdate(
      req.params.id,
      { $push: { reviews: review._id } },
      { new: true, useFindAndModify: false }
    );

    // Respond with the created review
    res.status(201).json({
      status: "success",
      data: {
        review,
      },
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
