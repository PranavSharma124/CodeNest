"use client";

import { useEffect, useState } from "react";
import { getReviewHistory } from "@/actions/getReviewHistory";
import { updateReviewTitle } from "@/actions/updateReviewTitle";
import { Button } from "@/components/ui/button";
import { deleteReview } from "@/actions/deleteReview";

type Review = {
  id: string;
  title: string;
  severity: "low" | "medium" | "high";
  summary: string;
  createdAt: string;
};

export default function ReviewHistory() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (review: Review) => {
    setEditingId(review.id);
    setEditingTitle(review.title);
  };

  const handleSave = async () => {
    if (!editingId || !editingTitle.trim()) {
      return;
    }

    try {
      setSaving(true);

      const updated = await updateReviewTitle(editingId, editingTitle);

      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review.id === updated.id
            ? { ...review, title: updated.title }
            : review,
        ),
      );

      setEditingId(null);
      setEditingTitle("");
    } catch (error) {
      console.error("Failed to update review:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    try {
      setDeletingId(reviewId);

      await deleteReview(reviewId);

      setReviews((currentReviews) =>
        currentReviews.filter((review) => review.id !== reviewId),
      );
    } catch (error) {
      console.error("Failed to delete review:", error);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await getReviewHistory();
        setReviews(data);
      } catch (error) {
        console.error("Failed to load review history:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading review history...
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-md border p-4 text-sm text-muted-foreground">
        No previous reviews yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Review History</h2>

      {reviews.map((review) => (
        <div key={review.id} className="rounded-md border p-4">
          <div className="flex items-center justify-between gap-4">
            {editingId === review.id ? (
              <div className="flex flex-1 gap-2">
                <input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="w-full rounded-md border px-2 py-1 text-sm"
                  disabled={saving}
                />

                <Button size="sm" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            ) : (
              <h3 className="font-medium">{review.title}</h3>
            )}

            <span className="text-sm capitalize text-muted-foreground">
              {review.severity}
            </span>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">{review.summary}</p>

          <p className="mt-2 text-xs text-muted-foreground">
            {new Date(review.createdAt).toLocaleString()}
          </p>

          {editingId !== review.id && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(review)}
              className="mt-2"
            >
              Rename
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(review.id)}
            disabled={deletingId === review.id}
            className="mt-2"
          >
            {deletingId === review.id ? "Deleting..." : "Delete"}
          </Button>
        </div>
      ))}
    </div>
  );
}
