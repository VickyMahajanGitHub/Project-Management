// middlewares/isAdmin.js
module.exports = (req, res, next) => {
  if (!req.user || req.user.userType !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied: Admins only.",
    });
  }
  next();
};
