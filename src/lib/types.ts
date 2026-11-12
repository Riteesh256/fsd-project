export type HabitFrequency = "DAILY" | "WEEKDAYS" | "WEEKENDS" | "CUSTOM";

export type HabitCategory =
  | "Health"
  | "Fitness"
  | "Productivity"
  | "Mindset"
  | "Learning"
  | "Finance"
  | "General";

export interface HabitItem {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  category: HabitCategory;
  frequency: string;
  targetCount: number;
  unit: string;
  color: string;
  currentStreak: number;
  longestStreak: number;
  isArchived: boolean;
  goalId?: string | null;
  goalTitle?: string | null;
  isCompletedToday?: boolean;
  todayProgress?: number;
  createdAt: Date;
}

export interface MilestoneItem {
  id: string;
  goalId: string;
  title: string;
  isAchieved: boolean;
  dueDate?: Date | null;
}

export interface GoalItem {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  category: string;
  targetDate?: Date | null;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";
  targetProgress: number;
  currentProgress: number;
  milestones: MilestoneItem[];
  linkedHabitsCount: number;
  createdAt: Date;
}

export interface DailySummary {
  totalHabits: number;
  completedToday: number;
  completionRate: number;
  bestStreak: number;
  activeGoals: number;
}

