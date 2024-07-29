// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//   //   user: {
//   //     type: mongoose.Schema.Types.ObjectId,
//   //     ref: "User", // Reference the User model
//   //     required: true,
//   //   },
//   paymentIntentId: {
//     type: String,
//     required: true,
//   },
//   customerEmail: {
//     type: String,
//     required: true,
//   },
//   items: [
//     {
//       //   productId: {
//       //     type: mongoose.Schema.Types.ObjectId,
//       //     ref: "Product", // Reference your product model
//       //     required: true,
//       //   },
//       productName: {
//         type: "string",
//         required: true,
//       },
//       quantity: {
//         type: Number,
//         required: true,
//         min: 1,
//       },
//       price: {
//         type: Number,
//         required: true,
//         min: 0,
//       },
//     },
//   ],
//   orderTotal: {
//     type: Number,
//     required: true,
//     min: 0,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Order = mongoose.model("Order", orderSchema);

// module.exports = Order;
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference the User model
    required: true,
  },
  paymentIntentId: {
    type: String,
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference your product model
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  orderTotal: {
    type: Number,
    required: true,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
