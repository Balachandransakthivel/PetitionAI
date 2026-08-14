import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut, User, Menu, X, ChevronDown, Shield } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationPanel from "@/components/features/NotificationPanel";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications(user?.id);
  const [showNotif, setShowNotif] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  const roleLinks = {
    citizen: [
      { to: "/citizen/dashboard", label: "Dashboard" },
      { to: "/citizen/submit", label: "Submit Petition" },
      { to: "/citizen/petitions", label: "My Petitions" },
    ],
    officer: [
      { to: "/officer/dashboard", label: "Dashboard" },
    ],
    admin: [
      { to: "/admin/dashboard", label: "Dashboard" },
      { to: "/admin/complaints", label: "Complaints" },
      { to: "/admin/users", label: "Users" },
      { to: "/admin/analytics", label: "Analytics" },
    ],
  };

  const links = user ? (roleLinks[user.role] || []) : [];

  return (
    <nav className="bg-navy-800 border-b border-navy-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? `/${user.role}/dashboard` : "/"} className="flex items-center gap-2.5">
            <img src="/favicon.png" alt="PetitionAI Logo" className="w-8 h-8 rounded-md object-cover border border-gold-400/40 shadow-sm" />
            <div className="leading-tight">
              <div className="text-white font-serif font-bold text-base leading-none">PetitionAI</div>
              <div className="text-navy-300 text-[10px] leading-tight tracking-wide uppercase">Citizen Grievance Portal</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {links.map(l => (
                <Link key={l.to} to={l.to} className="nav-link px-3 py-2 rounded-md hover:bg-navy-700">
                  {l.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right Actions */}
          {user ? (
            <div className="flex items-center gap-2">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => { setShowNotif(!showNotif); setShowMenu(false); }}
                  className="relative p-2 text-white/70 hover:text-white hover:bg-navy-700 rounded-full transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                {showNotif && (
                  <div className="absolute right-0 top-12 z-50">
                    <NotificationPanel userId={user.id} onClose={() => setShowNotif(false)} />
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => { setShowMenu(!showMenu); setShowNotif(false); }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md text-white/80 hover:text-white hover:bg-navy-700 transition-colors"
                >
                  <div className="w-7 h-7 bg-gold-400 rounded-full flex items-center justify-center text-navy-900 font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{user.name.split(" ")[0]}</span>
                  <span className="hidden sm:block text-[10px] bg-navy-600 text-navy-200 px-1.5 py-0.5 rounded uppercase font-semibold">{user.role}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-12 w-52 bg-white rounded-lg shadow-xl border border-border z-50 py-1 animate-fade-in">
                    <Link to={`/${user.role === "citizen" ? "citizen" : user.role}/profile`} className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setShowMenu(false)}>
                      <User className="w-4 h-4 text-muted-foreground" />
                      My Profile
                    </Link>
                    <hr className="my-1 border-border" />
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-red-50 transition-colors w-full text-left">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile toggle */}
              <button
                className="md:hidden p-2 text-white/70 hover:text-white"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Sign In</Link>
              <Link to="/register" className="bg-gold-400 text-navy-900 hover:bg-gold-300 font-semibold text-sm px-4 py-2 rounded-md transition-colors">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Nav */}
        {mobileOpen && user && (
          <div className="md:hidden pb-3 border-t border-navy-700 mt-1 pt-3 flex flex-col gap-1 animate-fade-in">
            {links.map(l => (
              <Link key={l.to} to={l.to} className="nav-link px-3 py-2 rounded-md hover:bg-navy-700 block" onClick={() => setMobileOpen(false)}>
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Backdrop */}
      {(showNotif || showMenu) && (
        <div className="fixed inset-0 z-30" onClick={() => { setShowNotif(false); setShowMenu(false); }} />
      )}
    </nav>
  );
}
