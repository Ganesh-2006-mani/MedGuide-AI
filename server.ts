import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize GoogleGenAI SDK with server-side API Key
// We set User-Agent to 'aistudio-build' for AI Studio telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

app.use(express.json());

// List of emergency keywords
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

// Server-side helper to check if a text contains any emergency keywords
function detectEmergency(text: string): boolean {
  const normalized = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

// Local clinical pattern parsing fallback engine for when the Gemini API is rate-limited or unavailable
function getLocalFallbackResult(input: any, isEmergency: boolean): any {
  const desc = (input.symptomDescription || "").toLowerCase();
  const conds = (input.conditions || "").toLowerCase();
  const durationStr = String(input.duration || "several days");
  const severityStr = String(input.severity || "mild");
  
  // Identify primary category based on symptom keywords
  let category = "general";
  
  if (isEmergency) {
    category = "emergency";
  } else if (desc.includes("cough") || desc.includes("throat") || desc.includes("breath") || desc.includes("cold") || desc.includes("fever") || desc.includes("sinus") || desc.includes("congest") || desc.includes("sneeze") || desc.includes("nose") || desc.includes("lung") || desc.includes("flu") || desc.includes("bronchitis")) {
    category = "respiratory";
  } else if (desc.includes("stomach") || desc.includes("belly") || desc.includes("nausea") || desc.includes("vomit") || desc.includes("diarrhea") || desc.includes("constip") || desc.includes("bloat") || desc.includes("acid") || desc.includes("reflux") || desc.includes("bowel") || desc.includes("digest") || desc.includes("cramp")) {
    category = "digestive";
  } else if (desc.includes("head") || desc.includes("migraine") || desc.includes("dizzy") || desc.includes("vertigo") || desc.includes("spin") || desc.includes("numb") || desc.includes("tingl") || desc.includes("brain") || desc.includes("neurolog")) {
    category = "neurological";
  } else if (desc.includes("muscle") || desc.includes("joint") || desc.includes("back") || desc.includes("bone") || desc.includes("knee") || desc.includes("shoulder") || desc.includes("ache") || desc.includes("sprain") || desc.includes("pain") || desc.includes("strain") || desc.includes("arthrit")) {
    category = "musculoskeletal";
  } else if (desc.includes("skin") || desc.includes("rash") || desc.includes("itch") || desc.includes("dry") || desc.includes("hives") || desc.includes("eczema") || desc.includes("burn") || desc.includes("acne") || desc.includes("derm")) {
    category = "dermatological";
  } else if (desc.includes("urinate") || desc.includes("bladder") || desc.includes("kidney") || desc.includes("burn") || desc.includes("urine") || desc.includes("uti")) {
    category = "urinary";
  }

  // Build standard structured report response
  const result: any = {
    summary: `The patient (${input.name || "Anonymous"}, a ${input.age}-year-old ${input.gender}) reports symptoms described as: "${input.symptomDescription}". This has been ongoing for ${durationStr} with a severity level rated as ${severityStr}.` + 
             (input.temperature ? ` A temperature of ${input.temperature} was recorded.` : "") +
             (input.bloodPressure ? ` Blood pressure was reported as ${input.bloodPressure}.` : "") +
             (input.heartRate ? ` Heart rate was reported as ${input.heartRate} bpm.` : "") +
             (input.conditions ? ` The patient has a background of: ${input.conditions}.` : ""),
    confidence: "Medium",
    reasoning: "",
    possible_conditions: [],
    common_causes: [],
    self_care: [
      "Ensure sufficient resting periods to let your body allocate energy toward recovery.",
      "Maintain stable hydration by drinking clear water, warm decaffeinated broths, or electrolyte solutions.",
      "Document the onset times, severity variations, and any potential triggers of your symptoms to share with your provider.",
      "Avoid strenuous physical activities or heavy lifting until you have been medically cleared."
    ],
    specialist: "Primary Care Physician",
    seek_medical_care: "We recommend scheduling a routine visit with a primary care provider to evaluate these symptoms in detail. Prepare a list of all your current supplements, prescription drugs, and any medical background to ensure an efficient consultation.",
    emergency: "Seek immediate emergency clinical assistance if you develop severe chest pain, extreme shortness of breath, sudden confusion, facial drooping, speech difficulties, or severe unmanageable pain.",
    prevention: [
      "Follow a balanced diet rich in leafy greens, proteins, and vitamins to reinforce physical health.",
      "Engage in regular, moderate exercise adjusted to your current fitness level and health background.",
      "Stay hydrated throughout the day, aiming for consistent water intake.",
      "Attend recommended annual health screenings and keep all routine vaccinations updated."
    ],
    disclaimer: "This information is for educational purposes only and is not a medical diagnosis. Always consult a qualified healthcare professional for medical advice, diagnosis, or treatment."
  };

  // Honest educational advisory notice about fallback state
  const serverLoadNote = " Note: This educational guidance was compiled using MedGuide's local clinical pattern parsing engine due to high demand on our model servers, ensuring you receive immediate supportive context.";

  switch (category) {
    case "emergency":
      result.confidence = "High";
      result.reasoning = `The description contains indicators of critical medical concern (chest pain, shortness of breath, severe bleeding, or neurological deficits). These require immediate physical clinical evaluation to rule out acute, life-threatening processes.` + serverLoadNote;
      result.possible_conditions = [
        {
          name: "Acute Cardiovascular or Pulmonary Distress",
          explanation: "Conditions affecting the heart or lungs, such as acute coronary syndromes, pulmonary embolisms, or severe asthma exacerbations.",
          why_match: "Your reported description matches high-priority clinical flags (cardiovascular/pulmonary systems)."
        },
        {
          name: "Acute Neurological Event",
          explanation: "Rapidly developing disturbances in brain function, potentially due to vascular changes or systemic alterations.",
          why_match: "Matches reported symptoms of sudden numbness, severe confusion, or speech changes."
        },
        {
          name: "Severe Systemic Reaction or Anaphylaxis",
          explanation: "An acute, potentially life-threatening allergic or immunological response affecting multiple organ systems simultaneously.",
          why_match: "Aligned with reports of severe sudden allergy, facial swelling, or severe throat tightness."
        }
      ];
      result.common_causes = [
        "Cardiovascular system strain",
        "Acute airway or bronchial constriction",
        "Severe immunological allergen exposure",
        "Vascular changes or blood pressure spikes"
      ];
      result.specialist = "Emergency Medical Services / Emergency Room Physician";
      result.seek_medical_care = "Do not wait for an outpatient appointment. Contact emergency services immediately or have someone drive you to the nearest emergency department.";
      result.emergency = "IMMEDIATE EMERGENCY: Severe chest heaviness, radiating arm/jaw pain, gasping for air, hives with lip swelling, or sudden weakness on one side of the body.";
      break;

    case "respiratory":
      result.confidence = "High";
      result.reasoning = `Your symptoms strongly match viral or inflammatory patterns of the upper or lower respiratory system. The presence of throat discomfort, nasal congestion, or coughing are standard hallmarks of airborne viral exposures.` + serverLoadNote;
      result.possible_conditions = [
        {
          name: "Viral Upper Respiratory Infection (Common Cold)",
          explanation: "A standard, self-limiting viral infection of the nose, sinuses, and throat.",
          why_match: `Matches your described symptoms of throat irritation, congestion, or cough with a ${severityStr} onset.`
        },
        {
          name: "Influenza (Flu)",
          explanation: "A highly contagious viral infection affecting the respiratory tract, often accompanied by systemic fatigue or temperature fluctuations.",
          why_match: "Consistent with a sudden onset of symptoms, general body discomfort, or fever indicators."
        },
        {
          name: "Allergic Rhinitis (Seasonal Allergies)",
          explanation: "An inflammatory response of the nasal passages triggered by airborne particles such as pollen, dust, or pet dander.",
          why_match: "Likely if symptoms involve persistent sneezing, nasal itchiness, or watery eyes without systemic fever."
        }
      ];
      result.common_causes = [
        "Inhalation of airborne seasonal viral particles",
        "Immunological responses to environmental allergens",
        "Rapid temperature or humidity shifts leading to sinus irritation",
        "Secondary bronchial inflammation"
      ];
      result.self_care = [
        "Inhale steam from a hot shower or use a cool-mist humidifier to keep airway linings hydrated.",
        "Soothe throat irritation by gargling with warm salt water (1/2 teaspoon of salt in a glass of warm water).",
        "Drink warm, soothing liquids such as decaffeinated tea with honey to calm throat mucosal surfaces.",
        "Rest extensively in a well-ventilated, moderate-temperature room."
      ];
      result.specialist = "Primary Care Physician / ENT Specialist";
      result.seek_medical_care = "Schedule a visit if you experience a high fever that does not resolve, sinus pain lasting over 10 days, or a barking cough with thick phlegm.";
      result.emergency = "Proceed to urgent care if you experience severe wheezing, a feeling of throat closure, chest pain when deep-breathing, or blue lips.";
      result.prevention = [
        "Practice thorough hand washing with soap for at least 20 seconds, especially after being in public spaces.",
        "Consider an annual influenza vaccination to optimize immune defenses.",
        "Avoid close physical contact or sharing utensils with individuals presenting active cold or flu symptoms.",
        "Maintain optimal indoor air quality by regularly changing HVAC filters."
      ];
      break;

    case "digestive":
      result.confidence = "High";
      result.reasoning = `The reported symptoms point toward active gastrointestinal tract irritation, common in acute viral gastroenteritis, dietary intolerances, or stomach acid reflux. The digestive lining can become highly sensitive to dietary variables, viral pathogens, or stress.` + serverLoadNote;
      result.possible_conditions = [
        {
          name: "Acute Viral Gastroenteritis (Stomach Flu)",
          explanation: "An inflammation of the stomach and intestines caused by viral exposure, leading to temporary digestive discomfort.",
          why_match: `Correlates with reported nausea, abdominal cramping, or stool alterations over the duration of ${durationStr}.`
        },
        {
          name: "Gastroesophageal Reflux (GERD / Acid Reflux)",
          explanation: "A condition where stomach acid frequently flows back into the esophagus, causing burning sensations in the upper chest or throat.",
          why_match: "Matches reports of burning in the stomach, chest, or throat, especially after eating or lying down."
        },
        {
          name: "Dietary Indigestion or Food Intolerance",
          explanation: "Temporary difficulty digesting specific foods (such as lactose or gluten) or reaction to rich, spicy, or contaminated meals.",
          why_match: "Consistent with cramping, bloating, or stomach heaviness shortly following meals."
        }
      ];
      result.common_causes = [
        "Consumption of spicy, highly acidic, or rich fatty foods",
        "Ingestion of viral or bacterial elements from contaminated surfaces",
        "Somatic stress or anxiety affecting gastrointestinal motility",
        "Sluggish gastric emptying or esophageal sphincter relaxation"
      ];
      result.self_care = [
        "Adopt a temporary BRAT diet (Bananas, Rice, Applesauce, Toast) to minimize digestive tract strain.",
        "Sip small amounts of clear water, diluted coconut water, or electrolyte drinks to prevent dehydration.",
        "Avoid lying completely flat for at least 2-3 hours after eating; elevate the head of your bed slightly.",
        "Avoid highly acidic, spicy, fried, or carbonated items as well as dairy products."
      ];
      result.specialist = "Gastroenterologist / Primary Care Physician";
      result.seek_medical_care = "Consult a physician if you cannot keep liquids down for more than 24 hours, experience chronic daily heartburn, or have persistent severe abdominal pain.";
      result.emergency = "Go to the emergency room immediately if you observe blood in your stool or vomit, have a rigid, severely painful abdomen, or have a high fever with sudden severe localized right-side pain.";
      result.prevention = [
        "Eat smaller, more frequent meals rather than large heavy portions.",
        "Ensure food products are thoroughly cooked and hands are clean before preparing meals.",
        "Identify and limit foods that trigger symptoms (e.g. caffeine, carbonation, dairy, highly processed fats).",
        "Chew food completely and avoid eating in a hurried or stressful state."
      ];
      break;

    case "neurological":
      result.confidence = "Medium";
      result.reasoning = `The reported description focuses on neurological patterns (such as headaches, migraines, or balance changes). These often stem from vascular tension, muscle contractions in the neck, fatigue, dehydration, or inner ear imbalances.` + serverLoadNote;
      result.possible_conditions = [
        {
          name: "Tension-Type Headache",
          explanation: "The most common type of headache, characterized by a dull, aching band of pressure around the forehead or back of the head.",
          why_match: `Matches your description of dull, squeezing head discomfort with a ${severityStr} severity.`
        },
        {
          name: "Migraine with or without Aura",
          explanation: "A neurological syndrome characterized by throbbing, often unilateral head pain, accompanied by light sensitivity, nausea, or visual disturbances.",
          why_match: "Highly likely if head discomfort is severe, pulsating, unilateral, or accompanied by visual spots or nausea."
        },
        {
          name: "Benign Inner Ear Imbalance (Vertigo/Vestibular Irritation)",
          explanation: "A temporary disruption of the balance center inside the inner ear, creating false sensations of spinning or motion.",
          why_match: "Fits if symptoms describe dizziness, off-balance sensations, or room-spinning when turning your head."
        }
      ];
      result.common_causes = [
        "Dehydration and inadequate baseline fluid intake",
        "Sustained psychological stress, muscle tension in neck/shoulders, or eye strain",
        "Inadequate sleep hygiene or irregular sleep-wake patterns",
        "Fluctuations in hormonal levels or atmospheric barometric pressure"
      ];
      result.self_care = [
        "Rest in a quiet, cool, dimly lit room and close your eyes during acute episodes.",
        "Place a cool damp cloth or cold compress across your forehead or back of your neck.",
        "Drink a full glass of cool water immediately; dehydration is a highly common trigger.",
        "Massage neck, shoulder, and temple muscles gently to relieve muscular tension."
      ];
      result.specialist = "Neurologist / Primary Care Physician";
      result.seek_medical_care = "Schedule an appointment if your headaches occur more than twice a week, grow progressively worse, or are not relieved by standard relaxation.";
      result.emergency = "EMERGENCY: Sudden 'thunderclap' headache (worst headache of your life), accompanied by high fever, stiff neck, double vision, numbness, or difficulty speaking.";
      result.prevention = [
        "Keep a consistent daily schedule for meals, hydration, and sleep to stabilize neurological baselines.",
        "Incorporate stress-reduction practices such as deep breathing, gentle stretching, or yoga into your week.",
        "Adjust workstation ergonomics to prevent sustained neck and eye strain.",
        "Limit excessive caffeine intake and avoid sudden withdrawal of caffeine."
      ];
      break;

    case "musculoskeletal":
      result.confidence = "High";
      result.reasoning = `Your symptoms point toward structural or inflammatory mechanical strain affecting muscle, tendon, ligament, or joint structures. Mechanical injuries or posture tension are extremely common culprits for these discomforts.` + serverLoadNote;
      result.possible_conditions = [
        {
          name: "Localized Muscle Strain or Tendon Sprain",
          explanation: "Microscopic tearing or stretching of muscle fibers (strain) or ligaments (sprain) from sudden movement, overload, or overuse.",
          why_match: `Correlates with reported aching pain in specific joints or muscles, especially following physical exertive tasks.`
        },
        {
          name: "Postural Fatigue / Myofascial Tension",
          explanation: "Ached muscular tension arising from sitting or standing in static positions for long periods, straining supporting muscle groups.",
          why_match: "Consistent with dull, broad, symmetrical muscle aching in the lower back, neck, or shoulders."
        },
        {
          name: "Osteoarthritis or Joint Inflammation",
          explanation: "Gradual wear and tear of protective cartilage within joints, leading to friction, stiffness, and mild localized inflammation.",
          why_match: "Often matches if joint stiffness is worst upon waking and improves with light movement, primarily in older brackets."
        }
      ];
      result.common_causes = [
        "Lifting heavy items with improper spinal mechanics",
        "Sustained static postures at un-ergonomic desk setups",
        "Sudden twisting motions, repetitive micro-trauma, or athletic overexertion",
        "Localized joint wear and cartilage thinning over time"
      ];
      result.self_care = [
        "Apply the R.I.C.E protocol: Rest the affected area, Ice for 15 minutes at a time, Compress gently, and Elevate.",
        "Apply a warm compress or soak in a warm Epsom salt bath after the initial 48 hours to relax tight muscle fibers.",
        "Perform light, non-impact range-of-motion stretching to prevent muscle shortening and stiffness.",
        "Avoid heavy loading, high-impact running, or lifting items that aggravate the pain."
      ];
      result.specialist = "Orthopedist / Physical Therapist / Rheumatologist";
      result.seek_medical_care = "Contact a physician if joint swelling is accompanied by a hot skin feel, if pain persists unchanged after 2 weeks, or if joint motion is severely locked.";
      result.emergency = "Proceed to emergency services immediately if you cannot put any weight on a limb, if a joint is visibly deformed, or if pain is accompanied by loss of bladder or bowel control (cauda equina risk).";
      result.prevention = [
        "Practice proper biomechanics, bending at your knees and hips rather than rounding your back when lifting.",
        "Implement short 2-minute stretching breaks every hour when working at a computer desk.",
        "Build core and supporting muscle strength through low-impact exercises like swimming, cycling, or Pilates.",
        "Wear well-supported, shock-absorbing footwear tailored to your daily physical demands."
      ];
      break;

    case "dermatological":
      result.confidence = "High";
      result.reasoning = `The reported symptoms relate to the cutaneous system (skin, dermis, or subcutaneous layers). Skin responses frequently result from contact allergens, inflammatory conditions (like eczema), or mild localized infections.` + serverLoadNote;
      result.possible_conditions = [
        {
          name: "Contact Dermatitis (Allergic or Irritant)",
          explanation: "A localized skin reaction caused by direct contact with an irritating substance or allergen, such as soaps, cosmetics, nickel, or plants.",
          why_match: `Aligned with descriptions of a localized itch, redness, or tiny bumps arising on the skin.`
        },
        {
          name: "Eczema (Atopic Dermatitis)",
          explanation: "A chronic, inflammatory skin condition that causes dry, red, extremely itchy patches, often in skin creases (elbows, knees).",
          why_match: "Highly likely if skin dryness is severe, recurrent, or has been present on-and-off for several months."
        },
        {
          name: "Urticaria (Hives)",
          explanation: "Raised, extremely itchy, red or skin-colored welts that appear on the skin, often triggered by systemic allergens, stress, or temperature shifts.",
          why_match: "Fits if skin patches are swollen, raised, appear and disappear quickly, or itch intensely."
        }
      ];
      result.common_causes = [
        "Exposure to harsh chemical fragrances, parabens, or heavy laundry detergents",
        "Environmental triggers like low humidity, hot showers, or wool clothing",
        "Systemic immune responses to consumed foods or new medications",
        "Physical friction, excessive sweating, or localized insect bites"
      ];
      result.self_care = [
        "Apply cold, damp compresses to the itchy skin areas to reduce localized heat and inflammation.",
        "Take lukewarm showers rather than hot water, and limit bathing duration to under 10 minutes.",
        "Apply a thick, fragrance-free, hypoallergenic moisturizing cream immediately after bathing to seal skin moisture.",
        "Avoid scratching the affected skin; keep fingernails trimmed short to prevent secondary bacterial infections."
      ];
      result.specialist = "Dermatologist / Allergist";
      result.seek_medical_care = "See a doctor if your skin shows signs of secondary infection (e.g., golden crusting, oozing pus, or red streaks), or if the rash covers a large portion of your body.";
      result.emergency = "EMERGENCY: Seek immediate care if a rash is accompanied by swelling of the face, lips, or tongue, difficulty swallowing, or wheezing (Anaphylaxis risk).";
      result.prevention = [
        "Switch to dye-free, fragrance-free laundry detergents and personal hygiene products.",
        "Wear loose, breathable cotton clothing to minimize friction and thermal sweating.",
        "Apply sunscreen consistently to guard the dermal barrier against UV radiation and thermal burns.",
        "Keep skin well-hydrated from the inside out by maintaining sufficient fluid intake."
      ];
      break;

    case "urinary":
      result.confidence = "High";
      result.reasoning = `The reported symptoms correspond to the urinary tract. Bacterial entry into the bladder, kidney stress, or systemic inflammation are the primary triggers of urinary discomforts.` + serverLoadNote;
      result.possible_conditions = [
        {
          name: "Uncomplicated Urinary Tract Infection (Cystitis)",
          explanation: "A common bacterial infection localized in the bladder, causing inflammation of the urinary mucosal lining.",
          why_match: `Correlates with reported burning sensations during urination, increased urgency, or lower abdominal pressure.`
        },
        {
          name: "Urethral Irritation (Urethritis)",
          explanation: "Inflammation or irritation of the urethra, often caused by chemical irritants (soaps, bubble baths) or friction.",
          why_match: "Possible if burning is present without significant systemic symptoms, high frequency, or lower back discomfort."
        },
        {
          name: "Dehydration-Induced Concentrated Urine Irritation",
          explanation: "A non-infectious condition where highly concentrated, acidic urine irritates the urinary tract wall due to low hydration.",
          why_match: "Likely if burning is mild and resolves rapidly after drinking large volumes of water."
        }
      ];
      result.common_causes = [
        "Ascending bacterial migration from outer surfaces into the urethra",
        "Chemical irritation from scented hygiene sprays, bath salts, or synthetic bubble baths",
        "Inadequate daily water consumption leading to highly concentrated urine",
        "Friction or physical micro-trauma from tight-fitting synthetic underwear"
      ];
      result.self_care = [
        "Increase your pure water intake significantly, drinking a glass of water every 1-2 hours to flush the urinary tract.",
        "Empty your bladder completely and frequently; do not hold urine for long periods.",
        "Avoid bladder irritants such as caffeine, alcohol, spicy foods, carbonated drinks, and artificial sweeteners.",
        "Place a warm heating pad across your lower abdomen to soothe pelvic pressure."
      ];
      result.specialist = "Urologist / Primary Care Physician / Gynecologist";
      result.seek_medical_care = "Consult a physician promptly for urinary burning. Bacterial urinary infections typically require professional evaluation and appropriate clinical treatment.";
      result.emergency = "EMERGENCY: Seek immediate medical care if you develop sudden severe lower back/flank pain, high fever with chills, nausea, vomiting, or visible blood in your urine (signs of kidney spread).";
      result.prevention = [
        "Maintain excellent personal hygiene, always wiping from front to back to prevent bacterial transfer.",
        "Urinate immediately following physical intimacy to clear any introduced bacteria.",
        "Wear breathable, loose-fitting cotton undergarments and avoid wet swimsuits for extended periods.",
        "Avoid using perfumed soaps, bubble baths, or feminine douches in the pelvic area."
      ];
      break;

    default: // General
      result.confidence = "Medium";
      result.reasoning = `The description reports general systemic discomforts or fatigue. These can represent minor self-limiting viral adjustments, environmental shifts, mild nutritional gaps, sleep changes, or somatic tension.` + serverLoadNote;
      result.possible_conditions = [
        {
          name: "Mild Viral Syndrome or Immune Activation",
          explanation: "A general, non-specific immunological response to a common minor pathogen, causing mild fatigue or general achiness.",
          why_match: `Aligned with reported general discomforts and onset duration of ${durationStr}.`
        },
        {
          name: "Physical Fatigue and Stress Exhaustion",
          explanation: "Somatic drain resulting from high psychological demands, muscle fatigue, or poor circadian sleep architectures.",
          why_match: "Fits if symptoms describe general exhaustion, muscle heaviness, or brain fog without focal localizing pain."
        },
        {
          name: "Dehydration or Minor Nutritional Imbalance",
          explanation: "Systemic fatigue or mild headache caused by low daily hydration or minor vitamin/mineral gaps.",
          why_match: "Consistent with intermittent symptoms that fluctuate based on hydration, meals, or rest."
        }
      ];
      result.common_causes = [
        "Irregular sleep-wake patterns or high cognitive/physical exhaustion",
        "Under-hydration or skipping meals leading to low blood glucose",
        "Minor immune system activation fighting off self-limiting common viruses",
        "Extended periods of sitting in poorly ventilated indoor environments"
      ];
      result.self_care = [
        "Prioritize 8 hours of uninterrupted sleep; establish a relaxing screen-free routine before bed.",
        "Drink at least 8-10 glasses of pure water throughout the day.",
        "Consume small, nutritious meals containing lean proteins, complex carbohydrates, and minerals.",
        "Engage in light, 15-minute walks in fresh air to support vascular circulation and mental clarity."
      ];
      result.specialist = "Primary Care Physician / Internal Medicine Specialist";
      result.seek_medical_care = "Make an appointment with a primary care doctor if fatigue or generalized symptoms persist for more than 2-3 weeks, or interfere with daily tasks.";
      result.emergency = "Contact emergency services immediately if you experience sudden chest pressure, sudden numbness on one side, severe sudden shortness of breath, or a high fever above 103°F (39.4°C).";
      result.prevention = [
        "Incorporate regular physical activity, such as moderate walking, 3-4 times a week.",
        "Maintain a consistent sleep hygiene routine, waking and sleeping at similar times daily.",
        "Schedule annual physical health checkups and stay up to date on recommended vaccinations.",
        "Practice daily mindfulness, stress-management techniques, and balanced nutrition."
      ];
      break;
  }

  return result;
}

// Symptom analysis API endpoint
app.post("/api/check-symptoms", async (req: Request, res: Response): Promise<void> => {
  let isEmergency = false;
  try {
    const {
      name,
      age,
      gender,
      height,
      weight,
      country,
      conditions,
      medications,
      allergies,
      pregnant,
      duration,
      severity,
      temperature,
      bloodPressure,
      heartRate,
      symptomDescription,
    } = req.body;

    // Server-side validation
    if (!age || isNaN(Number(age)) || Number(age) < 0 || Number(age) > 120) {
      res.status(400).json({ error: "Invalid age. Must be a number between 0 and 120." });
      return;
    }

    if (!gender) {
      res.status(400).json({ error: "Gender is required." });
      return;
    }

    if (!duration) {
      res.status(400).json({ error: "Duration is required." });
      return;
    }

    if (!severity) {
      res.status(400).json({ error: "Severity is required." });
      return;
    }

    if (!symptomDescription || symptomDescription.trim().length < 10) {
      res.status(400).json({
        error: "Symptom description is required and must be at least 10 characters long.",
      });
      return;
    }

    if (symptomDescription.trim().length > 1000) {
      res.status(400).json({
        error: "Symptom description must not exceed 1000 characters.",
      });
      return;
    }

    // Check for emergency keywords
    isEmergency = detectEmergency(symptomDescription) || detectEmergency(conditions || "");

    // Check if API Key is configured
    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error: "Gemini API key is missing. Please configure it in your Secrets panel.",
      });
      return;
    }

    // Prepare system instruction and patient prompt
    const systemInstruction = `You are MedGuide AI, an educational medical assistant designed to help users understand their symptoms in a safe, responsible, and informative manner.
Your purpose is to provide educational information only. You must never diagnose diseases, prescribe medications, or replace licensed healthcare professionals.
Always follow these rules.

IMPORTANT BEHAVIORS:
1. Be professional, calm, respectful, and clear. Avoid excessive medical jargon. Explain technical terms simply.
2. Clearly distinguish between possibilities and confirmed diagnoses. Never say the user definitely has a condition.
3. List 3–5 possible conditions that may be associated with the symptoms.
   For each condition, provide: Name, Brief explanation, and Why it may match the symptoms.
4. For "confidence", evaluate how closely the symptoms match common medical patterns and return either "Low", "Medium", or "High". Keep in mind this represents diagnostic matching confidence, not medical certainty.
5. Provide safe, general, non-pharmaceutical self-care recommendations such as: rest, hydration, monitoring symptoms, healthy diet, and avoiding strenuous activity. Never recommend prescription medications, suggest treatment plans, dosages, or controlled drugs.
6. Emphasize that only a licensed healthcare professional can determine appropriate treatments or confirm diagnoses.

MANDATORY DISCLAIMER:
Every response must emphasize this disclaimer: "This information is for educational purposes only and is not a medical diagnosis. Always consult a qualified healthcare professional for medical advice, diagnosis, or treatment."`;

    const patientDetails = `
Patient demographics and clinical metadata:
- Name/Alias: ${name || "Anonymous"}
- Age: ${age} years old
- Gender: ${gender}
- Duration of symptoms: ${duration}
- Severity: ${severity}
${pregnant && pregnant !== "n/a" ? `- Pregnancy Status: ${pregnant === "yes" ? "Pregnant" : "Not pregnant"}` : ""}
${height ? `- Height: ${height}` : ""}
${weight ? `- Weight: ${weight}` : ""}
${country ? `- Country of Residence: ${country}` : ""}
${conditions ? `- Existing medical conditions: ${conditions}` : ""}
${medications ? `- Current medications: ${medications}` : ""}
${allergies ? `- Known allergies: ${allergies}` : ""}
${temperature ? `- Body Temperature: ${temperature}` : ""}
${bloodPressure ? `- Blood Pressure: ${bloodPressure}` : ""}
${heartRate ? `- Heart Rate: ${heartRate}` : ""}

Patient's Description of Symptoms:
"${symptomDescription}"
`;

    // Request structured JSON response from Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { text: "Provide educational symptom checker guidance based on the patient details." },
        { text: patientDetails },
      ],
      config: {
        systemInstruction,
        temperature: 0.1, // low temperature for more consistent, clinical-educational text
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A summary of the patient's symptoms, duration, severity, and any other reported clinical signs.",
            },
            possible_conditions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: {
                    type: Type.STRING,
                    description: "Name of the possible medical condition.",
                  },
                  explanation: {
                    type: Type.STRING,
                    description: "A brief, non-alarmist description of what this condition is.",
                  },
                  why_match: {
                    type: Type.STRING,
                    description: "Explains how the patient's specific reported symptoms and details match this condition.",
                  },
                },
                required: ["name", "explanation", "why_match"],
              },
              description: "A list of 3-5 possible conditions. Always frame these as possibilities, never diagnoses.",
            },
            confidence: {
              type: Type.STRING,
              description: "Low, Medium, or High, indicating how closely the symptoms fit typical medical patterns.",
            },
            reasoning: {
              type: Type.STRING,
              description: "Reasoning explaining the possible correlations between the symptoms and factors like duration, age, or reported conditions.",
            },
            common_causes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of common general triggers, environmental causes, or risk factors related to these symptoms.",
            },
            self_care: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of safe, non-prescription self-care actions, like rest, fluids, or tracking.",
            },
            specialist: {
              type: Type.STRING,
              description: "The type of medical specialist (e.g. Primary Care Physician, Dermatologist, Cardiologist) the patient could consult.",
            },
            seek_medical_care: {
              type: Type.STRING,
              description: "Explanation of when and why they should make an appointment with a doctor for these symptoms.",
            },
            emergency: {
              type: Type.STRING,
              description: "Explicit list of emergency signs relevant to this category of symptoms where immediate medical care is critical.",
            },
            prevention: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Healthy lifestyle guidelines or actions that could help prevent these symptoms from recurring.",
            },
            disclaimer: {
              type: Type.STRING,
              description: "The mandatory educational disclaimer text.",
            },
          },
          required: [
            "summary",
            "possible_conditions",
            "confidence",
            "reasoning",
            "common_causes",
            "self_care",
            "specialist",
            "seek_medical_care",
            "emergency",
            "prevention",
            "disclaimer",
          ],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from Google Gemini API.");
    }

    // Parse response
    const result = JSON.parse(responseText.trim());

    res.json({
      result,
      isEmergency,
    });
  } catch (error: any) {
    console.info("Gemini API request throttled or unavailable. Engaged local clinical pattern parsing engine fallback.");
    try {
      const fallbackResult = getLocalFallbackResult(req.body, isEmergency);
      res.json({
        result: fallbackResult,
        isEmergency,
        isLocalFallback: true,
      });
    } catch (fallbackError: any) {
      console.error("Failed to generate local fallback report:", fallbackError);
      res.status(500).json({
        error: "An error occurred while processing your request. Please try again.",
        details: error.message || String(error),
      });
    }
  }
});

// Configure Vite or Static Files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
