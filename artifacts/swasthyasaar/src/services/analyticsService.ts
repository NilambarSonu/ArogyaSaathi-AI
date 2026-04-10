// ─── Analytics Service ────────────────────────────────────────────────────────
// Provides chart and dashboard statistics data.
//
// Demo mode:   returns data from src/mock/
// Production:  calls GET /api/analytics/*
//
// Backend teammate: implement in api-server/src/routes/analytics.ts

import { apiClient, USE_MOCK } from "./apiClient";
import {
  mockAshas,
  mockChartData,
  conditionDistribution,
  referralCompletionData,
} from "@/mock";
import type {
  AshaWorker,
  RiskChartDataPoint,
  ConditionDistributionPoint,
  ReferralCompletionPoint,
} from "@/types";

// ─── ASHA Workers ─────────────────────────────────────────────────────────────
export async function getAshaWorkers(): Promise<AshaWorker[]> {
  if (USE_MOCK) {
    return Promise.resolve(mockAshas as AshaWorker[]);
  }
  const res = await apiClient.get<AshaWorker[]>("/api/analytics/ashas");
  return res.data;
}

// ─── Risk Distribution Chart ──────────────────────────────────────────────────
export async function getRiskChartData(): Promise<RiskChartDataPoint[]> {
  if (USE_MOCK) {
    return Promise.resolve(mockChartData);
  }
  const res = await apiClient.get<RiskChartDataPoint[]>("/api/analytics/risk-trend");
  return res.data;
}

// ─── Condition Distribution ────────────────────────────────────────────────────
export async function getConditionDistribution(): Promise<
  ConditionDistributionPoint[]
> {
  if (USE_MOCK) {
    return Promise.resolve(conditionDistribution);
  }
  const res = await apiClient.get<ConditionDistributionPoint[]>(
    "/api/analytics/condition-distribution"
  );
  return res.data;
}

// ─── Referral Completion Rate ─────────────────────────────────────────────────
export async function getReferralCompletionData(): Promise<
  ReferralCompletionPoint[]
> {
  if (USE_MOCK) {
    return Promise.resolve(referralCompletionData);
  }
  const res = await apiClient.get<ReferralCompletionPoint[]>(
    "/api/analytics/referral-completion"
  );
  return res.data;
}
