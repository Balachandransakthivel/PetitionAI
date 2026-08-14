import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, MapPin, Tag, Brain, Upload, CheckCircle, Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useComplaints } from "@/hooks/useComplaints";
import { useNotifications } from "@/hooks/useNotifications";
import { CATEGORIES } from "@/constants/mockData";
import { generateAIAnalysis, generatePetitionId } from "@/lib/utils";
import { Complaint, StatusUpdate } from "@/types";
import AIAnalysisCard from "@/components/features/AIAnalysisCard";

import { generateAIAnalysis as genAI } from "@/constants/mockData";

type Step = "form" | "analyzing" | "result";

export default function SubmitPetition() {
  const { user } = useAuth();
  const { addComplaint } = useComplaints();
  const { addNotification } = useNotifications(user?.id);
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("form");
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    district: "Coimbatore",
  });

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("analyzing");

    await new Promise(r => setTimeout(r, 2200));

    const aiResult = generateAIAnalysis(form.title, form.description, form.category);
    const petitionId = generatePetitionId();
    const now = new Date().toISOString();

    const statusHistory: StatusUpdate[] = [
      { status: "submitted", timestamp: now, note: "Petition submitted by citizen", updatedBy: "System" },
      {
        status: "under_review",
        timestamp: new Date(Date.now() + 60000).toISOString(),
        note: `AI analysis complete. Classified as ${aiResult.category} (${Math.round(aiResult.categoryConfidence * 100)}% confidence). Routed to ${aiResult.department}.`,
        updatedBy: "AI System",
      },
    ];

    const complaint: Complaint = {
      id: `c_${Date.now()}`,
      petitionId,
      title: form.title,
      description: form.description,
      category: form.category,
      location: form.location,
      district: form.district,
      submittedBy: user?.id || "u1",
      submittedByName: user?.name || "Citizen",
      submittedAt: now,
      status: "under_review",
      priority: aiResult.priority,
      assignedDepartment: aiResult.department,
      aiAnalysis: aiResult,
      statusHistory,
      reopenCount: 0,
      isEscalated: false,
    };

    addComplaint(complaint);
    addNotification({
      userId: user?.id || "u1",
      title: "Petition Submitted Successfully",
      message: `Petition ${petitionId} submitted. AI classified as ${aiResult.category}, Priority: ${aiResult.priority.toUpperCase()}.`,
      type: "success",
      isRead: false,
      petitionId,
    });

    setSubmittedComplaint(complaint);
    setStep("result");
  }

  if (step === "analyzing") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="card-base p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-navy-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-navy-700 animate-pulse" />
          </div>
          <h2 className="font-serif text-xl font-bold text-foreground mb-2">AI is Analysing Your Petition</h2>
          <p className="text-muted-foreground text-sm mb-6">Classifying complaint, detecting duplicates, predicting priority and routing to department...</p>
          <div className="space-y-2.5">
            {["Preprocessing complaint text...", "Running NLP classification...", "Checking semantic similarity...", "Predicting priority & sentiment...", "Routing to department..."].map((msg, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="w-3 h-3 animate-spin text-navy-500 flex-shrink-0" />
                {msg}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === "result" && submittedComplaint) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="card-base p-6 mb-6 border-l-4 border-green-500">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
              <div>
                <p className="font-bold text-foreground">Petition Submitted Successfully!</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Petition ID: <span className="font-mono font-bold text-navy-700">{submittedComplaint.petitionId}</span> · Use this ID to track your complaint.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="card-base p-4">
              <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-navy-600" /> Petition Details
              </h3>
              <div className="space-y-2">
                <p className="text-sm"><span className="text-muted-foreground">Title:</span> <span className="font-medium">{submittedComplaint.title}</span></p>
                <p className="text-sm"><span className="text-muted-foreground">Category:</span> <span className="font-medium">{submittedComplaint.category}</span></p>
                <p className="text-sm"><span className="text-muted-foreground">Location:</span> <span className="font-medium">{submittedComplaint.location}</span></p>
                <p className="text-sm"><span className="text-muted-foreground">Department:</span> <span className="font-semibold text-navy-700">{submittedComplaint.assignedDepartment}</span></p>
                <p className="text-sm"><span className="text-muted-foreground">Status:</span> <span className="font-semibold text-blue-600">Under Review</span></p>
              </div>
            </div>
            <AIAnalysisCard analysis={submittedComplaint.aiAnalysis} compact />
          </div>

          <AIAnalysisCard analysis={submittedComplaint.aiAnalysis} />

          <div className="flex gap-3 mt-6">
            <button onClick={() => navigate(`/citizen/petition/${submittedComplaint.id}`)} className="btn-primary flex items-center gap-2">
              Track This Petition
            </button>
            <button onClick={() => { setStep("form"); setForm({ title: "", description: "", category: "", location: "", district: "Coimbatore" }); }} className="btn-secondary">
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="font-serif text-2xl font-bold text-foreground">Submit New Petition</h1>
          <p className="text-muted-foreground text-sm mt-1">Your complaint will be automatically classified and routed by our AI engine.</p>
        </div>

        <div className="card-base p-3 mb-6 flex items-start gap-2 bg-navy-50 border-navy-200">
          <Brain className="w-4 h-4 text-navy-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-navy-700 leading-relaxed">
            Our AI will automatically: classify your complaint, detect duplicates, assign priority, analyse sentiment, and route to the correct department.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card-base p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Petition Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => update("title", e.target.value)}
              required
              placeholder="Brief title describing the issue"
              className="w-full border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Complaint Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={form.category}
                onChange={e => update("category", e.target.value)}
                required
                className="w-full border border-border rounded-md pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400 appearance-none bg-white"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Complaint Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={e => update("description", e.target.value)}
              required
              rows={5}
              placeholder="Describe the issue in detail. Include what happened, when it started, and how it is affecting you and others..."
              className="w-full border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400 resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">More detail helps the AI analyse more accurately. Min 50 characters recommended.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Location / Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={form.location}
                onChange={e => update("location", e.target.value)}
                required
                placeholder="Street name, landmark, area"
                className="w-full border border-border rounded-md pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">District</label>
            <select
              value={form.district}
              onChange={e => update("district", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400"
            >
              {["Coimbatore", "Chennai", "Madurai", "Salem", "Tiruchirappalli", "Tiruppur", "Erode", "Vellore"].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
            <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Supporting images/documents</p>
            <p className="text-xs text-muted-foreground mt-1">Drag & drop or click to upload (JPG, PNG, PDF — max 5MB)</p>
            <button type="button" className="mt-3 text-xs text-navy-600 border border-navy-300 px-3 py-1.5 rounded-md hover:bg-navy-50 transition-colors">
              Browse Files
            </button>
          </div>

          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p className="text-xs text-amber-700">Submitting false complaints may result in account suspension. Please ensure accuracy.</p>
          </div>

          <button type="submit" className="w-full bg-navy-800 hover:bg-navy-700 text-white font-semibold py-3 rounded-md transition-colors flex items-center justify-center gap-2">
            <Brain className="w-4 h-4" /> Submit & Analyse with AI
          </button>
        </form>
      </div>
    </div>
  );
}
