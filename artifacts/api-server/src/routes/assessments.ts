import { Router } from "express";
import { logger } from "../lib/logger";
import { VoiceAssessmentSchema, MaternalAssessmentSchema, NcdAssessmentSchema, NewbornAssessmentSchema, SaveAssessmentSchema } from "@workspace/schemas";
import { RiskLevel } from "@workspace/types";

const router = Router();

const successResponse = <T>(data: T) => ({
  success: true,
  data,
  timestamp: new Date().toISOString(),
});

// ─── Keyword-based voice AI logic (mirrors frontend voiceAI.ts) ───────────────
function parseVoiceInput(transcript: string) {
  const text = transcript.toLowerCase();

  if (
    text.includes("pregnant") &&
    (text.includes("headache") ||
      text.includes("swelling") ||
      text.includes("preeclampsia") ||
      text.includes("bp"))
  ) {
    return {
      condition: "High-Risk Pregnancy (Possible Preeclampsia)",
      riskLevel: "CRITICAL",
      immediateAction: "Refer to PHC within 2 hours",
      dangerSigns: ["Headache", "Edema", "8th month pregnancy"],
      steps: [
        "1. Check BP immediately (target <140/90)",
        "2. Ask about vision changes and abdominal pain",
        "3. Arrange urgent referral to PHC",
        "4. Do not delay — preeclampsia is life-threatening",
      ],
    };
  }

  if (
    (text.includes("newborn") || text.includes("baby")) &&
    (text.includes("fever") ||
      text.includes("not feeding") ||
      text.includes("feeding"))
  ) {
    return {
      condition: "Sick Newborn — Possible Neonatal Sepsis",
      riskLevel: "CRITICAL",
      immediateAction: "Refer to hospital IMMEDIATELY",
      dangerSigns: ["High fever", "Not feeding", "Newborn < 7 days"],
      steps: [
        "1. Keep baby warm and wrapped",
        "2. Do NOT give any medications",
        "3. Call 108 ambulance immediately",
        "4. Notify facility before arrival",
      ],
    };
  }

  if (
    (text.includes("diabetic") || text.includes("diabetes")) &&
    text.includes("missed")
  ) {
    return {
      condition: "Uncontrolled Diabetes Risk",
      riskLevel: "MEDIUM",
      immediateAction: "Schedule PHC visit within 3 days",
      dangerSigns: ["Missed medication", "Blood sugar likely elevated"],
      steps: [
        "1. Check blood sugar if glucometer available",
        "2. Counsel on medication adherence",
        "3. Schedule PHC visit in 3 days",
        "4. Dietary counseling — reduce sugar/rice intake",
      ],
    };
  }

  return {
    condition: "General Assessment Needed",
    riskLevel: "LOW",
    immediateAction: "Proceed with standard checkup",
    dangerSigns: ["None clearly identified"],
    steps: [
      "1. Complete full health questionnaire",
      "2. Update patient records",
      "3. Schedule regular follow-up",
    ],
  };
}

function getBand(score: number): string {
  if (score <= 40) return "LOW";
  if (score <= 60) return "MEDIUM";
  if (score <= 80) return "HIGH";
  return "CRITICAL";
}

// ─── POST /api/assess/voice ───────────────────────────────────────────────────
router.post("/voice", (req, res) => {
  const parseResult = VoiceAssessmentSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({
      success: false,
      code: "INVALID_REQUEST",
      message: "Request validation failed",
      details: parseResult.error.format(),
    });
    return;
  }

  const { transcript } = parseResult.data;
  const result = parseVoiceInput(transcript);
  logger.info({ riskLevel: result.riskLevel }, "POST /api/assess/voice");
  res.json(successResponse(result));
});

// ─── POST /api/assess/maternal ────────────────────────────────────────────────
router.post("/maternal", (req, res) => {
  const parseResult = MaternalAssessmentSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({
      success: false,
      code: "INVALID_REQUEST",
      message: "Request validation failed",
      details: parseResult.error.format(),
    });
    return;
  }

  const data = parseResult.data;
  let score = 0;
  if ((data.age ?? 0) < 18 || (data.age ?? 0) > 35) score += 20;
  if ((data.hemoglobin ?? 12) < 7) score += 25;
  else if ((data.hemoglobin ?? 12) < 10) score += 15;
  if ((data.systolicBp ?? 120) > 140) score += 30;
  if ((data.ancVisits ?? 4) < 3) score += 20;
  if (Array.isArray(data.dangerSigns)) score += data.dangerSigns.length * 10;
  if (data.previousComplications) score += 15;
  if ((data.distanceToPhc ?? 0) > 10) score += 10;

  logger.info({ score }, "POST /api/assess/maternal");
  res.json(successResponse({ score, level: getBand(score) }));
});

// ─── POST /api/assess/ncd ─────────────────────────────────────────────────────
router.post("/ncd", (req, res) => {
  const parseResult = NcdAssessmentSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({
      success: false,
      code: "INVALID_REQUEST",
      message: "Request validation failed",
      details: parseResult.error.format(),
    });
    return;
  }

  const data = parseResult.data;
  let score = 0;
  if ((data.fastingSugar ?? 90) > 126) score += 30;
  else if ((data.fastingSugar ?? 90) > 100) score += 15;
  if ((data.systolicBp ?? 120) > 140) score += 25;
  if ((data.age ?? 30) > 45) score += 15;
  if (data.smoking) score += 20;
  if (Array.isArray(data.familyHistory)) score += data.familyHistory.length * 10;
  if (data.physicalActivity === "Low" || data.physicalActivity === "Sedentary") score += 15;

  logger.info({ score }, "POST /api/assess/ncd");
  res.json(successResponse({ score, level: getBand(score) }));
});

// ─── POST /api/assess/newborn ─────────────────────────────────────────────────
router.post("/newborn", (req, res) => {
  const parseResult = NewbornAssessmentSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({
      success: false,
      code: "INVALID_REQUEST",
      message: "Request validation failed",
      details: parseResult.error.format(),
    });
    return;
  }

  const data = parseResult.data;
  let score = 0;
  if ((data.temperature ?? 37) > 38 || (data.temperature ?? 37) < 36) score += 25;
  if (data.feeding === "Not feeding") score += 30;
  if (data.abnormalBreathing) score += 30;
  if (data.skinColor === "Blue/Cyanotic" || data.skinColor === "Pale") score += 35;
  if ((data.weight ?? 3) < 2) score += 20;

  logger.info({ score }, "POST /api/assess/newborn");
  res.json(successResponse({ score, level: getBand(score) }));
});

// ─── POST /api/assessments (save to record) ───────────────────────────────────
router.post("/", (req, res) => {
  const parseResult = SaveAssessmentSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({
      success: false,
      code: "INVALID_REQUEST",
      message: "Request validation failed",
      details: parseResult.error.format(),
    });
    return;
  }

  const { patientId, transcript, analysis } = parseResult.data;

  // TODO: persist to database
  const savedId = `assessment-${Date.now()}`;
  logger.info({ patientId, savedId }, "POST /api/assessments (saved)");
  res.status(201).json(successResponse({ savedId }));
});

export default router;
