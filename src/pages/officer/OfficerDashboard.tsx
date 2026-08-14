import { useState } from "react";
import { Search, Filter, CheckCircle, Clock, AlertTriangle, BarChart3 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useComplaints } from "@/hooks/useComplaints";
import { Link } from "react-router-dom";
import { cn, statusClass, statusLabel, priorityClass, formatDate } from "@/lib/utils";
import { ComplaintStatus, Priority } from "@/types";

export default function OfficerDashboard() {
  const { user } = useAuth();
  const { complaints } = useComplaints();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");

  // Officer sees complaints assigned to their department or to them
  const deptComplaints = complaints.filter(c =>
    c.assignedDepartment === user?.department ||
    c.assignedOfficer === "o1" // officer demo
  );

  const filtered = deptComplaints.filter(c => {
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchPriority = priorityFilter === "all" || c.priority === priorityFilter;
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.petitionId.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchPriority && matchSearch;
  });

  const pending = deptComplaints.filter(c => !["resolved", "closed"].includes(c.status));
  const resolved = deptComplaints.filter(c => ["resolved", "closed"].includes(c.status));
  const critical = deptComplaints.filter(c => c.priority === "critical");

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-7">
          <h1 className="font-serif text-2xl font-bold text-foreground">Officer Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {user?.name} · {user?.department || "Roads & Infrastructure"} Department
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          {[
            { label: "Assigned", value: deptComplaints.length, icon: BarChart3, color: "text-navy-600 bg-navy-50" },
            { label: "Pending Action", value: pending.length, icon: Clock, color: "text-amber-600 bg-amber-50" },
            { label: "Resolved", value: resolved.length, icon: CheckCircle, color: "text-green-600 bg-green-50" },
            { label: "Critical", value: critical.length, icon: AlertTriangle, color: "text-red-600 bg-red-50" },
          ].map(s => (
            <div key={s.label} className="card-base p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", s.color)}>
                  <s.icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="card-base p-4 mb-5">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search complaints..."
              className="w-full border border-border rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400" />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">Status:</span>
            </div>
            {(["all", "submitted", "under_review", "assigned", "in_progress"] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={cn("text-xs px-2.5 py-1 rounded-full border transition-colors",
                  statusFilter === s ? "bg-navy-800 text-white border-navy-800" : "bg-white text-muted-foreground border-border hover:border-navy-300")}>
                {s === "all" ? "All" : statusLabel(s)}
              </button>
            ))}
            <span className="mx-2 text-border">|</span>
            <span className="text-xs text-muted-foreground font-medium self-center">Priority:</span>
            {(["all", "critical", "high", "medium", "low"] as const).map(p => (
              <button key={p} onClick={() => setPriorityFilter(p)}
                className={cn("text-xs px-2.5 py-1 rounded-full border capitalize transition-colors",
                  priorityFilter === p ? "bg-navy-800 text-white border-navy-800" : "bg-white text-muted-foreground border-border hover:border-navy-300")}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Complaints Table */}
        <div className="card-base overflow-hidden">
          <div className="bg-navy-800 text-white px-5 py-3 text-sm font-semibold flex items-center justify-between">
            <span>Assigned Complaints ({filtered.length})</span>
            <span className="text-navy-300 text-xs">Click a row to manage</span>
          </div>
          <div className="divide-y divide-border">
            {filtered.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">No complaints match your filters.</div>
            ) : (
              filtered.map(c => (
                <Link key={c.id} to={`/officer/petition/${c.id}`}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-5 py-4 hover:bg-muted transition-colors group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-mono font-semibold text-navy-600">{c.petitionId}</span>
                      {c.aiAnalysis.isDuplicate && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold">DUPLICATE</span>}
                      {c.isEscalated && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-semibold">ESCALATED</span>}
                    </div>
                    <p className="text-sm font-semibold text-foreground group-hover:text-navy-700 transition-colors">{c.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.submittedByName} · {c.location} · {formatDate(c.submittedAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <span className="text-xs font-semibold px-2 py-1 rounded border bg-navy-50 text-navy-700 border-navy-200">
                      {Math.round(c.aiAnalysis.categoryConfidence * 100)}% AI
                    </span>
                    <span className={cn("text-xs font-semibold px-2 py-1 rounded border", priorityClass(c.priority))}>{c.priority.toUpperCase()}</span>
                    <span className={cn("text-xs font-semibold px-2 py-1 rounded border", statusClass(c.status))}>{statusLabel(c.status)}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
