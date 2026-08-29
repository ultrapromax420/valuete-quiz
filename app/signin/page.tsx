"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { SigninForm } from "@/components/signin-form";

function SigninContent() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const signupHref = next
    ? `/signup?next=${encodeURIComponent(next)}`
    : "/signup";
  const message =
    next === "/participate"
      ? "Sign in to submit your quiz answers."
      : next === "/vote"
        ? "Sign in to vote for submitted answers."
        : "Sign in to participate and vote.";

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <img
          src="/logo.png"
          alt="Valuete"
          width={40}
          height={40}
          className="mx-auto size-10"
        />
        <h1 className="text-2xl font-semibold tracking-tight">Valuete Quiz</h1>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <SigninForm />
      <p className="px-4 pb-2 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href={signupHref} className="underline underline-offset-4">
          Sign up
        </Link>
      </p>
    </>
  );
}

export default function SigninPage() {
  return (
    <div className="container mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-4">
      <Card className="w-full">
        <CardContent className="space-y-6 pt-6">
          <Suspense
            fallback={
              <p className="text-center text-sm text-muted-foreground">
                Loading...
              </p>
            }
          >
            <SigninContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
