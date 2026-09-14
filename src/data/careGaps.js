/**
 * SWASTHYASETU - CARE GAPS DATA MODULE
 * Tracks dropped referrals, missed immunizations, overdue follow-ups,
 * medicine stockouts, and maternal/NCD care breaches across rural sectors.
 */

export const careGapsSummary = {
  totalIdentifiedGaps: 48,
  criticalBreaches: 11,
  resolvedThisMonth: 64,
  averageResolutionDays: 3.4,
  highRiskSectors: ["Shivpur Sector B", "Harhua Rural", "Kashi Outskirts"]
};

export const careGapsCategories = [
  { id: "all", label: "All Gaps", count: 48 },
  { id: "referral_drop", label: "Dropped Referrals", count: 18 },
  { id: "maternal_child", label: "Maternal & Child Health", count: 14 },
  { id: "ncd_followup", label: "NCD / Chronic Care", count: 9 },
  { id: "supply_shortage", label: "Medicine & Diagnostic Shortage", count: 7 }
];

export const careGapsData = [
  {
    id: "GAP-1001",
    category: "referral_drop",
    categoryLabel: "Dropped Referral",
    title: "Overdue Secondary Referral for Chest X-Ray",
    patientName: "Rameshwar Yadav",
    patientId: "P-44021",
    age: 54,
    gender: "Male",
    severity: "urgent", // urgent | moderate | low
    village: "Shivpur Village, Sector B",
    assignedWorker: "ASHA Malti Devi",
    referringDoctor: "Dr. Rajesh Verma (PHC Harhua)",
    targetFacility: "District Hospital Varanasi",
    daysOverdue: 6,
    breachDate: "30 Aug 2026",
    reason: "Transport barrier and lack of escort; missed diagnostic token",
    recommendedAction: "Dispatch ASHA for home counseling and arrange 108 ambulance transport",
    status: "Pending Action" // Pending Action | In Progress | Resolved
  },
  {
    id: "GAP-1002",
    category: "maternal_child",
    categoryLabel: "Maternal Health",
    title: "Missed 3rd Trimester High-Risk ANC Visit",
    patientName: "Sunita Devi",
    patientId: "P-55219",
    age: 26,
    gender: "Female",
    severity: "urgent",
    village: "Harhua Rural, Ward 4",
    assignedWorker: "ANM Sangeeta",
    referringDoctor: "Dr. Ananya Sharma (CHC Shivpur)",
    targetFacility: "CHC Shivpur",
    daysOverdue: 8,
    breachDate: "28 Aug 2026",
    reason: "Patient reported mild bleeding but did not attend follow-up screening",
    recommendedAction: "Immediate ANM home visit with portable Doppler and BP monitoring kit",
    status: "Pending Action"
  },
  {
    id: "GAP-1003",
    category: "ncd_followup",
    categoryLabel: "Chronic Disease (NCD)",
    title: "Discontinued Hypertension Medication",
    patientName: "Gopal Krishna",
    patientId: "P-39102",
    age: 62,
    gender: "Male",
    severity: "moderate",
    village: "Kashi Outskirts, Hamlet 2",
    assignedWorker: "CHO Ritu Patel",
    referringDoctor: "Dr. Rajesh Verma (PHC Harhua)",
    targetFacility: "Ayushman Arogya Mandir Kashi",
    daysOverdue: 14,
    breachDate: "22 Aug 2026",
    reason: "Amlodipine strip finished; patient perceived absence of symptoms as cure",
    recommendedAction: "ASHA refill home delivery and patient adherence counseling",
    status: "In Progress"
  },
  {
    id: "GAP-1004",
    category: "supply_shortage",
    categoryLabel: "Supply Chain Breach",
    title: "Stockout: IFA Tablets & Malaria Rapid Test Kits",
    patientName: "Community Stock",
    patientId: "FAC-003",
    age: null,
    gender: null,
    severity: "moderate",
    village: "Sub-Centre Kashi Rural",
    assignedWorker: "CHO Ritu Patel",
    referringDoctor: "N/A",
    targetFacility: "Sub-Centre / Ayushman Arogya Mandir Kashi",
    daysOverdue: 4,
    breachDate: "01 Sep 2026",
    reason: "Central block supply buffer delayed by 5 days",
    recommendedAction: "Emergency inventory reallocation from CHC Shivpur warehouse",
    status: "In Progress"
  },
  {
    id: "GAP-1005",
    category: "maternal_child",
    categoryLabel: "Child Immunization",
    title: "Overdue Pentavalent-3 & OPV Booster",
    patientName: "Aarav Kumar (Child)",
    patientId: "P-78103",
    age: "14 weeks",
    gender: "Male",
    severity: "low",
    village: "Shivpur Village, Sector A",
    assignedWorker: "ASHA Malti Devi",
    referringDoctor: "Pediatric OPD CHC",
    targetFacility: "Sub-Centre Shivpur",
    daysOverdue: 5,
    breachDate: "31 Aug 2026",
    reason: "Family traveled to maternal village during scheduled immunization day",
    recommendedAction: "Enroll into upcoming Wednesday Village Health & Nutrition Day (VHND)",
    status: "Resolved"
  }
];

/**
 * Filter utility helper
 */
export const getCareGapsByCategory = (category = "all") => {
  if (category === "all") return careGapsData;
  return careGapsData.filter((item) => item.category === category);
};

export const getCareGapsBySeverity = (severity = "urgent") => {
  return careGapsData.filter((item) => item.severity === severity);
};

export default careGapsData;