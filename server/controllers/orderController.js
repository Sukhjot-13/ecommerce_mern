const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const { computeOrderTotal } = require("../utils/orderTotals");

exports.createOrder = async (req, res) => {
  const { userId, paymentIntentId, items } = req.body;
  try {
    if (!userId || !paymentIntentId) {
      return res
        .status(400)
        .json({ error: "userId and paymentIntentId are required" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "items must be a non-empty array" });
    }

    // Never trust the client total: reload each product price server-side and
    // recompute. A tampered quantity/price fails here with 400.
    const pricedLines = await Promise.all(
      items.map(async (item, i) => {
        if (!item || !item.productId) {
          throw new Error(`items[${i}].productId is required`);
        }
        const product = await Product.findById(item.productId)
          .select("price")
          .lean();
        if (!product) {
          throw new Error(`Unknown product: ${item.productId}`);
        }
        return { price: product.price, quantity: item.quantity };
      })
    );
    const orderTotal = computeOrderTotal(pricedLines);

    const order = new Order({
      user: userId,
      paymentIntentId,
      items: items.map((item, i) => ({
        productId: item.productId,
        quantity: pricedLines[i].quantity,
        price: pricedLines[i].price,
      })),
      orderTotal,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getAllOrders = async (req, res) => {
  try {
    if (!req.query.userId) {
      return res.status(400).json({ error: "userId query param is required" });
    }
    const orders = await Order.find({ user: req.query.userId }).populate(
      "items.productId"
    );
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};
