import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, PlusCircle, FileText } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useComplaints } from "@/hooks/useComplaints";
import ComplaintCard from "@/components/features/ComplaintCard";
import { ComplaintStatus } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: { label: string; value: ComplaintStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Submitted", value: "submitted" },
  { label: "Under Review", value: "under_review" },
  { label: "Assigned", value: "assigned" },
  { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
];

export default function MyPetitions() {
  const { user } = useAuth();
  const { getByUser } = useComplaints();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "all">("all");

  const complaints = getByUser(user?.id || "u1");

  const filtered = complaints.filter(c => {
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.petitionId.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">My Petitions</h1>
            <p className="text-muted-foreground text-sm mt-1">{complaints.length} total petitions filed</p>
          </div>
          <Link to="/citizen/submit" className="btn-primary flex items-center gap-2 w-fit">
            <PlusCircle className="w-4 h-4" /> New Petition
          </Link>
        </div>

        {/* Search */}
        <div className="card-base p-4 mb-5">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, petition ID, or category..."
              className="w-full border border-border rounded-md pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full border font-medium transition-colors",
                  statusFilter === f.value
                    ? "bg-navy-800 text-white border-navy-800"
                    : "bg-white text-muted-foreground border-border hover:border-navy-300 hover:text-navy-700"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="card-base p-12 text-center">
              <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-semibold text-foreground mb-1">No petitions found</p>
              <p className="text-sm text-muted-foreground">
                {complaints.length === 0 ? "Submit your first petition to get started." : "Try adjusting your filters."}
              </p>
              {complaints.length === 0 && (
                <Link to="/citizen/submit" className="btn-primary mt-4 inline-block">Submit Petition</Link>
              )}
            </div>
          ) : (
            filtered.map(c => (
              <ComplaintCard key={c.id} complaint={c} linkTo={`/citizen/petition/${c.id}`} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
