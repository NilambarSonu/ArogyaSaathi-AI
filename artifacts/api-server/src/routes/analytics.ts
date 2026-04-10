import { Router } from "express";
import { logger } from "../lib/logger";

const router = Router();

const successResponse = <T>(data: T) => ({
  success: true,
  data,
  timestamp: new Date().toISOString(),
});

// ─── Static seed data ─────────────────────────────────────────────────────────
const mockAshas = [
  { id: 1, name: "Meera Singh", village: "Phulbani", patientsToday: 8, highRisk: 2, status: "Active" },
  { id: 2, name: "Lakshmi Behera", village: "Junagarh", patientsToday: 6, highRisk: 3, status: "Active" },
  { id: 3, name: "Anita Pal", village: "Kesinga", patientsToday: 5, highRisk: 1, status: "Active" },
  { id: 4, name: "Savitri Devi", village: "Bhawanipatna", patientsToday: 7, highRisk: 2, status: "Active" },
  { id: 5, name: "Priya Nanda", village: "Ampani", patientsToday: 3, highRisk: 0, status: "Inactive" },
];

const mockRiskTrend = [
  { month: "Jan", critical: 2, high: 5, medium: 8, low: 12 },
  { month: "Feb", critical: 3, high: 6, medium: 7, low: 11 },
  { month: "Mar", critical: 4, high: 4, medium: 9, low: 13 },
  { month: "Apr", critical: 3, high: 7, medium: 6, low: 14 },
  { month: "May", critical: 5, high: 8, medium: 8, low: 10 },
  { month: "Jun", critical: 4, high: 6, medium: 9, low: 12 },
];

const mockConditionDist = [
  { month: "Jan", Maternal: 15, NCD: 8, Newborn: 4 },
  { month: "Feb", Maternal: 14, NCD: 9, Newborn: 5 },
  { month: "Mar", Maternal: 16, NCD: 11, Newborn: 3 },
  { month: "Apr", Maternal: 18, NCD: 10, Newborn: 6 },
  { month: "May", Maternal: 17, NCD: 12, Newborn: 5 },
  { month: "Jun", Maternal: 19, NCD: 14, Newborn: 4 },
];

const mockReferralCompletion = [
  { month: "Jan", rate: 65 },
  { month: "Feb", rate: 70 },
  { month: "Mar", rate: 72 },
  { month: "Apr", rate: 75 },
  { month: "May", rate: 78 },
  { month: "Jun", rate: 82 },
];

const mockReferrals = [
  { id: 1, patientName: "Parvati Nayak", to: "PHC Junagarh", reason: "High BP preeclampsia", status: "Received at PHC", urgency: "CRITICAL", time: "4 hours ago", progress: 4 },
  { id: 2, patientName: "Baby of Priya", to: "District Hospital Bhawanipatna", reason: "Neonatal fever", status: "Patient Traveling", urgency: "CRITICAL", time: "2 hours ago", progress: 3 },
  { id: 3, patientName: "Raman Babu", to: "PHC Bhawanipatna", reason: "Uncontrolled diabetes", status: "Initiated", urgency: "HIGH", time: "5 hours ago", progress: 1 },
  { id: 4, patientName: "Geeta Mandal", to: "PHC Bhawanipatna", reason: "BP management", status: "Complete", urgency: "HIGH", time: "1 day ago", progress: 5 },
  { id: 5, patientName: "Champa Majhi", to: "PHC Bhawanipatna", reason: "Term pregnancy monitoring", status: "ASHA Notified", urgency: "HIGH", time: "30 mins ago", progress: 2 },
  { id: 6, patientName: "Ananya Behera", to: "CHC Phulbani", reason: "Newborn not feeding", status: "Initiated", urgency: "HIGH", time: "1 hour ago", progress: 1 },
];

// ─── GET /api/analytics/ashas ─────────────────────────────────────────────────
router.get("/ashas", (_req, res) => {
  logger.info("GET /api/analytics/ashas");
  res.json(successResponse(mockAshas));
});

// ─── GET /api/analytics/risk-trend ───────────────────────────────────────────
router.get("/risk-trend", (_req, res) => {
  logger.info("GET /api/analytics/risk-trend");
  res.json(successResponse(mockRiskTrend));
});

// ─── GET /api/analytics/condition-distribution ───────────────────────────────
router.get("/condition-distribution", (_req, res) => {
  logger.info("GET /api/analytics/condition-distribution");
  res.json(successResponse(mockConditionDist));
});

// ─── GET /api/analytics/referral-completion ──────────────────────────────────
router.get("/referral-completion", (_req, res) => {
  logger.info("GET /api/analytics/referral-completion");
  res.json(successResponse(mockReferralCompletion));
});

// ─── GET /api/referrals ───────────────────────────────────────────────────────
router.get("/referrals", (_req, res) => {
  logger.info("GET /api/referrals");
  res.json(successResponse(mockReferrals));
});

export default router;
