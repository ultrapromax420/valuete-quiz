"use client";

import Link from "next/link";
import { ArrowRight, Lightbulb, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuizHero() {
  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-20">
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-amber-100/60 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-orange-100/50 blur-[80px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-7 flex items-center justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700">
              <Lightbulb className="h-3.5 w-3.5" />
              Exclusively for IITians · Win up to ₹10,000
            </span>
          </div>

          {/* Heading */}
          <h1 className="mb-5 text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl leading-[1.08]">
            Are you the next{" "}
            <span className="text-gradient">Steve Jobs?</span>
          </h1>

          <p className="mx-auto mb-3 max-w-2xl text-xl text-gray-500 sm:text-2xl">
            Are you able to connect the dots behind why there&apos;s a{" "}
            <span className="font-semibold text-amber-600">massive stable coin premium in India?</span>
          </p>

          <p className="mx-auto mb-10 max-w-xl text-lg text-gray-500">
            5 puzzles that seem so simple and yet break people&apos;s brains. Answer them, win votes and prove your worth.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signin?next=/participate">
              <Button
                size="lg"
                className="h-12 w-full gap-2.5 rounded-full bg-amber-500 px-8 text-base font-semibold text-white shadow-lg shadow-amber-200 transition-all hover:bg-amber-600 sm:w-auto"
              >
                <Lightbulb className="size-4" />
                Solve Puzzles
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/signin?next=/vote">
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full gap-2.5 rounded-full px-8 text-base font-semibold transition-all hover:border-amber-400 hover:text-amber-700 sm:w-auto"
              >
                <Vote className="size-4" />
                Vote on Answers
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl font-bold text-gray-900">5</span>
              <span>Mind-bending puzzles</span>
            </div>
            <div className="hidden h-10 w-px bg-gray-200 sm:block" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl font-bold text-amber-600">₹36,000</span>
              <span>Total prize pool</span>
            </div>
            <div className="hidden h-10 w-px bg-gray-200 sm:block" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl font-bold text-gray-900">1000s</span>
              <span>Fellow IITians</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
