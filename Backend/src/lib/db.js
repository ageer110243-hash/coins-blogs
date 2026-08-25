import mongoose from "mongoose";
import dns from "node:dns";

// Fixes "querySrv ECONNREFUSED _mongodb._tcp...mongodb.net" — this happens
// when the machine's default DNS resolver (often the router/ISP's DNS on
// Windows) can't answer SRV-type lookups, which Atlas's mongodb+srv://
// connection strings depend on. Pointing Node's *own* resolver at public
// DNS servers fixes it without changing the computer's system-wide DNS
// settings. This only affects Node's own DNS lookups, nothing else on
// the machine.
dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);

// On Vercel, each request can hit a fresh serverless invocation. Without
// caching, that would open a brand-new MongoDB connection every time and
// quickly exhaust Atlas's free-tier connection limit. Caching the
// connection on `global` lets warm invocations reuse it.
let cached = global.__mongoose_cache;
if (!cached) {
  cached = global.__mongoose_cache = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!process.env.MONGO_URL) {
    throw new Error(
      "MONGO_URL is empty in Backend/.env — paste your MongoDB Atlas connection string there first."
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URL, {
        serverSelectionTimeoutMS: 15000,
      })
      .then((m) => {
        console.log(`MongoDB connected: ${m.connection.host}`);
        return m;
      })
      .catch((error) => {
        cached.promise = null; // let the next call retry instead of reusing a dead promise
        throw enrichConnectionError(error);
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

function enrichConnectionError(error) {
  const isSrvDnsFailure =
    error.message?.includes("querySrv") || error.message?.includes("ECONNREFUSED");

  if (isSrvDnsFailure) {
    error.message +=
      "\n\n   This is a DNS issue resolving your mongodb+srv:// address, not a" +
      "\n   problem with your credentials. If it persists even after this fix," +
      "\n   open MongoDB Atlas → Connect → Drivers, turn OFF the 'SRV Connection" +
      "\n   String' toggle, and paste that mongodb:// (non-SRV) string into" +
      "\n   MONGO_URL in Backend/.env instead — it bypasses SRV DNS lookups" +
      "\n   entirely and will work regardless of network/DNS restrictions.";
  }

  return error;
}
