const express = require("express");
const categoryController = require("../controllers/categoryController");
const { requireAdmin } = require("../utils/authGuard");

const router = express.Router();

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(requireAdmin, categoryController.createCategory);

module.exports = router;
