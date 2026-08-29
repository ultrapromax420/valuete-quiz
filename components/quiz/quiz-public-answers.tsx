"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ThumbsUp, LockKeyhole } from "lucide-react";

import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";

type PublicAnswer = {
  id: string;
  answer: string;
  voteCount: number;
  user?: { name?: string };
};

type PublicQuestion = {
  id: string;
  question: string;
  answers: PublicAnswer[];
};

export function QuizPublicAnswers() {
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiRequest("/quiz/public/answers")
      .then((result) => setQuestions(result?.data?.questions || []))
      .catch((error) => {
        toast.error(error.message || "Failed to load public answers.");
        setQuestions([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-sm text-muted-foreground">
            Community Answers
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            See what others think
          </h2>
          <p className="text-lg text-muted-foreground">
            These are the top approved answers from participants. Sign in to vote for the best ones or submit your own!
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="h-9 w-9 animate-spin rounded-full border-2 border-border border-t-amber-500" />
            </div>
          ) : !questions.length ? (
            <div className="rounded-2xl border border-dashed border-border/60 p-12 text-center">
              <p className="mb-4 text-muted-foreground">No answers have been published yet.</p>
              <Link href="/signin?next=/participate">
                <Button variant="outline" className="rounded-full">
                  Be the first to answer
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-14">
              {questions.map((question, index) => (
                <div key={question.id}>
                  {/* Question header */}
                  <div className="mb-6 border-b border-border/60 pb-4">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-400">
                      Puzzle {index + 1}
                    </p>
                    <h3 className="text-lg font-semibold text-foreground">
                      {question.question}
                    </h3>
                  </div>

                  {question.answers.length ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {question.answers.map((answer) => (
                        <div
                          key={answer.id}
                          className="group flex flex-col justify-between rounded-xl border border-border/60 bg-card p-5 transition-all hover:border-border"
                        >
                          <div className="mb-4">
                            <p className="mb-3 text-sm font-medium text-amber-400">
                              {answer.user?.name || "Anonymous Participant"}
                            </p>
                            <p className="line-clamp-5 whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
                              &ldquo;{answer.answer}&rdquo;
                            </p>
                          </div>

                          <div className="flex items-center justify-between border-t border-border/60 pt-4">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <ThumbsUp className="h-4 w-4" />
                              {answer.voteCount} {answer.voteCount === 1 ? "vote" : "votes"}
                            </div>
                            <Link href="/signin?next=/vote">
                              <Button size="sm" variant="outline" className="h-7 rounded-full px-3 text-xs gap-1.5 hover:border-amber-500/40 hover:text-amber-400">
                                <LockKeyhole className="h-3 w-3" />
                                Vote
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="border-l-2 border-border/60 pl-4 text-sm italic text-muted-foreground">
                      No published answers for this puzzle yet.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {!isLoading && questions.length > 0 && (
            <div className="mt-12 flex justify-center">
              <Link href="/signin?next=/vote">
                <Button className="rounded-full bg-amber-500 px-6 font-semibold text-white shadow-md shadow-amber-500/20 hover:bg-amber-400">
                  Sign in to vote &amp; see all answers
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
