import { AIAnalysis } from "@/types";
import { analyzeSentiment } from "./sentimentAnalysis";
import { predictPriority } from "./priorityPrediction";
import { classifyCategoryAndDepartment } from "./classification";
import { detectDuplicates } from "./duplicateDetection";

export * from "./sentimentAnalysis";
export * from "./priorityPrediction";
export * from "./classification";
export * from "./duplicateDetection";

export function generateAIAnalysis(
  title: string,
  description: string,
  category: string
): AIAnalysis {
  const fullText = `${title} ${description}`;
  const { sentiment, sentimentScore } = analyzeSentiment(fullText);
  const { priority, priorityScore } = predictPriority(fullText);
  const { department, categoryConfidence, departmentConfidence } =
    classifyCategoryAndDepartment(category);
  const { isDuplicate, duplicateCount, similarComplaints } = detectDuplicates(category);

  const words = fullText
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 5);
  const keywords = [...new Set(words)].slice(0, 6);

  return {
    category,
    categoryConfidence,
    department,
    departmentConfidence,
    priority,
    priorityScore,
    sentiment,
    sentimentScore,
    isDuplicate,
    duplicateCount,
    similarComplaints,
    urgencyLevel: priority,
    keywords: keywords.length > 0 ? keywords : ["complaint", "repair", "service"],
    summaryNote: `AI classified this as ${category} with ${Math.round(
      categoryConfidence * 100
    )}% confidence. Routed to ${department}. Priority: ${priority.toUpperCase()}. ${
      isDuplicate ? "⚠️ Similar complaints found." : "No duplicates detected."
    }`,
  };
}
