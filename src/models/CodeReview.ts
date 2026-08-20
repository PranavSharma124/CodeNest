import mongoose, { Schema, Document, Model } from "mongoose";

interface Issue {
  title: string;
  explanation: string;
  suggestion: string;
}

export interface CodeReviewDocument extends Document {
  userId: string;
  title: string;
  code: string;
  summary: string;
  severity: "low" | "medium" | "high";
  issues: Issue[];
  improvedCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const issueSchema = new Schema<Issue>(
  {
    title: {
      type: String,
      required: true,
    },

    explanation: {
      type: String,
      required: true,
    },

    suggestion: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const codeReviewSchema = new Schema<CodeReviewDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    code: {
      type: String,
      required: true,
    },

    summary: {
      type: String,
      required: true,
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },

    issues: {
      type: [issueSchema],
      required: true,
      default: [],
    },

    improvedCode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const CodeReview: Model<CodeReviewDocument> =
  mongoose.models.CodeReview ||
  mongoose.model<CodeReviewDocument>("CodeReview", codeReviewSchema);
