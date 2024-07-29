const Order = require("../models/orderModel");
exports.createOrder = async (req, res) => {
  const { userId, paymentIntentId, items, orderTotal } = req.body;
  try {
    const order = new Order({
      user: userId,
      paymentIntentId,
      items,
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
    const orders = await Order.find({ user: req.query.userId }).populate(
      "items.productId"
    );
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};
