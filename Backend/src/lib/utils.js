import jwt from "jsonwebtoken";

// Signs a JWT for the given user id and sets it as an httpOnly cookie on res.
export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, cookieOptions());

  return token;
};

export const clearAuthCookie = (res) => {
  res.cookie("jwt", "", { ...cookieOptions(), maxAge: 0 });
};

function cookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // not accessible from client-side JS, protects against XSS
    // Frontend and backend are served from the same Vercel project/domain
    // (see vercel.json rewrites), so this is a same-site cookie — "lax" is
    // enough. Only "secure" needs to flip on for HTTPS in production.
    sameSite: "lax",
    secure: isProduction,
  };
}
