"use client";

import React from "react";
import { CheckCircle2, Flame, Target, TrendingUp } from "lucide-react";
import { DailySummary } from "@/lib/types";

interface StatsOverviewProps {
  summary: DailySummary;
}

export function StatsOverview({ summary }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Card 1: Today's Completion */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs transition-colors duration-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Today&apos;s Progress
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
            {summary.completionRate}%
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            ({summary.completedToday}/{summary.totalHabits} done)
          </span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${summary.completionRate}%` }}
          />
        </div>
      </div>

      {/* Card 2: Longest Active Streak */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs transition-colors duration-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Top Active Streak
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
            {summary.bestStreak}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            consecutive days
          </span>
        </div>
        <p className="text-xs text-amber-600 dark:text-amber-400 mt-3 font-medium">
          🔥 Consistency is compounding
        </p>
      </div>

      {/* Card 3: Active Goals */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs transition-colors duration-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Active Goals
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <Target className="w-4 h-4 text-indigo-500" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
            {summary.activeGoals}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            in progress
          </span>
        </div>
        <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-3 font-medium">
          🎯 Habits mapped directly to targets
        </p>
      </div>

      {/* Card 4: Momentum & Velocity */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs transition-colors duration-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Momentum Rating
          </span>
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-cyan-500" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
            {summary.completionRate >= 80
              ? "High"
              : summary.completionRate >= 50
              ? "Steady"
              : "Building"}
          </span>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3">
          {summary.completionRate === 100
            ? "🌟 All daily habits completed!"
            : `${summary.totalHabits - summary.completedToday} habits remaining today`}
        </p>
      </div>
    </div>
  );
}

