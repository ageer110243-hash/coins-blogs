import User from "../models/user.model.js";
import ChatRequest from "../models/chatRequest.model.js";

// All other users, each annotated with where things stand between me and
// them, so the frontend knows whether to show "Send request", "Requested",
// "Accept / Decline", or nothing (already connected — they belong in Chats).
export const getPeople = async (req, res) => {
  try {
    const myId = req.user._id;

    const [users, requests] = await Promise.all([
      User.find({ _id: { $ne: myId } }).select("-password"),
      ChatRequest.find({ $or: [{ senderId: myId }, { receiverId: myId }] }),
    ]);

    const byOtherUserId = new Map();
    for (const r of requests) {
      const otherId =
        r.senderId.toString() === myId.toString()
          ? r.receiverId.toString()
          : r.senderId.toString();
      byOtherUserId.set(otherId, r);
    }

    const result = users.map((u) => {
      const r = byOtherUserId.get(u._id.toString());
      let connectionStatus = "none";
      let requestId = null;

      if (r) {
        requestId = r._id;
        if (r.status === "accepted") {
          connectionStatus = "connected";
        } else if (r.senderId.toString() === myId.toString()) {
          connectionStatus = "pending-sent";
        } else {
          connectionStatus = "pending-received";
        }
      }

      return {
        _id: u._id,
        fullName: u.fullName,
        profilePic: u.profilePic,
        bio: u.bio,
        connectionStatus,
        requestId,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("getPeople error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Pending requests someone else sent ME, waiting on my accept/decline.
export const getIncomingRequests = async (req, res) => {
  try {
    const requests = await ChatRequest.find({
      receiverId: req.user._id,
      status: "pending",
    })
      .populate("senderId", "-password")
      .sort({ createdAt: -1 });

    const result = requests.map((r) => ({
      _id: r._id,
      sender: r.senderId,
      createdAt: r.createdAt,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("getIncomingRequests error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send a chat request to :id. No message can be exchanged until they accept.
export const sendRequest = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (receiverId === senderId.toString()) {
      return res.status(400).json({ message: "You can't send a request to yourself" });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    // A request may already exist in either direction.
    const existing = await ChatRequest.findOne({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    if (existing) {
      if (existing.status === "accepted") {
        return res.status(400).json({ message: "You're already connected with this user" });
      }
      if (existing.senderId.toString() === senderId.toString()) {
        return res.status(400).json({ message: "Request already sent" });
      }
      return res
        .status(400)
        .json({ message: "This user already sent you a request — accept it instead" });
    }

    const request = await ChatRequest.create({ senderId, receiverId, status: "pending" });
    await request.populate("senderId", "-password");

    // No websocket push — the receiver's People/Requests page polls
    // GET /api/requests/incoming periodically, same pattern the chat
    // sidebar uses for new messages. Keeps this deployable on serverless
    // hosts like Vercel where a persistent socket connection isn't possible.

    res.status(201).json({ _id: request._id, requestStatus: "pending" });
  } catch (error) {
    console.error("sendRequest error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Accept or decline a request sent TO me.
export const respondToRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // "accept" | "decline"
    const myId = req.user._id;

    if (!["accept", "decline"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const request = await ChatRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    if (request.receiverId.toString() !== myId.toString()) {
      return res.status(403).json({ message: "You can't respond to this request" });
    }
    if (request.status === "accepted") {
      return res.status(400).json({ message: "Already accepted" });
    }

    if (action === "decline") {
      await request.deleteOne(); // lets them send a fresh request later
      return res.status(200).json({ message: "Request declined" });
    }

    request.status = "accepted";
    await request.save();
    await request.populate("receiverId", "-password");

    res.status(200).json({ message: "Request accepted" });
  } catch (error) {
    console.error("respondToRequest error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
