import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
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
    text: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // Cloudinary secure_url — not raw base64, keeps documents small
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Speeds up the "conversation between two users" query that runs every time a chat is opened
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
