// See src/server.js for why this has to be "dotenv/config" and not
// "import dotenv from 'dotenv'; dotenv.config();" — this ordering is what
// makes CLOUDINARY_* (and everything else in .env) actually be defined by
// the time app.js and its dependencies (like Cloudinary's config) load.
import "dotenv/config";

import app from "../src/app.js";
import { connectDB } from "../src/lib/db.js";

// Express apps are themselves valid (req, res) handlers, so Vercel's
// Node.js runtime can call this directly for every request under /api/*.
// We just make sure the DB connection is established (or reused from the
// cache in lib/db.js) before each request reaches the routes.
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
