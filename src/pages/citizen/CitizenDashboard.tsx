import { Link } from "react-router-dom";
import { PlusCircle, FileText, Clock, CheckCircle, AlertTriangle, ArrowRight, Bell } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useComplaints } from "@/hooks/useComplaints";
import { useNotifications } from "@/hooks/useNotifications";
import ComplaintCard from "@/components/features/ComplaintCard";
import { statusLabel, statusClass, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function CitizenDashboard() {
  const { user } = useAuth();
  const { getByUser } = useComplaints();
  const { notifications, unreadCount } = useNotifications(user?.id);

  const myComplaints = getByUser(user?.id || "u1");
  const pending = myComplaints.filter(c => !["resolved", "closed"].includes(c.status));
  const resolved = myComplaints.filter(c => ["resolved", "closed"].includes(c.status));
  const critical = myComplaints.filter(c => c.priority === "critical");

  const recentComplaints = myComplaints.slice(0, 3);
  const recentNotifs = notifications.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">Welcome back, {user?.name?.split(" ")[0]}</h1>
            <p className="text-muted-foreground text-sm mt-1">Track your petitions and submit new grievances</p>
          </div>
          <Link to="/citizen/submit" className="btn-primary flex items-center gap-2 w-fit">
            <PlusCircle className="w-4 h-4" /> Submit New Petition
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Petitions", value: myComplaints.length, icon: FileText, color: "text-blue-600 bg-blue-50" },
            { label: "Pending", value: pending.length, icon: Clock, color: "text-amber-600 bg-amber-50" },
            { label: "Resolved", value: resolved.length, icon: CheckCircle, color: "text-green-600 bg-green-50" },
            { label: "Critical", value: critical.length, icon: AlertTriangle, color: "text-red-600 bg-red-50" },
          ].map(s => (
            <div key={s.label} className="card-base p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground font-medium">{s.label}</p>
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", s.color)}>
                  <s.icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Petitions */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Recent Petitions</h2>
              <Link to="/citizen/petitions" className="text-sm text-navy-600 hover:text-navy-800 flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {recentComplaints.length === 0 ? (
              <div className="card-base p-10 text-center">
                <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No petitions yet. Submit your first one!</p>
                <Link to="/citizen/submit" className="btn-primary mt-4 inline-block">Submit Petition</Link>
              </div>
            ) : (
              recentComplaints.map(c => (
                <ComplaintCard key={c.id} complaint={c} linkTo={`/citizen/petition/${c.id}`} />
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="card-base p-4">
              <h3 className="font-semibold text-foreground mb-3 text-sm">Quick Actions</h3>
              <div className="space-y-2">
                <Link to="/citizen/submit" className="flex items-center gap-2.5 p-2.5 rounded-md hover:bg-muted transition-colors group">
                  <PlusCircle className="w-4 h-4 text-navy-600" />
                  <span className="text-sm font-medium group-hover:text-navy-700">Submit New Petition</span>
                </Link>
                <Link to="/citizen/petitions" className="flex items-center gap-2.5 p-2.5 rounded-md hover:bg-muted transition-colors group">
                  <FileText className="w-4 h-4 text-navy-600" />
                  <span className="text-sm font-medium group-hover:text-navy-700">My Petitions</span>
                </Link>
                <Link to="/citizen/profile" className="flex items-center gap-2.5 p-2.5 rounded-md hover:bg-muted transition-colors group">
                  <Clock className="w-4 h-4 text-navy-600" />
                  <span className="text-sm font-medium group-hover:text-navy-700">My Profile</span>
                </Link>
              </div>
            </div>

            {/* Notifications */}
            <div className="card-base p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <Bell className="w-4 h-4 text-navy-600" /> Notifications
                  {unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{unreadCount}</span>}
                </h3>
              </div>
              {recentNotifs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No notifications.</p>
              ) : (
                <div className="space-y-2">
                  {recentNotifs.map(n => (
                    <div key={n.id} className={cn("p-2.5 rounded-md text-xs", !n.isRead ? "bg-blue-50 border border-blue-100" : "bg-muted")}>
                      <p className="font-semibold text-foreground">{n.title}</p>
                      <p className="text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
