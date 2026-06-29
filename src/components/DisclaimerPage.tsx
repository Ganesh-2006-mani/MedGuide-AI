import React from "react";
import { FileText, AlertTriangle, HeartPulse } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="space-y-6" id="disclaimer-view-container">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-emerald-500 dark:text-cyan-400" />
          Full Medical Disclaimer
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Crucial safety and regulatory compliance guidelines regarding our educational model interface.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 space-y-6 text-sm text-slate-600 dark:text-slate-300 dark:border-slate-800 dark:bg-slate-900/40 shadow-xs leading-relaxed">
        
        {/* High visibility alert callout */}
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-600 dark:text-red-400">
          <div className="flex gap-3">
            <AlertTriangle className="h-6 w-6 shrink-0 text-red-500 animate-pulse" />
            <div>
              <h3 className="font-bold uppercase tracking-wider text-red-700 dark:text-red-400 text-sm">CRITICAL ADVISORY WARNING</h3>
              <p className="mt-1 text-xs text-red-800 dark:text-red-200/80 leading-relaxed font-semibold">
                THE OUTPUTS RENDERED BY THIS SYSTEM ARE PRODUCED BY AN ARTIFICIAL INTELLIGENCE MODEL. THEY DO NOT CONSTITUTE PROFESSIONAL CLINICAL DIAGNOSES, REASONED MEDICAL DIRECTIVES, TREATMENT PROTOCOLS, OR DOCTORS' ADVICE.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">1. Scope of Service</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              MedGuide AI is an interactive simulator designed for academic research, health literacy tutoring, and self-directed patient education. The analysis matches entered tokens against standard peer-reviewed literature and general categorical parameters. It is completely blind to physical signs, blood biomarkers, hereditary genetics, and precise patient contexts.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">2. Emergency Guidance</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              If you are facing critical indications—such as severe chest pain, extreme dyspnea (difficulty breathing), sudden hemi-paralysis, speech impairment, or heavy bleeding—do not engage with online algorithms. Proceed immediately to a hospital emergency department or call your country's emergency phone services immediately.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">3. Prescription Limitation Rules</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              This system is strictly configured to withhold any prescription recommendations, drug dosages, antibiotic guidance, or controlled drug recommendations. Any self-treatment initiated without certified physician approval is done so strictly at your own individual risk.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">4. Intellectual & Informational Accuracy</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              While we use state-of-the-art Google Gemini LLM configurations, medical science changes rapidly. Some records could be out-of-date, incomplete, or inappropriate for specific demographic brackets. Users should cross-reference findings with certified databases like PubMed, the FDA, or the National Institutes of Health.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-5 text-center text-xs text-slate-400">
          <HeartPulse className="h-5 w-5 mx-auto mb-2 text-emerald-500/50 dark:text-cyan-500/50" />
          Always trust licensed, clinical health services with your physical wellness.
        </div>
      </div>
    </div>
  );
}
