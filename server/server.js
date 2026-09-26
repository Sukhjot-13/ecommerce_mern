const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const app = require("./app");

if (!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
  console.error(
    "Missing required env vars: DATABASE and DATABASE_PASSWORD. " +
      "Copy server/.env.example to server/.env and fill them in."
  );
  process.exit(1);
}
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then(
  (con) => {
    console.log("connected to db");
  },
  (err) => {
    console.error("failed to connect to db:", err.message);
    process.exit(1);
  }
);
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
