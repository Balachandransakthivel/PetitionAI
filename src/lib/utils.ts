import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ComplaintStatus, Priority, Sentiment, AIAnalysis } from "@/types";
import { CATEGORIES, DEPARTMENTS } from "@/constants/mockData";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function statusLabel(status: ComplaintStatus): string {
  const map: Record<ComplaintStatus, string> = {
    submitted: "Submitted",
    under_review: "Under Review",
    assigned: "Assigned",
    in_progress: "In Progress",
    resolved: "Resolved",
    closed: "Closed",
  };
  return map[status] || status;
}

export function statusClass(status: ComplaintStatus): string {
  const map: Record<ComplaintStatus, string> = {
    submitted: "status-submitted",
    under_review: "status-review",
    assigned: "status-assigned",
    in_progress: "status-progress",
    resolved: "status-resolved",
    closed: "status-closed",
  };
  return map[status] || "";
}

export function priorityClass(priority: Priority): string {
  const map: Record<Priority, string> = {
    critical: "priority-critical",
    high: "priority-high",
    medium: "priority-medium",
    low: "priority-low",
  };
  return map[priority] || "";
}

export function sentimentColor(sentiment: Sentiment): string {
  const map: Record<Sentiment, string> = {
    positive: "text-green-600",
    neutral: "text-blue-600",
    negative: "text-orange-600",
    angry: "text-red-600",
  };
  return map[sentiment] || "text-gray-600";
}

export function sentimentBg(sentiment: Sentiment): string {
  const map: Record<Sentiment, string> = {
    positive: "bg-green-50 border-green-200",
    neutral: "bg-blue-50 border-blue-200",
    negative: "bg-orange-50 border-orange-200",
    angry: "bg-red-50 border-red-200",
  };
  return map[sentiment] || "bg-gray-50 border-gray-200";
}

export function generatePetitionId(): string {
  const year = new Date().getFullYear();
  const num = String(Math.floor(Math.random() * 900) + 100).padStart(3, "0");
  return `PET-${year}-${num}`;
}

export function confidenceBar(score: number): string {
  if (score >= 0.9) return "bg-green-500";
  if (score >= 0.75) return "bg-blue-500";
  if (score >= 0.6) return "bg-yellow-500";
  return "bg-red-500";
}

export function generateAIAnalysis(title: string, description: string, category: string): AIAnalysis {
  const text = `${title} ${description}`.toLowerCase();

  const angryWords = ["angry", "furious", "unacceptable", "terrible", "worst", "disgusting", "outrageous", "frustrated"];
  const negativeWords = ["bad", "poor", "issue", "problem", "complaint", "broken", "damaged", "fail", "missing", "blocked"];
  const positiveWords = ["please", "kindly", "request", "hope", "appreciate", "grateful"];

  let sentiment: "positive" | "neutral" | "negative" | "angry" = "neutral";
  let sentimentScore = 0.5;
  if (angryWords.some(w => text.includes(w))) { sentiment = "angry"; sentimentScore = 0.15; }
  else if (negativeWords.filter(w => text.includes(w)).length >= 2) { sentiment = "negative"; sentimentScore = 0.3; }
  else if (positiveWords.some(w => text.includes(w))) { sentiment = "positive"; sentimentScore = 0.75; }

  const criticalWords = ["accident", "emergency", "danger", "death", "flood", "fire", "collapse", "sewage overflow"];
  const highWords = ["broken", "leaking", "no water", "no electricity", "pothole", "blocked drain"];
  let priority: "critical" | "high" | "medium" | "low" = "medium";
  let priorityScore = 0.5;
  if (criticalWords.some(w => text.includes(w))) { priority = "critical"; priorityScore = 0.95; }
  else if (highWords.some(w => text.includes(w))) { priority = "high"; priorityScore = 0.75; }
  else if (text.length < 50) { priority = "low"; priorityScore = 0.25; }

  const deptMap: Record<string, string> = {
    "Road & Infrastructure": "Roads & Infrastructure",
    "Building & Construction": "Roads & Infrastructure",
    "Water Supply": "Water Works",
    "Sanitation": "Waste Management",
    "Electricity": "Electricity Board",
    "Waste Management": "Waste Management",
    "Parks & Recreation": "Waste Management",
    "Noise Pollution": "Public Safety",
    "Public Safety": "Public Safety",
    "Healthcare": "Health Department",
    "Education": "Education Department",
    "Public Transport": "Transport Authority",
  };

  const words = text.split(/\s+/).filter(w => w.length > 5);
  const keywords = [...new Set(words)].slice(0, 6);

  const catConf = 0.85 + Math.random() * 0.12;
  const deptConf = 0.80 + Math.random() * 0.15;
  const isDuplicate = Math.random() > 0.7;

  const similarComplaints = isDuplicate ? [
    { id: `PET-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`, title: `Similar ${category} complaint nearby`, similarity: 0.72 + Math.random() * 0.2, status: "in_progress" as const },
  ] : [];

  return {
    category,
    categoryConfidence: catConf,
    department: deptMap[category] || "Roads & Infrastructure",
    departmentConfidence: deptConf,
    priority,
    priorityScore,
    sentiment,
    sentimentScore,
    isDuplicate,
    duplicateCount: isDuplicate ? Math.floor(Math.random() * 3) + 1 : 0,
    similarComplaints,
    urgencyLevel: priority,
    keywords: keywords.length > 0 ? keywords : ["complaint", "repair", "service"],
    summaryNote: `AI classified this as ${category} with ${Math.round(catConf * 100)}% confidence. Routed to ${deptMap[category] || "Roads & Infrastructure"}. Priority: ${priority.toUpperCase()}. ${isDuplicate ? "⚠️ Similar complaints found." : "No duplicates detected."}`,
  };
}
