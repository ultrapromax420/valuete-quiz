import type { Metadata } from "next";

import { Providers } from "@/components/providers";
import { QuizNavbar } from "@/components/quiz/quiz-navbar";

import "./globals.css";

export const metadata: Metadata = {
  title: "Valuete Quiz",
  description:
    "Puzzles about what money is and how it works. Participate, vote, and compete for prizes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        <Providers>
          <QuizNavbar />
          <div className="pt-16">{children}</div>
        </Providers>
      </body>
    </html>
  );
}

