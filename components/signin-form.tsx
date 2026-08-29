"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { apiRequest } from "@/lib/api";
import { getSafeNextPath } from "@/lib/auth-redirect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SigninForm() {
  const searchParams = useSearchParams();
  const nextPath = getSafeNextPath(searchParams.get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await apiRequest("/quiz/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
    } catch (error: any) {
      setIsLoading(false);
      if (error?.code === "ACCOUNT_PENDING") {
        window.location.href = "/pending";
        return;
      }
      toast.error("Sign in failed", {
        description: error.message || "Check your email and password and try again.",
      });
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: nextPath,
    });

    setIsLoading(false);

    if (result?.error) {
      toast.error("Sign in failed", {
        description: "Check your email and password and try again.",
      });
      return;
    }

    toast.success("Signed in successfully");
    window.location.href = nextPath;
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
