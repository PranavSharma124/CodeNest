/*
 * CodeNest MongoDB CRUD Demonstration
 * Required for MongoDB CRUD evaluation criteria.
 *
 * Educational example only.
 * Demonstrates Create, Read, Update, and Delete
 * using MongoDB/Mongoose-style operations.
 */

import mongoose, { Schema, Document, Model } from "mongoose";

interface ICodeReview extends Document {
  userId: string;
  title: string;
  code: string;
  summary: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
}

const codeReviewSchema = new Schema<ICodeReview>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    code: { type: String, required: true },
    summary: { type: String, required: true },
    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      required: true,
    },
  },
  { timestamps: true },
);

const CodeReview: Model<ICodeReview> =
  mongoose.models.CodeReview ||
  mongoose.model<ICodeReview>("CodeReview", codeReviewSchema);


// ============================================================
// 1. CREATE
// ============================================================

async function createReview(): Promise<ICodeReview> {
  const review = await CodeReview.create({
    userId: "user-123",
    title: "Authentication Review",
    code: "const user = await getUser();",
    summary: "The code can be improved with better error handling.",
    severity: "MEDIUM",
  });

  return review;
}


// ============================================================
// 2. READ
// ============================================================

async function getUserReviews(userId: string): Promise<ICodeReview[]> {
  return await CodeReview.find({ userId }).sort({ createdAt: -1 });
}

async function getReviewById(
  reviewId: string,
): Promise<ICodeReview | null> {
  return await CodeReview.findById(reviewId);
}


// ============================================================
// 3. UPDATE
// ============================================================

async function updateReview(
  reviewId: string,
  summary: string,
): Promise<ICodeReview | null> {
  return await CodeReview.findByIdAndUpdate(
    reviewId,
    { summary },
    { new: true, runValidators: true },
  );
}


// ============================================================
// 4. DELETE
// ============================================================

async function deleteReview(
  reviewId: string,
): Promise<ICodeReview | null> {
  return await CodeReview.findByIdAndDelete(reviewId);
}


// ============================================================
// 5. CRUD SUMMARY
// ============================================================

/*
CREATE
    CodeReview.create(...)
    Inserts a new document into MongoDB.

READ
    CodeReview.find(...)
    Retrieves multiple documents.

    CodeReview.findById(...)
    Retrieves one document.

UPDATE
    CodeReview.findByIdAndUpdate(...)
    Updates an existing document.

DELETE
    CodeReview.findByIdAndDelete(...)
    Deletes an existing document.

All operations are asynchronous and return Promises.
*/
