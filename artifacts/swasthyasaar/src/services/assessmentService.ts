// ─── Assessment Service ───────────────────────────────────────────────────────
// Handles Voice AI analysis and clinical risk calculations.
//
// Demo mode:   uses local parseVoiceInput() and calculateXxxRisk() utilities
// Production:  calls POST /api/assess/voice and POST /api/assess/maternal etc.
//
// Backend teammate: implement in api-server/src/routes/assessments.ts

import { apiClient, USE_MOCK } from "./apiClient";
import { parseVoiceInput } from "@/utils/voiceAI";
import {
  calculateMaternalRisk,
  calculateNcdRisk,
  calculateNewbornRisk,
} from "@/utils/riskScoring";
import type {
  AIAssessmentResponse,
  MaternalAssessmentInput,
  NcdAssessmentInput,
  NewbornAssessmentInput,
  RiskResult,
} from "@/types";

// ─── Voice AI Assessment ──────────────────────────────────────────────────────
export async function analyzeVoiceTranscript(
  transcript: string
): Promise<AIAssessmentResponse> {
  if (USE_MOCK) {
    return Promise.resolve(parseVoiceInput(transcript) as AIAssessmentResponse);
  }
  const res = await apiClient.post<AIAssessmentResponse>("/api/assess/voice", {
    transcript,
  });
  return res.data;
}

// ─── Maternal Risk Scoring ────────────────────────────────────────────────────
export async function assessMaternalRisk(
  data: MaternalAssessmentInput
): Promise<RiskResult> {
  if (USE_MOCK) {
    return Promise.resolve(calculateMaternalRisk(data));
  }
  const res = await apiClient.post<RiskResult>("/api/assess/maternal", data);
  return res.data;
}

// ─── NCD Risk Scoring ─────────────────────────────────────────────────────────
export async function assessNcdRisk(data: NcdAssessmentInput): Promise<RiskResult> {
  if (USE_MOCK) {
    return Promise.resolve(calculateNcdRisk(data));
  }
  const res = await apiClient.post<RiskResult>("/api/assess/ncd", data);
  return res.data;
}

// ─── Newborn Risk Scoring ─────────────────────────────────────────────────────
export async function assessNewbornRisk(
  data: NewbornAssessmentInput
): Promise<RiskResult> {
  if (USE_MOCK) {
    return Promise.resolve(calculateNewbornRisk(data));
  }
  const res = await apiClient.post<RiskResult>("/api/assess/newborn", data);
  return res.data;
}

// ─── Save Assessment to Record ────────────────────────────────────────────────
export async function saveAssessment(payload: {
  patientId: number;
  transcript: string;
  analysis: AIAssessmentResponse;
}): Promise<{ savedId: string }> {
  if (USE_MOCK) {
    console.log("[MOCK] Assessment saved:", payload);
    return Promise.resolve({ savedId: `mock-${Date.now()}` });
  }
  const res = await apiClient.post<{ savedId: string }>(
    "/api/assessments",
    payload
  );
  return res.data;
}
