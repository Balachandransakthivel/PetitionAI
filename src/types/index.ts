// Types for the Intelligent Petition Classification and Resolution System

export type UserRole = "citizen" | "officer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  department?: string;
  joinedAt: string;
  avatar?: string;
}

export type ComplaintStatus =
  | "submitted"
  | "under_review"
  | "assigned"
  | "in_progress"
  | "resolved"
  | "closed";

export type Priority = "critical" | "high" | "medium" | "low";

export type Sentiment = "positive" | "neutral" | "negative" | "angry";

export interface AIAnalysis {
  category: string;
  categoryConfidence: number;
  department: string;
  departmentConfidence: number;
  priority: Priority;
  priorityScore: number;
  sentiment: Sentiment;
  sentimentScore: number;
  isDuplicate: boolean;
  duplicateCount: number;
  similarComplaints: SimilarComplaint[];
  urgencyLevel: "critical" | "high" | "medium" | "low";
  keywords: string[];
  summaryNote: string;
}

export interface SimilarComplaint {
  id: string;
  title: string;
  similarity: number;
  status: ComplaintStatus;
}

export interface StatusUpdate {
  status: ComplaintStatus;
  timestamp: string;
  note: string;
  updatedBy: string;
}

export interface Complaint {
  id: string;
  petitionId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  district: string;
  submittedBy: string;
  submittedByName: string;
  submittedAt: string;
  status: ComplaintStatus;
  priority: Priority;
  assignedDepartment: string;
  assignedOfficer?: string;
  assignedOfficerName?: string;
  officerRemarks?: string;
  resolutionDetails?: string;
  resolutionProof?: string;
  aiAnalysis: AIAnalysis;
  statusHistory: StatusUpdate[];
  feedback?: {
    rating: number;
    comment: string;
    submittedAt: string;
  };
  images?: string[];
  isEscalated?: boolean;
  reopenCount: number;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  officerCount: number;
  pendingCount: number;
  resolvedCount: number;
  categories: string[];
}

export interface Officer {
  id: string;
  name: string;
  email: string;
  department: string;
  assignedCount: number;
  resolvedCount: number;
  rating: number;
  joinedAt: string;
}

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
