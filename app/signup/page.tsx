"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { SignupForm } from "@/components/signup-form";

function SignupContent() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const signinHref = next
    ? `/signin?next=${encodeURIComponent(next)}`
    : "/signin";

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
        <h1 className="text-2xl font-semibold tracking-tight">
          Create a Quiz account
        </h1>
        <p className="text-sm text-muted-foreground">
          Your account will be reviewed before you can sign in.
        </p>
      </div>
      <SignupForm />
      <p className="px-4 pb-2 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={signinHref} className="underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </>
  );
}

export default function SignupPage() {
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
            <SignupContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
