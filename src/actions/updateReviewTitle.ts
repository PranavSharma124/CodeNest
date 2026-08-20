"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { CodeReview } from "@/models/CodeReview";

export async function updateReviewTitle(reviewId: string, title: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    throw new Error("Title cannot be empty");
  }

  if (trimmedTitle.length > 100) {
    throw new Error("Title cannot exceed 100 characters");
  }

  await connectMongoDB();

  const review = await CodeReview.findOneAndUpdate(
    {
      _id: reviewId,
      userId: session.user.id,
    },
    {
      $set: {
        title: trimmedTitle,
      },
    },
    {
      new: true,
    },
  ).lean();

  if (!review) {
    throw new Error("Review not found");
  }

  return {
    id: review._id.toString(),
    title: review.title,
  };
}
