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
    // Frontend and backend are deployed as two separate Vercel projects on
    // two different domains, so this is a cross-site cookie — it needs
    // SameSite=None + Secure for the browser to send it. Locally (same-site,
    // http) "lax" + non-secure is what actually works, so this switches on
    // NODE_ENV.
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  };
}
