// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization token missing or invalid.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user from database using the decoded ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    // Attach full user object to req
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};
// // middlewares/isAdmin.js
// exports.isAdmin = (req, res, next) => {
//   try {
//     if (!req.user || req.user.userType !== "admin") {
//       return res.status(403).json({
//         status: false,
//         message: "Access denied: Admins only.",
//       });
//     }
//     next();
//   } catch (error) {
//     console.error("isAdmin error:", error);
//     res.status(500).json({
//       status: false,
//       message: "Internal server error.",
//     });
//   }
// };

// // middlewares/isManager.js
// exports.isManager = (req, res, next) => {
//   try {
//     if (!req.user || req.user.userType !== "manager") {
//       return res.status(403).json({ message: "Access denied: Managers only." });
//     }
//     next();
//   } catch (error) {
//     console.error("isManager error:", error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// };
