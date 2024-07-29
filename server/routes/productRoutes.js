const productController = require("./../controllers/productController");
const express = require("express");
const router = express.Router();
const uploadFiles = require("../utils/multerConfig");

router
  .route("/:slug?") // Make slug parameter optional by adding a question mark (?)
  .get(productController.getAllProducts)
  .post(uploadFiles, productController.createProduct);

module.exports = router;
