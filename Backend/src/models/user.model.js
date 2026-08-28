import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
      default: null,
    },
    googleId: {
      type: String,
      default: null,
      index: true,
      sparse: true,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    profilePic: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
      maxlength: 160,
      trim: true,
    },
    role: {
      type: String,
      enum: ["member", "admin"],
      default: "member",
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
