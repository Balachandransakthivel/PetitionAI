export function classifyCategoryAndDepartment(category: string): {
  department: string;
  categoryConfidence: number;
  departmentConfidence: number;
} {
  const deptMap: Record<string, string> = {
    "Road & Infrastructure": "Roads & Infrastructure",
    "Building & Construction": "Roads & Infrastructure",
    "Water Supply": "Water Works",
    "Sanitation": "Waste Management",
    "Electricity": "Electricity Board",
    "Waste Management": "Waste Management",
    "Parks & Recreation": "Waste Management",
    "Noise Pollution": "Public Safety",
    "Public Safety": "Public Safety",
    "Healthcare": "Health Department",
    "Education": "Education Department",
    "Public Transport": "Transport Authority",
  };

  const catConf = 0.85 + Math.random() * 0.12;
  const deptConf = 0.80 + Math.random() * 0.15;

  return {
    department: deptMap[category] || "Roads & Infrastructure",
    categoryConfidence: Number(catConf.toFixed(2)),
    departmentConfidence: Number(deptConf.toFixed(2)),
  };
}
