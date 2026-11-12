"use client";

import React from "react";
import { Flame, Award, Zap } from "lucide-react";
import { HabitItem } from "@/lib/types";

interface ConsistencyMatrixProps {
  habits: HabitItem[];
}

export function ConsistencyMatrix({ habits }: ConsistencyMatrixProps) {
  // Generate past 28 days for clean calendar view
  const days: { dateStr: string; label: string; count: number; level: number }[] =
    [];
  const today = new Date();

  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const dayNum = d.getDate();

    // In a full system, this checks daily habit logs. Here we simulate consistency based on streaks
    const isToday = i === 0;
    const completedTodayCount = habits.filter((h) => h.isCompletedToday).length;
    
    // Simulate past days' intensity realistically based on current active streaks
    let count = 0;
    if (isToday) {
      count = completedTodayCount;
    } else {
      // Habit streak simulation: habits with streak > i were completed on that day
      count = habits.filter((h) => h.currentStreak > i).length;
    }

    let level = 0;
    if (count >= 4) level = 4;
    else if (count >= 3) level = 3;
    else if (count >= 2) level = 2;
    else if (count >= 1) level = 1;

    days.push({
      dateStr,
      label: `${dayName} ${dayNum}`,
      count,
      level,
    });
  }

  const levelColors = [
    "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700/60",
    "bg-emerald-200 dark:bg-emerald-900/60 border-emerald-300 dark:border-emerald-800",
    "bg-emerald-300 dark:bg-emerald-700/70 border-emerald-400 dark:border-emerald-600",
    "bg-emerald-500 dark:bg-emerald-600 border-emerald-600 dark:border-emerald-500",
    "bg-emerald-600 dark:bg-emerald-500 border-emerald-700 dark:border-emerald-400",
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs mb-8 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Habit Consistency Matrix
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Past 4 Weeks
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Visualizing uninterrupted momentum across all daily routines.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
          <span>Less</span>
          {levelColors.map((colorClass, idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-sm border ${colorClass}`}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Grid of 28 Days */}
      <div className="grid grid-cols-7 sm:grid-cols-14 gap-2">
        {days.map((day, idx) => (
          <div
            key={idx}
            title={`${day.label}: ${day.count} habits completed`}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div
              className={`w-full aspect-square rounded-md border transition-all duration-200 group-hover:scale-110 ${
                levelColors[day.level]
              }`}
            />
            <span className="text-[10px] text-zinc-400 mt-1 font-medium group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">
              {day.label.split(" ")[1]}
            </span>
          </div>
        ))}
      </div>

      {/* Motivational Milestones Footer */}
      <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-2 text-zinc-600 dark:text-zinc-300">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>
            <strong>The 2-Day Rule:</strong> Never miss twice in a row to protect your neurological habit loop.
          </span>
        </div>

        <div className="flex items-center space-x-3 text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center space-x-1">
            <Award className="w-3.5 h-3.5 text-indigo-500" />
            <span>Badge: 7-Day Warrior</span>
          </div>
          <div className="flex items-center space-x-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>21-Day Habit Formed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

