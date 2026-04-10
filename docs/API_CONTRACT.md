# SwasthyaSaar API Contract

This document outlines the API endpoints, expected request payloads, and response structures for interaction between the Frontend UI and Backend Services.

**Base URL:** `/api`

### Common Types & Wrappers

All standard API success responses are wrapped in:
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-04-10T00:00:00.000Z"
}
```

Standard Error Responses:
```json
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "Human readable error message"
}
```

---

## Patients API

### 1. `GET /patients`
Retrieve a list of patients.
**Query Parameters:**
- `risk` (optional): Filter by risk level (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`)

**Response (`data` payload):** Array of Patient objects.
```json
[
  {
    "id": 0,
    "name": "Sunita Devi",
    "age": 24,
    "condition": "Pregnant 32 weeks",
    "village": "Phulbani",
    "ashaAssigned": "Meera Singh",
    "riskLevel": "HIGH",
    "lastVisit": "2 days ago",
    "nextVisit": "Apr 12, 2026",
    "details": "High blood pressure observed. Requires close monitoring."
  }
]
```

### 2. `GET /patients/:id`
Retrieve a single patient by ID.

**Response (`data` payload):** Single Patient object.

---

## Assessments API

### 3. `POST /assess/voice`
Analyze a local voice transcript for risk classification.

**Request Payload:**
```json
{
  "transcript": "Patient is 8th month pregnant with severe headache and swelling..."
}
```

**Response (`data` payload):** Voice AI analysis result
```json
{
  "condition": "High-Risk Pregnancy (Possible Preeclampsia)",
  "riskLevel": "CRITICAL",
  "immediateAction": "Refer to PHC within 2 hours",
  "dangerSigns": ["Headache", "Edema", "8th month pregnancy"],
  "steps": [
    "1. Check BP immediately (target <140/90)"
  ]
}
```

### 4. `POST /assess/maternal`
Calculate maternal health risk score.

**Request Payload:**
```json
{
  "age": 24,
  "hemoglobin": 9.5,
  "systolicBp": 145,
  "ancVisits": 2,
  "dangerSigns": ["Headache"],
  "previousComplications": false,
  "distanceToPhc": 15
}
```

**Response (`data` payload):**
```json
{
  "score": 65,
  "level": "HIGH"
}
```

### 5. `POST /assess/ncd`
Calculate non-communicable disease (NCD) risk score.

**Request Payload:**
```json
{
  "fastingSugar": 140,
  "systolicBp": 150,
  "age": 52,
  "smoking": false,
  "familyHistory": ["Diabetes"],
  "physicalActivity": "Low"
}
```

**Response (`data` payload):**
```json
{
  "score": 75,
  "level": "HIGH"
}
```

### 6. `POST /assess/newborn`
Calculate newborn health risk score.

**Request Payload:**
```json
{
  "temperature": 39,
  "feeding": "Not feeding",
  "abnormalBreathing": true,
  "skinColor": "Pale",
  "weight": 2.5
}
```

**Response (`data` payload):**
```json
{
  "score": 85,
  "level": "CRITICAL"
}
```

### 7. `POST /assessments`
Persist an assessment analysis to the database.

**Request Payload:**
```json
{
  "patientId": 1,
  "transcript": "Fever and cough",
  "analysis": { ... } // Any analysis object 
}
```

**Response (`data` payload):**
```json
{
  "savedId": "assessment-1712750000000"
}
```
