import { useState, useCallback } from "react";
import { Complaint, Priority } from "@/types";
import { EscalationRule, EscalationLog, DEFAULT_ESCALATION_RULES } from "@/types/escalation";
import { getSLAStatus } from "@/lib/sla";
import { v4 as uuidv4 } from "uuid";

const RULES_KEY = "petitionai_escalation_rules";
const LOG_KEY = "petitionai_escalation_log";

function loadRules(): EscalationRule[] {
  try {
    const data = localStorage.getItem(RULES_KEY);
    return data ? JSON.parse(data) : DEFAULT_ESCALATION_RULES;
  } catch {
    return DEFAULT_ESCALATION_RULES;
  }
}

function loadLogs(): EscalationLog[] {
  try {
    const data = localStorage.getItem(LOG_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveRules(rules: EscalationRule[]) {
  localStorage.setItem(RULES_KEY, JSON.stringify(rules));
}

function saveLogs(logs: EscalationLog[]) {
  localStorage.setItem(LOG_KEY, JSON.stringify(logs));
}

const PRIORITY_ORDER: Record<Priority, number> = {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3,
};

export function useEscalation() {
  const [rules, setRules] = useState<EscalationRule[]>(loadRules);
  const [logs, setLogs] = useState<EscalationLog[]>(loadLogs);

  const checkAndEscalate = useCallback(
    (complaint: Complaint): EscalationLog | null => {
      if (complaint.status === "resolved" || complaint.status === "closed") return null;
      if (complaint.isEscalated && PRIORITY_ORDER[complaint.priority] >= PRIORITY_ORDER.critical) return null;

      const sla = getSLAStatus(complaint);
      const hoursElapsed = sla.percentage / 100 * (sla.hoursRemaining + (sla.percentage / 100 * 24));

      for (const rule of rules) {
        if (!rule.enabled) continue;
        if (complaint.priority !== rule.triggerPriority) continue;
        if (sla.isOverdue || hoursElapsed >= rule.triggerHoursOverdue) {
          if (PRIORITY_ORDER[rule.escalateToPriority] > PRIORITY_ORDER[complaint.priority]) {
            const log: EscalationLog = {
              id: uuidv4(),
              complaintId: complaint.id,
              fromPriority: complaint.priority,
              toPriority: rule.escalateToPriority,
              reason: rule.description,
              escalatedBy: "system",
              escalatedAt: new Date().toISOString(),
              autoEscalated: true,
            };
            const allLogs = loadLogs();
            allLogs.push(log);
            saveLogs(allLogs);
            setLogs(allLogs);
            return log;
          }
        }
      }
      return null;
    },
    [rules]
  );

  const manualEscalate = useCallback(
    (complaint: Complaint, toPriority: Priority, reason: string, adminName: string) => {
      const log: EscalationLog = {
        id: uuidv4(),
        complaintId: complaint.id,
        fromPriority: complaint.priority,
        toPriority,
        reason,
        escalatedBy: adminName,
        escalatedAt: new Date().toISOString(),
        autoEscalated: false,
      };
      const allLogs = loadLogs();
      allLogs.push(log);
      saveLogs(allLogs);
      setLogs(allLogs);
      return log;
    },
    []
  );

  const getComplaintLogs = useCallback(
    (complaintId: string) => logs.filter(l => l.complaintId === complaintId),
    [logs]
  );

  const updateRules = useCallback((newRules: EscalationRule[]) => {
    saveRules(newRules);
    setRules(newRules);
  }, []);

  return { rules, logs, checkAndEscalate, manualEscalate, getComplaintLogs, updateRules };
}
