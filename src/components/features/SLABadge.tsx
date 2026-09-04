import { Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { Complaint } from "@/types";
import { getSLAStatus, getSLAColor } from "@/lib/sla";
import { cn } from "@/lib/utils";

interface Props {
  complaint: Complaint;
  showDeadline?: boolean;
}

export default function SLABadge({ complaint, showDeadline = true }: Props) {
  const sla = getSLAStatus(complaint);
  const colorClass = getSLAColor(sla.isOverdue, sla.percentage);

  return (
    <div className={cn("inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border", colorClass)}>
      {complaint.status === "resolved" || complaint.status === "closed" ? (
        <CheckCircle className="w-3.5 h-3.5" />
      ) : sla.isOverdue ? (
        <AlertTriangle className="w-3.5 h-3.5" />
      ) : (
        <Clock className="w-3.5 h-3.5" />
      )}
      <span>{sla.label}</span>
      {showDeadline && (complaint.status !== "resolved" && complaint.status !== "closed") && (
        <span className="text-[10px] opacity-75">
          (Due: {new Date(sla.deadline).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })})
        </span>
      )}
    </div>
  );
}
