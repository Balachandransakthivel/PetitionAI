import { useState, useEffect } from "react";
import { Notification } from "@/types";
import { MOCK_NOTIFICATIONS } from "@/constants/mockData";

const STORAGE_KEY = "petition_ai_notifications";

function loadNotifications(): Notification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error("Error loading notifications from localStorage:", err);
  }
  return MOCK_NOTIFICATIONS;
}

export function useNotifications(userId: string | undefined) {
  const [all, setAll] = useState<Notification[]>(loadNotifications);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }, [all]);

  const userNotifs = all.filter(n => !userId || n.userId === userId);
  const unreadCount = userNotifs.filter(n => !n.isRead).length;

  function markRead(id: string) {
    setAll(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }

  function markAllRead() {
    setAll(prev => prev.map(n => n.userId === userId ? { ...n, isRead: true } : n));
  }

  function addNotification(notif: Omit<Notification, "id" | "timestamp">) {
    const newNotif: Notification = {
      ...notif,
      id: `n_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setAll(prev => [newNotif, ...prev]);
  }

  return { notifications: userNotifs, unreadCount, markRead, markAllRead, addNotification };
}
