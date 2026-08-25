import mongoose from "mongoose";

// A connection between two users. Chat is only allowed once status is
// "accepted" — see message.controller.js's assertConnected() check.
const chatRequestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// One request document per (sender, receiver) pair — stops someone from
// spamming the same person with duplicate requests.
chatRequestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

const ChatRequest = mongoose.model("ChatRequest", chatRequestSchema);

export default ChatRequest;
