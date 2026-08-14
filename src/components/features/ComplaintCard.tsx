import { Link } from "react-router-dom";
import { MapPin, Calendar, Building2, ChevronRight, Copy } from "lucide-react";
import { Complaint } from "@/types";
import { cn, statusClass, statusLabel, priorityClass, formatDate } from "@/lib/utils";

interface Props {
  complaint: Complaint;
  linkTo?: string;
  showAI?: boolean;
}

export default function ComplaintCard({ complaint, linkTo, showAI = true }: Props) {
  const card = (
    <div className={cn("card-base p-4 hover:shadow-md transition-shadow group", linkTo ? "cursor-pointer" : "")}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-mono font-semibold text-navy-600 bg-navy-50 px-2 py-0.5 rounded">
              {complaint.petitionId}
            </span>
            <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded border", statusClass(complaint.status))}>
              {statusLabel(complaint.status)}
            </span>
            <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded border", priorityClass(complaint.priority))}>
              {complaint.priority.toUpperCase()}
            </span>
            {complaint.aiAnalysis.isDuplicate && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded border bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
                <Copy className="w-3 h-3" /> Duplicate
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-foreground leading-snug mb-2 group-hover:text-navy-700 transition-colors">
            {complaint.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{complaint.description}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin className="w-3 h-3" /> {complaint.location}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Building2 className="w-3 h-3" /> {complaint.assignedDepartment}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Calendar className="w-3 h-3" /> {formatDate(complaint.submittedAt)}
            </span>
          </div>
        </div>
        {linkTo && <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1 group-hover:text-navy-600 transition-colors" />}
      </div>

      {showAI && (
        <div className="mt-3 pt-3 border-t border-border flex items-center gap-3 flex-wrap">
          <span className="text-[11px] text-muted-foreground">
            AI: <span className="font-semibold text-navy-700">{complaint.category}</span>
          </span>
          <span className="text-[11px] text-muted-foreground">
            Confidence: <span className="font-semibold text-navy-700">{Math.round(complaint.aiAnalysis.categoryConfidence * 100)}%</span>
          </span>
          <span className="text-[11px] text-muted-foreground capitalize">
            Sentiment: <span className={cn("font-semibold", {
              "text-red-600": complaint.aiAnalysis.sentiment === "angry",
              "text-orange-600": complaint.aiAnalysis.sentiment === "negative",
              "text-blue-600": complaint.aiAnalysis.sentiment === "neutral",
              "text-green-600": complaint.aiAnalysis.sentiment === "positive",
            })}>{complaint.aiAnalysis.sentiment}</span>
          </span>
        </div>
      )}
    </div>
  );

  if (linkTo) return <Link to={linkTo}>{card}</Link>;
  return card;
}
