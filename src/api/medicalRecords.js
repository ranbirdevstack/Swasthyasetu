// Shared demo medical-record store for role-based prototype access.
// Patient + Doctor can read the full record; Health Worker should only read necessary care details.
export const MEDICAL_RECORDS_KEY = "swasthyasetu_medical_records";

const seedRecords = {
  "Shivam": {
    patient: {
      name: "Shivam",
      age: 21,
      gender: "Male",
      bloodGroup: "B+",
      village: "Chandauli",
      phone: "9876543210"
    },
    history: [
      { date: "04 Sep 2026", type: "Consultation", title: "General consultation", detail: "Routine consultation with General Physician." },
      { date: "30 Aug 2026", type: "Vitals", title: "Health assessment", detail: "Blood pressure and blood sugar checked by health worker." },
      { date: "28 Aug 2026", type: "Diagnostics", title: "Blood Sugar Test", detail: "Diagnostic test completed; report available." },
      { date: "26 Aug 2026", type: "Referral", title: "Diagnostic referral", detail: "Referred for routine diagnostic evaluation." },
      { date: "20 Aug 2026", type: "Consultation", title: "Follow-up visit", detail: "Follow-up consultation completed." }
    ],
    documents: [
      { id: "DOC-001", name: "Blood Sugar Report", type: "Diagnostic Report", date: "28 Aug 2026", status: "Available", demo: true },
      { id: "DOC-002", name: "Consultation Prescription", type: "Prescription", date: "04 Sep 2026", status: "Available", demo: true },
      { id: "DOC-003", name: "Referral Note", type: "Referral Document", date: "26 Aug 2026", status: "Available", demo: true }
    ],
    vitals: { bloodPressure: "128/82 mmHg", bloodSugar: "132 mg/dL", temperature: "98.6 °F", pulse: "78 bpm", date: "30 Aug 2026" },
    consultations: [
      { date: "04 Sep 2026", doctor: "General Physician", diagnosis: "Routine follow-up assessment", medicine: "Continue prescribed medicines", diagnostics: "Blood Sugar Test", notes: "Patient advised routine monitoring." }
    ]
  }
};

export function getMedicalRecords() {
  try {
    const saved = localStorage.getItem(MEDICAL_RECORDS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  localStorage.setItem(MEDICAL_RECORDS_KEY, JSON.stringify(seedRecords));
  return seedRecords;
}

export function getPatientRecord(name = "Shivam") {
  const records = getMedicalRecords();
  if (records[name]) return records[name];
  const generic = {
    patient: { name, age: 0, gender: "Not specified", bloodGroup: "Not recorded", village: "Not recorded", phone: "Not recorded" },
    history: [
      { date: "30 Aug 2026", type: "Vitals", title: "Health worker assessment", detail: "Vitals recorded and made available to the consulting doctor." },
      { date: "28 Aug 2026", type: "Consultation", title: "Previous consultation", detail: "Previous consultation record available for clinical review." },
      { date: "25 Aug 2026", type: "Diagnostics", title: "Diagnostic review", detail: "Previous diagnostic information recorded in the patient file." }
    ],
    documents: [
      { id: `DOC-${name}-001`, name: "Previous Diagnostic Report", type: "Diagnostic Report", date: "28 Aug 2026", status: "Available" },
      { id: `DOC-${name}-002`, name: "Previous Consultation Note", type: "Consultation Document", date: "25 Aug 2026", status: "Available" }
    ],
    vitals: { bloodPressure: "Not recorded", bloodSugar: "Not recorded", temperature: "Not recorded", pulse: "Not recorded", date: "30 Aug 2026" },
    consultations: []
  };
  records[name] = generic;
  localStorage.setItem(MEDICAL_RECORDS_KEY, JSON.stringify(records));
  return generic;
}

export function savePatientRecord(name, record) {
  const records = getMedicalRecords();
  records[name] = record;
  localStorage.setItem(MEDICAL_RECORDS_KEY, JSON.stringify(records));
  return record;
}

export function addHealthWorkerVitals(name, vitals) {
  const record = getPatientRecord(name);
  record.vitals = { ...record.vitals, ...vitals, date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) };
  record.history = [
    { date: record.vitals.date, type: "Vitals", title: "Health worker assessment", detail: `BP ${record.vitals.bloodPressure || "—"} · Blood Sugar ${record.vitals.bloodSugar || "—"} · Pulse ${record.vitals.pulse || "—"}` },
    ...record.history
  ];
  savePatientRecord(name, record);
  return record;
}

export function addDoctorConsultation(name, consultation) {
  const record = getPatientRecord(name);
  record.consultations = [consultation, ...(record.consultations || [])];
  record.history = [
    { date: consultation.date, type: "Consultation", title: consultation.diagnosis || "Doctor consultation", detail: `${consultation.diagnostics || "No diagnostic order"} · ${consultation.medicine || "No medicine added"}` },
    ...record.history
  ];
  record.documents = [
    { id: `DOC-${Date.now()}`, name: "Doctor Consultation Note", type: "Consultation Document", date: consultation.date, status: "Available" },
    ...record.documents
  ];
  savePatientRecord(name, record);
  return record;
}
