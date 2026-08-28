import express from "express";
import {
  getPosts,
  getCategories,
  createPost,
  deletePost,
  toggleLike,
  setVerified,
  startInquiry,
} from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public — lets the logged-out hero showcase preview real posts.
// getPosts/getCategories work fine with or without req.user (see controller).
router.get("/categories", getCategories);
router.get("/", getPosts);

router.post("/", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.post("/:id/like", protectRoute, toggleLike);
router.patch("/:id/verify", protectRoute, setVerified);
router.post("/:id/inquire", protectRoute, startInquiry);

export default router;
