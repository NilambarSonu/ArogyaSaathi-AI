export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

function getBand(score: number): RiskLevel {
  if (score <= 40) return "LOW";
  if (score <= 60) return "MEDIUM";
  if (score <= 80) return "HIGH";
  return "CRITICAL";
}

export function calculateMaternalRisk(data: any): { score: number; level: RiskLevel } {
  let score = 0;
  
  if (data.age < 18 || data.age > 35) score += 20;
  if (data.hemoglobin < 7) score += 25;
  else if (data.hemoglobin < 10) score += 15;
  
  if (data.systolicBp > 140) score += 30;
  if (data.ancVisits < 3) score += 20;
  
  if (data.dangerSigns) {
    score += data.dangerSigns.length * 10;
  }
  
  if (data.previousComplications) score += 15;
  if (data.distanceToPhc > 10) score += 10;
  
  return { score, level: getBand(score) };
}

export function calculateNcdRisk(data: any): { score: number; level: RiskLevel } {
  let score = 0;
  
  if (data.fastingSugar > 126) score += 30;
  else if (data.fastingSugar > 100) score += 15;
  
  if (data.systolicBp > 140) score += 25;
  if (data.age > 45) score += 15;
  if (data.smoking) score += 20;
  
  if (data.familyHistory) {
    score += data.familyHistory.length * 10;
  }
  
  if (data.physicalActivity === "Low" || data.physicalActivity === "Sedentary") score += 15;
  
  return { score, level: getBand(score) };
}

export function calculateNewbornRisk(data: any): { score: number; level: RiskLevel } {
  let score = 0;
  
  if (data.temperature > 38 || data.temperature < 36) score += 25;
  if (data.feeding === "Not feeding") score += 30;
  if (data.abnormalBreathing) score += 30;
  if (data.skinColor === "Blue/Cyanotic" || data.skinColor === "Pale") score += 35;
  if (data.weight < 2) score += 20;
  
  return { score, level: getBand(score) };
}
