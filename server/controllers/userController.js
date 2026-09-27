const User = require("./../models/userModel");
// NOTE: password signup was removed (Firebase handles auth) — no bcrypt use.

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
  // Read-only lookup by email. Served as GET /getUserId?email= (preferred);
  // POST /getUserId with { email } is kept as a legacy alias.
  const email = req.query.email || req.body.email;
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
