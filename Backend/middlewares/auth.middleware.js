const jwt = require("jsonwebtoken");

const authMiddleware = (requiredRoles) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res
          .status(401)
          .json({ message: "Access denied. No token provided." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (!requiredRoles.includes(decoded.role_id)) {
        return res
          .status(403)
          .json({ message: "Access denied. Insufficient privileges." });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }
  };
};

module.exports = authMiddleware;
