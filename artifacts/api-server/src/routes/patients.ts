import { Router } from "express";
import { logger } from "../lib/logger";
import { Patient } from "@workspace/types";

const router = Router();

// ────────────────────────────────────────────────────────────────────────────
// Seed data (mirrors frontend mock — replace with DB queries when ready)
// ────────────────────────────────────────────────────────────────────────────
const mockPatients: Patient[] = [
  { id: 0, name: "Sunita Devi", age: 24, condition: "Pregnant 32 weeks", village: "Phulbani", ashaAssigned: "Meera Singh", riskLevel: "HIGH", lastVisit: "2 days ago", nextVisit: "Apr 12, 2026", details: "High blood pressure observed. Requires close monitoring." },
  { id: 1, name: "Parvati Nayak", age: 35, condition: "Pregnant 38 weeks", village: "Junagarh", ashaAssigned: "Lakshmi Behera", riskLevel: "CRITICAL", lastVisit: "4 hours ago", nextVisit: "Apr 10, 2026", details: "BP 160/100, severe headache reported." },
  { id: 2, name: "Radha Sahu", age: 19, condition: "Pregnant 28 weeks", village: "Kesinga", ashaAssigned: "Meera Singh", riskLevel: "MEDIUM", lastVisit: "1 week ago", nextVisit: "Apr 18, 2026", details: "Slight anemia, advised iron supplements." },
  { id: 3, name: "Lakshmi Prasad", age: 45, condition: "Diabetic", village: "Phulbani", ashaAssigned: "Anita Pal", riskLevel: "MEDIUM", lastVisit: "3 days ago", nextVisit: "Apr 15, 2026", details: "Fasting sugar 140 mg/dL." },
  { id: 4, name: "Geeta Mandal", age: 52, condition: "Hypertension", village: "Bhawanipatna", ashaAssigned: "Savitri Devi", riskLevel: "HIGH", lastVisit: "5 days ago", nextVisit: "Apr 11, 2026", details: "BP 150/95, missed medication last week." },
  { id: 5, name: "Raman Babu", age: 58, condition: "Diabetic+Hypertension", village: "Junagarh", ashaAssigned: "Anita Pal", riskLevel: "CRITICAL", lastVisit: "Yesterday", nextVisit: "Apr 10, 2026", details: "Uncontrolled sugar, foot ulcer developing." },
  { id: 6, name: "Kavitha Rao", age: 28, condition: "Pregnant 36 weeks", village: "Bhawanipatna", ashaAssigned: "Savitri Devi", riskLevel: "LOW", lastVisit: "1 week ago", nextVisit: "Apr 20, 2026", details: "Healthy progression." },
  { id: 7, name: "Ananya Behera", age: 0, condition: "Newborn (4 days)", village: "Phulbani", ashaAssigned: "Meera Singh", riskLevel: "HIGH", lastVisit: "Today", nextVisit: "Apr 11, 2026", details: "Not feeding well, slight jaundice." },
  { id: 8, name: "Baby of Priya", age: 0, condition: "Newborn (2 days)", village: "Kesinga", ashaAssigned: "Lakshmi Behera", riskLevel: "CRITICAL", lastVisit: "Today", nextVisit: "Apr 10, 2026", details: "Fever 39C, lethargic." },
  { id: 9, name: "Saraswati Devi", age: 31, condition: "Pregnant 20 weeks", village: "Phulbani", ashaAssigned: "Meera Singh", riskLevel: "LOW", lastVisit: "2 weeks ago", nextVisit: "Apr 22, 2026", details: "Regular checkup normal." },
  { id: 10, name: "Durga Nayak", age: 38, condition: "Pregnant 34 weeks", village: "Junagarh", ashaAssigned: "Lakshmi Behera", riskLevel: "MEDIUM", lastVisit: "4 days ago", nextVisit: "Apr 14, 2026", details: "Hb 9.5, advised diet change." },
  { id: 11, name: "Meena Sahu", age: 44, condition: "Diabetic", village: "Kesinga", ashaAssigned: "Anita Pal", riskLevel: "LOW", lastVisit: "2 weeks ago", nextVisit: "May 1, 2026", details: "Sugar controlled with medication." },
  { id: 12, name: "Champa Majhi", age: 22, condition: "Pregnant 40 weeks", village: "Bhawanipatna", ashaAssigned: "Savitri Devi", riskLevel: "HIGH", lastVisit: "Yesterday", nextVisit: "Apr 10, 2026", details: "Past due date, monitoring for labor signs." },
  { id: 13, name: "Baby Ravi", age: 0, condition: "Newborn (7 days)", village: "Junagarh", ashaAssigned: "Lakshmi Behera", riskLevel: "MEDIUM", lastVisit: "3 days ago", nextVisit: "Apr 13, 2026", details: "Feeding improved, weight stable." },
  { id: 14, name: "Basanti Soren", age: 48, condition: "Hypertension", village: "Phulbani", ashaAssigned: "Anita Pal", riskLevel: "MEDIUM", lastVisit: "1 week ago", nextVisit: "Apr 17, 2026", details: "BP 135/85, continuing current dose." },
];

const successResponse = <T>(data: T) => ({
  success: true,
  data,
  timestamp: new Date().toISOString(),
});

// ─── GET /api/patients ────────────────────────────────────────────────────────
// Query params: ?risk=LOW|MEDIUM|HIGH|CRITICAL  (optional filter)
router.get("/", (req, res) => {
  const { risk } = req.query;
  let result = mockPatients;

  if (risk && typeof risk === "string") {
    result = mockPatients.filter(
      (p) => p.riskLevel === risk.toUpperCase()
    );
  }

  logger.info({ count: result.length, risk }, "GET /api/patients");
  res.json(successResponse(result));
});

// ─── GET /api/patients/:id ────────────────────────────────────────────────────
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const patient = mockPatients.find((p) => p.id === id);

  if (!patient) {
    res.status(404).json({
      success: false,
      code: "PATIENT_NOT_FOUND",
      message: `Patient with id ${id} not found`,
    });
    return;
  }

  logger.info({ id }, "GET /api/patients/:id");
  res.json(successResponse(patient));
});

export default router;
