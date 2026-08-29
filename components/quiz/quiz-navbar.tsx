"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, Gift, Users, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function QuizNavbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo / Left */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center transition-transform group-hover:scale-105">
            <Image src="/logo.png" alt="Valuete Logo" width={32} height={32} className="object-contain" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold tracking-tight text-gray-900">Valuete</span>
            <span className="text-lg font-semibold text-amber-500">Quiz</span>
          </div>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-3">
          {session ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <User className="h-3.5 w-3.5" />
                </div>
                <span className="hidden sm:inline-block max-w-[120px] truncate">
                  {session.user?.name || session.user?.email?.split('@')[0] || "Profile"}
                </span>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-3 py-2 border-b border-gray-100 mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{session.user?.name || "User"}</p>
                    <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                  </div>
                  
                  <Link href="/participate" onClick={() => setIsOpen(false)}>
                    <div className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors">
                      <Users className="h-4 w-4" />
                      Puzzles
                    </div>
                  </Link>

                  <Link href="/referrals" onClick={() => setIsOpen(false)}>
                    <div className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors">
                      <Users className="h-4 w-4" />
                      Referrals
                    </div>
                  </Link>
                  
                  <Link href="/rewards" onClick={() => setIsOpen(false)}>
                    <div className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors">
                      <Gift className="h-4 w-4" />
                      Rewards
                    </div>
                  </Link>

                  <div className="my-1 border-t border-gray-100"></div>

                  <button
                    onClick={() => {
                      setIsOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/signin">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden rounded-full px-5 font-medium text-gray-700 hover:bg-gray-100 sm:flex"
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="rounded-full bg-amber-500 px-5 font-semibold text-white shadow-sm hover:bg-amber-600"
                >
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
