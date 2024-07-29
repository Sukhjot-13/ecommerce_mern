const mongoose = require("mongoose");
const slugify = require("slugify");
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  console.log(this.slug);
  next();
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
