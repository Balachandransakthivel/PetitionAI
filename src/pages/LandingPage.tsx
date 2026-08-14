import { Link } from "react-router-dom";
import { Shield, Brain, FileText, Bell, BarChart3, Users, CheckCircle, ArrowRight, Building2, Zap } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const FEATURES = [
  { icon: Brain, title: "AI Classification", desc: "Complaints are automatically classified with 90%+ accuracy using NLP and semantic analysis.", color: "bg-blue-50 text-blue-600" },
  { icon: Building2, title: "Auto Department Routing", desc: "AI predicts and routes complaints to the correct department without manual intervention.", color: "bg-purple-50 text-purple-600" },
  { icon: Zap, title: "Priority & Sentiment", desc: "Every complaint is assigned a priority score and sentiment analysis for faster resolution.", color: "bg-amber-50 text-amber-600" },
  { icon: FileText, title: "Duplicate Detection", desc: "Semantic similarity engine detects and consolidates duplicate complaints automatically.", color: "bg-rose-50 text-rose-600" },
  { icon: Bell, title: "Real-Time Notifications", desc: "Citizens receive instant email and in-app notifications at every status change.", color: "bg-green-50 text-green-600" },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Admins get comprehensive reports on complaint trends, officer performance, and resolution metrics.", color: "bg-navy-50 text-navy-600" },
];

const DEMO_CREDS = [
  { role: "Citizen", email: "citizen@demo.com", password: "citizen123", color: "border-blue-200 bg-blue-50", badge: "bg-blue-600" },
  { role: "Officer", email: "officer@demo.com", password: "officer123", color: "border-purple-200 bg-purple-50", badge: "bg-purple-600" },
  { role: "Admin", email: "admin@demo.com", password: "admin123", color: "border-amber-200 bg-amber-50", badge: "bg-amber-600" },
];

const STEPS = [
  { n: "01", title: "Citizen Submits Petition", desc: "Fills in description, category, and location." },
  { n: "02", title: "AI Analysis", desc: "Classifies, prioritises, detects duplicates, routes to department." },
  { n: "03", title: "Officer Action", desc: "Reviews AI results, updates status, adds remarks." },
  { n: "04", title: "Resolution & Closure", desc: "Citizen is notified, provides feedback, petition closed." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-navy-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBanner} alt="AI Petition Portal" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-900/80 to-navy-800/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-gold-400/20 border border-gold-400/40 text-gold-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wider">
              <Brain className="w-3.5 h-3.5" /> AI-Powered Grievance Platform
            </div>
            <h1 className="font-serif text-4xl lg:text-5xl font-bold leading-tight mb-5">
              Intelligent Petition Classification & Resolution
            </h1>
            <p className="text-navy-200 text-lg leading-relaxed mb-8">
              An AI-driven civic grievance portal that automates complaint classification, duplicate detection, priority prediction, and department routing — delivering faster resolution for every citizen.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="bg-gold-400 hover:bg-gold-300 text-navy-900 font-bold px-6 py-3 rounded-md transition-all hover:shadow-lg flex items-center gap-2">
                Submit a Petition <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/login" className="border border-white/30 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-md transition-all flex items-center gap-2">
                Sign In
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 mt-10">
              {[["127+", "Petitions Filed"], ["94%", "AI Accuracy"], ["4.2 days", "Avg. Resolution"], ["8", "Departments"]].map(([v, l]) => (
                <div key={l}>
                  <p className="text-2xl font-bold text-gold-300">{v}</p>
                  <p className="text-xs text-navy-300">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-3">Platform Features</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Combining AI intelligence with government accountability for smarter grievance management.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="card-base p-6 hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow */}
      <section className="py-20 bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-navy-300">From submission to resolution — powered by AI every step.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={i} className="relative">
                <div className="bg-navy-800 border border-navy-700 rounded-lg p-5">
                  <div className="text-3xl font-black text-gold-400/30 mb-2">{s.n}</div>
                  <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-navy-300">{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 z-10">
                    <ArrowRight className="w-5 h-5 text-gold-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Login */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-3">Try the Demo</h2>
            <p className="text-muted-foreground">Use these credentials to explore each role in the system.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {DEMO_CREDS.map(d => (
              <div key={d.role} className={`border rounded-lg p-5 ${d.color}`}>
                <span className={`text-white text-xs font-bold px-2 py-1 rounded ${d.badge} uppercase`}>{d.role}</span>
                <div className="mt-4 space-y-1.5">
                  <p className="text-xs text-muted-foreground">Email: <span className="font-mono text-foreground">{d.email}</span></p>
                  <p className="text-xs text-muted-foreground">Password: <span className="font-mono text-foreground">{d.password}</span></p>
                </div>
                <Link to="/login" className="mt-4 block text-center text-sm font-semibold text-navy-700 hover:text-navy-900 transition-colors">
                  Login as {d.role} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-3">Role-Based Access</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Users, role: "Citizens", color: "text-blue-600", items: ["Register & login securely", "Submit petitions with file uploads", "Track status in real time", "Receive notifications", "Provide feedback after resolution"] },
              { icon: Shield, role: "Officers", color: "text-purple-600", items: ["View assigned complaints", "See full AI analysis", "Update complaint status", "Add remarks & resolution proof", "Escalate critical cases"] },
              { icon: BarChart3, role: "Administrators", color: "text-amber-600", items: ["Manage all users & officers", "Monitor all complaints", "Assign officers to cases", "View analytics & reports", "Manage departments & categories"] },
            ].map(r => (
              <div key={r.role} className="card-base p-6">
                <r.icon className={`w-8 h-8 ${r.color} mb-4`} />
                <h3 className="font-serif font-bold text-lg text-foreground mb-4">{r.role}</h3>
                <ul className="space-y-2">
                  {r.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-950 text-navy-300 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gold-400" />
            <span className="font-serif font-bold text-white">PetitionAI</span>
          </div>
          <p className="text-sm text-center">Intelligent Petition Classification & Resolution · BE CSE Mini Project · 2024</p>
          <p className="text-xs text-navy-500">Team: Akashresi S · Arun K · Balachandran S</p>
        </div>
      </footer>
    </div>
  );
}
