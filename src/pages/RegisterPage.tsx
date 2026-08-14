import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function RegisterPage() {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", password: "", confirmPassword: "" });

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    const result = await register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      password: form.password,
    });
    if (!result.success) {
      setError(result.error || "Registration failed.");
      return;
    }
    navigate("/citizen/dashboard");
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-navy-800 rounded-xl mb-4 shadow-lg">
            <Shield className="w-7 h-7 text-gold-400" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Create Citizen Account</h1>
          <p className="text-muted-foreground text-sm mt-1">Register to submit and track your petitions</p>
        </div>

        <div className="card-base p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-md">{error}</div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <input type="text" value={form.name} onChange={e => update("name", e.target.value)} required placeholder="Your full name"
                  className="w-full border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email Address <span className="text-red-500">*</span></label>
                <input type="email" value={form.email} onChange={e => update("email", e.target.value)} required placeholder="your@email.com"
                  className="w-full border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number</label>
              <input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+91 XXXXX XXXXX"
                className="w-full border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Residential Address</label>
              <textarea value={form.address} onChange={e => update("address", e.target.value)} placeholder="House No, Street, Area, City - Pincode" rows={2}
                className="w-full border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400 resize-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} value={form.password} onChange={e => update("password", e.target.value)} required placeholder="Min 6 characters"
                    className="w-full border border-border rounded-md px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
                <input type="password" value={form.confirmPassword} onChange={e => update("confirmPassword", e.target.value)} required placeholder="Repeat password"
                  className="w-full border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400" />
              </div>
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full bg-navy-800 hover:bg-navy-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-md transition-colors flex items-center justify-center gap-2">
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-navy-700 font-semibold hover:text-navy-900">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
