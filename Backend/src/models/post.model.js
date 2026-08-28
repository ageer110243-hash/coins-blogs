import mongoose from "mongoose";

// One flexible Post model backs the whole directory: University, Academy,
// Business, Admission, Jobs, Events and General posts. `category` decides
// which optional nested block (university / academy / business) actually
// gets filled in and shown on the detail page — the others stay empty.
const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, default: "" },

    category: {
      type: String,
      enum: ["University", "Academy", "Business", "Admission", "Jobs", "Events", "General"],
      required: true,
      index: true,
    },
    city: { type: String, required: true, trim: true, index: true },
    organizationName: { type: String, trim: true, default: "" },

    contact: {
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
      address: { type: String, default: "" },
      website: { type: String, default: "" },
    },

    // Only relevant when category === "University"
    university: {
      programs: { type: String, default: "" },
      eligibility: { type: String, default: "" },
      admissionStart: { type: Date, default: null },
      admissionDeadline: { type: Date, default: null },
      fee: { type: String, default: "" },
      requiredDocuments: { type: String, default: "" },
      howToApply: { type: String, default: "" },
      applicationLink: { type: String, default: "" },
    },

    // Only relevant when category === "Academy"
    academy: {
      courses: { type: String, default: "" },
      courseDuration: { type: String, default: "" },
      fee: { type: String, default: "" },
      timings: { type: String, default: "" },
      admissionInfo: { type: String, default: "" },
    },

    // Only relevant when category === "Business"
    business: {
      businessCategory: { type: String, default: "" },
      services: { type: String, default: "" },
      openingHours: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

// Backs the free-text search box (title / organization name / description).
postSchema.index({ title: "text", organizationName: "text", description: "text" });

const Post = mongoose.model("Post", postSchema);

export default Post;
