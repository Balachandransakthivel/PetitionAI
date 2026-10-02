import { Priority, ComplaintStatus, Complaint } from "@/types";

// SLA deadlines in hours based on priority
export const SLA_DEADLINES: Record<Priority, number> = {
  critical: 24,
  high: 72,
  medium: 168, // 7 days
  low: 336,   // 14 days
};

export function calculateSLADeadline(submittedAt: string, priority: Priority): string {
  const submitDate = new Date(submittedAt);
  const deadlineMs = SLA_DEADLINES[priority] * 60 * 60 * 1000;
  return new Date(submitDate.getTime() + deadlineMs).toISOString();
}

export function getSLAStatus(complaint: Complaint): {
  deadline: string;
  isOverdue: boolean;
  hoursRemaining: number;
  percentage: number;
  label: string;
} {
  const deadline = calculateSLADeadline(complaint.submittedAt, complaint.priority);
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const submittedDate = new Date(complaint.submittedAt);
  const totalMs = deadlineDate.getTime() - submittedDate.getTime();
  const remainingMs = deadlineDate.getTime() - now.getTime();
  const hoursRemaining = Math.floor(remainingMs / (1000 * 60 * 60));
  const percentage = Math.max(0, Math.min(100, ((totalMs - remainingMs) / totalMs) * 100));

  const isResolved = complaint.status === "resolved" || complaint.status === "closed";
  const isOverdue = !isResolved && remainingMs < 0;

  let label = "";
  if (isResolved) {
    label = "Resolved";
  } else if (isOverdue) {
    label = `Overdue by ${Math.abs(hoursRemaining)}h`;
  } else if (hoursRemaining < 24) {
    label = `${hoursRemaining}h remaining`;
  } else {
    label = `${Math.floor(hoursRemaining / 24)}d ${hoursRemaining % 24}h remaining`;
  }

  return { deadline, isOverdue, hoursRemaining, percentage, label };
}

export function getSLAColor(isOverdue: boolean, percentage: number): string {
  if (isOverdue) return "text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/60";
  if (percentage > 80) return "text-orange-600 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800/60";
  if (percentage > 50) return "text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-950/40 border-yellow-200 dark:border-yellow-800/60";
  return "text-green-600 dark:text-green-300 bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800/60";
}
