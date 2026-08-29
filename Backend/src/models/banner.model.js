import mongoose from "mongoose";

// Admin-managed promotional slides shown in the Home page hero carousel.
// Kept separate from Post so "promote my business" images don't need a
// full directory listing behind them — just a picture + a place to send
// clicks (usually one of your own Post pages, but any URL works).
const bannerSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    businessName: { type: String, trim: true, default: "" },
    // Where clicking the slide goes. Left empty = not clickable.
    // Internal post links are stored as "/posts/<id>"; anything else
    // (http/https) opens in a new tab from the frontend.
    link: { type: String, trim: true, default: "" },
    isActive: { type: Boolean, default: true, index: true },
    // Lower shows first. Ties broken by createdAt (newest first).
    order: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;
