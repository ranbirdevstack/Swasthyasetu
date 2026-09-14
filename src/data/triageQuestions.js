/**
 * SWASTHYASETU - CLINICAL TRIAGE PROTOCOL & GUARDRAILS
 * 
 * Safety Rules:
 * 1. Zero-False-Negative: Any red-flag symptom immediately forces "Emergency".
 * 2. High-Risk Maternal: Triggers urgent referral to First Referral Units (FRU/CHC).
 * 3. Advisory Only: Provides clinical routing recommendations, not definitive diagnosis.
 */

export const TRIAGE_CATEGORIES = [
  { id: "general", label: "General Illness / Fever", icon: "🌡️" },
  { id: "maternal", label: "Maternal & ANC / PNC", icon: "🤰" },
  { id: "pediatric", label: "Child Health (Under 5)", icon: "👶" },
  { id: "chronic", label: "NCDs (Chest Pain, Stroke, BP)", icon: "❤️" },
];

export const TRIAGE_QUESTIONS = {
  // 1. General & Acute Infections
  general: [
    {
      id: "gen_consciousness",
      text: "Is the patient unresponsive, abnormally drowsy, or having seizures?",
      weight: 10,
      isRedFlag: true,
      dangerSign: "Altered Mental Status / Convulsion",
    },
    {
      id: "gen_respiratory",
      text: "Severe difficulty breathing, blue lips, or inability to speak full sentences?",
      weight: 10,
      isRedFlag: true,
      dangerSign: "Acute Respiratory Distress",
    },
    {
      id: "gen_fever_duration",
      text: "High fever (>102°F) lasting more than 5 consecutive days?",
      weight: 3,
      isRedFlag: false,
    },
    {
      id: "gen_hydration",
      text: "Signs of severe dehydration (sunken eyes, dry mouth, no urine for >8 hours)?",
      weight: 4,
      isRedFlag: false,
    },
    {
      id: "gen_vomiting",
      text: "Persistent vomiting unable to retain oral fluids or ORS?",
      weight: 2,
      isRedFlag: false,
    },
  ],

  // 2. Maternal, Antenatal & Postnatal (High Risk Pregnancy Protocols)
  maternal: [
    {
      id: "mat_hemorrhage",
      text: "Active heavy vaginal bleeding (soaking >2 pads in an hour) or severe abdominal pain?",
      weight: 10,
      isRedFlag: true,
      dangerSign: "Obstetric Hemorrhage / Placental Abruption",
    },
    {
      id: "mat_preeclampsia",
      text: "Severe persistent headache, blurred vision, or sudden swelling of face/hands (BP ≥ 140/90)?",
      weight: 8,
      isRedFlag: true,
      dangerSign: "Impending Eclampsia / Preeclampsia",
    },
    {
      id: "mat_fetal_movement",
      text: "Marked reduction or complete absence of baby kicks/movements in the last 12 hours?",
      weight: 5,
      isRedFlag: false,
    },
    {
      id: "mat_fluid_leak",
      text: "Premature leaking of foul-smelling amniotic fluid before expected labor?",
      weight: 4,
      isRedFlag: false,
    },
    {
      id: "mat_pallor",
      text: "Severe pallor (white inner eyelids, nails) or extreme exhaustion?",
      weight: 3,
      isRedFlag: false,
    },
  ],

  // 3. Child Health (Integrated Management of Neonatal & Childhood Illness - IMNCI)
  pediatric: [
    {
      id: "ped_danger",
      text: "Unable to breastfeed/drink, continuous vomiting of everything, or convulsions?",
      weight: 10,
      isRedFlag: true,
      dangerSign: "IMNCI General Danger Sign",
    },
    {
      id: "ped_stridor",
      text: "Severe chest indrawing or noisy breathing/stridor while child is calm?",
      weight: 8,
      isRedFlag: true,
      dangerSign: "Severe Pneumonia / Airway Obstruction",
    },
    {
      id: "ped_lethargy",
      text: "Child is abnormally floppy, unconscious, or difficult to awaken?",
      weight: 10,
      isRedFlag: true,
      dangerSign: "Severe Sepsis / Meningitis",
    },
    {
      id: "ped_diarrhea_days",
      text: "Watery diarrhea for >14 days or blood in stool with fever?",
      weight: 3,
      isRedFlag: false,
    },
    {
      id: "ped_malnutrition",
      text: "Visible severe wasting (skin and bones) or swelling of both feet (edema)?",
      weight: 4,
      isRedFlag: false,
    },
  ],

  // 4. Chronic / Acute Cardiovascular & Neurological
  chronic: [
    {
      id: "chr_chest_pain",
      text: "Crushing chest tightness, pain radiating to left arm/jaw, accompanied by cold sweats?",
      weight: 10,
      isRedFlag: true,
      dangerSign: "Suspected Acute Myocardial Infarction",
    },
    {
      id: "chr_stroke_fast",
      text: "Sudden facial drooping, weakness/numbness in one arm, or slurred speech (FAST)?",
      weight: 10,
      isRedFlag: true,
      dangerSign: "Suspected Acute Ischemic Stroke",
    },
    {
      id: "chr_high_sugar",
      text: "Extreme thirst, frequent urination, fruity breath odor, or confusion?",
      weight: 5,
      isRedFlag: false,
    },
    {
      id: "chr_uncontrolled_bp",
      text: "Recorded BP > 180/110 mmHg even without acute symptoms?",
      weight: 6,
      isRedFlag: false,
    },
  ],
};

/**
 * Evaluates selected triage answers with Zero-False-Negative safety overrides.
 * 
 * @param {string} category - "general" | "maternal" | "pediatric" | "chronic"
 * @param {Object} answers - Map of { [questionId]: boolean }
 * @returns {Object} Triage determination with level, actions, and referral facility recommendations
 */
export const evaluateTriage = (category, answers = {}) => {
  const questionSet = TRIAGE_QUESTIONS[category] || TRIAGE_QUESTIONS.general;
  const triggeredRedFlags = [];
  let score = 0;

  questionSet.forEach((q) => {
    if (answers[q.id]) {
      score += q.weight;
      if (q.isRedFlag) {
        triggeredRedFlags.push(q.dangerSign);
      }
    }
  });

  // 1. Zero-False-Negative: Any red flag immediately forces Emergency Level
  if (triggeredRedFlags.length > 0) {
    return {
      level: "Emergency",
      color: "#dc2626",
      badge: "Emergency",
      score,
      triggeredRedFlags,
      targetFacilityType: "CHC / District Hospital (FRU)",
      actionRequired: "Dial 108 immediately. Stabilize vitals and prepare for expedited transfer.",
      maxWaitTime: "Immediate (0 - 15 mins)",
      isLifeThreatening: true,
    };
  }

  // 2. High Clinical Urgency (Score >= 6)
  if (score >= 6) {
    return {
      level: "Urgent",
      color: "#d65f5f",
      badge: "Urgent",
      score,
      triggeredRedFlags: [],
      targetFacilityType: "Primary Health Centre (PHC) / CHC",
      actionRequired: "Same-day consultation with Medical Officer. Issue referral slip.",
      maxWaitTime: "Within 2 - 4 hours",
      isLifeThreatening: false,
    };
  }

  // 3. Moderate Clinical Attention (Score 3 to 5)
  if (score >= 3) {
    return {
      level: "Priority",
      color: "#f59e0b",
      badge: "Pending",
      score,
      triggeredRedFlags: [],
      targetFacilityType: "Health & Wellness Centre (HWC) / Sub-Centre",
      actionRequired: "Community Health Officer (CHO) review, tele-consultation, or scheduled OPD.",
      maxWaitTime: "Within 24 hours",
      isLifeThreatening: false,
    };
  }

  // 4. Routine / Home Care Guidance (Score 0 to 2)
  return {
    level: "Routine",
    color: "#16a34a",
    badge: "Routine",
    score,
    triggeredRedFlags: [],
    targetFacilityType: "Sub-Centre / ASHA Home Care",
    actionRequired: "Symptomatic treatment, hydration, standard nutrition advice. Follow up in 48 hours if unresolved.",
    maxWaitTime: "Elective / Routine OPD",
    isLifeThreatening: false,
  };
};

export default {
  TRIAGE_CATEGORIES,
  TRIAGE_QUESTIONS,
  evaluateTriage,
};