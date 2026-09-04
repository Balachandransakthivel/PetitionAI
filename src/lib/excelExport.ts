import * as XLSX from "xlsx";
import { Complaint } from "@/types";
import { statusLabel, formatDate } from "./utils";

export function exportComplaintsToExcel(complaints: Complaint[], filename?: string): void {
  const data = complaints.map(c => ({
    "Petition ID": c.petitionId,
    "Title": c.title,
    "Description": c.description.substring(0, 200),
    "Category": c.category,
    "Department": c.assignedDepartment,
    "Priority": c.priority.toUpperCase(),
    "Status": statusLabel(c.status),
    "Location": c.location,
    "District": c.district,
    "Submitted By": c.submittedByName,
    "Assigned Officer": c.assignedOfficerName || "Unassigned",
    "Submitted Date": formatDate(c.submittedAt),
    "AI Confidence": `${Math.round(c.aiAnalysis.categoryConfidence * 100)}%`,
    "Sentiment": c.aiAnalysis.sentiment,
    "Is Duplicate": c.aiAnalysis.isDuplicate ? "Yes" : "No",
    "Is Escalated": c.isEscalated ? "Yes" : "No",
    "Reopen Count": c.reopenCount,
  }));

  const ws = XLSX.utils.json_to_sheet(data);

  // Set column widths
  ws["!cols"] = [
    { wch: 18 }, { wch: 30 }, { wch: 40 }, { wch: 20 },
    { wch: 25 }, { wch: 10 }, { wch: 15 }, { wch: 25 },
    { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 15 },
    { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Complaints");
  XLSX.writeFile(wb, filename || `PetitionAI_Export_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportSingleComplaintToExcel(complaint: Complaint): void {
  const detailData = [
    { Field: "Petition ID", Value: complaint.petitionId },
    { Field: "Title", Value: complaint.title },
    { Field: "Description", Value: complaint.description },
    { Field: "Category", Value: complaint.category },
    { Field: "Department", Value: complaint.assignedDepartment },
    { Field: "Priority", Value: complaint.priority.toUpperCase() },
    { Field: "Status", Value: statusLabel(complaint.status) },
    { Field: "Location", Value: complaint.location },
    { Field: "District", Value: complaint.district },
    { Field: "Submitted By", Value: complaint.submittedByName },
    { Field: "Submitted Date", Value: formatDate(complaint.submittedAt) },
    { Field: "Assigned Officer", Value: complaint.assignedOfficerName || "Unassigned" },
    { Field: "AI Category", Value: complaint.category },
    { Field: "AI Confidence", Value: `${Math.round(complaint.aiAnalysis.categoryConfidence * 100)}%` },
    { Field: "Sentiment", Value: complaint.aiAnalysis.sentiment },
    { Field: "Priority Score", Value: `${Math.round(complaint.aiAnalysis.priorityScore * 100)}%` },
    { Field: "Keywords", Value: complaint.aiAnalysis.keywords.join(", ") },
    { Field: "Is Duplicate", Value: complaint.aiAnalysis.isDuplicate ? "Yes" : "No" },
    { Field: "Is Escalated", Value: complaint.isEscalated ? "Yes" : "No" },
    { Field: "Reopen Count", Value: String(complaint.reopenCount) },
    { Field: "Officer Remarks", Value: complaint.officerRemarks || "None" },
    { Field: "Resolution Details", Value: complaint.resolutionDetails || "Pending" },
  ];

  const ws = XLSX.utils.json_to_sheet(detailData);
  ws["!cols"] = [{ wch: 20 }, { wch: 80 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Petition Details");

  // Status history sheet
  const historyData = complaint.statusHistory.map(h => ({
    Status: statusLabel(h.status),
    Note: h.note,
    "Updated By": h.updatedBy,
    Timestamp: formatDate(h.timestamp),
  }));
  const histWs = XLSX.utils.json_to_sheet(historyData);
  XLSX.utils.book_append_sheet(wb, histWs, "Status History");

  XLSX.writeFile(wb, `Petition_${complaint.petitionId}.xlsx`);
}
