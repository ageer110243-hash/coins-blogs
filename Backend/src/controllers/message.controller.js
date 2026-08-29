import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import ChatRequest from "../models/chatRequest.model.js";
import cloudinary from "../lib/cloudinary.js";

const ONLINE_WINDOW_MS = 5 * 60 * 1000; // "online" = active in the last 5 minutes

// True only once an accepted ChatRequest exists between the two users —
// this is what actually stops random people from messaging each other.
async function assertConnected(userAId, userBId) {
  const accepted = await ChatRequest.findOne({
    status: "accepted",
    $or: [
      { senderId: userAId, receiverId: userBId },
      { senderId: userBId, receiverId: userAId },
    ],
  });
  return !!accepted;
}

// Only users I'm actually connected with (accepted chat request), shown in
// the sidebar as "contacts". Browsing/requesting everyone else happens via
// /api/requests/people instead.
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const onlineSince = new Date(Date.now() - ONLINE_WINDOW_MS);

    const accepted = await ChatRequest.find({
      status: "accepted",
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    const contactIds = accepted.map((r) =>
      r.senderId.toString() === loggedInUserId.toString() ? r.receiverId : r.senderId
    );

    const [users, unreadCounts] = await Promise.all([
      User.find({ _id: { $in: contactIds } }).select("-password"),
      Message.aggregate([
        { $match: { receiverId: loggedInUserId, seen: false } },
        { $group: { _id: "$senderId", count: { $sum: 1 } } },
      ]),
    ]);

    const unreadMap = Object.fromEntries(
      unreadCounts.map((c) => [c._id.toString(), c.count])
    );

    const result = users.map((u) => ({
      ...u.toObject(),
      online: u.lastSeen >= onlineSince,
      unread: unreadMap[u._id.toString()] || 0,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("getUsersForSidebar error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Full conversation between the logged-in user and :id
export const getMessages = async (req, res) => {
  try {
    const { id: otherUserId } = req.params;
    const myId = req.user._id;

    if (!(await assertConnected(myId, otherUserId))) {
      return res
        .status(403)
        .json({ message: "You need to connect with this user first — send a chat request" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: myId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("replyTo", "text image senderId");

    // mark what they sent me as seen — the sender will pick this up on
    // their next poll of this same conversation
    await Message.updateMany(
      { senderId: otherUserId, receiverId: myId, seen: false },
      { $set: { seen: true } }
    );

    res.status(200).json(messages);
  } catch (error) {
    console.error("getMessages error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image, replyTo } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res
        .status(400)
        .json({ message: "Message text or image is required" });
    }

    if (!(await assertConnected(senderId, receiverId))) {
      return res
        .status(403)
        .json({ message: "You need to connect with this user first — send a chat request" });
    }

    let replyToId = null;
    if (replyTo) {
      // only allow replying to a message that's actually part of this conversation
      const original = await Message.findOne({
        _id: replyTo,
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      });
      if (original) replyToId = original._id;
    }

    let imageUrl;
    if (image) {
      // image arrives as a base64 data URL from the client
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "sindhlink/messages",
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      replyTo: replyToId,
    });

    await newMessage.save();
    await newMessage.populate("replyTo", "text image senderId");

    // The receiver picks this up on their next poll of /api/messages/:id —
    // see useChatStore.js on the frontend (polls every few seconds while a
    // conversation is open). No websocket needed, which is what makes this
    // deploy cleanly on Vercel serverless.
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("sendMessage error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
