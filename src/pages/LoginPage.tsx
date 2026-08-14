import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { DEMO_CREDENTIALS } from "@/lib/auth";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || "Login failed.");
      return;
    }
    const stored = JSON.parse(localStorage.getItem("petition_ai_user") || "{}");
    const role = stored.role;
    if (role === "citizen") navigate("/citizen/dashboard");
    else if (role === "officer") navigate("/officer/dashboard");
    else if (role === "admin") navigate("/admin/dashboard");
    else navigate("/");
  }

  function fillDemo(cred: typeof DEMO_CREDENTIALS[0]) {
    setEmail(cred.email);
    setPassword(cred.password);
    setError("");
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-navy-800 rounded-xl mb-4 shadow-lg">
            <Shield className="w-7 h-7 text-gold-400" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">PetitionAI Portal</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="card-base p-6 shadow-lg">
          {/* Demo Quick Fill */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Quick Demo Login</p>
            <div className="flex gap-2">
              {DEMO_CREDENTIALS.map(c => (
                <button
                  key={c.role}
                  onClick={() => fillDemo(c)}
                  className="flex-1 text-xs border border-border rounded-md py-1.5 font-medium hover:bg-navy-50 hover:border-navy-300 transition-colors capitalize"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-md">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full border border-border rounded-md px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 transition-colors"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-navy-800 hover:bg-navy-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-5">
            No account?{" "}
            <Link to="/register" className="text-navy-700 font-semibold hover:text-navy-900">Register as Citizen</Link>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Protected by JWT Authentication · Role-Based Access Control
        </p>
      </div>
    </div>
  );
}
