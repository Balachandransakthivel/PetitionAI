import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { PlusCircle, FileText, Clock, CheckCircle, AlertTriangle, ArrowRight, Bell, TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useComplaints } from "@/hooks/useComplaints";
import { useNotifications } from "@/hooks/useNotifications";
import ComplaintCard from "@/components/features/ComplaintCard";
import { cn } from "@/lib/utils";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function CitizenDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { getByUser } = useComplaints();
  const { notifications, unreadCount } = useNotifications(user?.id);

  const myComplaints = getByUser(user?.id || "u1");
  const pending = myComplaints.filter(c => !["resolved", "closed"].includes(c.status));
  const resolved = myComplaints.filter(c => ["resolved", "closed"].includes(c.status));
  const critical = myComplaints.filter(c => c.priority === "critical");

  const recentComplaints = myComplaints.slice(0, 3);
  const recentNotifs = notifications.slice(0, 3);

  const stats = [
    { label: "Total Petitions", value: myComplaints.length, icon: FileText, gradient: "from-blue-500 to-blue-600" },
    { label: "Pending", value: pending.length, icon: Clock, gradient: "from-amber-500 to-orange-500" },
    { label: "Resolved", value: resolved.length, icon: CheckCircle, gradient: "from-emerald-500 to-green-500" },
    { label: "Critical", value: critical.length, icon: AlertTriangle, gradient: "from-red-500 to-rose-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-background dark:to-background transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="font-display text-3xl font-extrabold text-foreground">
              Welcome back, {user?.name?.split(" ")[0]}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Track your petitions and submit new grievances</p>
          </div>
          <Link to="/citizen/submit" className="btn-primary flex items-center gap-2 w-fit text-sm">
            <PlusCircle className="w-4 h-4" /> Submit New Petition
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map(s => (
            <motion.div key={s.label} variants={fadeInUp} className="group">
              <div className="card-doppelrand">
                <div className="card-doppelrand-inner">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200`}>
                      <s.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-display font-extrabold text-foreground">{s.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Petitions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-foreground">Recent Petitions</h2>
              <Link to="/citizen/petitions" className="text-sm text-navy-600 dark:text-gold-400 hover:text-navy-800 dark:hover:text-gold-300 flex items-center gap-1 font-medium transition-colors">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {recentComplaints.length === 0 ? (
              <div className="card-doppelrand">
                <div className="card-doppelrand-inner py-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <p className="font-display font-bold text-foreground mb-1">No petitions yet</p>
                  <p className="text-sm text-muted-foreground mb-4">Submit your first petition to get started!</p>
                  <Link to="/citizen/submit" className="btn-primary inline-flex items-center gap-2 text-sm">
                    <PlusCircle className="w-4 h-4" /> Submit Petition
                  </Link>
                </div>
              </div>
            ) : (
              recentComplaints.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                >
                  <ComplaintCard complaint={c} linkTo={`/citizen/petition/${c.id}`} />
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-5"
          >
            {/* Quick Actions */}
            <div className="card-doppelrand">
              <div className="card-doppelrand-inner">
                <h3 className="font-display font-bold text-sm text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  {[
                    { to: "/citizen/submit", icon: PlusCircle, label: "Submit New Petition" },
                    { to: "/citizen/petitions", icon: FileText, label: "My Petitions" },
                    { to: "/citizen/profile", icon: TrendingUp, label: "My Profile" },
                  ].map(action => (
                    <Link
                      key={action.to}
                      to={action.to}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-navy-50 dark:bg-navy-900/60 flex items-center justify-center group-hover:bg-navy-100 dark:group-hover:bg-navy-800 transition-colors">
                        <action.icon className="w-4 h-4 text-navy-600 dark:text-gold-400" />
                      </div>
                      <span className="text-sm font-medium text-foreground group-hover:text-navy-700 dark:group-hover:text-gold-400 transition-colors">{action.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="card-doppelrand">
              <div className="card-doppelrand-inner">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
                    <Bell className="w-4 h-4 text-navy-600 dark:text-gold-400" /> Notifications
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </h3>
                </div>
                {recentNotifs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No notifications</p>
                ) : (
                  <div className="space-y-2">
                    {recentNotifs.map(n => (
                      <div
                        key={n.id}
                        className={cn(
                          "p-3 rounded-xl text-xs transition-colors border",
                          !n.isRead ? "bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900" : "bg-muted/40 border-border"
                        )}
                      >
                        <p className="font-semibold text-foreground">{n.title}</p>
                        <p className="text-muted-foreground mt-1 line-clamp-2">{n.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
