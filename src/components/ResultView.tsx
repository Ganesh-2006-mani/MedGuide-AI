import React, { useRef } from "react";
import { SymptomAnalysisResult, SymptomFormInput } from "../types";
import { 
  FileText, Copy, Printer, Check, AlertTriangle, 
  HelpCircle, Sparkles, Shield, User, Heart, Clock, LogOut, ArrowLeft 
} from "lucide-react";

interface ResultViewProps {
  result: SymptomAnalysisResult;
  input: SymptomFormInput;
  isEmergency: boolean;
  onBack: () => void;
}

export default function ResultView({ result, input, isEmergency, onBack }: ResultViewProps) {
  const [copied, setCopied] = React.useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    try {
      const conditionsStr = result.possible_conditions
        .map((c) => `- ${c.name}: ${c.explanation} (Why match: ${c.why_match})`)
        .join("\n");

      const text = `
AI MEDICAL SYMPTOM ASSESSMENT REPORT (EDUCATIONAL ONLY)
------------------------------------------------------
Patient Summary:
Name: ${input.name || "Anonymous"}
Age: ${input.age} | Gender: ${input.gender}
Duration: ${input.duration} | Severity: ${input.severity}
Symptom Description: ${input.symptomDescription}

AI Symptom Summary:
${result.summary}

Confidence Match: ${result.confidence}
Explanation: ${result.reasoning}

Possible Conditions matching symptoms:
${conditionsStr}

Common Causes & Triggers:
${result.common_causes.map((c) => `- ${c}`).join("\n")}

Self-Care Recommendations:
${result.self_care.map((s) => `- ${s}`).join("\n")}

Recommended Specialist: ${result.specialist}
When to Seek Professional Medical Care: ${result.seek_medical_care}

Emergency Warning Signs:
${result.emergency}

Prevention & Wellness Tips:
${result.prevention.map((p) => `- ${p}`).join("\n")}

Disclaimer:
${result.disclaimer}
------------------------------------------------------
This information is for educational purposes only and is not a medical diagnosis. Always consult a qualified healthcare professional.
`;
      await navigator.clipboard.writeText(text.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy report", err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Elegant browser print-to-PDF approach: trigger standard window print which is styled beautifully for PDF export via CSS print media
    window.print();
  };

  // Map confidence level to specific styling classes
  const getConfidenceBadgeColor = (level: string) => {
    const l = level.toLowerCase();
    if (l.includes("high")) return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
    if (l.includes("med")) return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    return "bg-slate-500/10 text-slate-400 border-slate-700";
  };

  return (
    <div className="space-y-6" id="result-view-container">
      {/* Back navigation & Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
          id="btn-back-to-checker"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Symptom Questionnaire
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
            id="btn-copy-results"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                Copied Report!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-400" />
                Copy Text
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
            id="btn-print-results"
          >
            <Printer className="h-3.5 w-3.5 text-slate-400" />
            Print Report
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-2 text-xs font-semibold text-white hover:from-emerald-500 hover:to-teal-500 transition-all shadow-xs cursor-pointer"
            id="btn-pdf-results"
          >
            <FileText className="h-3.5 w-3.5 text-emerald-200" />
            Save as PDF
          </button>
        </div>
      </div>

      {/* EMERGENCY HIGHLIGHT BANNER */}
      {isEmergency && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400 shadow-lg">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 animate-pulse text-red-500" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-400">Critical Priority Marker Detected</h4>
              <p className="mt-1 text-xs text-red-200/80">
                You described symptoms associated with medical emergencies. If your condition worsens or you feel severe discomfort, please consult urgent healthcare providers immediately.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FALLBACK MODE BANNER */}
      {result.isLocalFallback && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-emerald-800 dark:text-emerald-300 shadow-xs">
          <div className="flex gap-3">
            <Sparkles className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Offline Fallback Engaged</h4>
              <p className="mt-1 text-xs text-emerald-800/80 dark:text-emerald-300/80">
                Our AI model server is currently experiencing exceptionally high demand. To provide you with immediate educational guidance without any interruption, we activated MedGuide's secure, offline clinical pattern parsing engine.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE ASSESSMENT REPORT */}
      <div 
        ref={reportRef} 
        className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-8 dark:border-slate-800 dark:bg-slate-900/40 backdrop-blur-sm print:border-none print:bg-white print:text-black print:p-0 print:shadow-none"
        id="printable-symptom-report"
      >
        {/* Report Header */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-6 print:border-slate-300">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[10px] uppercase font-bold tracking-widest mb-2 inline-block print:bg-slate-100 print:text-slate-800 print:border-slate-300">
                Symptom Checker Report
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white print:text-slate-900">
                Educational Assessment Report
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 print:text-slate-600">
                Generated via MedGuide AI on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-1">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getConfidenceBadgeColor(result.confidence)}`}>
                Pattern Match: {result.confidence}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider mt-1 block print:text-slate-500">
                Confidence Level
              </span>
            </div>
          </div>
        </div>

        {/* Part 1: Patient Summary */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-4 bg-slate-50/80 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 space-y-3 print:bg-slate-50 print:border-slate-200 print:text-slate-900">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 print:text-slate-700">
              <User className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
              Patient Metrics
            </h3>
            <div className="text-xs space-y-2 text-slate-600 dark:text-slate-300 print:text-slate-800">
              <p><strong className="text-slate-500 dark:text-slate-400 print:text-slate-600 font-medium">Name:</strong> {input.name || "Anonymous"}</p>
              <p><strong className="text-slate-500 dark:text-slate-400 print:text-slate-600 font-medium">Age:</strong> {input.age} years</p>
              <p><strong className="text-slate-500 dark:text-slate-400 print:text-slate-600 font-medium">Gender:</strong> {input.gender}</p>
              <p><strong className="text-slate-500 dark:text-slate-400 print:text-slate-600 font-medium">Duration:</strong> {input.duration}</p>
              <p><strong className="text-slate-500 dark:text-slate-400 print:text-slate-600 font-medium">Severity:</strong> {input.severity}</p>
              {input.country && <p><strong className="text-slate-500 dark:text-slate-400 print:text-slate-600 font-medium">Location:</strong> {input.country}</p>}
              {input.pregnant && input.pregnant !== "n/a" && (
                <p><strong className="text-slate-500 dark:text-slate-400 print:text-slate-600 font-medium">Pregnancy status:</strong> {input.pregnant === "yes" ? "Pregnant" : "Not pregnant"}</p>
              )}
            </div>
            
            {/* Vitals subpanel */}
            {(input.temperature || input.bloodPressure || input.heartRate) && (
              <div className="border-t border-slate-100 dark:border-slate-800 mt-3 pt-3 space-y-1.5 print:border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Vital Signs Reported</span>
                <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300 print:text-slate-800">
                  {input.temperature && <p><span className="text-slate-500 dark:text-slate-400 font-medium">Temp:</span> {input.temperature}</p>}
                  {input.bloodPressure && <p><span className="text-slate-500 dark:text-slate-400 font-medium">BP:</span> {input.bloodPressure}</p>}
                  {input.heartRate && <p><span className="text-slate-500 dark:text-slate-400 font-medium">Pulse:</span> {input.heartRate}</p>}
                </div>
              </div>
            )}

            {/* Medical context */}
            {(input.conditions || input.medications || input.allergies) && (
              <div className="border-t border-slate-100 dark:border-slate-800 mt-3 pt-3 space-y-2 print:border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Background Details</span>
                <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300 print:text-slate-800">
                  {input.conditions && <p><strong className="text-slate-500 dark:text-slate-400">Conditions:</strong> {input.conditions}</p>}
                  {input.medications && <p><strong className="text-slate-500 dark:text-slate-400">Medications:</strong> {input.medications}</p>}
                  {input.allergies && <p><strong className="text-slate-500 dark:text-slate-400">Allergies:</strong> {input.allergies}</p>}
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-8 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 print:text-slate-700">
                Reported Description
              </h3>
              <div className="rounded-xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/60 p-4 text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed print:bg-slate-50 print:border-slate-200 print:text-slate-900">
                "{input.symptomDescription}"
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 print:text-slate-700">
                Symptom Summary
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed print:text-slate-900">
                {result.summary}
              </p>
            </div>
          </div>
        </div>

        {/* Part 2: Possible Conditions Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 print:text-slate-700 print:border-slate-300">
            Possible Conditions & Patient Match Insights
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {result.possible_conditions.map((condition, idx) => (
              <div 
                key={idx} 
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-4 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors print:border-slate-200 print:bg-slate-50"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 print:text-slate-900">{condition.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed print:text-slate-700">{condition.explanation}</p>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2 mt-2 print:border-slate-200">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono tracking-tight block uppercase font-bold mb-1 print:text-cyan-600">Why Symptoms Match:</span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed print:text-slate-800">"{condition.why_match}"</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 italic mt-1.5 leading-normal print:text-slate-600">
            * Only a licensed physician can diagnose medical conditions. This list is an educational summary of patterns matching literature sources, and does not represent an exhaustive or conclusive clinical diagnosis.
          </p>
        </div>

        {/* Part 3: Causes, Self-Care, Next Steps */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 border-t border-slate-100 dark:border-slate-800 pt-6 print:border-slate-300">
          {/* Actionable Next Steps / Consult Info */}
          <div className="bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 space-y-4 print:bg-slate-50 print:border-slate-200">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider print:text-slate-700 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
              Next Consult Steps
            </h3>
            
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Recommended Specialist</span>
                <p className="text-xs text-slate-700 dark:text-slate-200 font-semibold print:text-slate-900 mt-0.5">{result.specialist || "Primary Care Physician"}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">When to Seek Medical Care</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed print:text-slate-800 mt-0.5">{result.seek_medical_care}</p>
              </div>
            </div>
          </div>

          {/* Self-Care Advice */}
          <div className="bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 space-y-4 print:bg-slate-50 print:border-slate-200">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider print:text-slate-700 flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
              General Self-Care Tips
            </h3>
            
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 print:text-slate-800">
              {result.self_care.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5"></span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Causes / Triggers */}
          <div className="bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 space-y-4 print:bg-slate-50 print:border-slate-200">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider print:text-slate-700 flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
              Possible Common Causes
            </h3>
            
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 print:text-slate-800">
              {result.common_causes.map((cause, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-600 shrink-0 mt-1.5"></span>
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Part 4: Prevention */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-3 print:border-slate-300">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider print:text-slate-700">
            Prevention & Long-term Wellness Guidelines
          </h3>
          <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {result.prevention.map((tip, idx) => (
              <li 
                key={idx} 
                className="flex items-start gap-2.5 rounded-lg bg-slate-50/80 dark:bg-slate-950/20 p-2.5 text-xs text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800/40 print:bg-slate-50 print:border-slate-200 print:text-slate-900"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold text-[10px] print:bg-slate-200 print:text-slate-800">
                  {idx + 1}
                </div>
                <span className="leading-normal">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Part 5: Specific Critical Indicators / Emergency warning */}
        {result.emergency && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-300 space-y-1.5 print:border-slate-300 print:bg-slate-50 print:text-red-900">
            <h4 className="font-bold uppercase tracking-wider text-red-400 print:text-red-800">Emergency Red Flag Warnings</h4>
            <p className="leading-relaxed">{result.emergency}</p>
          </div>
        )}

        {/* Part 6: Clinical Educational Disclaimer */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 print:border-slate-300 print:text-slate-600">
          <p className="font-bold text-slate-600 dark:text-slate-400 uppercase mb-1.5 print:text-slate-800">
            🚨 MANDATORY MEDICAL DISCLAIMER
          </p>
          <p className="mb-2">
            This symptom assessment summary was generated by artificial intelligence for **EDUCATIONAL PURPOSES ONLY**. It is not a clinical or diagnostic tool. This application is not a substitute for professional medical care, physical examination, diagnostic triage, or active healthcare intervention.
          </p>
          <p className="mb-2">
            <strong>NEVER</strong> ignore professional medical advice, delay booking appointments, or alter treatment regimens or medications based on outputs generated by this system. If you are experiencing serious pain, respiratory difficulty, cardiovascular discomfort, or allergic reactions, seek immediate emergency clinical assistance immediately.
          </p>
          <p className="italic text-slate-500 dark:text-slate-400/80 print:text-slate-700">
            "{result.disclaimer}"
          </p>
        </div>
      </div>
    </div>
  );
}
