import confetti from "canvas-confetti";

export function triggerStreakConfetti() {
  confetti({
    particleCount: 60,
    spread: 70,
    origin: { y: 0.7 },
    colors: ["#10B981", "#6366F1", "#F59E0B", "#06B6D4"],
  });
}

export function triggerGoalCelebration() {
  const duration = 2 * 1000;
  const animationEnd = Date.now() + duration;

  const interval: ReturnType<typeof setInterval> = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 40 * (timeLeft / duration);
    confetti({
      particleCount,
      origin: { x: Math.random(), y: Math.random() - 0.2 },
    });
  }, 250);
}

