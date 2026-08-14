import { Link } from "react-router-dom";
import { Users, FileText, CheckCircle, AlertTriangle, Building2, TrendingUp, ArrowRight, Clock } from "lucide-react";
import { useComplaints } from "@/hooks/useComplaints";
import { DEPARTMENTS, OFFICERS } from "@/constants/mockData";
import { ANALYTICS_DATA } from "@/constants/mockData";
import { cn, statusClass, statusLabel, priorityClass, formatDate } from "@/lib/utils";

export default function AdminDashboard() {
  const { complaints } = useComplaints();
  const critical = complaints.filter(c => c.priority === "critical" && c.status !== "resolved");
  const pending = complaints.filter(c => !["resolved", "closed"].includes(c.status));
  const resolved = complaints.filter(c => ["resolved", "closed"].includes(c.status));

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">System overview and complaint management</p>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/complaints" className="btn-primary text-sm flex items-center gap-2">
              <FileText className="w-4 h-4" /> All Complaints
            </Link>
            <Link to="/admin/analytics" className="btn-secondary text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Analytics
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          {[
            { label: "Total Complaints", value: ANALYTICS_DATA.totalComplaints, icon: FileText, color: "text-navy-600 bg-navy-50", sub: "All time" },
            { label: "Pending", value: pending.length, icon: Clock, color: "text-amber-600 bg-amber-50", sub: "Needs attention" },
            { label: "Resolved", value: ANALYTICS_DATA.resolvedComplaints, icon: CheckCircle, color: "text-green-600 bg-green-50", sub: "This month" },
            { label: "Critical", value: ANALYTICS_DATA.criticalComplaints, icon: AlertTriangle, color: "text-red-600 bg-red-50", sub: "Urgent" },
          ].map(s => (
            <div key={s.label} className="card-base p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", s.color)}>
                  <s.icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          {/* Critical Complaints */}
          <div className="lg:col-span-2 card-base overflow-hidden">
            <div className="bg-red-700 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-semibold text-sm">Critical Complaints</span>
              </div>
              <Link to="/admin/complaints" className="text-red-200 hover:text-white text-xs flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
            </div>
            <div className="divide-y divide-border">
              {critical.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">No critical complaints.</div>
              ) : (
                critical.slice(0, 5).map(c => (
                  <Link key={c.id} to={`/admin/complaint/${c.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-muted transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{c.title}</p>
                      <p className="text-xs text-muted-foreground">{c.petitionId} · {c.assignedDepartment}</p>
                    </div>
                    <span className={cn("text-xs font-semibold px-2 py-1 rounded border", statusClass(c.status))}>{statusLabel(c.status)}</span>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Department Overview */}
          <div className="card-base overflow-hidden">
            <div className="bg-navy-800 text-white px-4 py-3 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span className="font-semibold text-sm">Departments</span>
            </div>
            <div className="divide-y divide-border">
              {DEPARTMENTS.slice(0, 5).map(d => (
                <div key={d.id} className="px-4 py-3">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-semibold text-foreground truncate">{d.name}</p>
                    <span className="text-xs font-bold text-navy-700">{d.code}</span>
                  </div>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span className="text-amber-600 font-medium">{d.pendingCount} pending</span>
                    <span className="text-green-600 font-medium">{d.resolvedCount} resolved</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Officers + Recent */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Officers */}
          <div className="card-base overflow-hidden">
            <div className="bg-navy-800 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="font-semibold text-sm">Officers</span>
              </div>
              <Link to="/admin/users" className="text-navy-300 hover:text-white text-xs flex items-center gap-1">Manage <ArrowRight className="w-3 h-3" /></Link>
            </div>
            <div className="divide-y divide-border">
              {OFFICERS.map(o => (
                <div key={o.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-8 h-8 bg-navy-100 rounded-full flex items-center justify-center text-navy-700 font-bold text-sm flex-shrink-0">
                    {o.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{o.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{o.department}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-navy-700">{o.assignedCount} active</p>
                    <p className="text-[10px] text-muted-foreground">{o.resolvedCount} resolved</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Complaints */}
          <div className="card-base overflow-hidden">
            <div className="bg-navy-800 text-white px-4 py-3 flex items-center justify-between">
              <span className="font-semibold text-sm">Recent Petitions</span>
              <Link to="/admin/complaints" className="text-navy-300 hover:text-white text-xs flex items-center gap-1">All <ArrowRight className="w-3 h-3" /></Link>
            </div>
            <div className="divide-y divide-border">
              {complaints.slice(0, 5).map(c => (
                <Link key={c.id} to={`/admin/complaint/${c.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-muted transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-muted-foreground">{c.petitionId}</span>
                      <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded border", priorityClass(c.priority))}>{c.priority}</span>
                    </div>
                  </div>
                  <span className={cn("text-xs font-semibold px-2 py-1 rounded border ml-2 flex-shrink-0", statusClass(c.status))}>{statusLabel(c.status)}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
