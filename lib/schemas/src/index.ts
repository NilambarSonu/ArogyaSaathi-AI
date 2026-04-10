import { z } from "zod";

// ─── Voice Assessment Schema ─────────────────────────────────────────────────
export const VoiceAssessmentSchema = z.object({
  transcript: z.string().min(1, "Transcript cannot be empty"),
});

// ─── Maternal Assessment Schema ──────────────────────────────────────────────
export const MaternalAssessmentSchema = z.object({
  age: z.number().int().positive().optional(),
  hemoglobin: z.number().positive().optional(),
  systolicBp: z.number().positive().optional(),
  ancVisits: z.number().int().nonnegative().optional(),
  dangerSigns: z.array(z.string()).optional(),
  previousComplications: z.boolean().optional(),
  distanceToPhc: z.number().nonnegative().optional(),
});

// ─── NCD Assessment Schema ───────────────────────────────────────────────────
export const NcdAssessmentSchema = z.object({
  fastingSugar: z.number().positive().optional(),
  systolicBp: z.number().positive().optional(),
  age: z.number().int().positive().optional(),
  smoking: z.boolean().optional(),
  familyHistory: z.array(z.string()).optional(),
  physicalActivity: z.enum(["Low", "Moderate", "High", "Sedentary"]).optional(),
});

// ─── Newborn Assessment Schema ───────────────────────────────────────────────
export const NewbornAssessmentSchema = z.object({
  temperature: z.number().positive().optional(),
  feeding: z.string().optional(),
  abnormalBreathing: z.boolean().optional(),
  skinColor: z.string().optional(),
  weight: z.number().positive().optional(),
});

// ─── General Report/Assessment Save Schema ────────────────────────────────────
export const SaveAssessmentSchema = z.object({
  patientId: z.number(),
  transcript: z.string(),
  analysis: z.any(),
});
