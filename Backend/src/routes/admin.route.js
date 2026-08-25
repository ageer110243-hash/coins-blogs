import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { adminRoute } from "../middleware/admin.middleware.js";
import {
  getStats,
  getUsers,
  getWeeklyActivity,
  suspendUser,
  deleteUser,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Every route below requires a logged-in admin
router.use(protectRoute, adminRoute);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.get("/weekly-activity", getWeeklyActivity);
router.patch("/users/:id/suspend", suspendUser);
router.delete("/users/:id", deleteUser);

export default router;
