import { useState, useEffect, useCallback } from "react";
import { Complaint } from "@/types";
import { MOCK_COMPLAINTS } from "@/constants/mockData";
import { apiCreateComplaint, apiListComplaints, apiUpdateComplaint, isBackendUp, mockListComplaints } from "@/lib/api";

const STORAGE_KEY = "petition_ai_complaints";

function loadComplaints(): Complaint[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error("Error loading complaints from localStorage:", err);
  }
  return MOCK_COMPLAINTS;
}

function saveComplaints(complaints: Complaint[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

export function useComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>(loadComplaints);
  const [backendUp, setBackendUp] = useState(false);

  useEffect(() => {
    let cancelled = false;
    isBackendUp().then(up => {
      if (cancelled) return;
      setBackendUp(up);
      if (up) {
        apiListComplaints()
          .then(list => {
            if (!cancelled && list.length > 0) setComplaints(list);
          })
          .catch(() => {});
      }
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!backendUp) saveComplaints(complaints);
  }, [complaints, backendUp]);

  const refresh = useCallback(async () => {
    if (!(await isBackendUp())) return;
    try {
      const list = await apiListComplaints();
      if (list.length > 0) setComplaints(list);
    } catch {
      /* ignore */
    }
  }, []);

  async function addComplaint(c: Complaint) {
    setComplaints(prev => [c, ...prev]);
    if (await isBackendUp()) {
      try {
        const created = await apiCreateComplaint({
          title: c.title,
          description: c.description,
          category: c.category,
          location: c.location,
          district: c.district,
          images: c.images || [],
        });
        return created;
      } catch (err) {
        console.warn("Backend create failed, kept local:", err);
        return c;
      }
    }
    return c;
  }

  async function updateComplaint(id: string, updates: Partial<Complaint>) {
    setComplaints(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
    if (await isBackendUp()) {
      try {
        const updated = await apiUpdateComplaint(id, updates as Record<string, unknown>);
        return updated;
      } catch (err) {
        console.warn("Backend update failed, kept local:", err);
        return null;
      }
    }
    return null;
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

  return { complaints, addComplaint, updateComplaint, getByUser, getByDepartment, getByOfficer, refresh };
}