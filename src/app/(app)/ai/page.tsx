import CodeReview from "@/features/app/ai/CodeReview";
import { getReviewHistory } from "@/actions/getReviewHistory";
import ReviewHistory from "./ReviewHistory";

export default async function AIPage() {
  const reviews = await getReviewHistory();

  console.log("Review history:", reviews);

  return (
    <div className="h-full">
      <CodeReview />
      <ReviewHistory />
    </div>
  );
}
