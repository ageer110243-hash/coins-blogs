// Must be the very first import — "dotenv/config" runs dotenv.config() as
// part of module evaluation, which (per JS module-loading rules) happens
// before the imports below it. If this were `import dotenv...; dotenv.config();`
// instead, app.js (and Cloudinary's config inside it) would actually load
// BEFORE dotenv.config() ran, leaving process.env.CLOUDINARY_* undefined
// even with a correctly filled-in .env file.
import "dotenv/config";

import app from "./app.js";
import { connectDB } from "./lib/db.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port: ${PORT}`);
  try {
    await connectDB();
  } catch (error) {
    console.error("\n⚠️  Could not connect to MongoDB.");
    console.error(`   ${error.message}\n`);
    console.error(
      "   Common causes: MONGO_URL is wrong/empty in Backend/.env, your\n" +
        "   network's DNS can't resolve mongodb+srv:// addresses (try switching\n" +
        "   to 8.8.8.8 / 1.1.1.1), or Atlas Network Access doesn't allow your IP\n" +
        "   yet (add 0.0.0.0/0 under Atlas → Network Access for local dev).\n"
    );
    // keep the HTTP server running so nodemon doesn't just die — routes that
    // touch the DB will fail until this is fixed and the server restarts.
  }
});
