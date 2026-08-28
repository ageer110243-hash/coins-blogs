import mongoose from "mongoose";

export const POST_CATEGORIES = [
  "Food & Drink",
  "Fashion & Beauty",
  "Tech & Services",
  "Tutoring & Education",
  "Home & Crafts",
  "Events",
  "Other",
];

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    category: {
      type: String,
      enum: POST_CATEGORIES,
      default: "Other",
    },
    image: {
      type: String, // Cloudinary secure_url
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["active", "removed"],
      default: "active",
    },
  },
  { timestamps: true }
);

postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ status: 1, category: 1, createdAt: -1 });

const Post = mongoose.model("Post", postSchema);

export default Post;
