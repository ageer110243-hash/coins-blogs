import Post, { POST_CATEGORIES } from "../models/post.model.js";
import ChatRequest from "../models/chatRequest.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

// posts, annotated with whether the logged-in user has liked each one and
// how many likes it has — the raw `likes` array of ids isn't sent as-is.
// myId is undefined for the public/logged-out preview, which just means
// likedByMe is always false for them.
function toPublicPost(post, myId) {
  const obj = post.toObject();
  const likeIds = obj.likes || [];
  return {
    ...obj,
    likesCount: likeIds.length,
    likedByMe: myId ? likeIds.some((id) => id.toString() === myId.toString()) : false,
    likes: undefined,
  };
}

export const getCategories = (_req, res) => {
  res.status(200).json(POST_CATEGORIES);
};

export const getPosts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { status: "active" };
    if (category && POST_CATEGORIES.includes(category)) {
      filter.category = category;
    }

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(200)
      .populate("userId", "fullName profilePic");

    res.status(200).json(posts.map((p) => toPublicPost(p, req.user?._id)));
  } catch (error) {
    console.error("getPosts error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, description, image, category } = req.body;

    if (!title?.trim() || !description?.trim() || !image) {
      return res
        .status(400)
        .json({ message: "Title, description, and an image are all required" });
    }

    // image arrives as a base64 data URL from the client
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "chatwithme/posts",
    });

    const post = await Post.create({
      userId: req.user._id,
      title: title.trim(),
      description: description.trim(),
      category: POST_CATEGORIES.includes(category) ? category : "Other",
      image: uploadResponse.secure_url,
    });
    await post.populate("userId", "fullName profilePic");

    res.status(201).json(toPublicPost(post, req.user._id));
  } catch (error) {
    console.error("createPost error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isOwner = post.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You can't remove this post" });
    }

    post.status = "removed";
    await post.save();

    res.status(200).json({ message: "Post removed" });
  } catch (error) {
    console.error("deletePost error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const myId = req.user._id;

    const post = await Post.findById(id);
    if (!post || post.status !== "active") {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.some((uid) => uid.toString() === myId.toString());
    if (alreadyLiked) {
      post.likes = post.likes.filter((uid) => uid.toString() !== myId.toString());
    } else {
      post.likes.push(myId);
    }
    await post.save();

    res.status(200).json({ likesCount: post.likes.length, likedByMe: !alreadyLiked });
  } catch (error) {
    console.error("toggleLike error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin-only: mark/unmark a post's owner-business as verified.
export const setVerified = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }
    const { id } = req.params;
    const { verified } = req.body;

    const post = await Post.findByIdAndUpdate(id, { verified: !!verified }, { new: true });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ verified: post.verified });
  } catch (error) {
    console.error("setVerified error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Clicking "Message seller" should start a conversation immediately — a
// business inquiry isn't the same as a private friend request, so this
// skips the usual pending-request step and connects both users right away.
export const startInquiry = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const myId = req.user._id;

    const post = await Post.findById(postId);
    if (!post || post.status !== "active") {
      return res.status(404).json({ message: "Post not found" });
    }

    const sellerId = post.userId;
    if (sellerId.toString() === myId.toString()) {
      return res.status(400).json({ message: "This is your own post" });
    }

    let connection = await ChatRequest.findOne({
      $or: [
        { senderId: myId, receiverId: sellerId },
        { senderId: sellerId, receiverId: myId },
      ],
    });

    if (connection) {
      if (connection.status !== "accepted") {
        connection.status = "accepted";
        await connection.save();
      }
    } else {
      connection = await ChatRequest.create({
        senderId: myId,
        receiverId: sellerId,
        status: "accepted",
      });
    }

    const seller = await User.findById(sellerId).select("-password");
    res.status(200).json(seller);
  } catch (error) {
    console.error("startInquiry error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
