// // controllers/cartController.js
// const Cart = require("../models/cartModel");
// const User = require("../models/userModel");

// exports.addToCart = async (req, res) => {
//   const { id, productId, quantity } = req.body;

//   try {
//     let cart = await Cart.findOne({ user: id });

//     if (!cart) {
//       cart = new Cart({ user: id, products: [] });
//     }

//     const productIndex = cart.products.findIndex(
//       (p) => p.product.toString() === productId
//     );

//     if (productIndex >= 0) {
//       cart.products[productIndex].quantity += quantity;
//     } else {
//       cart.products.push({ product: productId, quantity });
//     }

//     await cart.save();
//     res.status(200).json({ success: true, cart });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// exports.getCart = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const cart = await Cart.findOne({ user: userId }).populate(
//       "products.product"
//     );
//     if (!cart) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Cart not found" });
//     }

//     res.status(200).json({ success: true, cart });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// exports.removeFromCart = async (req, res) => {
//   const { id, productId } = req.body;

//   try {
//     const cart = await Cart.findOne({ user: id });
//     if (!cart) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Cart not found" });
//     }

//     cart.products = cart.products.filter(
//       (p) => p.product.toString() !== productId
//     );

//     await cart.save();
//     res.status(200).json({ success: true, cart });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };
// controllers/cartController.js
const Cart = require("../models/cartModel");
const User = require("../models/userModel");

exports.addToCart = async (req, res) => {
  const { id, productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: id });

    if (!cart) {
      cart = new Cart({ user: id, products: [] });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex >= 0) {
      cart.products[productIndex].quantity += quantity;
      if (cart.products[productIndex].quantity <= 0) {
        cart.products.splice(productIndex, 1);
      }
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  const { id, productId } = req.body;

  try {
    const cart = await Cart.findOne({ user: id });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId
    );

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
