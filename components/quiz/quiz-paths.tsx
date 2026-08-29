"use client";

import Link from "next/link";
import { ArrowRight, Lightbulb, ThumbsUp } from "lucide-react";

export function QuizPaths() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 ring-1 ring-amber-200">
            Choose Your Path
          </span>
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Two ways to win
          </h2>
          <p className="text-lg text-gray-500">
            Vote on the existing answers or attempt to answer these puzzles. Both can be rewarding in their own way!
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <Link href="/signin?next=/participate" className="group block">
            <div className="relative h-full overflow-hidden rounded-2xl border border-amber-100 bg-amber-50 p-8 transition-all duration-200 hover:border-amber-300 hover:shadow-lg">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 transition-colors group-hover:bg-amber-200">
                <Lightbulb className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                Solve the Puzzles
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Read the puzzles, connect the dots, and submit your own creative answers. Win the grand prizes if your answer is voted the best.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-amber-600">
                Start answering <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          <Link href="/signin?next=/vote" className="group block">
            <div className="relative h-full overflow-hidden rounded-2xl border border-blue-100 bg-blue-50 p-8 transition-all duration-200 hover:border-blue-300 hover:shadow-lg">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 transition-colors group-hover:bg-blue-200">
                <ThumbsUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                Vote on Answers
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Read through what others have submitted and cast your votes for the smartest, most creative and well-reasoned answers.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-blue-600">
                Start voting <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
