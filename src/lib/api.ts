import { User, Complaint, Notification, AnalyticsData } from "@/types";
import { MOCK_COMPLAINTS, MOCK_NOTIFICATIONS } from "@/constants/mockData";
import { getStoredUser } from "./auth";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

let cachedBackendUp: boolean | null = null;

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = true
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (auth) {
    const user = getStoredUser();
    if (user?.token) headers["Authorization"] = `Bearer ${user.token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

export async function isBackendUp(): Promise<boolean> {
  if (cachedBackendUp !== null) return cachedBackendUp;
  try {
    const res = await fetch(`${API_BASE}/health`, { method: "GET" });
    cachedBackendUp = res.ok;
  } catch {
    cachedBackendUp = false;
  }
  return cachedBackendUp;
}

// ── Auth ────────────────────────────────────────────────────────────────────────
export async function apiLogin(email: string, password: string): Promise<User> {
  const data = await request<{ token: string; user: User }>(
    "/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) },
    false
  );
  return { ...data.user, token: data.token };
}

export async function apiRegister(data: {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}): Promise<User> {
  const res = await request<{ token: string; user: User }>(
    "/auth/register",
    { method: "POST", body: JSON.stringify(data) },
    false
  );
  return { ...res.user, token: res.token };
}

// ── Complaints ─────────────────────────────────────────────────────────────────
export async function apiListComplaints(params: Record<string, string> = {}): Promise<Complaint[]> {
  const qs = new URLSearchParams(params).toString();
  return request<Complaint[]>(`/complaints${qs ? `?${qs}` : ""}`);
}

export async function apiGetComplaint(id: string): Promise<Complaint> {
  return request<Complaint>(`/complaints/${id}`);
}

export async function apiCreateComplaint(data: {
  title: string;
  description: string;
  category: string;
  location: string;
  district: string;
  images: string[];
}): Promise<Complaint> {
  return request<Complaint>("/complaints", { method: "POST", body: JSON.stringify(data) });
}

export async function apiUpdateComplaint(
  id: string,
  data: Record<string, unknown>
): Promise<Complaint> {
  return request<Complaint>(`/complaints/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

// ── Notifications ──────────────────────────────────────────────────────────────
export async function apiListNotifications(): Promise<Notification[]> {
  return request<Notification[]>("/notifications");
}

export async function apiMarkNotificationRead(id: string): Promise<void> {
  await request(`/notifications/${id}/read`, { method: "PATCH" });
}

export async function apiMarkAllNotificationsRead(): Promise<void> {
  await request("/notifications/read-all", { method: "PATCH" });
}

// ── Analytics ───────────────────────────────────────────────────────────────────
export async function apiGetAnalytics(): Promise<AnalyticsData> {
  return request<AnalyticsData>("/analytics");
}

// ── Fallbacks (mock data when backend is down) ─────────────────────────────────
export function mockListComplaints(): Complaint[] {
  return MOCK_COMPLAINTS;
}

export function mockNotifications(): Notification[] {
  return MOCK_NOTIFICATIONS;
}