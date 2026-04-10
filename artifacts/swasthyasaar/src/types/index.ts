// ─── Shared Domain Types ──────────────────────────────────────────────────────
// These types serve as the single source of truth for data shapes shared across
// components, services, and (eventually) the backend API contract.

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

// ─── Patient ──────────────────────────────────────────────────────────────────
export interface Patient {
  id: number;
  name: string;
  age: number;
  condition: string;
  village: string;
  ashaAssigned: string;
  riskLevel: RiskLevel;
  lastVisit: string;
  nextVisit: string;
  details: string;
}

// ─── ASHA Worker ──────────────────────────────────────────────────────────────
export interface AshaWorker {
  id: number;
  name: string;
  village: string;
  patientsToday: number;
  highRisk: number;
  status: "Active" | "Inactive";
}

// ─── Referral ─────────────────────────────────────────────────────────────────
export interface Referral {
  id: number;
  patientName: string;
  to: string;
  reason: string;
  status: string;
  urgency: RiskLevel;
  time: string;
  progress: number;
}

// ─── Analytics / Chart Data ───────────────────────────────────────────────────
export interface RiskChartDataPoint {
  month: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface ConditionDistributionPoint {
  month: string;
  Maternal: number;
  NCD: number;
  Newborn: number;
}

export interface ReferralCompletionPoint {
  month: string;
  rate: number;
}

// ─── Voice AI ─────────────────────────────────────────────────────────────────
export interface AIAssessmentResponse {
  condition: string;
  riskLevel: string;
  immediateAction: string;
  dangerSigns: string[];
  steps: string[];
}

// ─── Assessment Inputs ────────────────────────────────────────────────────────
export interface MaternalAssessmentInput {
  age: number;
  hemoglobin: number;
  systolicBp: number;
  ancVisits: number;
  dangerSigns: string[];
  previousComplications: boolean;
  distanceToPhc: number;
}

export interface NcdAssessmentInput {
  fastingSugar: number;
  systolicBp: number;
  age: number;
  smoking: boolean;
  familyHistory: string[];
  physicalActivity: "Low" | "Moderate" | "High" | "Sedentary";
}

export interface NewbornAssessmentInput {
  temperature: number;
  feeding: string;
  abnormalBreathing: boolean;
  skinColor: string;
  weight: number;
}

export interface RiskResult {
  score: number;
  level: RiskLevel;
}

// ─── API Response Wrapper ─────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}
