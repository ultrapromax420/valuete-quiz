import { Metadata } from "next";
import { QuizHero } from "@/components/quiz/quiz-hero";
import { QuizPhilosophy } from "@/components/quiz/quiz-philosophy";
import { QuizPrizes } from "@/components/quiz/quiz-prizes";
import { QuizPuzzles } from "@/components/quiz/quiz-puzzles";
import { QuizCTA } from "@/components/quiz/quiz-cta";

export const metadata: Metadata = {
  title: "Valuete Quiz Challenge",
  description:
    "The world revolves around Money — but what money is, no one cares to question. Enter the Valuete Quiz Challenge and win up to ₹10,000. Exclusively for IITians.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <QuizHero />
      <QuizPhilosophy />
      <QuizPuzzles />
      <QuizPrizes />
      <QuizCTA />
    </div>
  );
}
