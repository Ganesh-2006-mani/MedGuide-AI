import React from "react";
import { Info, ShieldCheck, Cpu, UserCheck } from "lucide-react";

export default function About() {
  return (
    <div className="space-y-8" id="about-view-container">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Info className="h-5 w-5 text-emerald-500 dark:text-cyan-400" />
          About MedGuide AI
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          An AI-powered clinical metadata assessment tool built for health literacy.
        </p>
      </div>

      {/* Hero card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-br from-emerald-500/5 to-teal-500/5 p-6 md:p-8 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl -mr-36 -mt-36"></div>
        
        <div className="max-w-2xl space-y-4">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-cyan-400 border border-emerald-500/20 text-[10px] uppercase font-bold tracking-widest inline-block">
            Mission Statement
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
            Bridging the gap between medical symptoms and patient education.
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            MedGuide AI was conceived as an intelligent, safe, and easily digestible symptom checker interface. The goal is to discourage self-medication and promote timely medical consultations by providing clear, patient-friendly information based on systemic patterns.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            By analyzing reported parameters like duration, severity, existing medical backgrounds, and vitals, we use structured AI responses to construct helpful educational report templates for people to use when discussing health questions with their physicians.
          </p>
        </div>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs p-5 space-y-3 dark:border-slate-800 dark:bg-slate-900/20">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-cyan-500/10 dark:text-cyan-400">
            <Cpu className="h-5 w-5" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">Advanced Pattern Parsing</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Uses secure Google Gemini models optimized with customized system prompts to match reported complaints against peer-reviewed health concepts safely.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-xs p-5 space-y-3 dark:border-slate-800 dark:bg-slate-900/20">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">Privacy & Safety First</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            We explicitly guard against prescribing medicines or suggesting dangerous dosages. Your inputs never persist outside your browser's local sandbox storage.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-xs p-5 space-y-3 dark:border-slate-800 dark:bg-slate-900/20">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600">
            <UserCheck className="h-5 w-5" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">Actionable Reports</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Generate clean, organized report sheets which can be copied, printed, or exported as PDF to streamline clinical discussions with your family doctor.
          </p>
        </div>
      </div>

      {/* Educational Guideline Reminder */}
      <div className="rounded-xl bg-slate-50/50 border border-slate-200 p-5 space-y-2 dark:bg-slate-900/40 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">Important Advisory Note</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Artificial intelligence models are probabilistic sequence predictors and are susceptible to hallucinations, incomplete literature representation, and contextual limitations. Never delay critical diagnosis, suspend medications, or purchase remedies without a written prescription or direct advice from certified health services.
        </p>
      </div>
    </div>
  );
}
