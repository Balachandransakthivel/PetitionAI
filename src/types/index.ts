// Central export for PetitionAI types
export * from "./user";
export * from "./petition";
export * from "./ai";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  isRead: boolean;
  timestamp: string;
  petitionId?: string;
}

export interface AnalyticsData {
  totalComplaints: number;
  pendingComplaints: number;
  resolvedComplaints: number;
  criticalComplaints: number;
  duplicateComplaints: number;
  avgResolutionDays: number;
  categoryCounts: { category: string; count: number }[];
  departmentCounts: { department: string; count: number }[];
  priorityCounts: { priority: string; count: number }[];
  monthlyTrend: { month: string; submitted: number; resolved: number }[];
  statusCounts: { status: string; count: number }[];
}
