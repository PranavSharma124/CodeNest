"use client";

import { useState } from "react";
import { reviewCode } from "@/actions/reviewCode";
import { Button } from "@/components/ui/button";

type ReviewResult = {
  summary: string;
  severity: "low" | "medium" | "high";
  issues: {
    title: string;
    explanation: string;
    suggestion: string;
  }[];
  improvedCode: string;
};

export default function CodeReview() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReview = async () => {
    if (!code.trim()) {
      setError("Please enter some code.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await reviewCode(code);

      setResult(response);
    } catch (error) {
      console.error("Failed to review code:", error);
      setError("Failed to review code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-6">
      <div>
        <h1 className="text-2xl font-bold">CodeNest AI</h1>

        <p className="text-muted-foreground">
          Get an AI-powered review of your code.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold">Your code</h2>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here..."
          className="min-h-64 w-full resize-y rounded-md border bg-background p-4 font-mono text-sm outline-none focus:ring-2"
          disabled={loading}
        />

        <Button onClick={handleReview} disabled={loading}>
          {loading ? "Reviewing..." : "Review Code"}
        </Button>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      {result && (
        <div className="space-y-6 border-t pt-6">
          <div>
            <h2 className="mb-2 text-lg font-semibold">AI Review</h2>

            <p className="text-muted-foreground">{result.summary}</p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Severity</h3>

            <p className="capitalize">{result.severity}</p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Issues</h3>

            <div className="space-y-4">
              {result.issues.map((issue, index) => (
                <div key={index} className="rounded-md border p-4">
                  <h4 className="font-semibold">{issue.title}</h4>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {issue.explanation}
                  </p>

                  <p className="mt-2 text-sm">
                    <strong>Suggestion:</strong> {issue.suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Improved Code</h3>

            <pre className="overflow-x-auto rounded-md border bg-muted p-4 text-sm">
              <code>{result.improvedCode}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
