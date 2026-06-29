import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, ShieldAlert, Sparkles, BookOpen } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      category: "Accuracy & Purpose",
      question: "Can MedGuide AI diagnose my medical condition?",
      answer: "No, absolutely not. MedGuide AI is strictly an educational tool designed to analyze common medical trends and symptom combinations in literature. It does not possess medical certification, cannot run clinical tests, cannot diagnose any condition, and should never replace a professional examination by a certified physician.",
    },
    {
      category: "Accuracy & Purpose",
      question: "How reliable are the 'possible conditions' returned?",
      answer: "The outputs represent common associations described in medical texts. Symptoms alone are rarely sufficient for an accurate diagnosis, as completely benign issues can mimic serious conditions and vice versa. This analysis represents matching pattern confidence (low, medium, or high) rather than clinical certainty.",
    },
    {
      category: "Safety & Emergencies",
      question: "What should I do if my symptoms are flagged as an emergency?",
      answer: "If the symptom checker displays an emergency warning, or if you are experiencing chest pain, difficulty breathing, severe bleeding, or sudden confusion, you must stop seeking online evaluations immediately. Call your local emergency services (e.g. 911) or proceed to the nearest emergency clinic without delay.",
    },
    {
      category: "Data Privacy",
      question: "How is my personal and medical data handled?",
      answer: "We prioritize patient security. All values supplied in the questionnaire are processed server-side strictly to generate your analysis prompt via secure API calls. Your medical history and report details are stored strictly in your browser's local storage and are never sold, rented, or distributed. You can clear your history or clear the questionnaire at any time.",
    },
    {
      category: "Consultations",
      question: "How should I use the printed report or saved PDF?",
      answer: "The printed report serves as an educational reference. You can share it with your primary care provider or specialist to help organize your symptoms, describe when they started, list their duration and severity, and facilitate an informed conversation during your next physical checkup.",
    },
    {
      category: "Technical",
      question: "What technology powers MedGuide AI?",
      answer: "This application runs a full-stack architecture powered by React with Vite on the frontend and Express on the backend, secured with Google Gemini generative models to match clinical indicators safely against standard educational medical guidelines.",
    }
  ];

  return (
    <div className="space-y-6" id="faq-view-container">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-emerald-500 dark:text-cyan-400" />
          Frequently Asked Questions
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Learn how to safely utilize MedGuide AI as an educational asset.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Safe Usage Alert */}
        <div className="md:col-span-4 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs dark:border-slate-800 dark:bg-slate-900/40">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-emerald-500 dark:text-cyan-400" />
              Educational Guideline
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Medical algorithms should never be used as a singular checkpoint for health concerns. Health decisions are highly individual and rely on your background medical conditions, family genetics, medications, and age.
            </p>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Key Checklist</span>
              <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-cyan-500"></span>
                  Educate on possible categories
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-cyan-500"></span>
                  Collect history for your doctor
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-cyan-500"></span>
                  Never self-treat or adjust medications
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs dark:border-slate-800 dark:bg-slate-900/40">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-500 dark:text-cyan-400" />
              Health Literacy
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              We recommend researching symptoms with authoritative sources such as the World Health Organization (WHO), CDC, or Mayo Clinic.
            </p>
          </div>
        </div>

        {/* FAQs */}
        <div className="md:col-span-8 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs dark:border-slate-800 dark:bg-slate-900/20"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-medium text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-200 dark:hover:text-white dark:hover:bg-slate-900/40 transition-all cursor-pointer"
                  id={`faq-btn-${idx}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5">
                    <span className="text-[9px] w-fit uppercase font-bold tracking-wider text-emerald-600 bg-emerald-500/10 dark:text-cyan-400 dark:bg-cyan-500/10 px-1.5 py-0.5 rounded font-mono">
                      {faq.category}
                    </span>
                    <span className="text-slate-800 dark:text-white text-sm font-semibold">{faq.question}</span>
                  </div>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </button>

                {isOpen && (
                  <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/20 text-xs text-slate-600 dark:text-slate-300 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
