const productController = require("./../controllers/productController");
const express = require("express");
const router = express.Router();
const uploadFiles = require("../utils/multerConfig");
const { requireAdmin } = require("../utils/authGuard");

router
  .route("/:slug?") // Make slug parameter optional by adding a question mark (?)
  .get(productController.getAllProducts)
  // requireAdmin runs before multer so unauthorized uploads are rejected early.
  // Client must send its user _id in the x-user-id header (multipart bodies
  // aren't parsed yet at this point).
  .post(requireAdmin, uploadFiles, productController.createProduct);

module.exports = router;
