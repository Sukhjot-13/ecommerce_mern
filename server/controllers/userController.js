const User = require("./../models/userModel");
const bcrypt = require("bcrypt");
const hashPassword = async (password) => {
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (err) {
    throw new Error("Error hashing password");
  }
};

// exports.createUser = async (req, res) => {
//   try {
//     // Extract user data from the request body
//     const { userName, email, password, uid } = req.body;
//     console.log(userName, email, password, uid);
//     const hashedPassword = await hashPassword(password);

//     // Create a new user document using the userModel
//     const newUser = await User.create({
//       userName,
//       email,
//       password: hashedPassword,
//       uid,
//     });

//     // Send a response back to the client
//     res.status(201).json({
//       status: "success",
//       data: {
//         user: newUser,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: "fail",
//       message: err.message,
//     });
//   }
// };
exports.createUser = async (req, res) => {
  try {
    // Extract user data from the request body
    const { userName, email, uid } = req.body;
    console.log(userName, email, uid);

    // Create a new user document using the userModel
    const newUser = await User.create({
      userName,
      email,
      uid,
    });

    // Send a response back to the client
    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.getUserId = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, _id: user._id, role: user.role });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
exports.getUserById = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
