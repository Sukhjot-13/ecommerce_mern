const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const app = require("./app");
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then((con) => {
  console.log("connected to db");
});
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
