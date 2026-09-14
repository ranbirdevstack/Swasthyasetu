/**
 * SWASTHYASETU - FACILITIES DATA MODULE
 * Comprehensive directory of Sub-Centres, PHCs, CHCs, and District Hospitals
 * with live availability metrics, diagnostics, doctors, and operational statuses.
 */

export const facilityCategories = [
  { id: "all", label: "All Facilities" },
  { id: "CHC", label: "CHCs" },
  { id: "PHC", label: "PHCs" },
  { id: "Sub-Centre", label: "Arogya Mandirs" },
  { id: "District Hospital", label: "Hospitals" }
];

export const facilities = [
  {
    id: "fac-1",
    name: "Community Health Centre (CHC) Shivpur",
    type: "Community Health Centre",
    category: "CHC",
    distance: "2.4 km",
    distanceKm: 2.4,
    rating: 4.6,
    score: 94,
    openStatus: "Open 24/7",
    isOpen: true,
    emergency: true,
    address: "Station Road, Shivpur Rural Block, Varanasi",
    contact: "+91 542 228901",
    doctor: "Dr. Ananya Sharma (General Physician)",
    availableDoctors: 4,
    diagnostics: "CBC, Blood Sugar, X-Ray, ECG, Urine Routine",
    medicine: "92% Stocked (Essential Drug List)",
    wait: "15-20 mins",
    bedsAvailable: 14,
    totalBeds: 30,
    services: [
      "Emergency Care",
      "Maternal & Child Health",
      "Pathology Lab",
      "Minor OT",
      "Pharmacy"
    ],
    coordinates: { lat: 25.352, lng: 82.964 },
    ambulanceAvailable: true,
    timings: "24 Hours (Emergency) | 08:00 AM - 02:00 PM (OPD)",
    specialties: ["General Medicine", "Obstetrics & Gynaecology", "Pediatrics"]
  },
  {
    id: "fac-2",
    name: "Primary Health Centre (PHC) Harhua",
    type: "Primary Health Centre",
    category: "PHC",
    distance: "5.8 km",
    distanceKm: 5.8,
    rating: 4.2,
    score: 82,
    openStatus: "Open till 06:00 PM",
    isOpen: true,
    emergency: false,
    address: "Bazar Road, Harhua Gram Panchayat, Varanasi Rural",
    contact: "+91 542 228902",
    doctor: "Dr. Rajesh Verma (MBBS)",
    availableDoctors: 2,
    diagnostics: "Blood Sugar, Haemoglobin, Rapid Malaria, Rapid Dengue",
    medicine: "78% Stocked",
    wait: "30-40 mins",
    bedsAvailable: 4,
    totalBeds: 6,
    services: [
      "General OPD",
      "Universal Immunization",
      "Basic Diagnostic Tests",
      "Pharmacy"
    ],
    coordinates: { lat: 25.385, lng: 82.921 },
    ambulanceAvailable: false,
    timings: "08:00 AM - 06:00 PM",
    specialties: ["General Practice", "Family Welfare"]
  },
  {
    id: "fac-3",
    name: "Ayushman Arogya Mandir (Sub-Centre) Kashi",
    type: "Sub-Health Centre",
    category: "Sub-Centre",
    distance: "1.1 km",
    distanceKm: 1.1,
    rating: 4.5,
    score: 88,
    openStatus: "Open till 04:00 PM",
    isOpen: true,
    emergency: false,
    address: "Village Post Kashi Rural, Near Panchayat Bhavan",
    contact: "+91 542 228903",
    doctor: "CHO Ritu Patel / ANM Sangeeta",
    availableDoctors: 1,
    diagnostics: "Digital BP, Glucometer, Haemoglobin Strip, Pregnancy Kits",
    medicine: "Essential First-Line Kits Available",
    wait: "5-10 mins",
    bedsAvailable: 0,
    totalBeds: 0,
    services: [
      "NCD Screening",
      "First Aid",
      "Antenatal Checkups",
      "Teleconsultation"
    ],
    coordinates: { lat: 25.321, lng: 82.983 },
    ambulanceAvailable: false,
    timings: "09:00 AM - 04:00 PM",
    specialties: ["Community Health", "Maternal Care"]
  },
  {
    id: "fac-4",
    name: "Pandit Deen Dayal Upadhyaya District Hospital",
    type: "District Hospital",
    category: "District Hospital",
    distance: "11.2 km",
    distanceKm: 11.2,
    rating: 4.7,
    score: 96,
    openStatus: "Open 24/7",
    isOpen: true,
    emergency: true,
    address: "Pandeypur, Varanasi District Central",
    contact: "+91 542 250100",
    doctor: "Dr. Sandeep Gupta (Chief Medical Officer / Specialist)",
    availableDoctors: 18,
    diagnostics: "CT Scan, USG, Digital X-Ray, Full Biochemistry, Blood Bank",
    medicine: "96% Stocked (Full Formulary)",
    wait: "45-60 mins",
    bedsAvailable: 38,
    totalBeds: 150,
    services: [
      "24/7 Trauma Care",
      "ICU & NICU",
      "Specialty OPD",
      "Surgical Units",
      "In-House Blood Bank"
    ],
    coordinates: { lat: 25.334, lng: 82.998 },
    ambulanceAvailable: true,
    timings: "24 Hours (All Services)",
    specialties: [
      "Cardiology",
      "Orthopedics",
      "General Surgery",
      "Pediatrics",
      "Gynecology"
    ]
  },
  {
    id: "fac-5",
    name: "Primary Health Centre (PHC) Cholapur",
    type: "Primary Health Centre",
    category: "PHC",
    distance: "8.5 km",
    distanceKm: 8.5,
    rating: 4.1,
    score: 79,
    openStatus: "Open till 04:30 PM",
    isOpen: true,
    emergency: false,
    address: "Cholapur Block Headquarters, Varanasi Rural",
    contact: "+91 542 228905",
    doctor: "Dr. Vikas Singh (MBBS)",
    availableDoctors: 1,
    diagnostics: "Blood Sugar, Malaria Card, Sputum Collection",
    medicine: "72% Stocked",
    wait: "25-35 mins",
    bedsAvailable: 2,
    totalBeds: 4,
    services: [
      "General OPD",
      "TB Dots Centre",
      "Childhood Vaccination",
      "Pharmacy"
    ],
    coordinates: { lat: 25.421, lng: 83.045 },
    ambulanceAvailable: false,
    timings: "08:30 AM - 04:30 PM",
    specialties: ["General Medicine", "Infectious Disease Screening"]
  }
];

/**
 * Filter Facilities by Category
 */
export const getFacilitiesByCategory = (category = "all") => {
  if (category === "all") return facilities;
  return facilities.filter((f) => f.category === category);
};

/**
 * Filter Emergency Facilities
 */
export const getEmergencyFacilities = () => {
  return facilities.filter((f) => f.emergency && f.isOpen);
};

/**
 * Get Facility by ID
 */
export const getFacilityById = (id) => {
  return facilities.find((f) => f.id === id) || null;
};

export default facilities;