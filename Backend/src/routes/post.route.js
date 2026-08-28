import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
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
router.get("/:id", getPostById);

router.post("/", protectRoute, createPost);
router.put("/:id", protectRoute, updatePost);
router.delete("/:id", protectRoute, deletePost);

export default router;
