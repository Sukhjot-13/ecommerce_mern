const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    images: {
      type: [String], // Changed to array of strings
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: [{ type: String }],
    additionalFeatures: [
      {
        type: String,
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  console.log(this.slug);
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
