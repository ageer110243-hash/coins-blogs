// Must run after protectRoute, so req.user is already set.
export const adminRoute = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};
