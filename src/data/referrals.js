/**
 * SWASTHYASETU - REFERRALS DATA MODULE
 * Tracks end-to-end referral workflows across Sub-Centres, PHCs, CHCs,
 * and District Hospitals with priority levels, tokens, and verification status.
 */

export const referralStats = {
  totalActive: 34,
  urgentPriority: 6,
  completedThisWeek: 28,
  pendingDiagnostic: 12,
  averageTransitDays: 2.1,
};

export const referralFilterTabs = [
  { id: "all", label: "All Referrals" },
  { id: "urgent", label: "Urgent" },
  { id: "pending", label: "Pending Visit" },
  { id: "in-review", label: "In Review" },
  { id: "completed", label: "Completed" },
];

export const referralsData = [
  {
    id: "REF-2026-089",
    referralToken: "TK-CHC-104",
    patientId: "P-44021",
    patientName: "Rameshwar Yadav",
    age: 54,
    gender: "Male",
    phone: "+91 98765 11021",
    village: "Shivpur Village, Sector B",
    sourceFacility: "PHC Harhua",
    targetFacility: "CHC Shivpur",
    referringDoctor: "Dr. Rajesh Verma (MBBS)",
    receivingSpecialist: "Dr. Ananya Sharma (General Medicine)",
    assignedWorker: "ASHA Malti Devi",
    priority: "urgent", // urgent | moderate | routine
    reason: "Uncontrolled hypertension (165/100 mmHg) with exertion dyspnea and chest tightness.",
    referredDate: "03 Sep 2026",
    appointmentDate: "06 Sep 2026",
    timeSlot: "10:00 AM - 11:30 AM",
    status: "pending", // pending | in-review | confirmed | completed | dropped
    statusLabel: "Pending Visit",
    requiredDiagnostics: ["12-Lead ECG", "Serum Creatinine", "Fasting Blood Sugar"],
    transportArranged: true,
    transportDetails: "108 Ambulance / Community Health Worker Escort",
    clinicalNotes: "Patient has history of smoking. Prior medications ineffective.",
  },
  {
    id: "REF-2026-090",
    referralToken: "TK-DH-042",
    patientId: "P-55219",
    patientName: "Sunita Devi",
    age: 26,
    gender: "Female",
    phone: "+91 98765 22019",
    village: "Harhua Rural, Ward 4",
    sourceFacility: "Ayushman Arogya Mandir Kashi",
    targetFacility: "Pandit Deen Dayal Upadhyaya District Hospital",
    referringDoctor: "CHO Ritu Patel",
    receivingSpecialist: "Dr. Sandeep Gupta (Obstetrics & Gynecology)",
    assignedWorker: "ANM Sangeeta",
    priority: "urgent",
    reason: "High-Risk Pregnancy (32 weeks) with persistent severe anemia (Hb 7.2 g/dL) and pedal edema.",
    referredDate: "02 Sep 2026",
    appointmentDate: "05 Sep 2026",
    timeSlot: "09:30 AM - 11:00 AM",
    status: "in-review",
    statusLabel: "In Review",
    requiredDiagnostics: ["Obstetric Ultrasound (USG)", "Complete Blood Count (CBC)", "Urine Albumin"],
    transportArranged: true,
    transportDetails: "Janani Shishu Suraksha Karyakram (JSSK) Transport",
    clinicalNotes: "Two doses of Tetanus Toxoid completed. Blood transfusion may be required.",
  },
  {
    id: "REF-2026-091",
    referralToken: "TK-CHC-105",
    patientId: "P-88392",
    patientName: "Ranbir Pratap Singh",
    age: 21,
    gender: "Male",
    phone: "+91 98765 43210",
    village: "Shivpur Rural Block, Varanasi",
    sourceFacility: "CHC Shivpur",
    targetFacility: "CHC Shivpur (Pathology Wing)",
    referringDoctor: "Dr. Ananya Sharma",
    receivingSpecialist: "CHC Clinical Pathologist",
    assignedWorker: "ASHA Malti Devi",
    priority: "moderate",
    reason: "Suspected bacterial pharyngitis; persistent low-grade fever with throat inflammation.",
    referredDate: "04 Sep 2026",
    appointmentDate: "07 Sep 2026",
    timeSlot: "11:30 AM - 01:00 PM",
    status: "confirmed",
    statusLabel: "Confirmed Slot",
    requiredDiagnostics: ["Throat Swab Culture", "CBC", "ESR"],
    transportArranged: false,
    transportDetails: "Self-commute",
    clinicalNotes: "Amoxicillin started. Lab results requested for follow-up review.",
  },
  {
    id: "REF-2026-092",
    referralToken: "TK-PHC-031",
    patientId: "P-39102",
    patientName: "Gopal Krishna",
    age: 62,
    gender: "Male",
    phone: "+91 98765 33102",
    village: "Kashi Outskirts, Hamlet 2",
    sourceFacility: "PHC Harhua",
    targetFacility: "Ayushman Arogya Mandir Kashi",
    referringDoctor: "Dr. Rajesh Verma",
    receivingSpecialist: "CHO Ritu Patel",
    assignedWorker: "CHO Ritu Patel",
    priority: "routine",
    reason: "Post-hypertensive review and refill distribution for chronic therapy maintenance.",
    referredDate: "28 Aug 2026",
    appointmentDate: "04 Sep 2026",
    timeSlot: "02:00 PM - 04:00 PM",
    status: "completed",
    statusLabel: "Completed",
    requiredDiagnostics: ["Digital BP Monitoring", "Random Blood Sugar"],
    transportArranged: false,
    transportDetails: "Local Walk-in",
    clinicalNotes: "Patient blood pressure stabilized at 128/82 mmHg. 30-day medication dispensed.",
  },
  {
    id: "REF-2026-093",
    referralToken: "TK-DH-043",
    patientId: "P-12890",
    patientName: "Meena Devi",
    age: 48,
    gender: "Female",
    phone: "+91 98765 88291",
    village: "Cholapur Central",
    sourceFacility: "PHC Cholapur",
    targetFacility: "Pandit Deen Dayal Upadhyaya District Hospital",
    referringDoctor: "Dr. Vikas Singh",
    receivingSpecialist: "Orthopedic Department",
    assignedWorker: "ASHA Sunita",
    priority: "moderate",
    reason: "Suspected closed fracture of the distal radius following accidental fall.",
    referredDate: "01 Sep 2026",
    appointmentDate: "03 Sep 2026",
    timeSlot: "01:00 PM - 02:30 PM",
    status: "completed",
    statusLabel: "Completed",
    requiredDiagnostics: ["Digital Wrist X-Ray (AP/Lateral)"],
    transportArranged: true,
    transportDetails: "Family Vehicle with Splint Support",
    clinicalNotes: "Plaster of Paris (POP) slab applied. Review scheduled after 3 weeks.",
  },
];

/**
 * Filter referrals by status tab
 */
export const getReferralsByStatus = (status = "all") => {
  if (status === "all") return referralsData;
  return referralsData.filter((ref) => ref.status === status);
};

/**
 * Filter referrals by priority
 */
export const getReferralsByPriority = (priority = "urgent") => {
  return referralsData.filter((ref) => ref.priority === priority);
};

/**
 * Filter referrals for a specific patient ID
 */
export const getReferralsByPatientId = (patientId) => {
  return referralsData.filter((ref) => ref.patientId === patientId);
};

/**
 * Get single referral by Token or ID
 */
export const getReferralByIdOrToken = (identifier) => {
  return (
    referralsData.find(
      (ref) => ref.id === identifier || ref.referralToken === identifier
    ) || null
  );
};

export default referralsData;