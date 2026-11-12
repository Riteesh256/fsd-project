import { Suspense } from "react";
import { getDashboardData } from "@/lib/actions";
import { DashboardClient } from "@/components/DashboardClient";

export const instant = false;

async function DashboardLoader() {
  const { habits, goals, summary, user } = await getDashboardData();
  return (
    <DashboardClient
      habits={habits}
      goals={goals}
      summary={summary}
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
      }}
    />
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-zinc-500 font-medium">Loading HabitArc...</p>
          </div>
        </div>
      }
    >
      <DashboardLoader />
    </Suspense>
  );
}
