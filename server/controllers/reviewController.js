const Review = require("./../models/reviewModel");
const Product = require("./../models/productModel");

exports.getAllReviews = async (req, res) => {
  try {
    const filter = req.params.id ? { product: req.params.id } : {};
    const reviews = await Review.find(filter)
      .populate("user", "userName")
      .sort({ createdAt: -1 });
    res.status(200).json({ status: "success", results: reviews.length, data: { reviews } });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
// Example function to create a review and associate it with a product
exports.createReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ status: "fail", message: "Product not found" });
    }

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
