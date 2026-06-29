export interface SymptomFormInput {
  name?: string;
  age: number;
  gender: string;
  height?: string;
  weight?: string;
  country?: string;
  conditions?: string;
  medications?: string;
  allergies?: string;
  pregnant?: string; // "yes" | "no" | "n/a"
  duration: string;
  severity: string;
  temperature?: string;
  bloodPressure?: string;
  heartRate?: string;
  symptomDescription: string;
}

export interface PossibleCondition {
  name: string;
  explanation: string;
  why_match: string;
}

export interface SymptomAnalysisResult {
  summary: string;
  possible_conditions: PossibleCondition[];
  confidence: "Low" | "Medium" | "High";
  reasoning: string;
  common_causes: string[];
  self_care: string[];
  specialist: string;
  seek_medical_care: string;
  emergency: string;
  prevention: string[];
  disclaimer: string;
  isLocalFallback?: boolean;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  input: SymptomFormInput;
  result: SymptomAnalysisResult;
  isEmergency: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}
