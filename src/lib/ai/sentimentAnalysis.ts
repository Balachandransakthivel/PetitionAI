import { Sentiment } from "@/types";

export function analyzeSentiment(text: string): { sentiment: Sentiment; sentimentScore: number } {
  const lower = text.toLowerCase();
  const angryWords = ["angry", "furious", "unacceptable", "terrible", "worst", "disgusting", "outrageous", "frustrated"];
  const negativeWords = ["bad", "poor", "issue", "problem", "complaint", "broken", "damaged", "fail", "missing", "blocked"];
  const positiveWords = ["please", "kindly", "request", "hope", "appreciate", "grateful"];

  if (angryWords.some(w => lower.includes(w))) {
    return { sentiment: "angry", sentimentScore: 0.15 };
  }
  if (negativeWords.filter(w => lower.includes(w)).length >= 2) {
    return { sentiment: "negative", sentimentScore: 0.3 };
  }
  if (positiveWords.some(w => lower.includes(w))) {
    return { sentiment: "positive", sentimentScore: 0.75 };
  }
  return { sentiment: "neutral", sentimentScore: 0.5 };
}
