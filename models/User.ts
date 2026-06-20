/**
 * models/User.ts
 * Mongoose schema for the User collection.
 */

import mongoose, { Document, Model, Schema } from "mongoose";

// ── TypeScript interface (what a User document looks like) ────────────────────

export interface IUser extends Document {
  email: string;
  username: string;
  password: string; // bcrypt hash — never exposed to client
  favoriteGames: string[];
  platforms: Array<"PC" | "Console" | "Mobile">;
  verified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  createdAt: Date;
}

// ── Schema ────────────────────────────────────────────────────────────────────

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [32, "Username must be at most 32 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    favoriteGames: {
      type: [String],
      default: [],
    },
    platforms: {
      type: [String],
      enum: ["PC", "Console", "Mobile"],
      default: [],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      // sparse: true allows multiple documents to have null/undefined for this field
      // while still maintaining a unique index for non-null values (optional)
    },
    verificationTokenExpiry: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // only createdAt
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────

// Sparse index on token enables fast lookups during verification
UserSchema.index({ verificationToken: 1 }, { sparse: true });

// ── Model — guard against Next.js hot-reload re-registering the model ────────

const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default User;
