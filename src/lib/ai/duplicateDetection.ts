import { SimilarComplaint } from "@/types";

export function detectDuplicates(category: string): {
  isDuplicate: boolean;
  duplicateCount: number;
  similarComplaints: SimilarComplaint[];
} {
  const isDuplicate = Math.random() > 0.7;
  const year = new Date().getFullYear();
  const num = Math.floor(Math.random() * 900) + 100;

  const similarComplaints: SimilarComplaint[] = isDuplicate
    ? [
        {
          id: `PET-${year}-${num}`,
          title: `Similar ${category} complaint nearby`,
          similarity: Number((0.72 + Math.random() * 0.2).toFixed(2)),
          status: "in_progress",
        },
      ]
    : [];

  return {
    isDuplicate,
    duplicateCount: isDuplicate ? Math.floor(Math.random() * 3) + 1 : 0,
    similarComplaints,
  };
}
