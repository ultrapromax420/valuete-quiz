"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Question = {
  id: string;
  question: string;
  order: number;
};

type Submission = {
  id: string;
  answers: {
    questionId: string;
    question: string;
    answer: string;
    rating?: number | null;
    adminResponse?: string;
  }[];
  status: string;
  rating: number | null;
  adminNotes?: string;
};

export function QuizForm() {
  const { data: session, status } = useSession();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status !== "authenticated" || !session?.token) {
      return;
    }

    const load = async () => {
      try {
        const [questionsRes, meRes] = await Promise.all([
          apiFetch("/quiz/questions", session.token),
          apiFetch("/quiz/me", session.token),
        ]);
        setQuestions(questionsRes?.data?.questions || []);
        setSubmission(meRes?.data?.submission || null);

        if (meRes?.data?.submission?.answers) {
          const next: Record<string, string> = {};
          for (const item of meRes.data.submission.answers) {
            next[item.questionId] = item.answer;
          }
          setAnswers(next);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to load the quiz.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [session?.token, status]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session?.token) {
      return;
    }

    const payload = questions.map((question) => ({
      questionId: question.id,
      answer: (answers[question.id] || "").trim(),
    }));

    if (payload.some((item) => !item.answer)) {
      toast.error("Please answer every question before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await apiFetch("/quiz/submit", session.token, {
        method: "POST",
        body: JSON.stringify({ answers: payload }),
      });
      setSubmission(result.data);
      toast.success("Quiz submitted. An admin will review your answers.");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit the quiz.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || isLoading) {
    return <p className="text-sm text-muted-foreground">Loading quiz...</p>;
  }

  if (!questions.length && !submission) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          No quiz questions are available yet. Please check back later.
        </CardContent>
      </Card>
    );
  }

  const isSubmitted = !!submission;
  const displayQuestions = isSubmitted
    ? (submission.answers || []).map((item, index) => ({
        id: item.questionId || String(index),
        question: item.question,
        order: index + 1,
      }))
    : questions;

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {isSubmitted && (
        <Card>
          <CardContent className="space-y-2 pt-6 text-sm">
            <p className="font-medium">Your quiz has been submitted.</p>
            {submission.status === "rated" ? (
              <p>
                Overall score: <strong>{submission.rating}/5</strong>
                {submission.adminNotes ? ` — ${submission.adminNotes}` : ""}
              </p>
            ) : (
              <p className="text-muted-foreground">
                Your answers are pending review. They will not appear for voting
                until an admin approves them.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {displayQuestions.map((question, index) => (
        <Card key={question.id}>
          <CardHeader>
            <CardTitle className="text-base">
              Q{index + 1}. {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor={question.id} className="sr-only">
              Answer
            </Label>
            <Textarea
              id={question.id}
              rows={6}
              disabled={isSubmitted}
              placeholder="Type your answer here"
              value={answers[question.id] || ""}
              onChange={(event) =>
                setAnswers((current) => ({
                  ...current,
                  [question.id]: event.target.value,
                }))
              }
            />
            {isSubmitted && submission.status === "rated" && (
              <div className="rounded-md border bg-muted/40 p-3 text-sm">
                <p className="font-medium">
                  Score:{" "}
                  {submission.answers[index]?.rating != null
                    ? `${submission.answers[index].rating}/5`
                    : "-"}
                </p>
                {submission.answers[index]?.adminResponse && (
                  <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
                    {submission.answers[index].adminResponse}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {!isSubmitted && (
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit quiz"}
        </Button>
      )}
    </form>
  );
}
