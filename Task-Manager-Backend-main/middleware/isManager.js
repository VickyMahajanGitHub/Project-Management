// middlewares/isManager.js
module.exports = (req, res, next) => {
  if (!req.user || req.user.userType !== "manager") {
    return res.status(403).json({
      success: false,
      message: "Access denied: Managers only.",
    });
  }
  next();
};
