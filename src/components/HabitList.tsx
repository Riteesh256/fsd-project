"use client";

import React, { useState } from "react";
import {
  Check,
  Flame,
  Target,
  Trash2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { HabitItem, HabitCategory } from "@/lib/types";
import { toggleHabitAction, deleteHabitAction } from "@/lib/actions";
import { triggerStreakConfetti } from "./ConfettiTrigger";

interface HabitListProps {
  initialHabits: HabitItem[];
  onOpenAddModal: () => void;
}

const CATEGORIES: ("All" | HabitCategory)[] = [
  "All",
  "Health",
  "Fitness",
  "Productivity",
  "Learning",
  "Mindset",
];

export function HabitList({ initialHabits, onOpenAddModal }: HabitListProps) {
  const [habits, setHabits] = useState<HabitItem[]>(initialHabits);
  const [selectedCategory, setSelectedCategory] = useState<"All" | HabitCategory>(
    "All"
  );
  const [isPending, setIsPending] = useState(false);

  // Optimistic toggle
  const handleToggle = async (habitId: string) => {
    // Optimistically update local state immediately
    let wasCompleted = false;
    let newStreak = 0;

    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          wasCompleted = !h.isCompletedToday;
          newStreak = wasCompleted
            ? h.currentStreak + 1
            : Math.max(0, h.currentStreak - 1);
          return {
            ...h,
            isCompletedToday: wasCompleted,
            currentStreak: newStreak,
            longestStreak: Math.max(h.longestStreak, newStreak),
          };
        }
        return h;
      })
    );

    if (wasCompleted) {
      triggerStreakConfetti();
    }

    try {
      await toggleHabitAction(habitId);
    } catch (err) {
      console.error("Failed to toggle habit:", err);
      // Revert if error
      setHabits(initialHabits);
    }
  };

  const handleDelete = async (habitId: string) => {
    if (!confirm("Are you sure you want to delete this habit?")) return;
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    try {
      await deleteHabitAction(habitId);
    } catch (err) {
      console.error("Failed to delete habit:", err);
      setHabits(initialHabits);
    }
  };

  const filteredHabits =
    selectedCategory === "All"
      ? habits
      : habits.filter((h) => h.category === selectedCategory);

  const completedCount = filteredHabits.filter((h) => h.isCompletedToday).length;

  return (
    <div className="space-y-6">
      {/* Header & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Daily Habits Checklist
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {completedCount} of {filteredHabits.length} completed today
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Habit Items */}
      {filteredHabits.length === 0 ? (
        <div className="text-center py-12 px-4 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="w-12 h-12 mx-auto rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            No habits found in this category
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
            Build consistency by establishing small, manageable habits you can perform daily.
          </p>
          <button
            onClick={onOpenAddModal}
            className="mt-4 inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors duration-200 cursor-pointer"
          >
            <span>Create New Habit</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredHabits.map((habit) => {
            const isDone = habit.isCompletedToday;

            return (
              <div
                key={habit.id}
                className={`group flex items-start sm:items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                  isDone
                    ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/40"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs"
                }`}
              >
                {/* Left Side: Checkbox & Info */}
                <div className="flex items-start sm:items-center space-x-3.5 flex-1 min-w-0 pr-3">
                  {/* Custom Checkbox */}
                  <button
                    onClick={() => handleToggle(habit.id)}
                    aria-label={`Toggle ${habit.title}`}
                    className={`mt-0.5 sm:mt-0 w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 ${
                      isDone
                        ? "bg-emerald-500 text-white shadow-xs scale-100"
                        : "border-2 border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-emerald-400 bg-white dark:bg-zinc-800"
                    }`}
                  >
                    {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h4
                        className={`text-sm font-semibold tracking-tight transition-colors duration-200 truncate ${
                          isDone
                            ? "line-through text-zinc-400 dark:text-zinc-500"
                            : "text-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        {habit.title}
                      </h4>

                      {/* Category Badge */}
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/60">
                        {habit.category}
                      </span>

                      {/* Linked Goal Badge */}
                      {habit.goalTitle && (
                        <span className="inline-flex items-center space-x-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/40">
                          <Target className="w-3 h-3" />
                          <span className="truncate max-w-[140px]">
                            {habit.goalTitle}
                          </span>
                        </span>
                      )}
                    </div>

                    {habit.description && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                        {habit.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Side: Target, Streak & Actions */}
                <div className="flex items-center space-x-3 shrink-0">
                  {/* Streak Pill */}
                  <div
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-colors duration-200 ${
                      habit.currentStreak > 0
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>{habit.currentStreak}d</span>
                  </div>

                  {/* Target Unit */}
                  <span className="hidden md:inline-block text-xs font-medium text-zinc-400 dark:text-zinc-500">
                    {habit.targetCount} {habit.unit}
                  </span>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(habit.id)}
                    aria-label="Delete habit"
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-200 opacity-60 group-hover:opacity-100 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

