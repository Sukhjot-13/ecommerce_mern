const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const app = express();
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// app.use(express.static(`${__dirname}/images`));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  req.requestTime = new Date();
  next();
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/order", orderRoutes);

// app.all("*", (req, res, next) => {
//   next(new AppError(`cant find${req.originalUrl}`, 404));
// });

module.exports = app;
