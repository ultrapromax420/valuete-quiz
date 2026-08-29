import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

export default function PendingPage() {
  return (
    <div className="container mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-4">
      <Card className="w-full">
        <CardContent className="space-y-4 pt-6 text-center">
          <img
            src="/logo.png"
            alt="Valuete"
            width={40}
            height={40}
            className="mx-auto size-10"
          />
          <h1 className="text-2xl font-semibold tracking-tight">
            Registration under review
          </h1>
          <p className="text-sm text-muted-foreground">
            Your registration is currently under review. You will be able to
            sign in once your account has been approved.
          </p>
          <Link
            href="/signin"
            className="inline-block text-sm underline underline-offset-4"
          >
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
