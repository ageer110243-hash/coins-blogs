import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getPeople,
  getIncomingRequests,
  sendRequest,
  respondToRequest,
} from "../controllers/request.controller.js";

const router = express.Router();

router.get("/people", protectRoute, getPeople);
router.get("/incoming", protectRoute, getIncomingRequests);
router.post("/send/:id", protectRoute, sendRequest);
router.put("/:id/respond", protectRoute, respondToRequest);

export default router;
