const stripe = require("stripe")(`${process.env.STRIPE_SECRET_KEY}`);
const Order = require("../models/orderModel");
const User = require("../models/userModel");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";

exports.createCheckoutSession = async (req, res) => {
  try {
    // Optional: { email, userId, items: [{ productId, quantity, price }] }
    // When userId + items are supplied they are carried in metadata so the
    // success handler can persist a schema-valid order.
    const { email, userId, items } = req.body || {};
    const session = await stripe.checkout.sessions.create({
      line_items: req.body.line_items,
      mode: "payment",
      success_url: `${SERVER_URL}/api/v1/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/cancel`,
      ...(email ? { customer_email: email } : {}),
      ...(userId || items
        ? { metadata: { userId: userId || "", items: JSON.stringify(items || []) } }
        : {}),
    });
    res.send({ status: "success", url: session.url });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail payement",
      message: err.message,
    });
  }
};

exports.successPayment = async (req, res) => {
  const sessionId = req.query.session_id;

  try {
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
    const customerEmail = stripeSession.customer_details?.email;

    // Resolve the buyer: explicit metadata userId first, then email lookup.
    let userId = stripeSession.metadata?.userId || null;
    if (!userId && customerEmail) {
      const buyer = await User.findOne({ email: customerEmail });
      if (buyer) userId = buyer._id;
    }
    if (!userId) {
      return res.status(400).json({
        status: "fail",
        message: "Cannot persist order: buyer not found. Pass userId in checkout metadata.",
      });
    }

    // The cart snapshot carried in metadata has real productIds (required by
    // the Order schema). Stripe line items only carry price/product refs, so
    // without metadata the order cannot be persisted — fail clearly (400)
    // instead of a schema-validation 500.
    let items = [];
    try {
      const snapshot = JSON.parse(stripeSession.metadata?.items || "[]");
      if (Array.isArray(snapshot) && snapshot.length > 0) {
        items = snapshot
          .filter((i) => i && i.productId && i.quantity && i.price !== undefined)
          .map((i) => ({
            productId: i.productId,
            quantity: Number(i.quantity),
            price: Number(i.price),
          }));
      }
    } catch {
      items = [];
    }

    if (items.length === 0) {
      console.warn(
        "Checkout success without item metadata; line items:",
        JSON.stringify(
          lineItems.data.map((item) => ({
            description: item.description,
            quantity: item.quantity,
          }))
        )
      );
      return res.status(400).json({
        status: "fail",
        message:
          "Cannot persist order: no productIds available. Pass items with productId in checkout metadata.",
      });
    }

    const orderData = {
      user: userId,
      paymentIntentId:
        typeof stripeSession.payment_intent === "string"
          ? stripeSession.payment_intent
          : stripeSession.payment_intent?.id || sessionId,
      items,
      orderTotal: (stripeSession.amount_subtotal || 0) / 100,
    };
    const newOrder = new Order(orderData);
    await newOrder.save();
    res.redirect(`${CLIENT_URL}/success`);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "fail",
      message: "Error processing successful payment",
    });
  }
};
exports.paymentIntent = async (req, res) => {
  console.log(req.body);
  const amount = Number(req.body.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({
      error: "A positive numeric amount is required",
    });
  }
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.json({ paymentIntent: paymentIntent.client_secret });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
};
