import { useState } from "react";
import { Users, Building2, UserCheck, Mail, Phone, Star, Shield } from "lucide-react";
import { MOCK_USERS, DEPARTMENTS, OFFICERS } from "@/constants/mockData";
import { cn } from "@/lib/utils";

type Tab = "citizens" | "officers" | "departments";

export default function AdminUsers() {
  const [tab, setTab] = useState<Tab>("citizens");

  const citizens = MOCK_USERS.filter(u => u.role === "citizen");

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="font-serif text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage citizens, officers, and departments</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg mb-6 w-fit">
          {([
            { key: "citizens", label: "Citizens", icon: Users },
            { key: "officers", label: "Officers", icon: UserCheck },
            { key: "departments", label: "Departments", icon: Building2 },
          ] as const).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={cn("flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                tab === t.key ? "bg-white text-navy-800 shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Citizens Tab */}
        {tab === "citizens" && (
          <div className="card-base overflow-hidden">
            <div className="bg-navy-800 text-white px-5 py-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="font-semibold text-sm">Registered Citizens ({citizens.length})</span>
            </div>
            <div className="divide-y divide-border">
              {citizens.map(u => (
                <div key={u.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                    {u.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{u.name}</p>
                    <div className="flex gap-3 mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><Mail className="w-3 h-3" />{u.email}</span>
                      {u.phone && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Phone className="w-3 h-3" />{u.phone}</span>}
                    </div>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold uppercase">Citizen</span>
                </div>
              ))}
              {/* Add more demo entries */}
              {["Meena Devi", "Ravi Kumar", "Sudha R"].map(name => (
                <div key={name} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">{name.charAt(0)}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{name}</p>
                    <span className="text-xs text-muted-foreground">{name.toLowerCase().replace(" ", ".")}@example.com</span>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold uppercase">Citizen</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Officers Tab */}
        {tab === "officers" && (
          <div className="card-base overflow-hidden">
            <div className="bg-navy-800 text-white px-5 py-3 flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              <span className="font-semibold text-sm">Officers ({OFFICERS.length})</span>
            </div>
            <div className="divide-y divide-border">
              {OFFICERS.map(o => (
                <div key={o.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold flex-shrink-0">
                    {o.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{o.name}</p>
                    <div className="flex gap-3 mt-0.5 flex-wrap">
                      <span className="text-xs text-muted-foreground">{o.email}</span>
                      <span className="text-xs text-purple-600 font-medium">{o.department}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-center">
                      <p className="text-lg font-bold text-amber-500">{o.assignedCount}</p>
                      <p className="text-[10px] text-muted-foreground">Active</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">{o.resolvedCount}</p>
                      <p className="text-[10px] text-muted-foreground">Resolved</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                      <span className="text-sm font-bold">{o.rating}</span>
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold uppercase">Officer</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Departments Tab */}
        {tab === "departments" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DEPARTMENTS.map(d => (
              <div key={d.id} className="card-base p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-navy-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-navy-700" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">{d.name}</p>
                      <p className="text-xs text-muted-foreground">{d.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Shield className="w-3.5 h-3.5" /> {d.officerCount} officers
                  </div>
                </div>
                <div className="flex gap-4 mb-3">
                  <div>
                    <p className="text-xl font-bold text-amber-600">{d.pendingCount}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-green-600">{d.resolvedCount}</p>
                    <p className="text-xs text-muted-foreground">Resolved</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Handles</p>
                  <div className="flex flex-wrap gap-1">
                    {d.categories.map(c => (
                      <span key={c} className="text-[10px] bg-navy-50 text-navy-700 border border-navy-200 px-1.5 py-0.5 rounded">{c}</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">Head: <span className="font-medium text-foreground">{d.head}</span></p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
