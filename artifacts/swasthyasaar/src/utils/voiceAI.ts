export type AIResponse = {
  condition: string;
  riskLevel: string;
  immediateAction: string;
  dangerSigns: string[];
  steps: string[];
};

export const responses: Record<string, AIResponse> = {
  maternalHighRisk: {
    condition: "High-Risk Pregnancy (Possible Preeclampsia)",
    riskLevel: "CRITICAL",
    immediateAction: "Refer to PHC within 2 hours",
    dangerSigns: ["Headache", "Edema", "8th month pregnancy"],
    steps: [
      "1. Check BP immediately (target <140/90)",
      "2. Ask about vision changes and abdominal pain",
      "3. Arrange urgent referral to PHC",
      "4. Do not delay — preeclampsia is life-threatening"
    ]
  },
  newbornCritical: {
    condition: "Sick Newborn — Possible Neonatal Sepsis",
    riskLevel: "CRITICAL",
    immediateAction: "Refer to hospital IMMEDIATELY",
    dangerSigns: ["High fever", "Not feeding", "Newborn < 7 days"],
    steps: [
      "1. Keep baby warm and wrapped",
      "2. Do NOT give any medications",
      "3. Call 108 ambulance immediately",
      "4. Notify facility before arrival"
    ]
  },
  ncdMedium: {
    condition: "Uncontrolled Diabetes Risk",
    riskLevel: "MEDIUM",
    immediateAction: "Schedule PHC visit within 3 days",
    dangerSigns: ["Missed medication", "Blood sugar likely elevated"],
    steps: [
      "1. Check blood sugar if glucometer available",
      "2. Counsel on medication adherence",
      "3. Schedule PHC visit in 3 days",
      "4. Dietary counseling — reduce sugar/rice intake"
    ]
  },
  default: {
    condition: "General Assessment Needed",
    riskLevel: "LOW",
    immediateAction: "Proceed with standard checkup",
    dangerSigns: ["None clearly identified"],
    steps: [
      "1. Complete full health questionnaire",
      "2. Update patient records",
      "3. Schedule regular follow-up"
    ]
  }
};

export function parseVoiceInput(transcript: string): AIResponse {
  const text = transcript.toLowerCase();
  
  if (text.includes("pregnant") && (text.includes("headache") || text.includes("swelling") || text.includes("preeclampsia") || text.includes("bp"))) {
    return responses.maternalHighRisk;
  }
  
  if ((text.includes("newborn") || text.includes("baby")) && (text.includes("fever") || text.includes("not feeding") || text.includes("feeding"))) {
    return responses.newbornCritical;
  }
  
  if ((text.includes("diabetic") || text.includes("diabetes")) && text.includes("missed")) {
    return responses.ncdMedium;
  }
  
  return responses.default;
}
