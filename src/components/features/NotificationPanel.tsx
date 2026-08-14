import { CheckCheck, X, Bell, Info, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { timeAgo } from "@/lib/utils";

interface Props {
  userId: string;
  onClose: () => void;
}

export default function NotificationPanel({ userId, onClose }: Props) {
  const { notifications, markRead, markAllRead } = useNotifications(userId);

  const iconMap = {
    success: <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />,
  };

  return (
    <div className="w-80 bg-white rounded-xl shadow-2xl border border-border overflow-hidden animate-fade-in">
      <div className="flex items-center justify-between px-4 py-3 bg-navy-800 text-white">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4" />
          <span className="font-semibold text-sm">Notifications</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={markAllRead} className="text-navy-300 hover:text-white text-xs flex items-center gap-1 transition-colors">
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </button>
          <button onClick={onClose} className="text-navy-300 hover:text-white transition-colors ml-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">No notifications</div>
        ) : (
          notifications.map(n => (
            <button
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`w-full text-left px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted transition-colors ${!n.isRead ? "bg-blue-50/60" : ""}`}
            >
              <div className="flex items-start gap-2.5">
                {iconMap[n.type]}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-medium truncate ${!n.isRead ? "text-navy-800" : "text-foreground"}`}>{n.title}</p>
                    {!n.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{timeAgo(n.timestamp)}</p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
