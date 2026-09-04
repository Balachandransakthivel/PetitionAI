import jsPDF from "jspdf";
import { Complaint } from "@/types";
import { statusLabel, formatDateTime, formatDate } from "./utils";

export function generatePetitionPDF(complaint: Complaint): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header
  doc.setFillColor(26, 54, 93);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("PETITION DETAILS", pageWidth / 2, 18, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("AI-Powered Grievance Management System", pageWidth / 2, 26, { align: "center" });
  doc.text(`Generated on: ${formatDateTime(new Date().toISOString())}`, pageWidth / 2, 34, { align: "center" });

  y = 50;
  doc.setTextColor(0, 0, 0);

  // Petition ID & Status
  doc.setFillColor(240, 245, 255);
  doc.roundedRect(15, y, pageWidth - 30, 20, 3, 3, "F");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Petition ID: ${complaint.petitionId}`, 20, y + 8);
  doc.text(`Status: ${statusLabel(complaint.status)}`, 20, y + 15);
  doc.text(`Priority: ${complaint.priority.toUpperCase()}`, pageWidth - 20, y + 8, { align: "right" });
  doc.text(`Submitted: ${formatDate(complaint.submittedAt)}`, pageWidth - 20, y + 15, { align: "right" });

  y += 30;

  // Title
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Title", 20, y);
  y += 7;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const titleLines = doc.splitTextToSize(complaint.title, pageWidth - 40);
  doc.text(titleLines, 20, y);
  y += titleLines.length * 6 + 5;

  // Description
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Description", 20, y);
  y += 7;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const descLines = doc.splitTextToSize(complaint.description, pageWidth - 40);
  doc.text(descLines, 20, y);
  y += descLines.length * 5 + 8;

  // Details Grid
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, y, pageWidth - 30, 40, 3, 3, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");

  const col1 = 20;
  const col2 = pageWidth / 2 + 5;
  let rowY = y + 8;

  doc.text("Category:", col1, rowY);
  doc.setFont("helvetica", "normal");
  doc.text(complaint.category, col1 + 30, rowY);

  doc.setFont("helvetica", "bold");
  doc.text("Department:", col2, rowY);
  doc.setFont("helvetica", "normal");
  doc.text(complaint.assignedDepartment, col2 + 30, rowY);

  rowY += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Location:", col1, rowY);
  doc.setFont("helvetica", "normal");
  doc.text(complaint.location, col1 + 30, rowY);

  doc.setFont("helvetica", "bold");
  doc.text("District:", col2, rowY);
  doc.setFont("helvetica", "normal");
  doc.text(complaint.district, col2 + 30, rowY);

  rowY += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Submitted By:", col1, rowY);
  doc.setFont("helvetica", "normal");
  doc.text(complaint.submittedByName, col1 + 30, rowY);

  doc.setFont("helvetica", "bold");
  doc.text("Officer:", col2, rowY);
  doc.setFont("helvetica", "normal");
  doc.text(complaint.assignedOfficerName || "Not Assigned", col2 + 30, rowY);

  y += 50;

  // AI Analysis
  if (complaint.aiAnalysis) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("AI Analysis", 20, y);
    y += 8;

    doc.setFillColor(240, 248, 255);
    doc.roundedRect(15, y, pageWidth - 30, 35, 3, 3, "F");
    doc.setFontSize(10);

    doc.setFont("helvetica", "bold");
    doc.text("Category Confidence:", 20, y + 8);
    doc.setFont("helvetica", "normal");
    doc.text(`${Math.round(complaint.aiAnalysis.categoryConfidence * 100)}%`, 65, y + 8);

    doc.setFont("helvetica", "bold");
    doc.text("Sentiment:", 20, y + 16);
    doc.setFont("helvetica", "normal");
    doc.text(complaint.aiAnalysis.sentiment.toUpperCase(), 50, y + 16);

    doc.setFont("helvetica", "bold");
    doc.text("Priority Score:", col2, y + 8);
    doc.setFont("helvetica", "normal");
    doc.text(`${Math.round(complaint.aiAnalysis.priorityScore * 100)}%`, col2 + 35, y + 8);

    doc.setFont("helvetica", "bold");
    doc.text("Keywords:", 20, y + 24);
    doc.setFont("helvetica", "normal");
    doc.text(complaint.aiAnalysis.keywords.join(", "), 48, y + 24);

    y += 45;
  }

  // Status History
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Status History", 20, y);
  y += 8;

  complaint.statusHistory.forEach((entry, i) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.setFillColor(i % 2 === 0 ? 248 : 255, i % 2 === 0 ? 250 : 255, i % 2 === 0 ? 252 : 255);
    doc.roundedRect(15, y, pageWidth - 30, 14, 2, 2, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(statusLabel(entry.status), 20, y + 6);
    doc.setFont("helvetica", "normal");
    doc.text(entry.note.substring(0, 60), 60, y + 6);
    doc.text(formatDateTime(entry.timestamp), pageWidth - 20, y + 6, { align: "right" });
    doc.text(`By: ${entry.updatedBy}`, pageWidth - 20, y + 11, { align: "right" });
    y += 16;
  });

  // Officer Remarks
  if (complaint.officerRemarks) {
    y += 5;
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Officer Remarks", 20, y);
    y += 7;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const remarkLines = doc.splitTextToSize(complaint.officerRemarks, pageWidth - 40);
    doc.text(remarkLines, 20, y);
    y += remarkLines.length * 5 + 5;
  }

  // Resolution
  if (complaint.resolutionDetails) {
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Resolution Details", 20, y);
    y += 7;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const resLines = doc.splitTextToSize(complaint.resolutionDetails, pageWidth - 40);
    doc.text(resLines, 20, y);
    y += resLines.length * 5 + 5;
  }

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${totalPages} | PetitionAI - AI-Powered Grievance Management`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  doc.save(`Petition_${complaint.petitionId}.pdf`);
}
