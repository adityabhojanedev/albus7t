/**
 * models/Feedback.ts
 * Mongoose schema for user-submitted feedback.
 */

import mongoose, { Document, Model, Schema } from "mongoose";

export interface IFeedback extends Document {
  subject: string;
  message: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: [200, "Subject must be at most 200 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [2000, "Message must be at most 2000 characters"],
    },
    user: {
      id: { type: String },
      username: { type: String },
      email: { type: String },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Feedback: Model<IFeedback> =
  mongoose.models.Feedback ?? mongoose.model<IFeedback>("Feedback", FeedbackSchema);

export default Feedback;
