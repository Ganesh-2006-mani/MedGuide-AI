import React, { useState } from "react";
import { PhoneCall, Mail, MessageSquare, AlertCircle, CheckCircle } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="space-y-6" id="contact-view-container">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <PhoneCall className="h-5 w-5 text-emerald-500 dark:text-cyan-400" />
          Contact & Helplines
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Have feedback or need immediate assistance? Find contact channels below.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Support channels & emergency phone list */}
        <div className="md:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/40">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 animate-pulse" />
              Emergency Health Lines
            </h3>
            
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              If you require emergency help, please contact immediate first-responders rather than waiting for support replies.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 dark:bg-slate-950/50 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-white block">United States & Canada</span>
                <span className="text-rose-600 dark:text-red-400 font-bold block mt-0.5">Call 911 (Emergencies)</span>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] mt-0.5">Call 988 (Crisis Support Line)</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 dark:bg-slate-950/50 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-white block">United Kingdom</span>
                <span className="text-rose-600 dark:text-red-400 font-bold block mt-0.5">Call 999 (Emergencies)</span>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] mt-0.5">Call 111 (NHS Non-emergency Medical Advisor)</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 dark:bg-slate-950/50 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-white block">Australia</span>
                <span className="text-rose-600 dark:text-red-400 font-bold block mt-0.5">Call 000 (Emergencies)</span>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] mt-0.5">Call 13 11 14 (Lifeline Australia)</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs dark:border-slate-800 dark:bg-slate-900/20">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <Mail className="h-4 w-4 text-emerald-500 dark:text-cyan-400" />
              Administrative Support
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              For academic research inquiries, engineering collaboration, or feedback regarding our symptom model prompts, please email our education board.
            </p>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              support@medguide-ai.educational
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-xs dark:border-slate-800 dark:bg-zinc-900/50 backdrop-blur-xs">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <MessageSquare className="h-4 w-4 text-emerald-500 dark:text-cyan-400" />
            Send Feedback or Educational Inquiries
          </h3>

          {submitted && (
            <div className="mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-700 dark:text-emerald-400 flex items-start gap-3">
              <CheckCircle className="h-5 w-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <span className="font-bold text-sm block">Feedback Received Successfully</span>
                <span className="text-xs text-emerald-800 dark:text-emerald-300">Thank you for your valuable insight. Our educational coordinators will review your input.</span>
              </div>
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Your Name (Optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 dark:bg-zinc-950 px-3.5 py-2 text-sm text-slate-900 dark:text-white dark:border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-hidden transition-all placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Your Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 dark:bg-zinc-950 px-3.5 py-2 text-sm text-slate-900 dark:text-white dark:border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-hidden transition-all placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Message or Suggestion <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your comments regarding the educational checker experience here..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 dark:bg-zinc-950 px-3.5 py-2 text-sm text-slate-900 dark:text-white dark:border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-hidden transition-all placeholder-slate-400 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
              id="btn-submit-contact"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
