"use client";

import React from "react";
import { CheckCircle2, Plus, Target, Flame, Sparkles } from "lucide-react";

interface NavbarProps {
  onOpenAddHabit: () => void;
  onOpenAddGoal: () => void;
  activeTab: "habits" | "goals" | "analytics";
  setActiveTab: (tab: "habits" | "goals" | "analytics") => void;
}

export function Navbar({
  onOpenAddHabit,
  onOpenAddGoal,
  activeTab,
  setActiveTab,
}: NavbarProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Date */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100 tracking-tight">
                HabitArc
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                PRO
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              {currentDate}
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200/60 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab("habits")}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer ${
              activeTab === "habits"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <Flame className="w-4 h-4 text-emerald-500" />
            <span>Habits</span>
          </button>
          <button
            onClick={() => setActiveTab("goals")}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer ${
              activeTab === "goals"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <Target className="w-4 h-4 text-indigo-500" />
            <span>Goals</span>
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer ${
              activeTab === "analytics"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Consistency</span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenAddGoal}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-colors duration-200 cursor-pointer"
          >
            <Target className="w-4 h-4 text-indigo-500" />
            <span>New Goal</span>
          </button>

          <button
            onClick={onOpenAddHabit}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-colors duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Habit</span>
          </button>
        </div>
      </div>
    </header>
  );
}

