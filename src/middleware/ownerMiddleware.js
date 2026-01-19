const ownerMiddleware = (req, res, next) => {
  try {
    // authMiddleware ne req.user already set kiya hota hai
    if (req.user.role !== "owner") {
      return res.status(403).json({
        message: "Access denied: Owners only",
      });
    }

    // role sahi hai → aage jao
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = ownerMiddleware;
