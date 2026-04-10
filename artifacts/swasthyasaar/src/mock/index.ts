// ─── Mock Data Re-exports ──────────────────────────────────────────────────────
// This file is the single import point for all mock data used in demo mode.
// When the backend is ready, swap the consuming service files to real API calls
// instead of touching individual components.
//
// ⚠️  DO NOT import from src/data/ directly in components. Use this file.

export {
  mockPatients,
  mockAshas,
  mockReferrals,
  mockChartData,
  conditionDistribution,
  referralCompletionData,
} from "@/data/mockData";
