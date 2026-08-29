"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Gift, Wallet, Clock, ArrowUpRight } from "lucide-react";

import { apiFetch } from "@/lib/api";

type Reward = {
  id: string;
  amount: number;
  rewardType: string;
  status: string;
  createdAt?: string;
};

export default function RewardsPage() {
  const { data: session, status } = useSession();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated" || !session?.token) {
      return;
    }
    apiFetch("/quiz/rewards", session.token)
      .then((result) => setRewards(result?.data?.rewards || []))
      .catch((error) => toast.error(error.message || "Failed to load rewards."))
      .finally(() => setIsLoading(false));
  }, [session?.token, status]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-r-transparent"></div>
      </div>
    );
  }

  const totalEarned = rewards.reduce((sum, r) => sum + r.amount, 0);
  const paidOut = rewards.filter(r => r.status === "PAID").reduce((sum, r) => sum + r.amount, 0);
  const pending = totalEarned - paidOut;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-10">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 mb-4">
            <Gift className="h-8 w-8" />
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            My Rewards
          </h1>
          <p className="text-lg text-gray-500">
            Track your earnings from quiz prizes and successful referrals. Payouts are processed by our team.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Wallet className="h-4 w-4" />
              <p className="text-sm font-medium">Total Earned</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">₹{totalEarned.toLocaleString("en-IN")}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-600 mb-2">
              <ArrowUpRight className="h-4 w-4" />
              <p className="text-sm font-medium">Paid Out</p>
            </div>
            <p className="text-3xl font-bold text-emerald-600">₹{paidOut.toLocaleString("en-IN")}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-amber-600 mb-2">
              <Clock className="h-4 w-4" />
              <p className="text-sm font-medium">Pending Payout</p>
            </div>
            <p className="text-3xl font-bold text-amber-600">₹{pending.toLocaleString("en-IN")}</p>
          </div>
        </div>

        {/* List */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Reward History</h3>
          {!rewards.length ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <p className="text-gray-500">You haven't earned any rewards yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rewards.map((reward) => (
                <div key={reward.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-colors hover:bg-gray-50">
                  <div>
                    <p className="text-lg font-bold text-gray-900">₹{reward.amount.toLocaleString("en-IN")}</p>
                    <p className="text-sm text-gray-500 capitalize">{reward.rewardType.replace(/_/g, " ").toLowerCase()}</p>
                  </div>
                  <div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      reward.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {reward.status}
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
