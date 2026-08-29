"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ChevronDown, Sparkles, ThumbsUp, LockKeyhole, Loader2, ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { apiRequest, apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";

export const PUZZLES = [
  {
    order: 1,
    emoji: "💰",
    title: "The Great Money Switch",
    teaser: "Why did hard money become paper money only in the 1900s?",
    full: `Our modern money is paper or digital money but for most of human history money was physical — like gold coins, silver coins, shells etc. Something that was scarce and hard to make more of.

The big change from hard money to paper money happened in the 1900s. Until then, humans used hard money. Paper or digital money is incredibly easy to make more of and central banks do print their way to hyperinflation sometimes.

The big question is — "why did this happen only in the 1900s and not before?"

Are people in the 20th century so stupid that they can easily be fooled with Fake Money?

To create long lasting wealth, one needs to understand how money works. And as they say — until you study history, you can't predict the future!`,
    accent: "amber",
  },
  {
    order: 2,
    emoji: "🪙",
    title: "The Gold Mystery",
    teaser: "Banks lend for cars and holidays, but never for Gold. Why?",
    full: `Gold has been the ultimate store of wealth over 1000s of years.

Investing in Gold has been proven to be one of the best strategies over the last 25 years, beating even the prestigious S&P 500 index.

Nevertheless, banks don't lend you money to invest in Gold.

Banks lend crores to invest in houses and farmland. They lend to buy fancy cars, holidays — things with no guaranteed return.

Banks practically lend to buy anything under the sun except for buying Gold!

Ever wonder why? 🤔

Let us know if you can crack this mystery.

(Hint: If banks lend to invest in gold, gold prices would further skyrocket, propelling more people to invest in Gold. Which means just investing in gold would easily be the best investment strategy of all time…)`,
    accent: "yellow",
  },
  {
    order: 3,
    emoji: "📈",
    title: "The Billion Dollar Inflation",
    teaser: "Why do prices of everything keep going up — forever?",
    full: `Inflation hurts everyone. Everyone feels the pinch.

House prices keep going up despite new houses being built constantly. Food prices keep going up despite record production. Fuel prices keep going up despite record production. Gold prices are touching record highs.

The question is — why?

Have you wondered why prices of everything keep going up?

Economists who focus on the short-term blame supply shocks but never comment on long-term reasons.

What's causing inflation in all goods and services over the long term?

This is the billion dollar question (upgraded from million dollar — due to inflation 😂).`,
    accent: "orange",
  },
  {
    order: 4,
    emoji: "🔐",
    title: "The Unstoppable Stablecoin",
    teaser: "Why is stablecoin adoption impossible to stop?",
    full: `Governments around the world are trying to regulate and restrict stablecoins. Central banks are rushing to create their own digital currencies. Financial regulators warn of risks.

And yet — stablecoin adoption keeps growing. It cannot be stopped.

Why?

What fundamental force makes stablecoins so inevitable that no government, no regulation, and no central bank can halt their spread?

Connect the dots. Think about what stablecoins solve that traditional banking cannot. Think about who needs them and why.

The answer reveals something profound about the nature of money itself.`,
    accent: "blue",
  },
  {
    order: 5,
    emoji: "₿",
    title: "All Roads Lead to Bitcoin",
    teaser: "Why do all roads lead to Bitcoin?",
    full: `No matter where you start your journey — economics, monetary history, inflation, government debt, stablecoins, gold, banking — you always end up at Bitcoin.

Why?

Why does every investigation into the nature of money, every analysis of the global financial system, and every search for a solution to monetary debasement eventually point toward Bitcoin?

Is it hype? Is it speculation? Or is there a first-principles reason that makes Bitcoin not just an option, but the inevitable conclusion?

Think deeply. The world revolves around money — and the money question always leads somewhere.`,
    accent: "emerald",
  },
];

const DUMMY_ANSWERS: Record<number, PublicAnswer[]> = {
  1: [
    {
      id: "dummy1_1",
      answer: "Paper money emerged as a technological solution to the scaling problem of hard money. Moving physical gold across oceans for global trade became practically impossible and extremely risky. Paper notes acting as claims on gold provided the necessary velocity for the industrial revolution.",
      voteCount: 142,
      user: { name: "Aditya S." },
      hasVoted: false,
    },
    {
      id: "dummy1_2",
      answer: "Governments needed a way to fund massive global conflicts without instantly raising taxes. By moving to paper money, they could silently tax the population through inflation. The 1900s was just the first time the state apparatus was powerful enough to enforce this transition globally.",
      voteCount: 89,
      user: { name: "Priya M." },
      hasVoted: false,
    }
  ],
  2: [
    {
      id: "dummy2_1",
      answer: "Banks create credit to fund productive assets or consumption. If banks lent money to buy gold, they would be funding a speculative attack on their own currency system. Gold yields nothing, so the only way to repay the loan is if gold appreciates against the fiat currency.",
      voteCount: 215,
      user: { name: "Rahul K." },
      hasVoted: false,
    }
  ],
  3: [
    {
      id: "dummy3_1",
      answer: "Inflation is fundamentally a monetary phenomenon. It's not that things are getting more expensive, it's that the currency used to measure them is losing value because the supply of that currency is constantly being expanded by central banks.",
      voteCount: 310,
      user: { name: "Neha R." },
      hasVoted: false,
    }
  ],
  4: [
    {
      id: "dummy4_1",
      answer: "Stablecoins provide access to digital dollars for people in developing nations whose local currencies are rapidly debasing. The demand is so overwhelming from the global south that trying to regulate it is like trying to ban the internet.",
      voteCount: 178,
      user: { name: "Vikram T." },
      hasVoted: false,
    }
  ],
  5: [
    {
      id: "dummy5_1",
      answer: "Because it solves the fundamental problem of trust. Every other system requires you to trust a central authority not to debase your money. Bitcoin uses thermodynamics and cryptography to remove the need for trust entirely.",
      voteCount: 450,
      user: { name: "Anjali D." },
      hasVoted: false,
    }
  ]
};

type PublicAnswer = {
  id: string;
  answer: string;
  voteCount: number;
  user?: { name?: string };
  isOwn?: boolean;
  hasVoted?: boolean;
};

type PublicQuestion = {
  id: string;
  question: string;
  order: number;
  answers: PublicAnswer[];
};

export const accentMap: Record<string, { border: string; bg: string; text: string; btn: string }> = {
  amber:   { border: "border-amber-200 hover:border-amber-400",   bg: "bg-amber-50",   text: "text-amber-600",   btn: "bg-amber-500 hover:bg-amber-600 text-white" },
  yellow:  { border: "border-yellow-200 hover:border-yellow-400", bg: "bg-yellow-50",  text: "text-yellow-600",  btn: "bg-yellow-500 hover:bg-yellow-600 text-white" },
  orange:  { border: "border-orange-200 hover:border-orange-400", bg: "bg-orange-50",  text: "text-orange-600",  btn: "bg-orange-500 hover:bg-orange-600 text-white" },
  blue:    { border: "border-blue-200 hover:border-blue-400",     bg: "bg-blue-50",    text: "text-blue-600",    btn: "bg-blue-500 hover:bg-blue-600 text-white"   },
  emerald: { border: "border-emerald-200 hover:border-emerald-400", bg: "bg-emerald-50", text: "text-emerald-600", btn: "bg-emerald-500 hover:bg-emerald-600 text-white" },
};

const MAX_ANSWERS = 10;
const VOTE_LOCK_SECONDS = 5;

export function QuizPuzzles() {
  const { data: session } = useSession();
  const router = useRouter();
  const [openPuzzle, setOpenPuzzle] = useState<number | null>(1);
  const [questionsByOrder, setQuestionsByOrder] = useState<Map<number, PublicQuestion>>(new Map());
  const [answersLoading, setAnswersLoading] = useState(true);
  const [votingId, setVotingId] = useState<string | null>(null);
  
  // Read-to-Vote locks state: map of puzzle.order -> boolean (true = locked)
  const [voteLocks, setVoteLocks] = useState<Record<number, boolean>>({});
  const timerRefs = useRef<Record<number, NodeJS.Timeout>>({});

  useEffect(() => {
    // If logged in, fetch from /quiz/voting to get user's vote state
    // Otherwise fetch public answers
    const endpoint = session?.token ? "/quiz/voting" : "/quiz/public/answers";
    const fetcher = session?.token 
      ? () => apiFetch(endpoint, session.token) 
      : () => apiRequest(endpoint);

    fetcher()
      .then((result) => {
        const questions: PublicQuestion[] = result?.data?.questions || [];
        const map = new Map<number, PublicQuestion>();
        for (const q of questions) {
          map.set(q.order, q);
        }
        setQuestionsByOrder(map);
      })
      .catch(() => setQuestionsByOrder(new Map()))
      .finally(() => setAnswersLoading(false));
  }, [session?.token]);

  const togglePuzzle = (order: number) => {
    const isOpening = openPuzzle !== order;
    setOpenPuzzle(isOpening ? order : null);

    // If opening and not already unlocked, set a 5-second read lock
    if (isOpening && voteLocks[order] !== false) {
      setVoteLocks(prev => ({ ...prev, [order]: true }));
      
      if (timerRefs.current[order]) clearTimeout(timerRefs.current[order]);
      
      timerRefs.current[order] = setTimeout(() => {
        setVoteLocks(prev => ({ ...prev, [order]: false }));
      }, VOTE_LOCK_SECONDS * 1000);
    }
  };

  const handleVote = async (answerId: string, puzzleOrder: number) => {
    if (!session?.token) {
      router.push("/signin");
      return;
    }
    
    setVotingId(answerId);
    try {
      const result = await apiFetch("/quiz/votes", session.token, {
        method: "POST",
        body: JSON.stringify({ answerId }),
      });
      
      // Update local state to reflect vote
      setQuestionsByOrder(prev => {
        const next = new Map(prev);
        const q = next.get(puzzleOrder);
        if (q) {
          const updatedAnswers = q.answers.map(ans => 
            ans.id === answerId 
              ? { ...ans, voteCount: result.data.answer.voteCount, hasVoted: true } 
              : ans
          );
          next.set(puzzleOrder, { ...q, answers: updatedAnswers });
        }
        return next;
      });
      
      toast.success("Vote recorded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit vote.");
    } finally {
      setVotingId(null);
    }
  };

  return (
    <section className="bg-gray-50 py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white to-transparent pointer-events-none" />
      
      <div className="container relative mx-auto px-4 sm:px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full bg-amber-100 px-4 py-1.5 text-sm font-semibold text-amber-800 ring-1 ring-amber-200">
            The Valuete Challenge
          </span>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            5 puzzles that break brains
          </h2>
          <p className="text-lg text-gray-500">
            Think of well-researched, logical, out-of-the-box thinking. Read what others think, vote on the best answers, and submit your own to win prizes!
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-6">
          {PUZZLES.map((puzzle) => {
            const ac = accentMap[puzzle.accent];
            const isOpen = openPuzzle === puzzle.order;
            const dbQuestion = questionsByOrder.get(puzzle.order);
            const fetchedAnswers = dbQuestion?.answers ?? [];
            const hasRealAnswers = fetchedAnswers.length > 0;
            const sourceAnswers = hasRealAnswers ? fetchedAnswers : (DUMMY_ANSWERS[puzzle.order] || []);
            const answers = sourceAnswers.slice(0, MAX_ANSWERS);
            const totalAnswers = hasRealAnswers ? fetchedAnswers.length : sourceAnswers.length;
            const isVoteLocked = voteLocks[puzzle.order] === true;

            return (
              <div
                key={puzzle.order}
                className={`rounded-2xl border bg-white shadow-md transition-all duration-300 hover:shadow-lg ${ac.border} ${isOpen ? 'ring-2 ring-opacity-50 ring-' + puzzle.accent + '-400' : ''}`}
              >
                {/* Question header */}
                <button
                  onClick={() => togglePuzzle(puzzle.order)}
                  className="flex w-full items-center gap-4 p-5 sm:p-6 text-left"
                >
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-sm ${ac.bg}`}>
                    {puzzle.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`mb-1 text-xs font-bold uppercase tracking-widest ${ac.text}`}>
                      Puzzle {puzzle.order}
                    </p>
                    <h3 className="text-xl font-bold text-gray-900">{puzzle.title}</h3>
                    {!isOpen && <p className="mt-1 text-sm text-gray-500 truncate">{puzzle.teaser}</p>}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {!answersLoading && totalAnswers > 0 && (
                      <span className="hidden rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 sm:inline-block border border-gray-200">
                        {totalAnswers} {totalAnswers === 1 ? "answer" : "answers"}
                      </span>
                    )}
                    <div className={`flex items-center justify-center h-8 w-8 rounded-full bg-gray-50 transition-colors ${isOpen ? ac.bg : 'hover:bg-gray-100'}`}>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-5 pb-8 pt-5 sm:px-8">
                    {/* Puzzle full text */}
                    <div className={`mb-8 rounded-2xl p-6 shadow-sm border border-opacity-50 ${ac.bg} ${ac.border}`}>
                      <p className="whitespace-pre-wrap text-[1.05rem] leading-relaxed text-gray-800 font-medium">
                        {puzzle.full}
                      </p>
                    </div>

                    {/* Community Answers */}
                    {answers.length > 0 && (
                      <div className="mb-8 space-y-4">
                        <div className="flex justify-between items-end mb-2">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                            Community Answers
                            {totalAnswers > MAX_ANSWERS && (
                              <span className="ml-2 font-medium lowercase text-gray-400">
                                (showing {MAX_ANSWERS} of {totalAnswers})
                              </span>
                            )}
                          </h4>
                          {isVoteLocked && session && (
                            <span className="text-xs font-medium text-gray-400 flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full">
                              <LockKeyhole className="h-3 w-3" />
                              Read first to vote
                            </span>
                          )}
                        </div>
                        
                        {answers.map((answer) => (
                          <div
                            key={answer.id}
                            className={`group relative rounded-2xl border p-5 transition-all duration-200 ${answer.hasVoted ? "border-amber-200 bg-amber-50/40" : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"}`}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                                  {(answer.user?.name || "A").charAt(0).toUpperCase()}
                                </div>
                                <p className="text-sm font-bold text-gray-700">
                                  {answer.user?.name || "Anonymous Participant"} {answer.isOwn && <span className="text-amber-500 font-medium ml-1">(You)</span>}
                                </p>
                              </div>
                              <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border shadow-sm ${answer.hasVoted ? "bg-amber-500 border-amber-600 text-white" : "bg-gray-50 border-gray-200 text-gray-500"}`}>
                                <ThumbsUp className={`h-3 w-3 ${answer.hasVoted ? "text-white fill-white" : ""}`} />
                                {answer.voteCount}
                              </span>
                            </div>
                            <p className="mb-4 text-sm leading-relaxed text-gray-600">
                              {answer.answer}
                            </p>
                            
                            <div className="flex justify-end mt-2 pt-4 border-t border-gray-100">
                              <Button
                                size="sm"
                                onClick={() => handleVote(answer.id, puzzle.order)}
                                disabled={(isVoteLocked && !!session) || answer.hasVoted || answer.isOwn || votingId === answer.id}
                                variant={answer.hasVoted ? "default" : "outline"}
                                className={`h-8 gap-2 rounded-full px-5 text-xs font-bold shadow-sm transition-all
                                  ${answer.hasVoted 
                                    ? "bg-amber-500 text-white hover:bg-amber-600 border-transparent" 
                                    : "text-gray-600 border-gray-200 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50"
                                  }`}
                              >
                                {votingId === answer.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : answer.hasVoted ? (
                                  <ThumbsUp className="h-3.5 w-3.5 fill-white text-white" />
                                ) : (isVoteLocked && session) ? (
                                  <LockKeyhole className="h-3.5 w-3.5 text-gray-400" />
                                ) : (
                                  <ThumbsUp className={`h-3.5 w-3.5 ${session ? "" : "text-gray-400 group-hover:text-amber-500 transition-colors"}`} />
                                )}
                                {answer.hasVoted ? "Voted" : answer.isOwn ? "Your Answer" : "Vote for this"}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* No answers yet */}
                    {!answersLoading && answers.length === 0 && (
                      <div className="mb-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                        <p className="text-sm font-medium text-gray-500">
                          No answers yet — be the first to break the ice!
                        </p>
                      </div>
                    )}

                    {/* Answer CTA */}
                    <div className="flex justify-center pt-2">
                      <Link href={session ? "/participate" : "/signin"} className="w-full sm:w-auto">
                        <Button
                          size="lg"
                          className={`w-full sm:w-auto rounded-full px-8 py-6 gap-2 shadow-md font-bold text-sm transition-transform hover:scale-105 active:scale-95 ${ac.btn}`}
                        >
                          <Sparkles className="h-4 w-4" />
                          {session ? "Submit your answer" : "Sign in to answer"}
                          <ArrowRight className="h-4 w-4 ml-1 opacity-70" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
