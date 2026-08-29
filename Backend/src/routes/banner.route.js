import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { adminRoute } from "../middleware/admin.middleware.js";
import {
  getActiveBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../controllers/banner.controller.js";

const router = express.Router();

// Public — feeds the Home page hero carousel.
router.get("/", getActiveBanners);

// Admin only — managing promotional slides from the admin panel.
router.get("/admin", protectRoute, adminRoute, getAllBanners);
router.post("/", protectRoute, adminRoute, createBanner);
router.put("/:id", protectRoute, adminRoute, updateBanner);
router.delete("/:id", protectRoute, adminRoute, deleteBanner);

export default router;
