import mongoose from "mongoose";
import Banner from "../models/banner.model.js";
import cloudinary from "../lib/cloudinary.js";

const toObjectId = (id) => (mongoose.Types.ObjectId.isValid(id) ? id : null);

// GET /api/banners — public. Only active slides, in display order, for the
// Home page hero carousel.
export const getActiveBanners = async (_req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json(banners);
  } catch (error) {
    console.error("getActiveBanners error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/banners/admin — admin only. Every slide (active or not) for the
// admin panel's management list.
export const getAllBanners = async (_req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json(banners);
  } catch (error) {
    console.error("getAllBanners error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/banners — admin only. Image arrives as a base64 data URL, same
// as post/profile images elsewhere in this app.
export const createBanner = async (req, res) => {
  try {
    const { image, title, businessName, link, order } = req.body;

    if (!image) {
      return res.status(400).json({ message: "An image is required" });
    }
    if (!title?.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "sindhlink/banners",
    });

    const banner = await Banner.create({
      image: uploadResponse.secure_url,
      title: title.trim(),
      businessName: businessName?.trim() || "",
      link: link?.trim() || "",
      order: Number.isFinite(Number(order)) ? Number(order) : 0,
      createdBy: req.user._id,
    });

    res.status(201).json(banner);
  } catch (error) {
    console.error("createBanner error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /api/banners/:id — admin only. Title/link/order/active toggle, and
// optionally a replacement image.
export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    if (!toObjectId(id)) {
      return res.status(400).json({ message: "Invalid banner id" });
    }

    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    const { image, title, businessName, link, order, isActive } = req.body;

    if (title !== undefined) banner.title = title.trim();
    if (businessName !== undefined) banner.businessName = businessName.trim();
    if (link !== undefined) banner.link = link.trim();
    if (order !== undefined && Number.isFinite(Number(order))) banner.order = Number(order);
    if (isActive !== undefined) banner.isActive = !!isActive;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "sindhlink/banners",
      });
      banner.image = uploadResponse.secure_url;
    }

    await banner.save();
    res.status(200).json(banner);
  } catch (error) {
    console.error("updateBanner error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /api/banners/:id — admin only.
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    if (!toObjectId(id)) {
      return res.status(400).json({ message: "Invalid banner id" });
    }

    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    await banner.deleteOne();
    res.status(200).json({ message: "Banner deleted" });
  } catch (error) {
    console.error("deleteBanner error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
