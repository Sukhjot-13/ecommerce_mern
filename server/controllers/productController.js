const APIFeatures = require("../utils/apiFeatures");
const Product = require("./../models/productModel");
// controllers/productController.js
const Category = require("./../models/categoryModel");

exports.getAllProducts = async (req, res, next) => {
  try {
    const slug = req.params.slug; // Get the slug from request parameters
    if (slug) {
      // If slug is provided, find product by slug
      const product = await Product.findOne({ slug })
        .populate({
          path: "reviews",
          populate: {
            path: "user",
            select: "userName",
          },
        })
        .populate("category"); // Populate category fie
      if (!product) {
        return res
          .status(404)
          .json({ status: "fail", message: "Product not found" });
      }
      return res.status(200).json({ status: "success", product });
    } else {
      // If slug is not provided, treat it as a request for all products
      const features = new APIFeatures(Product.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .search();

      // Count all documents that match the filters and search criteria.
      // NOTE: countDocuments takes a filter object — pass the built query's
      // filter via getQuery(), never the Query instance itself.
      const totalResults = await Product.countDocuments(features.query.getQuery());

      // Pagination
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 8; // Adjust default limit if needed
      const skip = (page - 1) * limit;
      const products = await features.query.skip(skip).limit(limit);
      const totalPages = Math.ceil(totalResults / limit);

      return res.status(200).json({
        status: "success",
        results: products.length,
        totalResults,
        totalPages,
        data: { products },
      });
    }
  } catch (err) {
    return res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  const parseJsonArray = (value, field) => {
    if (value === undefined || value === null || value === "") return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      throw new Error(`Invalid JSON for field '${field}'`);
    }
  };

  try {
    // Extract data from the request
    const {
      brandName,
      productName,
      category,
      price,
      description,
      tags,
      features,
    } = req.body;

    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    // Handle files (can be single or multiple; empty when none uploaded)
    const images = (req.files || []).map((file) => file.path);

    // Log the extracted data
    console.log("Brand Name:", brandName);
    console.log("Product Name:", productName);
    console.log("Category:", category);
    console.log("Price:", price);
    console.log("Description:", description);
    console.log("Tags:", parseJsonArray(tags, "tags"));
    console.log("Features:", parseJsonArray(features, "features"));
    console.log("Images:", images);

    // Create the product object
    const productData = {
      brand: brandName,
      name: productName,
      category,
      price,
      description,
      tags: parseJsonArray(tags, "tags"),
      additionalFeatures: parseJsonArray(features, "features"), // Added additional features
      images, // Assuming you store multiple image paths in the database
    };

    // Use the create method to add the product to the database
    const createdProduct = await Product.create(productData);

    // Respond with success message
    res.json({
      message: "Product created successfully",
      product: createdProduct,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ error: error.message });
  }
};
