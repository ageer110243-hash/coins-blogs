import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import User from "../models/user.model.js";
import { generateToken, clearAuthCookie } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import { sendPasswordResetEmail, sendWelcomeEmail } from "../lib/email.js";
import { verifyGoogleToken } from "../lib/googleAuth.js";

const toPublicUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  profilePic: user.profilePic,
  bio: user.bio,
  role: user.role,
  status: user.status,
  lastSeen: user.lastSeen,
  createdAt: user.createdAt,
});

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // The very first account created becomes the admin automatically, so
    // there's always at least one user who can open the admin dashboard.
    const isFirstUser = (await User.countDocuments()) === 0;

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role: isFirstUser ? "admin" : "member",
      lastSeen: new Date(),
    });

    await newUser.save();
    generateToken(newUser._id, res);
    sendWelcomeEmail(newUser.email, newUser.fullName); // fire-and-forget, never blocks signup

    res.status(201).json(toPublicUser(newUser));
  } catch (error) {
    console.error("signup error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.status === "suspended") {
      return res
        .status(403)
        .json({ message: "This account has been suspended" });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "This account uses Google Sign-In — continue with Google instead",
      });
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    user.lastSeen = new Date();
    await user.save();

    generateToken(user._id, res);

    res.status(200).json(toPublicUser(user));
  } catch (error) {
    console.error("login error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    clearAuthCookie(res);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("logout error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    // Heartbeat: touch lastSeen so the admin dashboard's "online now" count
    // stays roughly accurate even for users who aren't socket-connected yet.
    req.user.lastSeen = new Date();
    await req.user.save();
    res.status(200).json(toPublicUser(req.user));
  } catch (error) {
    console.error("checkAuth error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, profilePic, bio } = req.body;
    const updates = {};

    if (fullName?.trim()) updates.fullName = fullName.trim();

    if (bio !== undefined) {
      if (bio.length > 160) {
        return res.status(400).json({ message: "Bio must be 160 characters or less" });
      }
      updates.bio = bio.trim();
    }

    if (profilePic) {
      // profilePic arrives as a base64 data URL from the client
      const uploadResponse = await cloudinary.uploader.upload(profilePic, {
        folder: "sindhlink/avatars",
      });
      updates.profilePic = uploadResponse.secure_url;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    });

    res.status(200).json(toPublicUser(updatedUser));
  } catch (error) {
    console.error("updateProfile error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: "Missing Google credential" });
    }

    const payload = await verifyGoogleToken(idToken);
    if (!payload?.email_verified) {
      return res.status(400).json({ message: "Google email is not verified" });
    }

    let user = await User.findOne({ googleId: payload.sub });

    if (!user) {
      // no account linked to this Google ID yet — check if an
      // email/password account with the same email already exists, and
      // link this Google ID to it instead of creating a duplicate
      user = await User.findOne({ email: payload.email });

      if (user) {
        user.googleId = payload.sub;
        if (!user.profilePic && payload.picture) user.profilePic = payload.picture;
        await user.save();
      } else {
        const isFirstUser = (await User.countDocuments()) === 0;
        user = await User.create({
          fullName: payload.name || payload.email.split("@")[0],
          email: payload.email,
          googleId: payload.sub,
          profilePic: payload.picture || "",
          role: isFirstUser ? "admin" : "member",
          lastSeen: new Date(),
        });
        sendWelcomeEmail(user.email, user.fullName);
      }
    }

    if (user.status === "suspended") {
      return res.status(403).json({ message: "This account has been suspended" });
    }

    user.lastSeen = new Date();
    await user.save();

    generateToken(user._id, res);
    res.status(200).json(toPublicUser(user));
  } catch (error) {
    console.error("googleLogin error:", error.message);
    res.status(401).json({ message: "Google sign-in failed" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    // Always respond the same way whether or not the account exists, so
    // this endpoint can't be used to find out which emails are registered.
    const genericResponse = {
      message: "If an account exists for that email, a reset link is on its way.",
    };

    if (!user) {
      return res.status(200).json(genericResponse);
    }

    if (!user.password) {
      // Google-only account — there's no password to reset
      return res.status(200).json(genericResponse);
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await user.save();

    const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");
    const resetLink = `${clientUrl}/reset-password/${rawToken}`;

    const { delivered } = await sendPasswordResetEmail(user.email, resetLink);

    // If SMTP isn't configured, email.js already logged the link server-side.
    // Hand it back in the response too so the frontend can show it directly —
    // handy for local dev/testing without setting up SMTP.
    return res.status(200).json(delivered ? genericResponse : { ...genericResponse, resetLink });
  } catch (error) {
    console.error("forgotPassword error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({ message: "This reset link is invalid or has expired" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    generateToken(user._id, res); // log them straight in after reset

    res.status(200).json(toPublicUser(user));
  } catch (error) {
    console.error("resetPassword error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
