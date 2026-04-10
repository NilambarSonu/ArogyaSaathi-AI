// ─── App Constants ─────────────────────────────────────────────────────────────
// All magic strings and configuration values live here. Never hard-code
// these values directly in components.

// ─── Risk Level Config ────────────────────────────────────────────────────────
export const RISK_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

export const RISK_COLORS: Record<string, string> = {
  LOW: "hsl(136 63% 47%)",
  MEDIUM: "hsl(38 90% 55%)",
  HIGH: "#f97316",
  CRITICAL: "hsl(357 77% 56%)",
};

export const RISK_BADGE_CLASSES: Record<string, string> = {
  LOW: "bg-emerald-100 text-emerald-800 border-emerald-200",
  MEDIUM: "bg-amber-100 text-amber-800 border-amber-200",
  HIGH: "bg-orange-100 text-orange-800 border-orange-200",
  CRITICAL: "bg-red-100 text-red-800 border-red-200 animate-pulse",
};

// ─── Routes ───────────────────────────────────────────────────────────────────
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  ASHA_DASHBOARD: "/asha-dashboard",
  SUPERVISOR_DASHBOARD: "/supervisor-dashboard",
  VOICE_ASSESSMENT: "/voice-assessment",
  MATERNAL_CHECK: "/maternal-check",
  NCD_TRACKER: "/ncd-tracker",
  PATIENT: (id: number | string) => `/patient/${id}`,
  ANALYTICS: "/analytics",
  REFERRALS: "/referrals",
} as const;

// ─── API Base ─────────────────────────────────────────────────────────────────
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// ─── Demo Mode ────────────────────────────────────────────────────────────────
export const DEMO_SCENARIOS = [
  { label: "Pregnant, headache, swelling", testId: "chip-maternal" },
  { label: "Newborn, fever, not feeding", testId: "chip-newborn" },
  { label: "Diabetic, missed medication", testId: "chip-ncd" },
] as const;

// ─── Voice AI Keywords ────────────────────────────────────────────────────────
export const HIGH_RISK_KEYWORDS = [
  "headache", "swelling", "fever", "bleeding", "pain",
  "not feeding", "preeclampsia", "critical",
];

export const MODERATE_RISK_KEYWORDS = [
  "pregnant", "newborn", "diabetic", "8 months", "baby", "diabetes",
];

// ─── Emergency Contact ────────────────────────────────────────────────────────
export const EMERGENCY_NUMBER = "108";
export const NEAREST_PHC_DISTANCE_KM = 8;
export const AMBULANCE_ETA_MINUTES = 18;
