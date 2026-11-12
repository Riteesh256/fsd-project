import { prisma } from "./prisma";

export async function ensureDefaultUserAndData() {
  // Check if default user exists
  let user = await prisma.user.findFirst({
    where: { email: "demo@antigravity.dev" },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "demo@antigravity.dev",
        name: "Alex Morgan",
        timezone: "America/New_York",
      },
    });

    // Create 2 exemplary goals
    const goal1 = await prisma.goal.create({
      data: {
        userId: user.id,
        title: "Pass Full-Stack Technical Interviews",
        description: "Master algorithms, system design, and complete portfolio projects.",
        category: "Learning",
        targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // in 60 days
        status: "IN_PROGRESS",
        targetProgress: 100,
        currentProgress: 60,
        milestones: {
          create: [
            { title: "Review NeetCode 75 Core Problems", isAchieved: true },
            { title: "Design High-Availability Architecture Mock", isAchieved: true },
            { title: "Complete Full-Stack Habit Tracker Showcase", isAchieved: false },
            { title: "Conduct 3 Behavioral & Tech Mock Interviews", isAchieved: false },
          ],
        },
      },
    });

    const goal2 = await prisma.goal.create({
      data: {
        userId: user.id,
        title: "Achieve Peak Fitness & Run 10k",
        description: "Build aerobic endurance, maintain hydration, and sleep consistently.",
        category: "Fitness",
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        status: "IN_PROGRESS",
        targetProgress: 100,
        currentProgress: 45,
        milestones: {
          create: [
            { title: "Run 5K without walking breaks", isAchieved: true },
            { title: "Consistent 7.5 hrs sleep for 14 straight days", isAchieved: false },
            { title: "Complete 10K outdoor run under 55 minutes", isAchieved: false },
          ],
        },
      },
    });

    // Create realistic habits
    const habitsData = [
      {
        userId: user.id,
        title: "Solve 2 LeetCode / Coding Problems",
        description: "Consistency over intensity. Sharpens algorithmic intuition.",
        category: "Learning",
        frequency: "DAILY",
        targetCount: 2,
        unit: "problems",
        color: "#6366F1", // Indigo
        currentStreak: 12,
        longestStreak: 18,
        goalId: goal1.id,
      },
      {
        userId: user.id,
        title: "Morning 30-Minute Aerobic Run / Cardio",
        description: "Zone 2 heart rate running before starting work.",
        category: "Fitness",
        frequency: "DAILY",
        targetCount: 30,
        unit: "mins",
        color: "#10B981", // Emerald
        currentStreak: 5,
        longestStreak: 14,
        goalId: goal2.id,
      },
      {
        userId: user.id,
        title: "Drink 2500ml Water",
        description: "Daily optimal hydration for focus and energy.",
        category: "Health",
        frequency: "DAILY",
        targetCount: 2500,
        unit: "ml",
        color: "#06B6D4", // Cyan
        currentStreak: 21,
        longestStreak: 21,
      },
      {
        userId: user.id,
        title: "Read 20 Pages of Non-Fiction",
        description: "System design, philosophy, or psychology.",
        category: "Productivity",
        frequency: "DAILY",
        targetCount: 20,
        unit: "pages",
        color: "#F59E0B", // Amber
        currentStreak: 8,
        longestStreak: 12,
      },
      {
        userId: user.id,
        title: "10-Minute Evening Mindful Meditation",
        description: "Unplug from screens and reflect on the day.",
        category: "Mindset",
        frequency: "DAILY",
        targetCount: 10,
        unit: "mins",
        color: "#8B5CF6", // Purple
        currentStreak: 4,
        longestStreak: 9,
      },
    ];

    const todayStr = new Date().toISOString().split("T")[0];

    for (const habitInfo of habitsData) {
      const createdHabit = await prisma.habit.create({
        data: habitInfo,
      });

      // Populate completed log for today on 2 of them to demonstrate realistic active progress
      if (
        habitInfo.title.includes("LeetCode") ||
        habitInfo.title.includes("Water")
      ) {
        await prisma.habitLog.create({
          data: {
            habitId: createdHabit.id,
            logDate: todayStr,
            progressValue: habitInfo.targetCount,
            isCompleted: true,
          },
        });
      }
    }
  }

  return user;
}

