import { Priority } from "./petition";

export interface EscalationRule {
  id: string;
  name: string;
  description: string;
  triggerPriority: Priority;
  triggerHoursOverdue: number;
  escalateToPriority: Priority;
  notifyRoles: ("officer" | "admin")[];
  autoAssign?: boolean;
  enabled: boolean;
}

export interface EscalationLog {
  id: string;
  complaintId: string;
  fromPriority: Priority;
  toPriority: Priority;
  reason: string;
  escalatedBy: string;
  escalatedAt: string;
  autoEscalated: boolean;
}

export const DEFAULT_ESCALATION_RULES: EscalationRule[] = [
  {
    id: "rule-1",
    name: "Medium to High",
    description: "Escalate medium priority complaints to high when 50% of SLA time has passed",
    triggerPriority: "medium",
    triggerHoursOverdue: 84,
    escalateToPriority: "high",
    notifyRoles: ["officer", "admin"],
    enabled: true,
  },
  {
    id: "rule-2",
    name: "High to Critical",
    description: "Escalate high priority complaints to critical when 75% of SLA time has passed",
    triggerPriority: "high",
    triggerHoursOverdue: 54,
    escalateToPriority: "critical",
    notifyRoles: ["admin"],
    enabled: true,
  },
  {
    id: "rule-3",
    name: "Critical Override",
    description: "Immediately notify admin when critical complaints are overdue",
    triggerPriority: "critical",
    triggerHoursOverdue: 0,
    escalateToPriority: "critical",
    notifyRoles: ["admin"],
    enabled: true,
  },
];
