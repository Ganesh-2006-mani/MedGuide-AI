import React from "react";
import { ShieldCheck, EyeOff, KeyRound, Globe } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="space-y-6" id="privacy-policy-container">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-500 dark:text-cyan-400" />
          Privacy Policy
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Learn about our strict data protection standards, client-only history, and server-side safety protocols.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 space-y-6 text-sm text-slate-600 dark:text-slate-300 dark:border-slate-800 dark:bg-slate-900/40 shadow-xs leading-relaxed">
        <div>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-cyan-400 uppercase tracking-widest font-mono">Last Updated: June 2026</span>
          <h3 className="text-md font-bold text-slate-900 dark:text-white mt-1 mb-2">Our Commitment to Patient Confidentiality</h3>
          <p>
            MedGuide AI values your privacy above all else. Unlike standard commercial portals, this application does not implement tracking cookies, does not log permanent clinical histories, does not build user accounts, and does not sell marketing metrics to third-party underwriters.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50/50 border border-slate-100 p-4 space-y-2 dark:bg-slate-950/40 dark:border-slate-800">
            <EyeOff className="h-5 w-5 text-emerald-500 dark:text-cyan-400" />
            <h4 className="font-semibold text-slate-800 dark:text-white text-xs">No Account Required</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              You do not have to register with an email address or connect social logins. Demographics can be completed anonymously.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50/50 border border-slate-100 p-4 space-y-2 dark:bg-slate-950/40 dark:border-slate-800">
            <KeyRound className="h-5 w-5 text-emerald-500 dark:text-cyan-400" />
            <h4 className="font-semibold text-slate-800 dark:text-white text-xs">Local Search History</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Symptom histories are stored purely within your own client browser via <span className="font-mono text-[10px]">localStorage</span>. It never leaves your device unless you request to print or save.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50/50 border border-slate-100 p-4 space-y-2 dark:bg-slate-950/40 dark:border-slate-800">
            <Globe className="h-5 w-5 text-emerald-500 dark:text-cyan-400" />
            <h4 className="font-semibold text-slate-800 dark:text-white text-xs">Secure Server Transit</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Questionnaire responses are transmitted to the secure Express backend using SSL encryption. The data is parsed into prompt constructs and is never logged to disk on our servers.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6 space-y-4">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">1. Information Collection & Use</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Any values typed into the symptoms list (age, gender, reported allergies, current medications, duration) are temporarily parsed to compile an instruction block passed to the Google Gemini AI Model. Once the model outputs its response structure, the raw form data is wiped from active memory.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">2. Children's Privacy</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              This application is designed strictly for educational training, clinical reference, and medical study guides. It should not be used by unsupervised children under the age of 18.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">3. Updates to this Policy</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              We may update this protocol periodically to reflect improvements in API transport privacy and sandbox parameters. Reviewing this screen periodically keeps you informed of your data's sandboxed environment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
