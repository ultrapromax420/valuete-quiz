import { Trophy, Medal, Award } from "lucide-react";

export function QuizPrizes() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 ring-1 ring-amber-200">
            The Rewards
          </span>
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Prove your worth. Win big.
          </h2>
          <p className="text-lg text-gray-500">
            Not to mention you get to show off your wits to 1000s of fellow IITians.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-3">
          {/* First Prize */}
          <div className="group relative overflow-hidden rounded-2xl border border-amber-200 bg-white p-6 text-center shadow-sm transition-all hover:shadow-md hover:border-amber-300">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
              <Trophy className="h-8 w-8 text-amber-500" />
            </div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-500">1st Prize</div>
            <h3 className="mb-3 text-xl font-bold text-gray-900">The Wizard</h3>
            <p className="text-4xl font-extrabold text-amber-500">₹10,000</p>
            <p className="mt-2 text-sm text-gray-400">1 winner</p>
          </div>

          {/* Second Prize */}
          <div className="group relative overflow-hidden rounded-2xl border border-indigo-200 bg-white p-6 text-center shadow-sm transition-all hover:shadow-md hover:border-indigo-300">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
              <Medal className="h-8 w-8 text-indigo-500" />
            </div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-indigo-500">2nd Prize</div>
            <h3 className="mb-3 text-xl font-bold text-gray-900">The Philosophers</h3>
            <p className="text-4xl font-extrabold text-indigo-500">₹5,000</p>
            <p className="mt-2 text-sm text-gray-400">2 winners (each)</p>
          </div>

          {/* Third Prize */}
          <div className="group relative overflow-hidden rounded-2xl border border-orange-200 bg-white p-6 text-center shadow-sm transition-all hover:shadow-md hover:border-orange-300">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
              <Award className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-orange-500">3rd Prize</div>
            <h3 className="mb-3 text-xl font-bold text-gray-900">The Innovators</h3>
            <p className="text-4xl font-extrabold text-orange-500">₹3,000</p>
            <p className="mt-2 text-sm text-gray-400">5 winners (each)</p>
          </div>
        </div>
      </div>
    </section>
  );
}
