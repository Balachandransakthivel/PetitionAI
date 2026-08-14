import { useState, useEffect } from "react";
import { Complaint } from "@/types";
import { MOCK_COMPLAINTS } from "@/constants/mockData";

const STORAGE_KEY = "petition_ai_complaints";

function loadComplaints(): Complaint[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return MOCK_COMPLAINTS;
}

function saveComplaints(complaints: Complaint[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

export function useComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>(loadComplaints);

  useEffect(() => {
    saveComplaints(complaints);
  }, [complaints]);

  function addComplaint(c: Complaint) {
    setComplaints(prev => [c, ...prev]);
  }

  function updateComplaint(id: string, updates: Partial<Complaint>) {
    setComplaints(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  }

  function getByUser(userId: string) {
    return complaints.filter(c => c.submittedBy === userId);
  }

  function getByDepartment(dept: string) {
    return complaints.filter(c => c.assignedDepartment === dept);
  }

  function getByOfficer(officerId: string) {
    return complaints.filter(c => c.assignedOfficer === officerId);
  }

  return { complaints, addComplaint, updateComplaint, getByUser, getByDepartment, getByOfficer };
}
