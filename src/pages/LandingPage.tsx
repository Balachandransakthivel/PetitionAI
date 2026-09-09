import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Shield, Brain, FileText, Bell, BarChart3, Users, CheckCircle,
  ArrowRight, Building2, Zap, Globe, Sparkles, ArrowUpRight,
  ChevronRight, Star, Clock, TrendingUp
} from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const { t } = useTranslation();

  const FEATURES = [
    { icon: Brain, title: "AI Classification", desc: "Complaints are automatically classified with 90%+ accuracy using NLP and semantic analysis.", color: "from-blue-500 to-blue-600" },
    { icon: Building2, title: "Auto Department Routing", desc: "AI predicts and routes complaints to the correct department without manual intervention.", color: "from-purple-500 to-purple-600" },
    { icon: Zap, title: "Priority & Sentiment", desc: "Every complaint is assigned a priority score and sentiment analysis for faster resolution.", color: "from-amber-500 to-orange-500" },
    { icon: FileText, title: "Duplicate Detection", desc: "Semantic similarity engine detects and consolidates duplicate complaints automatically.", color: "from-rose-500 to-pink-500" },
    { icon: Bell, title: "Real-Time Notifications", desc: "Citizens receive instant email and in-app notifications at every status change.", color: "from-emerald-500 to-green-500" },
    { icon: BarChart3, title: "Analytics Dashboard", desc: "Admins get comprehensive reports on complaint trends, officer performance, and resolution metrics.", color: "from-navy-600 to-navy-700" },
  ];

  const DEMO_CREDS = [
    { role: "Citizen", email: "citizen@demo.com", password: "citizen123", gradient: "from-blue-500 to-indigo-600", icon: Users },
    { role: "Officer", email: "officer@demo.com", password: "officer123", gradient: "from-purple-500 to-violet-600", icon: Shield },
    { role: "Admin", email: "admin@demo.com", password: "admin123", gradient: "from-amber-500 to-orange-500", icon: BarChart3 },
  ];

  const STEPS = [
    { n: "01", title: "Citizen Submits Petition", desc: "Fills in description, category, and location with file uploads.", icon: FileText },
    { n: "02", title: "AI Analysis", desc: "Classifies, prioritises, detects duplicates, routes to department.", icon: Brain },
    { n: "03", title: "Officer Action", desc: "Reviews AI results, updates status, adds remarks.", icon: Shield },
    { n: "04", title: "Resolution & Closure", desc: "Citizen is notified, provides feedback, petition closed.", icon: CheckCircle },
  ];

  const STATS = [
    { value: "127+", label: t("landing.stats.petitions"), icon: FileText },
    { value: "94%", label: t("landing.stats.accuracy"), icon: TrendingUp },
    { value: "4.2 days", label: t("landing.stats.resolution"), icon: Clock },
    { value: "8", label: t("landing.stats.departments"), icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={heroBanner} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-navy-950/95 via-navy-900/90 to-navy-800/80 dark:from-navy-950/98 dark:via-navy-950/95 dark:to-navy-900/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
          {/* Subtle ambient light */}
          <div className="absolute top-1/4 -right-20 w-80 h-80 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-navy-400/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28 w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-gold-300 text-xs font-semibold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                {t("landing.badge")}
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
            >
              {t("landing.heroTitle")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-navy-100 text-base lg:text-lg leading-relaxed mb-8 max-w-2xl"
            >
              {t("landing.heroDesc")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/register" className="group bg-gold-400 hover:bg-gold-300 text-navy-900 font-bold px-7 py-3.5 rounded-full transition-all duration-200 hover:shadow-xl hover:shadow-gold-400/20 flex items-center gap-3 text-base active:scale-[0.98]">
                {t("landing.cta")}
                <span className="w-7 h-7 rounded-full bg-navy-900/10 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-200">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link to="/login" className="border border-white/30 hover:border-white/60 hover:bg-white/10 text-white font-semibold px-7 py-3.5 rounded-full transition-all duration-200 flex items-center gap-2 backdrop-blur-sm">
                Sign In
                <ArrowUpRight className="w-4 h-4 opacity-70" />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10"
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="group">
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className="w-4 h-4 text-gold-400/80" />
                    <p className="text-2xl lg:text-3xl font-display font-extrabold text-gold-300">{stat.value}</p>
                  </div>
                  <p className="text-xs text-navy-200/90 uppercase tracking-wider font-medium">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28 bg-white dark:bg-background border-b border-border/40 relative transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-1.5 bg-navy-50 dark:bg-navy-900/60 text-navy-700 dark:text-navy-300 text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">
                <Star className="w-3 h-3" /> Features
              </span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="font-display text-3xl lg:text-4xl font-extrabold text-foreground mb-4">
              {t("landing.featuresTitle")}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground text-base lg:text-lg max-w-2xl mx-auto">
              {t("landing.featuresDesc")}
            </motion.p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                variants={scaleIn}
                className="group"
              >
                <div className="card-doppelrand h-full">
                  <div className="card-doppelrand-inner h-full flex flex-col">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform duration-200`}>
                      <f.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-foreground mb-2 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-navy-900 to-navy-950 dark:from-navy-950 dark:to-background text-white relative overflow-hidden transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 relative">
          <AnimatedSection className="text-center mb-14">
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-1.5 bg-white/10 text-gold-300 text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">
                <Zap className="w-3 h-3" /> Process
              </span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="font-display text-3xl lg:text-4xl font-extrabold mb-4">
              {t("landing.howItWorks")}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-navy-200 text-base lg:text-lg max-w-xl mx-auto">
              {t("landing.howItWorksDesc")}
            </motion.p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {STEPS.map((s, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="relative group"
              >
                <div className="bg-white/5 dark:bg-card/40 backdrop-blur-sm border border-white/10 dark:border-border/40 rounded-3xl p-6 hover:bg-white/10 dark:hover:bg-card/60 transition-all duration-200">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center mb-4 shadow-md shadow-gold-400/20 group-hover:scale-105 transition-transform duration-200">
                    <s.icon className="w-6 h-6 text-navy-900" />
                  </div>
                  <div className="text-xs font-bold text-gold-400/80 mb-2 tracking-widest">{s.n}</div>
                  <h3 className="font-display font-bold text-lg text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-navy-200 dark:text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:flex absolute top-20 -right-3 z-10 w-6 h-6 bg-navy-800 border border-navy-600 rounded-full items-center justify-center">
                    <ChevronRight className="w-3 h-3 text-gold-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Login */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white dark:from-background dark:to-card/20 border-b border-border/40 transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-1.5 bg-gold-50 dark:bg-gold-950/40 text-gold-700 dark:text-gold-300 text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">
                <Globe className="w-3 h-3" /> Demo
              </span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="font-display text-3xl lg:text-4xl font-extrabold text-foreground mb-4">
              {t("landing.tryDemo")}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground text-base max-w-xl mx-auto">
              {t("landing.tryDemoDesc")}
            </motion.p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {DEMO_CREDS.map((d) => (
              <motion.div
                key={d.role}
                variants={scaleIn}
                className="group"
              >
                <div className="card-doppelrand h-full">
                  <div className="card-doppelrand-inner text-center h-full flex flex-col justify-between">
                    <div>
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${d.gradient} flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-105 transition-transform duration-200`}>
                        <d.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-display font-bold text-xl text-foreground mb-3">{d.role}</h3>
                      <div className="space-y-1.5 mb-5 bg-muted/40 p-3 rounded-xl border border-border/40">
                        <p className="text-xs text-muted-foreground">
                          Email: <span className="font-mono text-foreground font-semibold">{d.email}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Password: <span className="font-mono text-foreground font-semibold">{d.password}</span>
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center gap-2 text-sm font-bold text-navy-700 dark:text-gold-400 hover:text-navy-900 dark:hover:text-gold-300 transition-colors group/link"
                    >
                      Login as {d.role}
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 lg:py-28 bg-white dark:bg-background transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-1.5 bg-navy-50 dark:bg-navy-900/60 text-navy-700 dark:text-navy-300 text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">
                <Shield className="w-3 h-3" /> Access Control
              </span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="font-display text-3xl lg:text-4xl font-extrabold text-foreground">
              {t("landing.rolesTitle")}
            </motion.h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Users, role: "Citizens", color: "from-blue-500 to-indigo-600", items: ["Register & login securely", "Submit petitions with file uploads", "Track status in real time", "Receive notifications", "Provide feedback after resolution"] },
              { icon: Shield, role: "Officers", color: "from-purple-500 to-violet-600", items: ["View assigned complaints", "See full AI analysis", "Update complaint status", "Add remarks & resolution proof", "Escalate critical cases"] },
              { icon: BarChart3, role: "Administrators", color: "from-amber-500 to-orange-500", items: ["Manage all users & officers", "Monitor all complaints", "Assign officers to cases", "View analytics & reports", "Manage departments & categories"] },
            ].map((r) => (
              <motion.div
                key={r.role}
                variants={fadeInUp}
                className="group"
              >
                <div className="card-doppelrand h-full">
                  <div className="card-doppelrand-inner h-full">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center mb-5 shadow-md group-hover:scale-105 transition-transform duration-200`}>
                      <r.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-foreground mb-4">{r.role}</h3>
                    <ul className="space-y-3">
                      {r.items.map(item => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-950 text-navy-300 py-12 border-t border-navy-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center shadow-sm">
                <img src="/favicon.png" alt="PetitionAI" className="w-5 h-5 rounded object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-display font-bold text-white text-base tracking-tight leading-none">PetitionAI</span>
                <span className="text-gold-400/90 text-[10px] font-semibold tracking-wider uppercase leading-none mt-1">Citizen Grievance Portal</span>
              </div>
            </div>
            <p className="text-sm text-navy-400">Intelligent Petition Classification & Resolution System</p>
            <p className="text-xs text-navy-500">&copy; {new Date().getFullYear()} PetitionAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
