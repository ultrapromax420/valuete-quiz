"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest("/quiz/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
          referralCode: referralCode.trim() || undefined,
        }),
      });
      toast.success("Registration submitted");
      router.push("/pending");
    } catch (error: any) {
      toast.error(error.message || "Signup failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
        />
      </div>
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
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          type="password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="referralCode">Referral code (optional)</Label>
        <Input
          id="referralCode"
          value={referralCode}
          onChange={(event) => setReferralCode(event.target.value)}
          placeholder="ABC123"
        />
      </div>
      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
