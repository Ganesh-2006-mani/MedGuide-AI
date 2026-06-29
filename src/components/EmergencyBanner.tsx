import React from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";

interface EmergencyBannerProps {
  show: boolean;
}

export default function EmergencyBanner({ show }: EmergencyBannerProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mb-6 w-full overflow-hidden rounded-xl border border-red-200 bg-red-50 text-red-800 shadow-md dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400"
      id="emergency-alert-banner"
    >
      <div className="flex items-start p-4 md:p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 animate-pulse">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="flex items-center text-base font-bold tracking-tight text-red-900 dark:text-red-200">
            <AlertTriangle className="mr-1.5 h-4 w-4" />
            🚨 MEDICAL EMERGENCY WARNING
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-red-700 dark:text-red-300">
            These symptoms may indicate a serious medical emergency. Please seek
            <strong> immediate medical attention</strong> or contact your local
            emergency services (e.g., call 911 or visit the nearest emergency room)
            immediately.
          </p>
          <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-red-800/80 dark:text-red-400/80">
            Do not wait for online symptom reports if you are experiencing critical discomfort.
          </div>
        </div>
      </div>
    </motion.div>
  );
}
