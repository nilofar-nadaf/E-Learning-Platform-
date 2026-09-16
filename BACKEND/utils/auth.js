const jwt = require("jsonwebtoken");
const config = require("./config");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ message: "Token is required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid or expired token" });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role === "ADMIN") {
    return next();
  }
  return res.status(403).send({ message: "Access denied: Admins only" });
};

module.exports = { auth, requireAdmin };