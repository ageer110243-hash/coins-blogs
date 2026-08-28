import mongoose from "mongoose";
import Post from "../models/post.model.js";
import ChatRequest from "../models/chatRequest.model.js";
import cloudinary from "../lib/cloudinary.js";

const ALLOWED_CATEGORIES = ["University", "Academy", "Business", "Admission", "Jobs", "Events", "General"];

const toObjectId = (id) => (mongoose.Types.ObjectId.isValid(id) ? id : null);

// GET /api/posts?search=&city=&category=&page=&limit=
// Public. Combines free-text search with city + category filters, all
// optional and combinable, matching the Explore page's filter bar.
export const getPosts = async (req, res) => {
  try {
    const { search, city, category, page = 1, limit = 12 } = req.query;

    const query = {};
    if (city && city !== "All Cities") query.city = city;
    if (category && category !== "All") query.category = category;
    if (search?.trim()) query.$text = { $search: search.trim() };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(48, Math.max(1, parseInt(limit, 10) || 12));

    const [posts, total] = await Promise.all([
      Post.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate("author", "fullName profilePic"),
      Post.countDocuments(query),
    ]);

    res.status(200).json({
      posts,
      total,
      page: pageNum,
      totalPages: Math.max(1, Math.ceil(total / limitNum)),
    });
  } catch (error) {
    console.error("getPosts error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/posts/:id — full detail for the Post Detail page
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!toObjectId(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const post = await Post.findById(id).populate("author", "fullName profilePic");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Only when someone is logged in (attachUserIfPresent) and viewing
    // someone else's post do we attach a connectionStatus — this is what
    // powers the small "Chat" option next to "Posted by" on the post page.
    let authorWithStatus = post.author;
    if (req.user && post.author && req.user._id.toString() !== post.author._id.toString()) {
      const request = await ChatRequest.findOne({
        $or: [
          { senderId: req.user._id, receiverId: post.author._id },
          { senderId: post.author._id, receiverId: req.user._id },
        ],
      });

      let connectionStatus = "none";
      let requestId = null;
      if (request) {
        requestId = request._id;
        if (request.status === "accepted") {
          connectionStatus = "connected";
        } else if (request.senderId.toString() === req.user._id.toString()) {
          connectionStatus = "pending-sent";
        } else {
          connectionStatus = "pending-received";
        }
      }

      authorWithStatus = { ...post.author.toObject(), connectionStatus, requestId };
    }

    res.status(200).json({ ...post.toObject(), author: authorWithStatus });
  } catch (error) {
    console.error("getPostById error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/posts — create a post (University / Academy / Business / etc.)
export const createPost = async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      category,
      city,
      organizationName,
      contact,
      university,
      academy,
      business,
    } = req.body;

    if (!title?.trim() || !description?.trim() || !category || !city?.trim()) {
      return res
        .status(400)
        .json({ message: "Title, description, category and city are required" });
    }

    if (!ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    let imageUrl = "";
    if (image) {
      // image arrives as a base64 data URL from the client, same as
      // profilePic / chat message images elsewhere in this app
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "chatwithme/posts",
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newPost = new Post({
      author: req.user._id,
      title: title.trim(),
      description: description.trim(),
      image: imageUrl,
      category,
      city: city.trim(),
      organizationName: organizationName?.trim() || "",
      contact: {
        phone: contact?.phone || "",
        email: contact?.email || "",
        address: contact?.address || "",
        website: contact?.website || "",
      },
      university: category === "University" ? university || {} : undefined,
      academy: category === "Academy" ? academy || {} : undefined,
      business: category === "Business" ? business || {} : undefined,
    });

    await newPost.save();
    await newPost.populate("author", "fullName profilePic");

    res.status(201).json(newPost);
  } catch (error) {
    console.error("createPost error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /api/posts/:id — owner (or admin) only
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!toObjectId(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isOwner = post.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only edit your own posts" });
    }

    const {
      title,
      description,
      image,
      category,
      city,
      organizationName,
      contact,
      university,
      academy,
      business,
    } = req.body;

    if (category && !ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    if (title?.trim()) post.title = title.trim();
    if (description?.trim()) post.description = description.trim();
    if (city?.trim()) post.city = city.trim();
    if (organizationName !== undefined) post.organizationName = organizationName.trim();
    if (category) post.category = category;

    if (contact) {
      post.contact = {
        phone: contact.phone ?? post.contact?.phone ?? "",
        email: contact.email ?? post.contact?.email ?? "",
        address: contact.address ?? post.contact?.address ?? "",
        website: contact.website ?? post.contact?.website ?? "",
      };
    }

    if (university) post.university = { ...post.university?.toObject?.(), ...university };
    if (academy) post.academy = { ...post.academy?.toObject?.(), ...academy };
    if (business) post.business = { ...post.business?.toObject?.(), ...business };

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "chatwithme/posts",
      });
      post.image = uploadResponse.secure_url;
    }

    await post.save();
    await post.populate("author", "fullName profilePic");

    res.status(200).json(post);
  } catch (error) {
    console.error("updatePost error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /api/posts/:id — owner (or admin) only
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!toObjectId(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isOwner = post.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    console.error("deletePost error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/posts/mine/list — posts created by the logged-in user (My Posts)
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("getMyPosts error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
