"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Sparkles, CheckCircle2, LockKeyhole } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PUZZLES, accentMap } from "@/components/quiz/quiz-puzzles";
import Link from "next/link";

const MIN_CHARS = 150;

export default function ParticipatePage() {
  const { data: session, status } = useSession();
  const [dbQuestions, setDbQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submission, setSubmission] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status !== "authenticated" || !session?.token) return;

    const load = async () => {
      try {
        const [questionsRes, meRes] = await Promise.all([
          apiFetch("/quiz/questions", session.token),
          apiFetch("/quiz/me", session.token),
        ]);
        
        setDbQuestions(questionsRes?.data?.questions || []);
        setSubmission(meRes?.data?.submission || null);

        if (meRes?.data?.submission?.answers) {
          const next: Record<number, string> = {};
          // The backend submission answers don't explicitly link to `order`. 
          // We map them by questionId to find the order.
          const qMap = new Map((questionsRes?.data?.questions || []).map((q: any) => [q.id, q.order]));
          for (const item of meRes.data.submission.answers) {
            const order = Number(qMap.get(item.questionId) || 0);
            next[order] = item.answer;
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

  const onSubmit = async () => {
    if (!session?.token) return;

    // Validate all 5 puzzles are answered and meet min length
    const payload: { questionId: string; answer: string }[] = [];
    for (const puzzle of PUZZLES) {
      const dbQ = dbQuestions.find(q => q.order === puzzle.order);
      if (!dbQ) {
        toast.error("Internal error: Could not map puzzle to database question.");
        return;
      }
      const ans = (answers[puzzle.order] || "").trim();
      if (ans.length < MIN_CHARS) {
        toast.error(`Puzzle ${puzzle.order} needs at least ${MIN_CHARS} characters. You wrote ${ans.length}.`);
        return;
      }
      payload.push({ questionId: dbQ.id, answer: ans });
    }

    setIsSubmitting(true);
    try {
      const result = await apiFetch("/quiz/submit", session.token, {
        method: "POST",
        body: JSON.stringify({ answers: payload }),
      });
      setSubmission(result.data);
      toast.success("Quiz submitted successfully! An admin will review your answers.");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit the quiz.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitted = !!submission;

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-r-transparent"></div>
      </div>
    );
  }

  const answeredCount = PUZZLES.filter(p => (answers[p.order] || "").trim().length >= MIN_CHARS).length;
  const progressPercent = Math.round((answeredCount / PUZZLES.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-10">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        
        {/* Header section */}
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {isSubmitted ? "Your Submission" : "Complete the Quiz"}
          </h1>
          <p className="text-lg text-gray-500">
            {isSubmitted 
              ? "You have completed the Valuete Quiz. View your answers below." 
              : "Read carefully and explain your reasoning. Minimum 5-10 lines per puzzle."}
          </p>
        </div>

        {/* Progress Bar (only if not submitted) */}
        {!isSubmitted && (
          <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-gray-700">
              <span>Progress</span>
              <span>{answeredCount} of {PUZZLES.length} Completed</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
              <div 
                className="h-full bg-amber-500 transition-all duration-500 ease-out" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Status Alert if submitted */}
        {isSubmitted && (
          <div className="mb-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
            <div className="flex items-center gap-3 text-emerald-800">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              <h3 className="text-lg font-semibold">Quiz Completed</h3>
            </div>
            <p className="mt-2 text-emerald-700">
              Your answers have been submitted.
              {submission.status === "PENDING" && " They are currently under review by our team before they become public."}
              {submission.status === "APPROVED" && " They have been approved and are now visible to the public!"}
            </p>
          </div>
        )}

        {/* Puzzles List */}
        <div className="space-y-8">
          {PUZZLES.map((puzzle) => {
            const ac = accentMap[puzzle.accent];
            const currentAns = answers[puzzle.order] || "";
            const charCount = currentAns.trim().length;
            const isValid = charCount >= MIN_CHARS;

            return (
              <div key={puzzle.order} className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${ac.border}`}>
                
                {/* Puzzle Text */}
                <div className="border-b border-gray-100 p-6 sm:p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${ac.bg}`}>
                      {puzzle.emoji}
                    </div>
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-widest ${ac.text}`}>
                        Puzzle {puzzle.order}
                      </p>
                      <h3 className="text-xl font-bold text-gray-900">{puzzle.title}</h3>
                    </div>
                  </div>
                  <div className={`rounded-xl p-5 ${ac.bg}`}>
                    <p className="whitespace-pre-wrap text-base leading-relaxed text-gray-800">
                      {puzzle.full}
                    </p>
                  </div>
                </div>

                {/* Answer Area */}
                <div className="bg-gray-50/50 p-6 sm:p-8">
                  {isSubmitted ? (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-700">Your Answer</h4>
                      <div className="rounded-xl border border-gray-200 bg-white p-5">
                        <p className="whitespace-pre-wrap text-gray-700">{currentAns}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-700">Your Answer</h4>
                        <span className={`text-xs font-medium ${charCount === 0 ? "text-gray-400" : isValid ? "text-emerald-600" : "text-amber-600"}`}>
                          {charCount} / {MIN_CHARS} min characters
                        </span>
                      </div>
                      <Textarea
                        rows={6}
                        placeholder="Write your detailed reasoning here..."
                        value={currentAns}
                        onChange={(e) => setAnswers({ ...answers, [puzzle.order]: e.target.value })}
                        className={`resize-y rounded-xl border-gray-200 bg-white p-4 focus-visible:ring-${puzzle.accent}-500/20 ${!isValid && charCount > 0 ? "border-amber-300 focus-visible:border-amber-400" : ""}`}
                      />
                      {!isValid && charCount > 0 && (
                        <p className="text-xs text-amber-600 flex items-center gap-1.5">
                          <LockKeyhole className="h-3 w-3" />
                          Please write at least {MIN_CHARS - charCount} more characters to unlock this puzzle.
                        </p>
                      )}
                      {isValid && !isSubmitted && (
                        <p className="text-xs text-emerald-600 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3" />
                          Great answer! Ready to submit.
                        </p>
                      )}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        {!isSubmitted && (
          <div className="mt-10 flex justify-end">
            <Button
              onClick={onSubmit}
              disabled={isSubmitting || answeredCount < PUZZLES.length}
              size="lg"
              className="rounded-full bg-amber-500 px-10 text-base font-semibold text-white shadow-lg shadow-amber-200 hover:bg-amber-600 hover:shadow-xl disabled:opacity-50"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              {isSubmitting ? "Submitting..." : "Submit All Answers"}
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
