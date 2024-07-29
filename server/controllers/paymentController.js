const stripe = require("stripe")(`${process.env.STRIPE_SECRET_KEY}`);
const Order = require("../models/orderModel");
const User = require("../models/userModel");

exports.createCheckoutSession = async (req, res) => {
  try {
    const email = "ab@ab.com";
    const session = await stripe.checkout.sessions.create({
      line_items: req.body.line_items,
      mode: "payment",
      success_url: `http://10.0.0.168:8080/api/v1/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://10.0.0.168:3000/cancel`,
      billing_details: {
        email,
      },
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
    // console.log("stripe session:", stripeSession);
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
    // console.log("line item 1:", lineItems.data[0]);
    // console.log("email is:", stripeSession.customer_details.email);
    // const userId = await User.findOne({
    //   email: stripeSession.customer_details.email,
    // });
    // console.log("user id is :", userId._id);
    const orderData = {
      //   user: userId._id,
      paymentIntentId: stripeSession.payment_intent,
      customerEmail: stripeSession.customer_details.email,
      items: lineItems.data.map((item) => ({
        productName: item.price.product,
        quantity: item.quantity,
        price: item.price.unit_amount / 100,
      })),
      orderTotal: stripeSession.amount_subtotal / 100,
    };
    const newOrder = new Order(orderData);
    await newOrder.save();
    res.redirect("http://10.0.0.168:3000/success");
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
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount * 100,
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
