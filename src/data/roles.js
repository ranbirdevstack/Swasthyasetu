/**
 * SWASTHYASETU - ROLE-BASED ACCESS CONTROL & CONFIGURATION
 * Defines capabilities, navigation structure, landing routes, and default user personas.
 */

export const ROLES = {
  PATIENT: "patient",
  WORKER: "worker",
  DOCTOR: "doctor",
  ADMIN: "admin"
};

export const roleConfigs = {
  [ROLES.PATIENT]: {
    id: "patient",
    title: "Patient",
    tagline: "Personal Health Journey & Care Access",
    badgeColor: "#087f8c",
    badgeBg: "#e5f4f5",
    icon: "👤",
    defaultRoute: "/patient/dashboard",
    permissions: [
      "view_own_records",
      "book_appointment",
      "perform_digital_triage",
      "search_facilities",
      "view_own_referrals",
      "view_own_prescriptions"
    ],
    mockUser: {
      id: "P-88392",
      name: "Ranbir Pratap Singh",
      role: "patient",
      roleLabel: "Patient",
      email: "ranbir.singh@swasthyasetu.org",
      phone: "+91 98765 43210",
      location: "Shivpur Rural Block, Varanasi",
      abhaId: "91-2345-6789-0123"
    },
    navItems: [
      { id: "dashboard", label: "Overview", icon: "⌂", path: "/patient/dashboard" },
      { id: "facilities", label: "Find Facility", icon: "⌖", path: "/patient/facilities" },
      { id: "recommendation", label: "Smart Recommendation", icon: "✦", path: "/patient/recommendation" },
      { id: "triage", label: "Digital Triage", icon: "✚", path: "/patient/triage" },
      { id: "appointments", label: "Appointments", icon: "▣", path: "/patient/appointments" },
      { id: "referrals", label: "My Referrals", icon: "↗", path: "/patient/referrals" },
      { id: "medicines", label: "Medicines & Diagnostics", icon: "💊", path: "/patient/medicines" },
      { id: "followup", label: "Follow-up", icon: "♥", path: "/patient/followup" }
    ]
  },

  [ROLES.WORKER]: {
    id: "worker",
    title: "Health Worker",
    tagline: "Community Outreach, Vitals Screening & Referrals",
    badgeColor: "#059669",
    badgeBg: "#ecfdf5",
    icon: "👩‍⚕️",
    defaultRoute: "/worker/dashboard",
    permissions: [
      "register_community_patient",
      "conduct_field_triage",
      "issue_referral",
      "record_vitals",
      "track_community_followups",
      "view_facility_capacity"
    ],
    mockUser: {
      id: "W-4019",
      name: "Malti Devi",
      role: "worker",
      roleLabel: "ASHA Facilitator",
      email: "malti.asha@swasthyasetu.gov.in",
      phone: "+91 98765 21098",
      sector: "Sector B - Shivpur Gram Panchayat",
      assignedHouseholds: 210
    },
    navItems: [
      { id: "dashboard", label: "Dashboard", icon: "⌂", path: "/worker/dashboard" },
      { id: "patients", label: "Community Register", icon: "♙", path: "/worker/patients" },
      { id: "triage", label: "Field Triage", icon: "✚", path: "/worker/triage" },
      { id: "referrals", label: "Referral Desk", icon: "↗", path: "/worker/referrals" },
      { id: "followup", label: "Maternal & NCD Visits", icon: "♥", path: "/worker/followup" },
      { id: "facilities", label: "Facility Directory", icon: "▣", path: "/worker/facilities" }
    ]
  },

  [ROLES.DOCTOR]: {
    id: "doctor",
    title: "Doctor",
    tagline: "Clinical Consultations, Triage Verification & Prescriptions",
    badgeColor: "#087f8c",
    badgeBg: "#edf7f7",
    icon: "👨‍⚕️",
    defaultRoute: "/doctor/dashboard",
    permissions: [
      "access_consultation_queue",
      "view_clinical_records",
      "write_eprescription",
      "order_lab_tests",
      "accept_triage_referrals",
      "discharge_or_escalate"
    ],
    mockUser: {
      id: "DOC-102",
      name: "Dr. Ananya Sharma",
      role: "doctor",
      roleLabel: "Medical Officer",
      specialization: "General Medicine",
      registrationNo: "UP-MED-2018-9941",
      facility: "Community Health Centre (CHC) Shivpur",
      email: "ananya.sharma@chc-shivpur.gov.in"
    },
    navItems: [
      { id: "dashboard", label: "Dashboard", icon: "⌂", path: "/doctor/dashboard" },
      { id: "queue", label: "Consultation Queue", icon: "▤", path: "/doctor/queue" },
      { id: "referrals", label: "Inward Referrals", icon: "↗", path: "/doctor/referrals" },
      { id: "patients", label: "Patient Records", icon: "♙", path: "/doctor/patients" },
      { id: "followup", label: "Clinical Review", icon: "♥", path: "/doctor/followup" }
    ]
  },

  [ROLES.ADMIN]: {
    id: "admin",
    title: "Administrator",
    tagline: "District Oversight, Resource Allocation & Care Gap Analytics",
    badgeColor: "#0b3954",
    badgeBg: "#e0f2fe",
    icon: "🏛️",
    defaultRoute: "/admin/dashboard",
    permissions: [
      "view_district_analytics",
      "manage_facilities",
      "track_care_gaps",
      "audit_referral_flow",
      "monitor_medicine_stock",
      "manage_user_accounts"
    ],
    mockUser: {
      id: "ADM-001",
      name: "Dr. Rajesh Kumar Verma",
      role: "admin",
      roleLabel: "District Health Officer",
      email: "dho.varanasi@swasthyasetu.gov.in",
      district: "Varanasi District Division",
      managedCentres: 34
    },
    navItems: [
      { id: "dashboard", label: "Dashboard", icon: "⌂", path: "/admin/dashboard" },
      { id: "facilities", label: "Facility Monitoring", icon: "⌖", path: "/admin/facilities" },
      { id: "referrals", label: "Referral Analytics", icon: "↗", path: "/admin/referrals" },
      { id: "gaps", label: "Care Gaps & Alerts", icon: "⚠", path: "/admin/gaps" },
      { id: "quality", label: "Quality Audit", icon: "◈", path: "/admin/quality" }
    ]
  }
};

/**
 * Helper: Retrieve role configuration
 */
export const getRoleConfig = (role) => {
  return roleConfigs[role] || roleConfigs[ROLES.PATIENT];
};

/**
 * Helper: Check if a role has specific permission
 */
export const hasPermission = (role, permission) => {
  const config = getRoleConfig(role);
  return config.permissions?.includes(permission) || false;
};

/**
 * Helper: Get mock profile for a given role
 */
export const getMockUserByRole = (role) => {
  return getRoleConfig(role)?.mockUser || null;
};

export default roleConfigs;