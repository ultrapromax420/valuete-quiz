export function QuizPhilosophy() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16 items-center">
          <div>
            <span className="mb-3 inline-block rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 ring-1 ring-amber-200">
              The Philosophy
            </span>
            <h2 className="mb-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              The world revolves around money.{" "}
              <span className="text-gray-400 font-normal">But what money is — no one cares to question.</span>
            </h2>
            <p className="text-base text-gray-500 leading-relaxed">
              Take a deep breath and let your creativity flow. These puzzles test your ability to understand some of the fundamental concepts of what money is and how it works.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: "🧠", text: "The winners will be those who are not just smart, but creative and can connect the right dots." },
              { icon: "🔍", text: "Most people never pause to think how it all works. Our goal is to force you to question the basics." },
              { icon: "💡", text: "Nuanced thinking wins. Out-of-the-box reasoning that is clear, logical, and fun to read." },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <span className="text-2xl">{item.icon}</span>
                <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
