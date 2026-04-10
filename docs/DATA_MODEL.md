# Database Data Model Suggestion

This document outlines the recommended relational schema entities and their core relationships to guide the backend implementation.

## 1. `users`
Represents generic system users (Admin, Doctor, etc.)
- `id` (PK, uuid)
- `name` (varchar)
- `email` (varchar), unique
- `role` (enum: 'ADMIN', 'DOCTOR', 'ASHA')
- `created_at` (timestamp)

## 2. `asha_workers`
Details specific to ASHA workers in the field.
- `id` (PK, uuid)
- `user_id` (FK -> users.id, unique)
- `village` (varchar)
- `status` (enum: 'ACTIVE', 'INACTIVE')
- `assigned_device_id` (varchar)

## 3. `patients`
Beneficiaries receiving care.
- `id` (PK, uuid)
- `asha_id` (FK -> asha_workers.id)
- `name` (varchar)
- `age` (int)
- `condition` (varchar)
- `village` (varchar)
- `risk_level` (enum: 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL')
- `details` (text)
- `last_visit_at` (timestamp)
- `next_visit_at` (timestamp)

## 4. `assessments`
Individual screening records for patients.
- `id` (PK, uuid)
- `patient_id` (FK -> patients.id)
- `asha_id` (FK -> asha_workers.id)
- `type` (enum: 'MATERNAL', 'NCD', 'NEWBORN', 'GENERAL')
- `transcript` (text, nullable)
- `calculated_score` (int)
- `risk_level` (enum: 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL')
- `raw_data` (jsonb) - *stores exact answers like blood pressure, hemoglobin based on assessment type*
- `created_at` (timestamp)

## 5. `referrals`
Escalations of patients to Primary Health Centers (PHCs).
- `id` (PK, uuid)
- `patient_id` (FK -> patients.id)
- `assessment_id` (FK -> assessments.id, nullable)
- `referred_to_hub` (varchar)
- `reason` (text)
- `urgency` (enum: 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL')
- `status` (enum: 'PENDING', 'ACCEPTED', 'RESOLVED')
- `progress` (int)
- `created_at` (timestamp)

## 6. `analytics_snapshots`
Aggregated denormalized data for dashboards.
- `id` (PK, uuid)
- `month_key` (varchar) - e.g., '2026-04'
- `villages_covered` (int)
- `total_critical` (int)
- `total_high` (int)
- `condition_maternal` (int)
- `condition_ncd` (int)
- `condition_newborn` (int)

---

### Key Relationships
- An **ASHA Worker** manages many **Patients**.
- A **Patient** has many **Assessments**.
- A **Patient** has many **Referrals** (often linked to a specific High/Critical **Assessment**).
