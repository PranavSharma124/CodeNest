"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { CodeReview } from "@/models/CodeReview";

export async function deleteReview(reviewId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  await connectMongoDB();

  const deletedReview = await CodeReview.findOneAndDelete({
    _id: reviewId,
    userId: session.user.id,
  });

  if (!deletedReview) {
    throw new Error("Review not found");
  }

  return {
    id: deletedReview._id.toString(),
  };
}
