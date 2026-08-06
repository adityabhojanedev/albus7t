/**
 * lib/mongodb.ts
 *
 * Cached Mongoose connection for Next.js.
 * Next.js hot-reloads modules in dev, which can create many connections.
 * We store the promise on `global` so it persists across hot-reloads.
 */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define MONGODB_URI in your .env.local file."
  );
}

// Extend NodeJS global to hold the cached connection
declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Initialise the cache the first time this module is loaded
if (!global._mongooseConn) {
  global._mongooseConn = { conn: null, promise: null };
}

const cache = global._mongooseConn;

export async function connectDB(): Promise<typeof mongoose> {
  // Return cached connection if already established
  if (cache.conn) return cache.conn;

  // If a connection attempt is in progress, wait for it
  if (!cache.promise) {
    cache.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false, // fail fast if not connected
      })
      .then((m) => m);
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

/**
 * Detects if an error is a database connection or handshake error
 */
export function isDatabaseError(err: unknown): boolean {
  if (typeof err === "object" && err !== null) {
    const errorString = String((err as any).message || err).toLowerCase();
    return (
      errorString.includes("mongoserverselectionerror") ||
      errorString.includes("econnrefused") ||
      errorString.includes("timeout") ||
      errorString.includes("handshake") ||
      errorString.includes("network")
    );
  }
  return false;
}
