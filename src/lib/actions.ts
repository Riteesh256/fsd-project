"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";
import { ensureDefaultUserAndData } from "./seed";
import { HabitItem, GoalItem, DailySummary, HabitCategory } from "./types";

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

export async function getDashboardData() {
  const user = await ensureDefaultUserAndData();
  const todayStr = getTodayString();

  // Fetch all active habits
  const rawHabits = await prisma.habit.findMany({
    where: { userId: user.id, isArchived: false },
    include: {
      goal: { select: { id: true, title: true } },
      logs: {
        where: { logDate: todayStr },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const habits: HabitItem[] = rawHabits.map((h) => {
    const todayLog = h.logs[0];
    return {
      id: h.id,
      userId: h.userId,
      title: h.title,
      description: h.description,
      category: h.category as HabitCategory,
      frequency: h.frequency,
      targetCount: h.targetCount,
      unit: h.unit,
      color: h.color,
      currentStreak: h.currentStreak,
      longestStreak: h.longestStreak,
      isArchived: h.isArchived,
      goalId: h.goalId,
      goalTitle: h.goal?.title ?? null,
      isCompletedToday: todayLog ? todayLog.isCompleted : false,
      todayProgress: todayLog ? todayLog.progressValue : 0,
      createdAt: h.createdAt,
    };
  });

  // Fetch active goals
  const rawGoals = await prisma.goal.findMany({
    where: { userId: user.id },
    include: {
      milestones: { orderBy: { createdAt: "asc" } },
      habits: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const goals: GoalItem[] = rawGoals.map((g) => ({
    id: g.id,
    userId: g.userId,
    title: g.title,
    description: g.description,
    category: g.category,
    targetDate: g.targetDate,
    status: g.status as GoalItem["status"],
    targetProgress: g.targetProgress,
    currentProgress: g.currentProgress,
    milestones: g.milestones.map((m) => ({
      id: m.id,
      goalId: m.goalId,
      title: m.title,
      isAchieved: m.isAchieved,
      dueDate: m.dueDate,
    })),
    linkedHabitsCount: g.habits.length,
    createdAt: g.createdAt,
  }));

  // Calculate summary metrics
  const totalHabits = habits.length;
  const completedToday = habits.filter((h) => h.isCompletedToday).length;
  const completionRate =
    totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  const bestStreak = habits.reduce(
    (max, h) => Math.max(max, h.currentStreak),
    0
  );
  const activeGoals = goals.filter((g) => g.status === "IN_PROGRESS").length;

  const summary: DailySummary = {
    totalHabits,
    completedToday,
    completionRate,
    bestStreak,
    activeGoals,
  };

  return { habits, goals, summary, user };
}

export async function toggleHabitAction(habitId: string) {
  const todayStr = getTodayString();

  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
    include: {
      logs: { where: { logDate: todayStr } },
      goal: true,
    },
  });

  if (!habit) throw new Error("Habit not found");

  const existingLog = habit.logs[0];
  const willBeCompleted = !existingLog || !existingLog.isCompleted;

  if (existingLog) {
    if (existingLog.isCompleted) {
      // Uncheck habit
      await prisma.habitLog.update({
        where: { id: existingLog.id },
        data: { isCompleted: false, progressValue: 0 },
      });

      const updatedStreak = Math.max(0, habit.currentStreak - 1);
      await prisma.habit.update({
        where: { id: habitId },
        data: { currentStreak: updatedStreak },
      });
    } else {
      // Re-check habit
      await prisma.habitLog.update({
        where: { id: existingLog.id },
        data: { isCompleted: true, progressValue: habit.targetCount },
      });

      const updatedStreak = habit.currentStreak + 1;
      const longest = Math.max(habit.longestStreak, updatedStreak);
      await prisma.habit.update({
        where: { id: habitId },
        data: { currentStreak: updatedStreak, longestStreak: longest },
      });
    }
  } else {
    // Create new completed log
    await prisma.habitLog.create({
      data: {
        habitId,
        logDate: todayStr,
        progressValue: habit.targetCount,
        isCompleted: true,
      },
    });

    const updatedStreak = habit.currentStreak + 1;
    const longest = Math.max(habit.longestStreak, updatedStreak);
    await prisma.habit.update({
      where: { id: habitId },
      data: { currentStreak: updatedStreak, longestStreak: longest },
    });
  }

  // Update linked goal if present
  if (habit.goalId) {
    await updateGoalProgress(habit.goalId);
  }

  revalidatePath("/");
  return { success: true, completed: willBeCompleted };
}

export async function createHabitAction(data: {
  title: string;
  description?: string;
  category: HabitCategory;
  frequency: string;
  targetCount: number;
  unit: string;
  color: string;
  goalId?: string;
}) {
  const user = await ensureDefaultUserAndData();

  await prisma.habit.create({
    data: {
      userId: user.id,
      title: data.title,
      description: data.description || null,
      category: data.category,
      frequency: data.frequency,
      targetCount: Number(data.targetCount) || 1,
      unit: data.unit || "times",
      color: data.color || "#10B981",
      goalId: data.goalId || null,
    },
  });

  revalidatePath("/");
  return { success: true };
}

export async function deleteHabitAction(habitId: string) {
  await prisma.habit.delete({
    where: { id: habitId },
  });

  revalidatePath("/");
  return { success: true };
}

export async function createGoalAction(data: {
  title: string;
  description?: string;
  category: string;
  targetDate?: string;
  milestones: string[];
}) {
  const user = await ensureDefaultUserAndData();

  const validMilestones = data.milestones
    .filter((m) => m.trim().length > 0)
    .map((title) => ({ title, isAchieved: false }));

  await prisma.goal.create({
    data: {
      userId: user.id,
      title: data.title,
      description: data.description || null,
      category: data.category || "General",
      targetDate: data.targetDate ? new Date(data.targetDate) : null,
      status: "IN_PROGRESS",
      targetProgress: 100,
      currentProgress: 0,
      milestones: {
        create: validMilestones,
      },
    },
  });

  revalidatePath("/");
  return { success: true };
}

export async function toggleMilestoneAction(milestoneId: string) {
  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
  });

  if (!milestone) throw new Error("Milestone not found");

  await prisma.milestone.update({
    where: { id: milestoneId },
    data: { isAchieved: !milestone.isAchieved },
  });

  await updateGoalProgress(milestone.goalId);

  revalidatePath("/");
  return { success: true };
}

export async function deleteGoalAction(goalId: string) {
  await prisma.goal.delete({
    where: { id: goalId },
  });

  revalidatePath("/");
  return { success: true };
}

async function updateGoalProgress(goalId: string) {
  const goal = await prisma.goal.findUnique({
    where: { id: goalId },
    include: {
      milestones: true,
      habits: {
        include: {
          logs: {
            where: { isCompleted: true },
          },
        },
      },
    },
  });

  if (!goal) return;

  const totalMilestones = goal.milestones.length;
  if (totalMilestones > 0) {
    const achieved = goal.milestones.filter((m) => m.isAchieved).length;
    const progress = Math.round((achieved / totalMilestones) * 100);
    const newStatus =
      progress === 100
        ? "COMPLETED"
        : progress > 0
        ? "IN_PROGRESS"
        : "NOT_STARTED";

    await prisma.goal.update({
      where: { id: goalId },
      data: { currentProgress: progress, status: newStatus },
    });
  }
}

