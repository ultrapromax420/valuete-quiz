"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuizCTA() {
  return (
    <section className="relative overflow-hidden bg-amber-500 py-24">
      {/* Subtle pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="container relative z-10 mx-auto px-4 text-center sm:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-5 text-5xl">💡</div>
          <h2 className="mb-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Let&apos;s awaken your inner Steve Jobs.
          </h2>
          <p className="mb-10 text-lg text-amber-100">
            The world needs more nuanced thinkers. Don&apos;t just accept what you&apos;re told — question the foundation of money itself. Win amazing prizes while doing it.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signin?next=/participate">
              <Button
                size="lg"
                className="h-12 w-full gap-2.5 rounded-full bg-white px-8 text-base font-semibold text-amber-600 shadow-md hover:bg-amber-50 sm:w-auto"
              >
                <Sparkles className="size-4" />
                Start Solving Now
              </Button>
            </Link>
            <Link href="/signin?next=/vote">
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full gap-2.5 rounded-full border-white/40 bg-transparent px-8 text-base font-semibold text-white hover:bg-white/10 sm:w-auto"
              >
                Vote on Answers
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
