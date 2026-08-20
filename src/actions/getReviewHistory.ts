"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { CodeReview } from "@/models/CodeReview";

export async function getReviewHistory() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  await connectMongoDB();

  const reviews = await CodeReview.find({
    userId: session.user.id,
  })
    .sort({ createdAt: -1 })
    .lean();

  return reviews.map((review) => ({
    id: review._id.toString(),
    title: review.title,
    severity: review.severity,
    summary: review.summary,
    createdAt: review.createdAt.toISOString(),
  }));
}
