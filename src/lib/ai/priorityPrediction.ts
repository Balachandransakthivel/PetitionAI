import { Priority } from "@/types";

export function predictPriority(text: string): { priority: Priority; priorityScore: number } {
  const lower = text.toLowerCase();
  const criticalWords = ["accident", "emergency", "danger", "death", "flood", "fire", "collapse", "sewage overflow"];
  const highWords = ["broken", "leaking", "no water", "no electricity", "pothole", "blocked drain"];

  if (criticalWords.some(w => lower.includes(w))) {
    return { priority: "critical", priorityScore: 0.95 };
  }
  if (highWords.some(w => lower.includes(w))) {
    return { priority: "high", priorityScore: 0.75 };
  }
  if (lower.length < 50) {
    return { priority: "low", priorityScore: 0.25 };
  }
  return { priority: "medium", priorityScore: 0.5 };
}
