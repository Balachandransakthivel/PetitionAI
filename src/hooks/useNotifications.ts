import { useState, useEffect, useCallback } from "react";
import { Notification } from "@/types";
import { MOCK_NOTIFICATIONS } from "@/constants/mockData";
import { apiListNotifications, apiMarkNotificationRead, apiMarkAllNotificationsRead, isBackendUp } from "@/lib/api";

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
  const [backendUp, setBackendUp] = useState(false);

  useEffect(() => {
    let cancelled = false;
    isBackendUp().then(up => {
      if (cancelled) return;
      setBackendUp(up);
      if (up) {
        apiListNotifications()
          .then(list => {
            if (!cancelled && list.length > 0) setAll(list);
          })
          .catch(() => {});
      }
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!backendUp) localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }, [all, backendUp]);

  const userNotifs = all.filter(n => !userId || n.userId === userId);
  const unreadCount = userNotifs.filter(n => !n.isRead).length;

  async function markRead(id: string) {
    setAll(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    if (await isBackendUp()) apiMarkNotificationRead(id).catch(() => {});
  }

  async function markAllRead() {
    setAll(prev => prev.map(n => n.userId === userId ? { ...n, isRead: true } : n));
    if (await isBackendUp()) apiMarkAllNotificationsRead().catch(() => {});
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