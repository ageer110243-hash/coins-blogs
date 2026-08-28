import express from "express";
import { protectRoute, attachUserIfPresent } from "../middleware/auth.middleware.js";
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

// NOTE: /mine/list must be registered before /:id, otherwise "mine" would
// be swallowed by the :id param route.
router.get("/mine/list", protectRoute, getMyPosts);

router.get("/", getPosts);
// attachUserIfPresent (not protectRoute) — post detail stays public for
// guests, but a logged-in viewer also gets the author's connectionStatus
// so the post page can show a "Chat" / "Requested" option.
router.get("/:id", attachUserIfPresent, getPostById);

router.post("/", protectRoute, createPost);
router.put("/:id", protectRoute, updatePost);
router.delete("/:id", protectRoute, deletePost);

export default router;
