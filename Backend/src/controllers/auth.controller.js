import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken, clearAuthCookie } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

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
        folder: "chatwithme/avatars",
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
