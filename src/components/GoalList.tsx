"use client";

import React, { useState } from "react";
import {
  Target,
  CheckCircle2,
  Circle,
  Calendar,
  ChevronDown,
  ChevronUp,
  Trash2,
  Sparkles,
} from "lucide-react";
import { GoalItem } from "@/lib/types";
import { toggleMilestoneAction, deleteGoalAction } from "@/lib/actions";
import { triggerGoalCelebration } from "./ConfettiTrigger";

interface GoalListProps {
  initialGoals: GoalItem[];
  onOpenAddModal: () => void;
}

export function GoalList({ initialGoals, onOpenAddModal }: GoalListProps) {
  const [goals, setGoals] = useState<GoalItem[]>(initialGoals);
  const [expandedGoals, setExpandedGoals] = useState<Record<string, boolean>>({
    [initialGoals[0]?.id || ""]: true,
  });

  const toggleExpand = (goalId: string) => {
    setExpandedGoals((prev) => ({ ...prev, [goalId]: !prev[goalId] }));
  };

  const handleToggleMilestone = async (goalId: string, milestoneId: string) => {
    let allAchieved = false;

    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const updatedMilestones = g.milestones.map((m) =>
            m.id === milestoneId ? { ...m, isAchieved: !m.isAchieved } : m
          );
          const achievedCount = updatedMilestones.filter((m) => m.isAchieved).length;
          const progress = Math.round(
            (achievedCount / (updatedMilestones.length || 1)) * 100
          );
          if (progress === 100) allAchieved = true;

          return {
            ...g,
            milestones: updatedMilestones,
            currentProgress: progress,
            status: progress === 100 ? "COMPLETED" : "IN_PROGRESS",
          };
        }
        return g;
      })
    );

    if (allAchieved) {
      triggerGoalCelebration();
    }

    try {
      await toggleMilestoneAction(milestoneId);
    } catch (err) {
      console.error("Failed to toggle milestone:", err);
      setGoals(initialGoals);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
    try {
      await deleteGoalAction(goalId);
    } catch (err) {
      console.error("Failed to delete goal:", err);
      setGoals(initialGoals);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Goals & Key Milestones
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Connect high-level aspirations to daily executable habits
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors duration-200 cursor-pointer"
        >
          <Target className="w-3.5 h-3.5" />
          <span>New Goal</span>
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-12 px-4 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="w-12 h-12 mx-auto rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            No goals defined yet
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
            Set ambitious, clear goals with actionable milestones and connect them to your habits.
          </p>
          <button
            onClick={onOpenAddModal}
            className="mt-4 inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors duration-200 cursor-pointer"
          >
            <span>Set First Goal</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const isExpanded = !!expandedGoals[goal.id];
            const isCompleted = goal.status === "COMPLETED";

            return (
              <div
                key={goal.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-colors duration-200"
              >
                <div>
                  {/* Top Bar: Category & Status */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/40">
                      {goal.category}
                    </span>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          isCompleted
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        {isCompleted ? "Achieved" : "In Progress"}
                      </span>

                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        aria-label="Delete goal"
                        className="p-1 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-200 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Goal Title & Description */}
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {goal.title}
                  </h3>
                  {goal.description && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                      {goal.description}
                    </p>
                  )}

                  {/* Progress Bar & Stats */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <span className="text-zinc-600 dark:text-zinc-400">
                        Milestones Progress
                      </span>
                      <span className="text-indigo-600 dark:text-indigo-400">
                        {goal.currentProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted ? "bg-emerald-500" : "bg-indigo-600"
                        }`}
                        style={{ width: `${goal.currentProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Milestones Accordion */}
                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                    <button
                      onClick={() => toggleExpand(goal.id)}
                      className="w-full flex items-center justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 py-1 cursor-pointer transition-colors duration-200"
                    >
                      <span>
                        Milestones ({goal.milestones.filter((m) => m.isAchieved).length}/
                        {goal.milestones.length})
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 space-y-2">
                        {goal.milestones.length === 0 ? (
                          <p className="text-xs text-zinc-400 italic">
                            No milestones added yet.
                          </p>
                        ) : (
                          goal.milestones.map((milestone) => (
                            <button
                              key={milestone.id}
                              onClick={() =>
                                handleToggleMilestone(goal.id, milestone.id)
                              }
                              className="w-full flex items-start space-x-2 text-left p-1.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors duration-200 cursor-pointer group"
                            >
                              {milestone.isAchieved ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                              ) : (
                                <Circle className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-indigo-500 mt-0.5 shrink-0 transition-colors duration-200" />
                              )}
                              <span
                                className={`text-xs ${
                                  milestone.isAchieved
                                    ? "line-through text-zinc-400 dark:text-zinc-500"
                                    : "text-zinc-700 dark:text-zinc-300"
                                }`}
                              >
                                {milestone.title}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Info */}
                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {goal.targetDate
                        ? `Target: ${new Date(goal.targetDate).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}`
                        : "Ongoing Target"}
                    </span>
                  </div>
                  <span>
                    {goal.linkedHabitsCount} linked{" "}
                    {goal.linkedHabitsCount === 1 ? "habit" : "habits"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

