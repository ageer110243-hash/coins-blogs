import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Same idea as protectRoute, but never blocks the request — used on public
// routes (like a post detail page) that show extra info ONLY when someone
// happens to be logged in. Guests sail through with req.user left unset.
export const attachUserIfPresent = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return next();

    const user = await User.findById(decoded.userId).select("-password");
    if (user && user.status !== "suspended") {
      req.user = user;
    }
    next();
  } catch (error) {
    // invalid/expired token on a public route — just proceed as a guest
    next();
  }
};

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status === "suspended") {
      return res
        .status(403)
        .json({ message: "This account has been suspended" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("protectRoute error:", error.message);
    res.status(401).json({ message: "Unauthorized - invalid or expired token" });
  }
};
