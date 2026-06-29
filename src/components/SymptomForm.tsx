import React, { useState, useEffect } from "react";
import { SymptomFormInput } from "../types";
import { Sparkles, Activity, User, AlertCircle, Thermometer, ChevronRight, RefreshCw } from "lucide-react";

interface SymptomFormProps {
  onSubmit: (data: SymptomFormInput) => void;
  isLoading: boolean;
  onEmergencyTrigger: (isEmergency: boolean) => void;
  initialData?: SymptomFormInput | null;
}

const EMERGENCY_KEYWORDS = [
  "chest pain",
  "difficulty breathing",
  "shortness of breath",
  "stroke",
  "heart attack",
  "unconscious",
  "severe bleeding",
  "poisoning",
  "suicidal thoughts",
  "seizure",
  "severe allergic reaction",
  "high fever in infants",
  "severe burns",
  "sudden confusion",
  "anaphylaxis"
];

export default function SymptomForm({
  onSubmit,
  isLoading,
  onEmergencyTrigger,
  initialData,
}: SymptomFormProps) {
  // Setup form states with sensible defaults or initial data
  const [formData, setFormData] = useState<SymptomFormInput>({
    name: "",
    age: "" as any,
    gender: "",
    height: "",
    weight: "",
    country: "",
    conditions: "",
    medications: "",
    allergies: "",
    pregnant: "n/a",
    duration: "",
    severity: "",
    temperature: "",
    bloodPressure: "",
    heartRate: "",
    symptomDescription: "",
  });

  // State for tracking custom error messages
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Populate initial data when reloading from search history
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setErrors({});
      setTouched({});
    }
  }, [initialData]);

  // Real-time validation and emergency warning checker
  useEffect(() => {
    const desc = formData.symptomDescription.toLowerCase();
    const cond = formData.conditions?.toLowerCase() || "";
    const matchesEmergency = EMERGENCY_KEYWORDS.some(
      (kw) => desc.includes(kw) || cond.includes(kw)
    );
    onEmergencyTrigger(matchesEmergency);
  }, [formData.symptomDescription, formData.conditions, onEmergencyTrigger]);

  const validateField = (name: string, value: any) => {
    let errorMsg = "";

    if (name === "age") {
      if (value === "" || value === undefined) {
        errorMsg = "Age is required.";
      } else {
        const num = Number(value);
        if (isNaN(num)) {
          errorMsg = "Age must be a valid number.";
        } else if (num < 0 || num > 120) {
          errorMsg = "Age must be between 0 and 120.";
        }
      }
    }

    if (name === "gender" && !value) {
      errorMsg = "Please select a gender.";
    }

    if (name === "duration" && !value) {
      errorMsg = "Please select the symptom duration.";
    }

    if (name === "severity" && !value) {
      errorMsg = "Please select a severity level.";
    }

    if (name === "symptomDescription") {
      if (!value || value.trim().length === 0) {
        errorMsg = "Symptom description is required.";
      } else if (value.trim().length < 10) {
        errorMsg = "Please write at least 10 characters.";
      } else if (value.length > 1000) {
        errorMsg = "Symptom description cannot exceed 1000 characters.";
      }
    }

    return errorMsg;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let finalValue: any = value;

    if (name === "age") {
      finalValue = value === "" ? "" : Math.floor(Number(value));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    if (touched[name]) {
      const errorMsg = validateField(name, finalValue);
      setErrors((prev) => ({
        ...prev,
        [name]: errorMsg,
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  // Check if form is fully valid and ready to submit
  const isFormValid = () => {
    const ageErr = validateField("age", formData.age);
    const genderErr = validateField("gender", formData.gender);
    const durationErr = validateField("duration", formData.duration);
    const severityErr = validateField("severity", formData.severity);
    const descErr = validateField("symptomDescription", formData.symptomDescription);

    return !ageErr && !genderErr && !durationErr && !severityErr && !descErr;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Force validation on all fields
    const newErrors = {
      age: validateField("age", formData.age),
      gender: validateField("gender", formData.gender),
      duration: validateField("duration", formData.duration),
      severity: validateField("severity", formData.severity),
      symptomDescription: validateField("symptomDescription", formData.symptomDescription),
    };

    setErrors(newErrors);
    setTouched({
      age: true,
      gender: true,
      duration: true,
      severity: true,
      symptomDescription: true,
    });

    const hasErrors = Object.values(newErrors).some((err) => err !== "");
    if (!hasErrors) {
      onSubmit(formData);
    }
  };

  const handleClear = () => {
    setFormData({
      name: "",
      age: "" as any,
      gender: "",
      height: "",
      weight: "",
      country: "",
      conditions: "",
      medications: "",
      allergies: "",
      pregnant: "n/a",
      duration: "",
      severity: "",
      temperature: "",
      bloodPressure: "",
      heartRate: "",
      symptomDescription: "",
    });
    setErrors({});
    setTouched({});
    onEmergencyTrigger(false);
  };

  const charsLeft = 1000 - formData.symptomDescription.length;

  return (
    <form
      onSubmit={handleFormSubmit}
      className="space-y-8 rounded-2xl border border-gray-200/60 bg-white/70 p-6 shadow-xl backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-900/70 md:p-8"
      id="symptom-checker-form"
    >
      {/* Educational Header Banner */}
      <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-4 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
        <p className="text-xs leading-relaxed font-medium">
          🔒 Your assessment is handled completely locally and server-side. Information shared here is used strictly for generating educational summaries via secure Gemini prompts, and is persisted only in your browser's private local storage.
        </p>
      </div>

      {/* SECTION 1: Personal Profile */}
      <div className="space-y-4">
        <h3 className="flex items-center text-md font-semibold tracking-tight text-gray-900 dark:text-zinc-100 border-b border-gray-100 dark:border-zinc-800 pb-2">
          <User className="mr-2 h-4 w-4 text-emerald-500" />
          1. Demographic Information
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
              Full Name or Alias (Optional)
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Jane Doe"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-sm bg-white/50 focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white"
              id="input-name"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
              Age <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="age"
              value={formData.age === "" ? "" : formData.age}
              onChange={handleInputChange}
              onBlur={handleBlur}
              min="0"
              max="120"
              placeholder="0–120"
              className={`w-full rounded-lg border px-3.5 py-2 text-sm bg-white/50 focus:border-emerald-500 focus:outline-none dark:bg-zinc-900/50 dark:text-white ${
                errors.age && touched.age
                  ? "border-red-500 dark:border-red-900/50"
                  : "border-gray-200 dark:border-zinc-800"
              }`}
              id="input-age"
              required
            />
            {errors.age && touched.age && (
              <p className="mt-1 flex items-center text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="mr-1 h-3.5 w-3.5" />
                {errors.age}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
              Biological Sex / Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full rounded-lg border px-3.5 py-2 text-sm bg-white/50 focus:border-emerald-500 focus:outline-none dark:bg-zinc-900/50 dark:text-white ${
                errors.gender && touched.gender
                  ? "border-red-500 dark:border-red-900/50"
                  : "border-gray-200 dark:border-zinc-800"
              }`}
              id="input-gender"
              required
            >
              <option value="">Select gender...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
            {errors.gender && touched.gender && (
              <p className="mt-1 flex items-center text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="mr-1 h-3.5 w-3.5" />
                {errors.gender}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
              Country of Residence (Optional)
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="e.g., United States"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-sm bg-white/50 focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white"
              id="input-country"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Medical Context */}
      <div className="space-y-4">
        <h3 className="flex items-center text-md font-semibold tracking-tight text-gray-900 dark:text-zinc-100 border-b border-gray-100 dark:border-zinc-800 pb-2">
          <Activity className="mr-2 h-4 w-4 text-emerald-500" />
          2. Clinical Context & Medical History
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
              Height (Optional)
            </label>
            <input
              type="text"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              placeholder="e.g., 5ft 9in or 175 cm"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-sm bg-white/50 focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white"
              id="input-height"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
              Weight (Optional)
            </label>
            <input
              type="text"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              placeholder="e.g., 160 lbs or 72 kg"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-sm bg-white/50 focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white"
              id="input-weight"
            />
          </div>

          {/* Conditional field: Pregnancy status */}
          {(formData.gender === "Female" || formData.gender === "Other") && (
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                Are you currently pregnant?
              </label>
              <div className="flex items-center space-x-6 mt-1.5">
                <label className="flex items-center text-sm text-gray-700 dark:text-zinc-300">
                  <input
                    type="radio"
                    name="pregnant"
                    value="yes"
                    checked={formData.pregnant === "yes"}
                    onChange={handleInputChange}
                    className="mr-2 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  Yes
                </label>
                <label className="flex items-center text-sm text-gray-700 dark:text-zinc-300">
                  <input
                    type="radio"
                    name="pregnant"
                    value="no"
                    checked={formData.pregnant === "no"}
                    onChange={handleInputChange}
                    className="mr-2 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  No
                </label>
                <label className="flex items-center text-sm text-gray-700 dark:text-zinc-300">
                  <input
                    type="radio"
                    name="pregnant"
                    value="n/a"
                    checked={formData.pregnant === "n/a" || !formData.pregnant}
                    onChange={handleInputChange}
                    className="mr-2 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  Prefer not to say / Not applicable
                </label>
              </div>
            </div>
          )}

          <div className="sm:col-span-2 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                Existing Medical Conditions (Optional)
              </label>
              <textarea
                name="conditions"
                value={formData.conditions}
                onChange={handleInputChange}
                placeholder="e.g., Asthma, Hypertension, Diabetes..."
                rows={2}
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-sm bg-white/50 focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white resize-none"
                id="input-conditions"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                Current Medications (Optional)
              </label>
              <textarea
                name="medications"
                value={formData.medications}
                onChange={handleInputChange}
                placeholder="e.g., Albuterol, Metformin, Multivitamins..."
                rows={2}
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-sm bg-white/50 focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white resize-none"
                id="input-medications"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                Known Allergies (Optional)
              </label>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleInputChange}
                placeholder="e.g., Penicillin, Peanuts, Pollen..."
                rows={2}
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-sm bg-white/50 focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white resize-none"
                id="input-allergies"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Optional Vitals */}
      <div className="space-y-4">
        <h3 className="flex items-center text-md font-semibold tracking-tight text-gray-900 dark:text-zinc-100 border-b border-gray-100 dark:border-zinc-800 pb-2">
          <Thermometer className="mr-2 h-4 w-4 text-emerald-500" />
          3. Vital Signs (Optional Information)
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
              Body Temperature
            </label>
            <input
              type="text"
              name="temperature"
              value={formData.temperature}
              onChange={handleInputChange}
              placeholder="e.g., 98.6°F or 37°C"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-sm bg-white/50 focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white"
              id="input-temp"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
              Blood Pressure
            </label>
            <input
              type="text"
              name="bloodPressure"
              value={formData.bloodPressure}
              onChange={handleInputChange}
              placeholder="e.g., 120/80 mmHg"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-sm bg-white/50 focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white"
              id="input-bp"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
              Heart Rate (Pulse)
            </label>
            <input
              type="text"
              name="heartRate"
              value={formData.heartRate}
              onChange={handleInputChange}
              placeholder="e.g., 72 bpm"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-sm bg-white/50 focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white"
              id="input-pulse"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: Symptoms Details */}
      <div className="space-y-4">
        <h3 className="flex items-center text-md font-semibold tracking-tight text-gray-900 dark:text-zinc-100 border-b border-gray-100 dark:border-zinc-800 pb-2">
          <Sparkles className="mr-2 h-4 w-4 text-emerald-500" />
          4. Current Symptoms Details
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
              Duration of Symptoms <span className="text-red-500">*</span>
            </label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full rounded-lg border px-3.5 py-2 text-sm bg-white/50 focus:border-emerald-500 focus:outline-none dark:bg-zinc-900/50 dark:text-white ${
                errors.duration && touched.duration
                  ? "border-red-500 dark:border-red-900/50"
                  : "border-gray-200 dark:border-zinc-800"
              }`}
              id="input-duration"
              required
            >
              <option value="">Select duration...</option>
              <option value="Less than 24 hours">Less than 24 hours</option>
              <option value="1–3 days">1–3 days</option>
              <option value="4–7 days">4–7 days</option>
              <option value="More than 1 week">More than 1 week</option>
            </select>
            {errors.duration && touched.duration && (
              <p className="mt-1 flex items-center text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="mr-1 h-3.5 w-3.5" />
                {errors.duration}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
              Severity <span className="text-red-500">*</span>
            </label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full rounded-lg border px-3.5 py-2 text-sm bg-white/50 focus:border-emerald-500 focus:outline-none dark:bg-zinc-900/50 dark:text-white ${
                errors.severity && touched.severity
                  ? "border-red-500 dark:border-red-900/50"
                  : "border-gray-200 dark:border-zinc-800"
              }`}
              id="input-severity"
              required
            >
              <option value="">Select severity...</option>
              <option value="Mild">Mild (minimal impact on daily activities)</option>
              <option value="Moderate">Moderate (some difficulty or restriction)</option>
              <option value="Severe">Severe (critical, extremely debilitating)</option>
            </select>
            {errors.severity && touched.severity && (
              <p className="mt-1 flex items-center text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="mr-1 h-3.5 w-3.5" />
                {errors.severity}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <div className="flex justify-between items-end mb-1">
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                Describe your symptoms in detail <span className="text-red-500">*</span>
              </label>
              <span className={`text-[11px] font-mono ${charsLeft < 100 ? "text-red-500 font-bold" : "text-gray-400"}`}>
                {charsLeft} characters remaining
              </span>
            </div>
            <textarea
              name="symptomDescription"
              value={formData.symptomDescription}
              onChange={handleInputChange}
              onBlur={handleBlur}
              rows={4}
              placeholder="e.g., I have had a moderate fever (101°F), dry persistent cough, and a mildly sore throat for three days. It gets worse at night and when talking."
              className={`w-full rounded-lg border px-3.5 py-2 text-sm bg-white/50 focus:border-emerald-500 focus:outline-none dark:bg-zinc-900/50 dark:text-white ${
                errors.symptomDescription && touched.symptomDescription
                  ? "border-red-500 dark:border-red-900/50"
                  : "border-gray-200 dark:border-zinc-800"
              }`}
              id="input-description"
              maxLength={1000}
              required
            />
            <div className="flex justify-between mt-1">
              {errors.symptomDescription && touched.symptomDescription ? (
                <p className="flex items-center text-xs text-red-600 dark:text-red-400">
                  <AlertCircle className="mr-1 h-3.5 w-3.5" />
                  {errors.symptomDescription}
                </p>
              ) : (
                <p className="text-[11px] text-gray-400 dark:text-zinc-500">
                  Minimum 10 characters. Describe timeline, sensations, and location of discomfort.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SUBMIT & CLEAR BUTTONS */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end border-t border-gray-100 dark:border-zinc-800 pt-6">
        <button
          type="button"
          onClick={handleClear}
          disabled={isLoading}
          className="w-full rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 sm:w-auto transition-all duration-200"
          id="btn-clear-form"
        >
          Clear Questionnaire
        </button>

        <button
          type="submit"
          disabled={isLoading || !isFormValid()}
          className={`relative w-full rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 sm:w-auto flex items-center justify-center ${
            isLoading || !isFormValid()
              ? "bg-gray-300 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-500 shadow-none"
              : "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-95 shadow-teal-500/10"
          }`}
          id="btn-submit-form"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Symptoms...
            </>
          ) : (
            <>
              Analyze Symptoms
              <ChevronRight className="ml-1.5 h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
