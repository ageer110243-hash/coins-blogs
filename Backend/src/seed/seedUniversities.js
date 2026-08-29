// One-time (re-runnable) data seed: creates/updates University-category
// posts for Hyderabad, Jamshoro, Karachi, Shaheed Benazirabad/Nawabshah
// and Sukkur, plus the verified Admission-category post(s) in
// ./universitiesData.js.
//
// Usage (from the Backend/ folder, with your real .env already filled in):
//   node src/seed/seedUniversities.js
//
// Safe to re-run: each post is upserted on (title + city), so running this
// again after editing universitiesData.js updates the existing posts
// instead of duplicating them.

import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import { UNIVERSITIES, ADMISSIONS } from "./universitiesData.js";

const SEED_AUTHOR_EMAIL = process.env.SEED_AUTHOR_EMAIL || "";

async function getOrCreateAuthor() {
  // Prefer an explicit account if given, then any existing admin, and
  // only create a new system account as a last resort.
  if (SEED_AUTHOR_EMAIL) {
    const byEmail = await User.findOne({ email: SEED_AUTHOR_EMAIL.toLowerCase() });
    if (byEmail) return byEmail;
    console.warn(
      `SEED_AUTHOR_EMAIL (${SEED_AUTHOR_EMAIL}) not found — falling back to an existing admin.`
    );
  }

  const existingAdmin = await User.findOne({ role: "admin" }).sort({ createdAt: 1 });
  if (existingAdmin) return existingAdmin;

  console.log("No admin account found — creating a system account to author these posts.");
  const randomPassword = Math.random().toString(36).slice(-12);
  const hashedPassword = await bcrypt.hash(randomPassword, await bcrypt.genSalt(10));

  const systemUser = await User.create({
    fullName: "SindhLink Team",
    email: "team@sindhlink.local",
    password: hashedPassword,
    role: "admin",
    bio: "Official university & admissions listings for SindhLink.",
  });

  console.log(
    `Created system account team@sindhlink.local — you generally won't need to log in as ` +
      `this account, since posts can be managed by any admin from the Admin Panel's "Manage All" tab.`
  );
  return systemUser;
}

async function upsertPost(entry, authorId) {
  const isAdmission = Boolean(entry.admissionStart || entry.admissionDeadline || entry.howToApply);

  const doc = {
    author: authorId,
    title: entry.title,
    description: entry.description,
    category: isAdmission ? "Admission" : "University",
    city: entry.city,
    organizationName: entry.organizationName || "",
    contact: { website: entry.website || "" },
    university: {
      programs: entry.programs || "",
      eligibility: entry.eligibility || "",
      admissionStart: entry.admissionStart ? new Date(entry.admissionStart) : null,
      admissionDeadline: entry.admissionDeadline ? new Date(entry.admissionDeadline) : null,
      fee: entry.fee || "",
      requiredDocuments: entry.requiredDocuments || "",
      howToApply: entry.howToApply || "",
      applicationLink: entry.applicationLink || entry.website || "",
    },
  };

  const result = await Post.findOneAndUpdate(
    { title: entry.title, city: entry.city },
    { $set: doc },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return result;
}

async function run() {
  if (!process.env.MONGO_URL) {
    console.error("MONGO_URL is empty — fill in Backend/.env before running this script.");
    process.exit(1);
  }

  // Reuses the same connectDB() the API server uses — this is what already
  // points Node's DNS resolver at 8.8.8.8/1.1.1.1, which is what actually
  // fixes the "querySrv ECONNREFUSED ...mongodb.net" error on networks
  // (very common on Windows/some ISPs/routers) whose default DNS can't
  // answer the SRV lookups that mongodb+srv:// URLs depend on.
  await connectDB();
  console.log("Connected to MongoDB.");

  const author = await getOrCreateAuthor();
  console.log(`Authoring posts as: ${author.fullName} <${author.email}>`);

  let created = 0;
  let updated = 0;

  for (const entry of [...UNIVERSITIES, ...ADMISSIONS]) {
    const before = await Post.exists({ title: entry.title, city: entry.city });
    await upsertPost(entry, author._id);
    if (before) updated += 1;
    else created += 1;
  }

  console.log(`\nDone. ${created} post(s) created, ${updated} post(s) updated.`);
  console.log(
    `${UNIVERSITIES.length} University posts + ${ADMISSIONS.length} Admission post(s) processed.`
  );

  await mongoose.disconnect();
}

run().catch((error) => {
  console.error("Seed script failed:", error);
  process.exit(1);
});
