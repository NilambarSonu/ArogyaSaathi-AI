// ─── Patient Service ──────────────────────────────────────────────────────────
// All patient-related data fetching goes through this module.
//
// Demo mode:   returns data from src/mock/
// Production:  calls GET /api/patients, GET /api/patients/:id, etc.
//
// Backend teammate: implement the endpoints in api-server/src/routes/patients.ts

import { apiClient, USE_MOCK } from "./apiClient";
import { mockPatients, mockReferrals } from "@/mock";
import type { Patient, Referral } from "@/types";

// ─── List Patients ─────────────────────────────────────────────────────────────
export async function getPatients(): Promise<Patient[]> {
  if (USE_MOCK) {
    return Promise.resolve(mockPatients as Patient[]);
  }
  const res = await apiClient.get<Patient[]>("/api/patients");
  return res.data;
}

// ─── Get Single Patient ────────────────────────────────────────────────────────
export async function getPatientById(id: number): Promise<Patient | undefined> {
  if (USE_MOCK) {
    return Promise.resolve(mockPatients.find((p) => p.id === id) as Patient | undefined);
  }
  const res = await apiClient.get<Patient>(`/api/patients/${id}`);
  return res.data;
}

// ─── Filter by Risk Level ──────────────────────────────────────────────────────
export async function getPatientsByRisk(
  level: Patient["riskLevel"]
): Promise<Patient[]> {
  if (USE_MOCK) {
    return Promise.resolve(
      (mockPatients as Patient[]).filter((p) => p.riskLevel === level)
    );
  }
  const res = await apiClient.get<Patient[]>(`/api/patients?risk=${level}`);
  return res.data;
}

// ─── Get Referrals ────────────────────────────────────────────────────────────
export async function getReferrals(): Promise<Referral[]> {
  if (USE_MOCK) {
    return Promise.resolve(mockReferrals as Referral[]);
  }
  const res = await apiClient.get<Referral[]>("/api/referrals");
  return res.data;
}

// ─── Create Referral ─────────────────────────────────────────────────────────
export async function createReferral(
  referral: Omit<Referral, "id">
): Promise<Referral> {
  if (USE_MOCK) {
    const newReferral = { ...referral, id: Date.now() } as Referral;
    return Promise.resolve(newReferral);
  }
  const res = await apiClient.post<Referral>("/api/referrals", referral);
  return res.data;
}
