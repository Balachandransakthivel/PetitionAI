import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Building2, User, Star, RotateCcw, AlertTriangle } from "lucide-react";
import { useComplaints } from "@/hooks/useComplaints";
import { useAuth } from "@/lib/auth";
import AIAnalysisCard from "@/components/features/AIAnalysisCard";
import StatusTimeline from "@/components/features/StatusTimeline";
import { cn, statusClass, statusLabel, priorityClass, formatDateTime, formatDate } from "@/lib/utils";

export default function PetitionDetail() {
  const { id } = useParams<{ id: string }>();
  const { complaints, updateComplaint } = useComplaints();
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const complaint = complaints.find(c => c.id === id);

  if (!complaint) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground mb-2">Petition Not Found</p>
          <Link to="/citizen/petitions" className="text-navy-600 hover:underline">Back to My Petitions</Link>
        </div>
      </div>
    );
  }

  function submitFeedback() {
    if (!rating) return;
    updateComplaint(complaint!.id, {
      feedback: { rating, comment: feedbackText, submittedAt: new Date().toISOString() },
    });
    setFeedbackSubmitted(true);
  }

  function reopenComplaint() {
    updateComplaint(complaint!.id, {
      status: "submitted",
      reopenCount: complaint!.reopenCount + 1,
      statusHistory: [
        ...complaint!.statusHistory,
        { status: "submitted", timestamp: new Date().toISOString(), note: "Petition reopened by citizen — resolution unsatisfactory.", updatedBy: user?.name || "Citizen" },
      ],
    });
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <Link to="/citizen/petitions" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to My Petitions
        </Link>

        {/* Header Card */}
        <div className="card-base p-5 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-sm font-mono font-bold text-navy-700 bg-navy-50 px-2.5 py-1 rounded">{complaint.petitionId}</span>
                <span className={cn("text-xs font-semibold px-2 py-1 rounded border", statusClass(complaint.status))}>{statusLabel(complaint.status)}</span>
                <span className={cn("text-xs font-semibold px-2 py-1 rounded border", priorityClass(complaint.priority))}>{complaint.priority.toUpperCase()} PRIORITY</span>
                {complaint.isEscalated && <span className="text-xs font-semibold px-2 py-1 rounded border bg-red-50 text-red-700 border-red-200 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Escalated</span>}
              </div>
              <h1 className="font-serif text-xl font-bold text-foreground">{complaint.title}</h1>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{complaint.description}</p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-medium text-sm">{complaint.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Department</p>
                <p className="font-medium text-sm">{complaint.assignedDepartment}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <User className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Assigned Officer</p>
                <p className="font-medium text-sm">{complaint.assignedOfficerName || "Not assigned yet"}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Submitted</p>
                <p className="font-medium text-sm">{formatDate(complaint.submittedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Status Timeline */}
          <StatusTimeline currentStatus={complaint.status} history={complaint.statusHistory} />

          {/* AI Analysis */}
          <AIAnalysisCard analysis={complaint.aiAnalysis} compact />
        </div>

        {/* Officer Remarks */}
        {complaint.officerRemarks && (
          <div className="card-base p-4 mb-5">
            <h3 className="font-semibold text-foreground mb-2 text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-navy-600" /> Officer Remarks
            </h3>
            <p className="text-sm text-muted-foreground bg-muted rounded-md p-3">{complaint.officerRemarks}</p>
            <p className="text-xs text-muted-foreground mt-2">— {complaint.assignedOfficerName}</p>
          </div>
        )}

        {/* Resolution Details */}
        {complaint.resolutionDetails && (
          <div className="card-base p-4 mb-5 border-l-4 border-green-400">
            <h3 className="font-semibold text-green-700 mb-2 text-sm">Resolution Details</h3>
            <p className="text-sm text-foreground">{complaint.resolutionDetails}</p>
            {complaint.resolutionProof && (
              <p className="text-xs text-muted-foreground mt-2">{complaint.resolutionProof}</p>
            )}
          </div>
        )}

        {/* Full AI Analysis */}
        <div className="mb-5">
          <AIAnalysisCard analysis={complaint.aiAnalysis} />
        </div>

        {/* Feedback */}
        {complaint.status === "resolved" && !complaint.feedback && !feedbackSubmitted && (
          <div className="card-base p-5 mb-5">
            <h3 className="font-semibold text-foreground mb-3">Rate the Resolution</h3>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} onClick={() => setRating(s)}
                  className={cn("w-9 h-9 rounded-full transition-all", rating >= s ? "text-gold-400" : "text-muted-foreground hover:text-gold-300")}>
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
              {rating > 0 && <span className="text-sm text-muted-foreground self-center ml-2">{rating}/5 stars</span>}
            </div>
            <textarea value={feedbackText} onChange={e => setFeedbackText(e.target.value)} placeholder="Share your experience (optional)..." rows={3}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400 resize-none mb-3" />
            <button onClick={submitFeedback} disabled={!rating} className="btn-primary disabled:opacity-50">Submit Feedback</button>
          </div>
        )}

        {(complaint.feedback || feedbackSubmitted) && (
          <div className="card-base p-4 mb-5 bg-green-50 border-green-200">
            <p className="text-sm font-semibold text-green-700">Feedback submitted. Thank you!</p>
            {complaint.feedback && (
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className={cn("w-4 h-4", s <= complaint.feedback!.rating ? "text-gold-400 fill-gold-400" : "text-muted-foreground")} />)}
              </div>
            )}
          </div>
        )}

        {/* Reopen */}
        {complaint.status === "resolved" && complaint.reopenCount < 2 && (
          <button onClick={reopenComplaint} className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-800 border border-amber-300 px-4 py-2 rounded-md hover:bg-amber-50 transition-colors">
            <RotateCcw className="w-4 h-4" /> Reopen — Issue Not Resolved
          </button>
        )}
      </div>
    </div>
  );
}
