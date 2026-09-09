import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, Loader2, KeyRound, Mail, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { DEMO_CREDENTIALS } from "@/lib/auth";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

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

  async function handlePasswordReset(e: React.FormEvent) {
    e.preventDefault();
    setResetLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setResetLoading(false);
    setResetSent(true);
  }

  if (showForgot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -right-32 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -left-32 w-80 h-80 bg-navy-400/5 rounded-full blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-500 mb-4 shadow-xl shadow-gold-400/20">
              <KeyRound className="w-7 h-7 text-navy-900" />
            </div>
            <h1 className="font-display text-2xl font-extrabold text-white">Reset Password</h1>
            <p className="text-navy-300 text-sm mt-1">Enter your email to receive a reset link</p>
          </div>
          <div className="card-doppelrand">
            <div className="card-doppelrand-inner">
              {resetSent ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-foreground mb-2">Check Your Email</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We've sent a password reset link to <strong>{resetEmail}</strong>.
                  </p>
                  <button onClick={() => { setShowForgot(false); setResetSent(false); setResetEmail(""); }}
                    className="text-sm text-navy-700 font-semibold hover:text-navy-900">
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} required
                        placeholder="Enter your registered email"
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-11 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400 focus:bg-white transition-all" />
                    </div>
                  </div>
                  <button type="submit" disabled={resetLoading}
                    className="w-full bg-navy-800 hover:bg-navy-700 disabled:opacity-60 text-white font-semibold py-3 rounded-full transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                    {resetLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : "Send Reset Link"}
                  </button>
                  <button type="button" onClick={() => setShowForgot(false)}
                    className="w-full text-sm text-muted-foreground hover:text-foreground py-2">
                    Back to Sign In
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-1/4 -left-32 w-80 h-80 bg-navy-400/5 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-500 mb-4 shadow-xl shadow-gold-400/20">
            <Shield className="w-7 h-7 text-navy-900" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-white">PetitionAI Portal</h1>
          <p className="text-navy-300 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="card-doppelrand">
          <div className="card-doppelrand-inner">
            {/* Demo Quick Fill */}
            <div className="mb-6">
              <p className="text-[11px] font-bold text-muted-foreground mb-2.5 uppercase tracking-widest">Quick Demo Login</p>
              <div className="flex gap-2">
                {DEMO_CREDENTIALS.map(c => (
                  <button
                    key={c.role}
                    onClick={() => fillDemo(c)}
                    className="flex-1 text-xs border border-gray-200 rounded-xl py-2 font-medium hover:bg-navy-50 hover:border-navy-300 transition-all capitalize active:scale-[0.98]"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl"
                >
                  {error}
                </motion.div>
              )}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400 focus:bg-white transition-all"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <button type="button" onClick={() => setShowForgot(true)}
                    className="text-xs text-navy-600 hover:text-navy-800 font-medium">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400 focus:bg-white transition-all"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-navy-800 hover:bg-navy-700 disabled:opacity-60 text-white font-semibold py-3 rounded-full transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg shadow-navy-900/20"
              >
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              No account?{" "}
              <Link to="/register" className="text-navy-700 font-bold hover:text-navy-900 transition-colors">
                Register as Citizen
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-navy-400 mt-6">
          Protected by JWT Authentication · Role-Based Access Control
        </p>
      </motion.div>
    </div>
  );
}
