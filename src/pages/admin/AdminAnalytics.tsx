import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { TrendingUp, Brain, Copy, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { ANALYTICS_DATA } from "@/constants/mockData";

const COLORS = ["#1e3a7b", "#2d4b8e", "#5c6ef7", "#8098fb", "#a5bcfd", "#c7d7fe", "#e0e9ff"];
const PIE_COLORS = ["#dc2626", "#ea580c", "#d97706", "#16a34a"];

export default function AdminAnalytics() {
  const d = ANALYTICS_DATA;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-7">
          <h1 className="font-serif text-2xl font-bold text-foreground">Analytics & Reports</h1>
          <p className="text-muted-foreground text-sm mt-1">System-wide complaint statistics and performance metrics</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {[
            { label: "Total Complaints", value: d.totalComplaints, icon: TrendingUp, color: "text-navy-600 bg-navy-50" },
            { label: "Pending", value: d.pendingComplaints, icon: Clock, color: "text-amber-600 bg-amber-50" },
            { label: "Resolved", value: d.resolvedComplaints, icon: CheckCircle, color: "text-green-600 bg-green-50" },
            { label: "Critical", value: d.criticalComplaints, icon: AlertTriangle, color: "text-red-600 bg-red-50" },
            { label: "Duplicates", value: d.duplicateComplaints, icon: Copy, color: "text-purple-600 bg-purple-50" },
            { label: "Avg. Resolution", value: `${d.avgResolutionDays}d`, icon: Brain, color: "text-blue-600 bg-blue-50" },
          ].map(s => (
            <div key={s.label} className="card-base p-4 text-center">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-2 ${s.color}`}>
                <s.icon className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Trend */}
          <div className="card-base p-5">
            <h3 className="font-semibold text-foreground mb-4 text-sm">Monthly Complaint Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={d.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Line type="monotone" dataKey="submitted" stroke="#1e3a7b" strokeWidth={2} dot={{ r: 3 }} name="Submitted" />
                <Line type="monotone" dataKey="resolved" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Bar */}
          <div className="card-base p-5">
            <h3 className="font-semibold text-foreground mb-4 text-sm">Complaints by Category</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={d.categoryCounts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="category" type="category" width={130} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#1e3a7b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Priority Pie */}
          <div className="card-base p-5">
            <h3 className="font-semibold text-foreground mb-4 text-sm">Priority Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={d.priorityCounts} dataKey="count" nameKey="priority" cx="50%" cy="50%" outerRadius={70} label={({ priority, percent }) => `${priority} ${Math.round(percent * 100)}%`} labelLine={false}>
                  {d.priorityCounts.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Department Bar */}
          <div className="card-base p-5 lg:col-span-2">
            <h3 className="font-semibold text-foreground mb-4 text-sm">Department-wise Complaints</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={d.departmentCounts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="department" tick={{ fontSize: 9 }} angle={-15} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {d.departmentCounts.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="card-base p-5 mb-6">
          <h3 className="font-semibold text-foreground mb-4 text-sm">Status Distribution</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {d.statusCounts.map((s, i) => (
              <div key={i} className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground">{s.count}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Stats */}
        <div className="card-base p-5 bg-gradient-to-r from-navy-800 to-navy-700 text-white">
          <div className="flex items-center gap-2 mb-5">
            <Brain className="w-5 h-5 text-gold-400" />
            <h3 className="font-semibold text-sm">AI Engine Statistics</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { label: "Classification Accuracy", value: "94.2%", sub: "NLP Model" },
              { label: "Duplicates Detected", value: d.duplicateComplaints, sub: "Semantic Similarity" },
              { label: "Auto-routed", value: "100%", sub: "Dept. Prediction" },
              { label: "Avg. AI Analysis", value: "1.8s", sub: "Processing Time" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-gold-300">{s.value}</p>
                <p className="text-xs text-white mt-1 font-medium">{s.label}</p>
                <p className="text-[10px] text-navy-300 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
