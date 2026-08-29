"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Users, Copy, CheckCircle2 } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";

type Referral = {
  id: string;
  referralCode: string;
  status: string;
  referredUser?: { name?: string; email?: string } | null;
};

export default function ReferralsPage() {
  const { data: session, status } = useSession();
  const [referralCode, setReferralCode] = useState("");
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status !== "authenticated" || !session?.token) {
      return;
    }
    apiFetch("/quiz/referral", session.token)
      .then((result) => {
        setReferralCode(result?.data?.referralCode || "");
        setReferrals(result?.data?.referrals || []);
      })
      .catch((error) => toast.error(error.message || "Failed to load referrals."))
      .finally(() => setIsLoading(false));
  }, [session?.token, status]);

  const onCopy = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast.success("Referral code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-r-transparent"></div>
      </div>
    );
  }

  const approvedCount = referrals.filter(r => r.status === "APPROVED").length;
  const pendingCount = referrals.filter(r => r.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-10">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 mb-4">
            <Users className="h-8 w-8" />
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Invite & Earn
          </h1>
          <p className="text-lg text-gray-500">
            Share your unique code. When your friends participate and their answers are approved, you earn ₹100 per friend!
          </p>
        </div>

        {/* Code Card */}
        <div className="mb-10 mx-auto max-w-md overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-amber-300">
          <div className="p-6 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-600">Your Referral Code</p>
            <div className="mb-4 text-4xl font-extrabold tracking-widest text-gray-900">
              {referralCode || "------"}
            </div>
            <Button 
              onClick={onCopy} 
              variant="outline"
              className="rounded-full border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 transition-colors w-full gap-2"
            >
              {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy Code"}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Approved Referrals</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">{approvedCount}</p>
            <p className="text-sm text-gray-400 mt-1">₹{approvedCount * 100} earned</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">{pendingCount}</p>
            <p className="text-sm text-gray-400 mt-1">Awaiting admin review</p>
          </div>
        </div>

        {/* List */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Referral History</h3>
          {!referrals.length ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <p className="text-gray-500">You haven't referred anyone yet. Share your code to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-colors hover:bg-gray-50">
                  <div>
                    <p className="font-semibold text-gray-900">{item.referredUser?.name || "Anonymous Friend"}</p>
                    <p className="text-sm text-gray-500">{item.referredUser?.email || "Email hidden"}</p>
                  </div>
                  <div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      item.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 
                      item.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
