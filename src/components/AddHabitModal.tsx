"use client";

import React, { useState } from "react";
import { X, Sparkles, Target } from "lucide-react";
import { HabitCategory, GoalItem } from "@/lib/types";
import { createHabitAction } from "@/lib/actions";

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableGoals: GoalItem[];
}

const PRESETS = [
  { title: "Drink 2.5L Water", category: "Health", count: 2500, unit: "ml" },
  { title: "Morning 20m Walk", category: "Fitness", count: 20, unit: "mins" },
  { title: "Read 20 Pages of Book", category: "Productivity", count: 20, unit: "pages" },
  { title: "Evening 5m Journal", category: "Mindset", count: 5, unit: "mins" },
  { title: "Solve 2 LeetCode Problems", category: "Learning", count: 2, unit: "problems" },
];

export function AddHabitModal({
  isOpen,
  onClose,
  availableGoals,
}: AddHabitModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<HabitCategory>("Health");
  const [frequency, setFrequency] = useState("DAILY");
  const [targetCount, setTargetCount] = useState(1);
  const [unit, setUnit] = useState("times");
  const [goalId, setGoalId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await createHabitAction({
        title,
        description,
        category,
        frequency,
        targetCount,
        unit,
        color: "#10B981",
        goalId: goalId || undefined,
      });
      onClose();
      // Reset form
      setTitle("");
      setDescription("");
      setTargetCount(1);
      setUnit("times");
      setGoalId("");
    } catch (err) {
      console.error("Failed to create habit:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyPreset = (preset: (typeof PRESETS)[0]) => {
    setTitle(preset.title);
    setCategory(preset.category as HabitCategory);
    setTargetCount(preset.count);
    setUnit(preset.unit);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Create New Habit
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Define a repeatable daily micro-action to build momentum.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="mb-5">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Popular Habits</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className="text-xs px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors duration-200 cursor-pointer"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Habit Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 15-Minute Morning Yoga"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Why this habit matters (Cue / Motivation)
            </label>
            <input
              type="text"
              placeholder="e.g. Improves flexibility and relieves back stiffness"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HabitCategory)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="Health">Health</option>
                <option value="Fitness">Fitness</option>
                <option value="Productivity">Productivity</option>
                <option value="Learning">Learning</option>
                <option value="Mindset">Mindset</option>
                <option value="Finance">Finance</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="DAILY">Every Day</option>
                <option value="WEEKDAYS">Mon - Fri (Weekdays)</option>
                <option value="WEEKENDS">Weekends Only</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Target Daily Goal
              </label>
              <input
                type="number"
                min="1"
                value={targetCount}
                onChange={(e) => setTargetCount(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Unit (e.g. times, mins, ml)
              </label>
              <input
                type="text"
                placeholder="times"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Goal Linking */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Link to Long-Term Goal (Optional)
            </label>
            <div className="relative">
              <select
                value={goalId}
                onChange={(e) => setGoalId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="">-- No Linked Goal --</option>
                {availableGoals.map((g) => (
                  <option key={g.id} value={g.id}>
                    🎯 {g.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors duration-200 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Create Habit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

