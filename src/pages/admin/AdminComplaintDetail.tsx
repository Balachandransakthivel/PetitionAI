import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, UserCheck, AlertTriangle, Save } from "lucide-react";
import { useComplaints } from "@/hooks/useComplaints";
import AIAnalysisCard from "@/components/features/AIAnalysisCard";
import StatusTimeline from "@/components/features/StatusTimeline";
import { cn, statusClass, statusLabel, priorityClass, formatDateTime } from "@/lib/utils";
import { OFFICERS } from "@/constants/mockData";
import { ComplaintStatus } from "@/types";
import { toast } from "sonner";

export default function AdminComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const { complaints, updateComplaint } = useComplaints();
  const complaint = complaints.find(c => c.id === id);
  const [selectedOfficer, setSelectedOfficer] = useState(complaint?.assignedOfficer || "");
  const [newStatus, setNewStatus] = useState<ComplaintStatus>(complaint?.status || "submitted");

  if (!complaint) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold mb-2">Complaint Not Found</p>
          <Link to="/admin/complaints" className="text-navy-600 hover:underline">Back</Link>
        </div>
      </div>
    );
  }

  function handleAssign() {
    const officer = OFFICERS.find(o => o.id === selectedOfficer);
    if (!officer) return;
    updateComplaint(complaint!.id, {
      assignedOfficer: officer.id,
      assignedOfficerName: officer.name,
      status: "assigned",
      statusHistory: [...complaint!.statusHistory, { status: "assigned", timestamp: new Date().toISOString(), note: `Assigned to Officer ${officer.name} by Admin`, updatedBy: "Admin" }],
    });
    toast.success(`Assigned to ${officer.name}`);
  }

  function handleStatusUpdate() {
    updateComplaint(complaint!.id, {
      status: newStatus,
      statusHistory: [...complaint!.statusHistory, { status: newStatus, timestamp: new Date().toISOString(), note: `Status updated by Admin`, updatedBy: "Admin" }],
    });
    toast.success("Status updated");
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Link to="/admin/complaints" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Complaints
        </Link>

        <div className="card-base p-5 mb-5">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="font-mono font-bold text-navy-700 bg-navy-50 px-2.5 py-1 rounded text-sm">{complaint.petitionId}</span>
            <span className={cn("text-xs font-semibold px-2 py-1 rounded border", statusClass(complaint.status))}>{statusLabel(complaint.status)}</span>
            <span className={cn("text-xs font-semibold px-2 py-1 rounded border", priorityClass(complaint.priority))}>{complaint.priority.toUpperCase()}</span>
          </div>
          <h1 className="font-serif text-xl font-bold text-foreground mb-2">{complaint.title}</h1>
          <p className="text-sm text-muted-foreground mb-4">{complaint.description}</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              ["Submitted By", complaint.submittedByName],
              ["Category", complaint.category],
              ["Location", complaint.location],
              ["Department", complaint.assignedDepartment],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-xs text-muted-foreground">{k}</p>
                <p className="font-medium text-sm">{v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <StatusTimeline currentStatus={complaint.status} history={complaint.statusHistory} />
          <AIAnalysisCard analysis={complaint.aiAnalysis} compact />
        </div>

        {/* Admin Actions */}
        <div className="card-base overflow-hidden mb-5">
          <div className="bg-navy-800 text-white px-5 py-3 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-gold-400" />
            <span className="font-semibold text-sm">Admin Actions</span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Assign Officer</label>
              <div className="flex gap-2">
                <select value={selectedOfficer} onChange={e => setSelectedOfficer(e.target.value)}
                  className="flex-1 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400">
                  <option value="">Select Officer</option>
                  {OFFICERS.map(o => <option key={o.id} value={o.id}>{o.name} — {o.department}</option>)}
                </select>
                <button onClick={handleAssign} disabled={!selectedOfficer}
                  className="bg-navy-700 hover:bg-navy-800 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-md flex items-center gap-1 transition-colors">
                  <Save className="w-3.5 h-3.5" /> Assign
                </button>
              </div>
              {complaint.assignedOfficerName && (
                <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1"><User className="w-3 h-3" /> Currently: {complaint.assignedOfficerName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Update Status</label>
              <div className="flex gap-2">
                <select value={newStatus} onChange={e => setNewStatus(e.target.value as ComplaintStatus)}
                  className="flex-1 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400">
                  {(["submitted", "under_review", "assigned", "in_progress", "resolved", "closed"] as ComplaintStatus[]).map(s => (
                    <option key={s} value={s}>{statusLabel(s)}</option>
                  ))}
                </select>
                <button onClick={handleStatusUpdate}
                  className="bg-navy-700 hover:bg-navy-800 text-white text-sm px-4 py-2 rounded-md transition-colors">
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>

        <AIAnalysisCard analysis={complaint.aiAnalysis} />
      </div>
    </div>
  );
}
