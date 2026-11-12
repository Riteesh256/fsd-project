"use client";

import React, { useState } from "react";
import { Navbar } from "./Navbar";
import { StatsOverview } from "./StatsOverview";
import { HabitList } from "./HabitList";
import { GoalList } from "./GoalList";
import { ConsistencyMatrix } from "./ConsistencyMatrix";
import { AddHabitModal } from "./AddHabitModal";
import { AddGoalModal } from "./AddGoalModal";
import { HabitItem, GoalItem, DailySummary } from "@/lib/types";
import {
  Flame,
  Target,
  Sparkles,
  CheckCircle2,
  Calendar,
  Zap,
} from "lucide-react";

interface DashboardClientProps {
  habits: HabitItem[];
  goals: GoalItem[];
  summary: DailySummary;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export function DashboardClient({
  habits,
  goals,
  summary,
  user,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"habits" | "goals" | "analytics">(
    "habits"
  );
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);

  const remainingHabits = summary.totalHabits - summary.completedToday;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/70 dark:bg-zinc-950">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddHabit={() => setIsAddHabitOpen(true)}
        onOpenAddGoal={() => setIsAddGoalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Hero Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
                Welcome back, {user.name?.split(" ")[0] || "Explorer"}
              </h1>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <Flame className="w-3.5 h-3.5" />
                <span>{summary.bestStreak}d streak</span>
              </span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              {remainingHabits === 0
                ? "✨ Incredible work! You've checked off every single habit for today."
                : `You are only ${remainingHabits} ${
                    remainingHabits === 1 ? "habit" : "habits"
                  } away from a 100% daily score.`}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAddHabitOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors duration-200 cursor-pointer"
            >
              + Quick Add Habit
            </button>
          </div>
        </div>

        {/* 4-Card Bento Grid Summary */}
        <StatsOverview summary={summary} />

        {/* Dynamic View by Tab */}
        {activeTab === "habits" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Daily Habits Checklist */}
            <div className="lg:col-span-2">
              <HabitList
                initialHabits={habits}
                onOpenAddModal={() => setIsAddHabitOpen(true)}
              />
            </div>

            {/* Right 1 Col: Quick Goal Overview & Momentum Insight */}
            <div className="space-y-6">
              {/* Linked Goals Preview */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-indigo-500" />
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      Active Goals
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab("goals")}
                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {goals.slice(0, 3).map((goal) => (
                    <div
                      key={goal.id}
                      className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800"
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate pr-2">
                          {goal.title}
                        </span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          {goal.currentProgress}%
                        </span>
                      </div>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${goal.currentProgress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consistency Mini Matrix */}
              <ConsistencyMatrix habits={habits} />
            </div>
          </div>
        )}

        {activeTab === "goals" && (
          <GoalList
            initialGoals={goals}
            onOpenAddModal={() => setIsAddGoalOpen(true)}
          />
        )}

        {activeTab === "analytics" && (
          <div className="space-y-8">
            <ConsistencyMatrix habits={habits} />

            {/* Category Distribution Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Atomic Habits Philosophy
                  </h4>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  You do not rise to the level of your goals. You fall to the
                  level of your systems. Each habit check is a vote for the type
                  of person you wish to become.
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-amber-500" />
                  </div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Streak Compounding
                  </h4>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  A 1% improvement every day results in a 37x transformation
                  over a single year. Consistency outweighs bursts of intense
                  effort.
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <Target className="w-4 h-4 text-indigo-500" />
                  </div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Goal Integration
                  </h4>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Every daily task links back to a strategic objective.
                  Completing your daily habits continuously moves the milestone
                  needle forward.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <AddHabitModal
        isOpen={isAddHabitOpen}
        onClose={() => setIsAddHabitOpen(false)}
        availableGoals={goals}
      />

      <AddGoalModal
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
      />
    </div>
  );
}

