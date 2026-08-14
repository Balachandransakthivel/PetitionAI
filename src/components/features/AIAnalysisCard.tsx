import { Brain, Building2, AlertTriangle, Copy, Smile, Tag, Lightbulb, TrendingUp } from "lucide-react";
import { AIAnalysis } from "@/types";
import { cn, confidenceBar, sentimentColor, sentimentBg } from "@/lib/utils";

interface Props {
  analysis: AIAnalysis;
  compact?: boolean;
}

export default function AIAnalysisCard({ analysis, compact = false }: Props) {
  const sentimentEmoji: Record<string, string> = {
    positive: "😊",
    neutral: "😐",
    negative: "😞",
    angry: "😡",
  };

  const priorityColors: Record<string, string> = {
    critical: "text-red-700 bg-red-50 border-red-200",
    high: "text-orange-700 bg-orange-50 border-orange-200",
    medium: "text-yellow-700 bg-yellow-50 border-yellow-200",
    low: "text-green-700 bg-green-50 border-green-200",
  };

  return (
    <div className="card-base overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-800 to-navy-700 px-4 py-3 flex items-center gap-2">
        <Brain className="w-5 h-5 text-gold-400" />
        <span className="text-white font-semibold text-sm">AI Analysis Results</span>
        <span className="ml-auto text-[10px] bg-navy-600 text-navy-200 px-2 py-0.5 rounded-full uppercase tracking-wide">Automated</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Summary */}
        {!compact && (
          <div className="bg-navy-50 border border-navy-200 rounded-md px-3 py-2.5 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-navy-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-navy-800 leading-relaxed">{analysis.summaryNote}</p>
          </div>
        )}

        {/* Grid: Category + Department */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted rounded-md p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Tag className="w-3.5 h-3.5 text-navy-600" />
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Category</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{analysis.category}</p>
            <ConfidenceBar score={analysis.categoryConfidence} />
          </div>
          <div className="bg-muted rounded-md p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Building2 className="w-3.5 h-3.5 text-navy-600" />
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Department</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{analysis.department}</p>
            <ConfidenceBar score={analysis.departmentConfidence} />
          </div>
        </div>

        {/* Priority + Sentiment */}
        <div className="grid grid-cols-2 gap-3">
          <div className={cn("rounded-md p-3 border", priorityColors[analysis.priority])}>
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wide">Priority</span>
            </div>
            <p className="text-sm font-bold capitalize">{analysis.priority}</p>
            <div className="mt-1.5 bg-white/50 rounded-full h-1.5">
              <div
                className={cn("h-1.5 rounded-full", confidenceBar(analysis.priorityScore))}
                style={{ width: `${analysis.priorityScore * 100}%` }}
              />
            </div>
            <p className="text-[10px] mt-1 opacity-75">{Math.round(analysis.priorityScore * 100)}% score</p>
          </div>
          <div className={cn("rounded-md p-3 border", sentimentBg(analysis.sentiment))}>
            <div className="flex items-center gap-1.5 mb-1">
              <Smile className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Sentiment</span>
            </div>
            <p className={cn("text-sm font-bold capitalize", sentimentColor(analysis.sentiment))}>
              {sentimentEmoji[analysis.sentiment]} {analysis.sentiment}
            </p>
            <p className={cn("text-[10px] mt-1", sentimentColor(analysis.sentiment))}>
              Score: {Math.round((1 - analysis.sentimentScore) * 100)}% negative
            </p>
          </div>
        </div>

        {/* Duplicate Detection */}
        <div className={cn("rounded-md p-3 border flex items-start gap-2", analysis.isDuplicate ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200")}>
          <Copy className={cn("w-4 h-4 flex-shrink-0 mt-0.5", analysis.isDuplicate ? "text-amber-600" : "text-green-600")} />
          <div>
            <p className={cn("text-xs font-semibold", analysis.isDuplicate ? "text-amber-700" : "text-green-700")}>
              {analysis.isDuplicate ? `⚠️ Possible Duplicate Detected` : "✓ No Duplicates Found"}
            </p>
            {analysis.isDuplicate && (
              <p className="text-[11px] text-amber-600 mt-0.5">{analysis.duplicateCount} similar complaint(s) already on record.</p>
            )}
          </div>
        </div>

        {/* Similar Complaints */}
        {analysis.similarComplaints.length > 0 && !compact && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Similar Complaints</p>
            <div className="space-y-1.5">
              {analysis.similarComplaints.map((sc) => (
                <div key={sc.id} className="flex items-center justify-between bg-muted rounded p-2">
                  <div>
                    <p className="text-xs font-medium text-foreground truncate max-w-[180px]">{sc.title}</p>
                    <p className="text-[10px] text-muted-foreground">{sc.id}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-navy-700">{Math.round(sc.similarity * 100)}%</p>
                    <p className="text-[10px] text-muted-foreground">similarity</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Keywords */}
        {!compact && analysis.keywords.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Extracted Keywords</p>
            <div className="flex flex-wrap gap-1.5">
              {analysis.keywords.map((kw, i) => (
                <span key={i} className="text-[11px] bg-navy-100 text-navy-700 px-2 py-0.5 rounded-full">{kw}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ConfidenceBar({ score }: { score: number }) {
  return (
    <div className="mt-2">
      <div className="bg-white/60 rounded-full h-1.5">
        <div className={cn("h-1.5 rounded-full transition-all", confidenceBar(score))} style={{ width: `${score * 100}%` }} />
      </div>
      <p className="text-[10px] text-muted-foreground mt-0.5">{Math.round(score * 100)}% confidence</p>
    </div>
  );
}
