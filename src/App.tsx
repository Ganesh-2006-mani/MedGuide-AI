import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import SymptomForm from "./components/SymptomForm";
import ResultView from "./components/ResultView";
import FAQ from "./components/FAQ";
import About from "./components/About";
import Contact from "./components/Contact";
import PrivacyPolicy from "./components/PrivacyPolicy";
import DisclaimerPage from "./components/DisclaimerPage";
import HistoryList from "./components/HistoryList";
import EmergencyBanner from "./components/EmergencyBanner";
import { SymptomFormInput, SymptomAnalysisResult, HistoryItem } from "./types";
import { 
  HeartPulse, ShieldAlert, Sparkles, AlertCircle, FileText, 
  HelpCircle, Info, PhoneCall, RefreshCw, Layers 
} from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("checker");
  const [formData, setFormData] = useState<SymptomFormInput | null>(null);
  const [analysisResult, setAnalysisResult] = useState<SymptomAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmergency, setIsEmergency] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistoryPanel, setShowHistoryPanel] = useState<boolean>(false);
  
  // Theme state: default is false (gorgeous Clinical Light Theme)
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("medguide_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load history from local storage", err);
    }
  }, []);

  // Update classes on documentElement when theme changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem("medguide_history", JSON.stringify(newHistory));
    } catch (err) {
      console.error("Failed to save history to local storage", err);
    }
  };

  const handleSymptomSubmit = async (input: SymptomFormInput) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setFormData(input);

    try {
      const response = await fetch("/api/check-symptoms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process symptom check.");
      }

      const data = await response.json();
      const result: SymptomAnalysisResult = data.result;
      if (data.isLocalFallback) {
        result.isLocalFallback = true;
      }
      const responseIsEmergency: boolean = data.isEmergency;

      setAnalysisResult(result);
      setIsEmergency(responseIsEmergency);

      // Save to local search history
      const historyItem: HistoryItem = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        input,
        result,
        isEmergency: responseIsEmergency,
      };

      const updatedHistory = [historyItem, ...history];
      saveHistory(updatedHistory);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while analyzing symptoms. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setFormData(item.input);
    setAnalysisResult(item.result);
    setIsEmergency(item.isEmergency);
    setCurrentTab("checker");
    setShowHistoryPanel(false);
    setError(null);
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    saveHistory(updated);
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to delete all saved reports? This action cannot be undone.")) {
      saveHistory([]);
    }
  };

  const handleBackToForm = () => {
    setAnalysisResult(null);
  };

  // Switch tabs cleanly
  const renderTabContent = () => {
    switch (currentTab) {
      case "faq":
        return <FAQ />;
      case "disclaimer":
        return <DisclaimerPage />;
      case "about":
        return <About />;
      case "contact":
        return <Contact />;
      case "privacy":
        return <PrivacyPolicy />;
      case "checker":
      default:
        if (analysisResult && formData) {
          return (
            <ResultView
              result={analysisResult}
              input={formData}
              isEmergency={isEmergency}
              onBack={handleBackToForm}
            />
          );
        }
        return (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
            {/* Form Column */}
            <div className="lg:col-span-8 space-y-6">
              <EmergencyBanner show={isEmergency} />
              
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-red-400 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">Analysis Error</h4>
                    <p className="text-xs text-red-200/80 mt-1">{error}</p>
                  </div>
                </div>
              )}

              <SymptomForm
                onSubmit={handleSymptomSubmit}
                isLoading={isLoading}
                onEmergencyTrigger={setIsEmergency}
                initialData={formData}
              />
            </div>

            {/* Quick Tips / Health Advisory Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 space-y-4 shadow-xs dark:border-slate-800/80 dark:bg-slate-900/40 backdrop-blur-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <HeartPulse className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                  Educating with AI
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Our system evaluates clinical tags like demographics, duration of onset, medical history, and vitals to produce helpful matching descriptions from peer-reviewed literature.
                </p>
                
                <div className="rounded-lg bg-slate-50/80 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80 p-3.5 text-xs text-slate-600 dark:text-slate-400 space-y-2">
                  <p className="font-bold text-slate-800 dark:text-slate-200">Before submitting:</p>
                  <ul className="space-y-1.5 list-disc list-inside">
                    <li>Be specific with physical locations</li>
                    <li>Detail how temperature or throat symptoms have changed</li>
                    <li>Report correct clinical duration metadata</li>
                  </ul>
                </div>
              </div>

              {/* Quick Disclaimer */}
              <div className="rounded-2xl border border-slate-200 bg-white/60 p-5 text-xs text-slate-500 space-y-2.5 shadow-2xs dark:border-slate-800/80 dark:bg-slate-900/20 dark:text-slate-400">
                <p className="font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wide">Standard Regulation Disclaimer</p>
                <p className="leading-relaxed">
                  This service is designed for study reference, healthy lifestyle guidance, and health-literacy tutoring. Always trust certified local health departments or physical family practitioners with clinical dilemmas.
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between transition-colors duration-300 dark:bg-slate-950 dark:text-slate-200 bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100/50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      
      {/* HEADER NAV */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        openHistory={() => setShowHistoryPanel(true)}
        historyCount={history.length}
      />

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        
        {/* Dynamic content routing */}
        <div className="space-y-6">
          {renderTabContent()}
        </div>

        {/* Sliding History Overlay Drawer */}
        {showHistoryPanel && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs">
            <div className="absolute inset-y-0 right-0 max-w-full pl-10 flex animate-in slide-in-from-right duration-300">
              <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800/60 p-6 shadow-2xl flex flex-col justify-between">
                <HistoryList
                  history={history}
                  onSelect={handleSelectHistoryItem}
                  onDelete={handleDeleteHistoryItem}
                  onClearAll={handleClearHistory}
                  onClose={() => setShowHistoryPanel(false)}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200/80 px-4 sm:px-6 lg:px-8 py-5 transition-colors duration-300 dark:bg-slate-950 dark:border-slate-900/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-slate-50 border border-slate-200 rounded shrink-0 dark:bg-slate-900 dark:border-slate-800">
              <ShieldAlert className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500 max-w-2xl dark:text-slate-400">
              <strong className="text-slate-700 dark:text-slate-300 uppercase font-bold tracking-wide">Educational Disclaimer:</strong>{" "}
              This application is for educational purposes only. It does not provide medical diagnosis or treatment. Always consult a qualified healthcare professional.
            </p>
          </div>

          <div className="flex gap-4 text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap self-start md:self-center">
            <button 
              onClick={() => setCurrentTab("privacy")} 
              className="hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => setCurrentTab("disclaimer")} 
              className="hover:underline cursor-pointer"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
