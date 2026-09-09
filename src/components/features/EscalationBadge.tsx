import { AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { Complaint } from "@/types";
import { useEscalation } from "@/hooks/useEscalation";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface EscalationBadgeProps {
  complaint: Complaint;
  onEscalate?: () => void;
}

export default function EscalationBadge({ complaint, onEscalate }: EscalationBadgeProps) {
  const { t } = useTranslation();
  const { getComplaintLogs } = useEscalation();
  const logs = getComplaintLogs(complaint.id);
  const latestLog = logs[logs.length - 1];

  if (!complaint.isEscalated && logs.length === 0) return null;

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
      complaint.isEscalated
        ? "bg-red-50 text-red-700 border-red-200"
        : "bg-orange-50 text-orange-700 border-orange-200"
    )}>
      {complaint.isEscalated ? (
        <>
          <AlertTriangle className="w-3 h-3" />
          {t("escalation.escalated")}
        </>
      ) : (
        <>
          <TrendingUp className="w-3 h-3" />
          {latestLog?.toPriority}
        </>
      )}
    </div>
  );
}

export function EscalationTimeline({ complaintId }: { complaintId: string }) {
  const { t } = useTranslation();
  const { getComplaintLogs } = useEscalation();
  const logs = getComplaintLogs(complaintId);

  if (logs.length === 0) return null;

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <Clock className="w-4 h-4 text-navy-600" />
        {t("escalation.escalationHistory")}
      </h4>
      <div className="space-y-2">
        {logs.map(log => (
          <div key={log.id} className="flex items-start gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
            <div>
              <p className="text-foreground">
                <span className="font-medium">{log.fromPriority}</span>
                {" → "}
                <span className="font-medium text-red-600">{log.toPriority}</span>
              </p>
              <p className="text-muted-foreground text-xs">{log.reason}</p>
              <p className="text-muted-foreground text-xs">
                {log.autoEscalated ? "Auto-escalated" : `By ${log.escalatedBy}`} •{" "}
                {new Date(log.escalatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
