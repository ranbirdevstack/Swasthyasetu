// src/pages/PatientDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosClient.js";
import FacilityMap from "../../components/FacilityMap.jsx";
import CallModal from "../../components/CallModal.jsx";
import { getPatientRecord } from "../../api/medicalRecords.js";
import "./PatientDashboard.css";

function InfoItem({ label, value }) {
  return <div><span className="info-label">{label}</span><strong>{value || "—"}</strong></div>;
}

function PatientDashboard() {
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [showProfile, setShowProfile] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [menuHistory, setMenuHistory] = useState([]);
  const [medicalRecord, setMedicalRecord] = useState(() => getPatientRecord("Shivam"));

  useEffect(() => {
    setMedicalRecord(getPatientRecord("Shivam"));
  }, [activeMenu]);

  const [facilitySearch, setFacilitySearch] = useState("");
  const [facilityFilter, setFacilityFilter] = useState("All Facilities");
  const [facilityViewMode, setFacilityViewMode] = useState("grid");
  const [selectedFacility, setSelectedFacility] = useState(null);

  const [recommendationType, setRecommendationType] = useState("General");
  const [recommendationLocation, setRecommendationLocation] = useState("Choubeypur");
  const [selectedPreferences, setSelectedPreferences] = useState(["Nearby"]);
  const [hasRecommended, setHasRecommended] = useState(false);

  const [triageSymptoms, setTriageSymptoms] = useState([]);
  const [triageSeverity, setTriageSeverity] = useState("");
  const [triageDuration, setTriageDuration] = useState("");
  const [triageAgeGroup, setTriageAgeGroup] = useState("");
  const [triageRedFlags, setTriageRedFlags] = useState([]);
  const [triageOther, setTriageOther] = useState("");
  const [triageResult, setTriageResult] = useState(null);
  const [triageHistory, setTriageHistory] = useState([]);

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      date: "Sep 04, 2026",
      time: "10:30 AM",
      doctor: "General Physician",
      facility: "Community Health Centre",
      location: "Choubeypur",
      type: "General Consultation",
      status: "Confirmed",
    },
    {
      id: 2,
      date: "Sep 10, 2026",
      time: "11:30 AM",
      doctor: "Medical Officer",
      facility: "Primary Health Centre Choubeypur",
      location: "Choubeypur",
      type: "Video Consultation",
      status: "Upcoming",
    },
  ]);

  const [appointmentForm, setAppointmentForm] = useState({
    facility: "",
    type: "General Consultation",
    date: "",
    time: "",
  });

  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [activeCallAppointment, setActiveCallAppointment] = useState(null);
  const [viewDocument, setViewDocument] = useState(null);
  const [viewReport, setViewReport] = useState(null);

  const [referrals] = useState([
    {
      id: 1,
      patient: "Shivam",
      from: "PHC Choubeypur",
      to: "District Hospital",
      reason: "Further diagnostic evaluation",
      date: "Aug 26, 2026",
      status: "In Progress",
      progress: 75,
    },
    {
      id: 2,
      patient: "Shivam",
      from: "Community Health Centre",
      to: "Rural Diagnostic Centre",
      reason: "Routine diagnostic testing",
      date: "Aug 28, 2026",
      status: "Accepted",
      progress: 50,
    },
  ]);

  const [medicineSearch, setMedicineSearch] = useState("");
  const [medicineFilter, setMedicineFilter] = useState("All");

  const medicines = [
    {
      id: 1,
      name: "Paracetamol 500 mg",
      generic: "Paracetamol",
      pharmacy: "Jan Aushadhi Pharmacy",
      location: "Choubeypur Market",
      stock: "In Stock",
      quantity: "Available",
      price: "Affordable",
    },
    {
      id: 2,
      name: "ORS Sachets",
      generic: "Oral Rehydration Salts",
      pharmacy: "Jan Aushadhi Pharmacy",
      location: "Choubeypur Market",
      stock: "In Stock",
      quantity: "Available",
      price: "Affordable",
    },
    {
      id: 3,
      name: "Vitamin B Complex",
      generic: "Vitamin B",
      pharmacy: "Community Pharmacy",
      location: "Choubeypur",
      stock: "Limited",
      quantity: "Few units",
      price: "Affordable",
    },
    {
      id: 4,
      name: "Antacid Tablets",
      generic: "Antacid",
      pharmacy: "Rural Pharmacy",
      location: "Choubeypur Road",
      stock: "Out of Stock",
      quantity: "Currently unavailable",
      price: "—",
    },
  ];

  const [diagnosticTests, setDiagnosticTests] = useState([
    {
      id: 1,
      name: "Complete Blood Count",
      short: "CBC",
      centre: "Rural Diagnostic Centre",
      date: "Sep 02, 2026",
      status: "Scheduled",
      report: "Pending",
    },
    {
      id: 2,
      name: "Blood Sugar Test",
      short: "BS",
      centre: "Choubeypur Pathology Lab",
      date: "Aug 28, 2026",
      status: "Completed",
      report: "Available",
    },
    {
      id: 3,
      name: "Urine Routine Test",
      short: "URT",
      centre: "Choubeypur Pathology Lab",
      date: "Aug 28, 2026",
      status: "Completed",
      report: "Available",
    },
  ]);

  const [diagnosticForm, setDiagnosticForm] = useState({
    test: "",
    centre: "",
    date: "",
  });

  const [followUps, setFollowUps] = useState([
    {
      id: 1,
      title: "Post-diagnostic consultation",
      doctor: "General Physician",
      facility: "Community Health Centre",
      date: "Sep 04, 2026",
      time: "10:30 AM",
      status: "Upcoming",
      reminder: true,
    },
    {
      id: 2,
      title: "Health progress review",
      doctor: "Medical Officer",
      facility: "PHC Choubeypur",
      date: "Sep 18, 2026",
      time: "11:00 AM",
      status: "Scheduled",
      reminder: false,
    },
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Appointment confirmed",
      message: "Your general consultation is confirmed for Sep 04, 2026.",
      time: "Today, 8:10 AM",
      read: false,
      type: "appointment",
    },
    {
      id: 2,
      title: "Diagnostic referral update",
      message: "Your diagnostic referral is currently in progress.",
      time: "Yesterday",
      read: false,
      type: "referral",
    },
    {
      id: 3,
      title: "Follow-up reminder",
      message: "Your upcoming follow-up is scheduled for Sep 04.",
      time: "Aug 29",
      read: true,
      type: "followup",
    },
  ]);

  const [profile, setProfile] = useState({
    id: "",
    name: "Shivam",
    age: "21",
    phone: "9876543210",
    email: "shivam@example.com",
    password: "password123",
    location: "Choubeypur, Varanasi",
    emergencyContact: "Family Contact",
    profilePicture: "",
  });

  const [editProfile, setEditProfile] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordToast, setPasswordToast] = useState("");

  useEffect(() => {
    const savedUser =
      localStorage.getItem("swasthya_user") ||
      localStorage.getItem("swasthyasetu_logged_in_user");
    const cachedName = localStorage.getItem("userName");

    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setProfile((prev) => ({
          ...prev,
          id: parsed.id || parsed._id || prev.id,
          name: parsed.name || prev.name,
          email: parsed.email || prev.email,
          phone: parsed.phone || prev.phone,
          password: parsed.password || prev.password,
          location: parsed.address || parsed.location || prev.location,
        }));
      } catch (err) {
        console.warn("Failed parsing saved user", err);
      }
    } else if (cachedName) {
      setProfile((prev) => ({ ...prev, name: cachedName }));
    }

    const fetchPatientData = async () => {
      try {
        const res = await api.get("/patient/dashboard");
        if (res.data) {
          if (res.data.profile) setProfile(res.data.profile);
          if (res.data.appointments) setAppointments(res.data.appointments);
        }
      } catch {}
    };

    fetchPatientData();
  }, []);

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    setProfile((prev) => ({ ...prev, password: newPassword }));

    try {
      const mockUsers = localStorage.getItem("swasthya_mock_users");
      if (mockUsers) {
        const users = JSON.parse(mockUsers);
        const updated = users.map((u) =>
          u.email.toLowerCase() === profile.email.toLowerCase()
            ? { ...u, password: newPassword }
            : u
        );
        localStorage.setItem("swasthya_mock_users", JSON.stringify(updated));
      }

      const currentUser = localStorage.getItem("swasthya_user");
      if (currentUser) {
        const user = JSON.parse(currentUser);
        user.password = newPassword;
        localStorage.setItem("swasthya_user", JSON.stringify(user));
      }
    } catch (err) {
      console.warn("Failed syncing password to localStorage", err);
    }

    setShowPasswordModal(false);
    setNewPassword("");
    setPasswordToast("Password updated successfully!");
    setTimeout(() => setPasswordToast(""), 3000);
  };

  const [settings, setSettings] = useState({
    appointmentReminder: true,
    referralUpdates: true,
    medicineUpdates: true,
    language: "English",
  });

  const menuItems = [
    { name: "Dashboard", icon: "⌂" },
    { name: "Find Facility", icon: "⌖" },
    { name: "Smart Recommendation", icon: "✦" },
    { name: "Digital Triage", icon: "✚" },
    { name: "Appointments", icon: "▣" },
    { name: "Referrals", icon: "↗" },
    { name: "Medicines", icon: "▤" },
    { name: "Diagnostics", icon: "⌕" },
    { name: "Follow-up", icon: "♥" },
    { name: "Care Journey", icon: "◈" },
    { name: "Medical History", icon: "▣" },
  ];

  const facilities = [
    {
      id: 1,
      name: "Community Health Centre",
      type: "CHC",
      category: "Hospitals",
      specialty: "General Medicine",
      location: "Choubeypur",
      hours: "8:00 AM – 8:00 PM",
      status: "Open",
      availability: true,
      affordable: true,
      distance: 2,
      icon: "✚",
      services: [
        "General Medicine",
        "Emergency Care",
        "Primary Care",
      ],
      description:
        "A nearby community health centre providing general consultation, primary care and basic emergency services.",
      phone: "+91 98765 43210",
    },
    {
      id: 2,
      name: "Rural Diagnostic Centre",
      type: "Diagnostic Centre",
      category: "Diagnostics",
      specialty: "Laboratory",
      location: "Choubeypur Road",
      hours: "9:00 AM – 6:00 PM",
      status: "Available",
      availability: true,
      affordable: true,
      distance: 3,
      icon: "⌕",
      services: [
        "Blood Test",
        "Laboratory",
        "Diagnostic Tests",
      ],
      description:
        "A local diagnostic centre providing laboratory services and common diagnostic tests.",
      phone: "+91 98765 43211",
    },
    {
      id: 3,
      name: "Jan Aushadhi Pharmacy",
      type: "Pharmacy",
      category: "Pharmacy",
      specialty: "Generic Medicines",
      location: "Choubeypur Market",
      hours: "8:00 AM – 9:00 PM",
      status: "Open",
      availability: true,
      affordable: true,
      distance: 1,
      icon: "▤",
      services: [
        "Medicines",
        "Generic Medicines",
        "Stock Check",
      ],
      description:
        "A nearby pharmacy providing affordable generic medicines and basic stock information.",
      phone: "+91 98765 43212",
    },
    {
      id: 4,
      name: "Primary Health Centre Choubeypur",
      type: "PHC",
      category: "PHC / CHC",
      specialty: "Primary Care",
      location: "Choubeypur",
      hours: "8:00 AM – 5:00 PM",
      status: "Open",
      availability: true,
      affordable: true,
      distance: 2,
      icon: "✚",
      services: [
        "Primary Care",
        "General Consultation",
        "Health Check-up",
      ],
      description:
        "Primary healthcare facility offering general consultation and routine health check-ups.",
      phone: "+91 98765 43213",
    },
    {
      id: 5,
      name: "Rural Multi-Specialty Hospital",
      type: "Hospital",
      category: "Hospitals",
      specialty: "General & Specialist Care",
      location: "Varanasi Road",
      hours: "24 Hours",
      status: "Open",
      availability: true,
      affordable: false,
      distance: 8,
      icon: "✚",
      services: [
        "General Medicine",
        "Specialist Consultation",
        "Emergency Care",
      ],
      description:
        "A larger healthcare facility offering general and specialist consultations.",
      phone: "+91 98765 43214",
    },
    {
      id: 6,
      name: "Choubeypur Pathology Lab",
      type: "Laboratory",
      category: "Diagnostics",
      specialty: "Pathology",
      location: "Choubeypur Market",
      hours: "7:30 AM – 7:00 PM",
      status: "Available",
      availability: true,
      affordable: true,
      distance: 1,
      icon: "⌕",
      services: [
        "Blood Test",
        "Urine Test",
        "Pathology",
      ],
      description:
        "A pathology laboratory providing routine laboratory and pathology testing.",
      phone: "+91 98765 43215",
    },
  ];

  const filteredFacilities = facilities.filter((facility) => {
    const search = facilitySearch.trim().toLowerCase();

    const matchesSearch =
      !search ||
      facility.name.toLowerCase().includes(search) ||
      facility.type.toLowerCase().includes(search) ||
      facility.category.toLowerCase().includes(search) ||
      facility.specialty.toLowerCase().includes(search) ||
      facility.location.toLowerCase().includes(search) ||
      facility.services.some((service) =>
        service.toLowerCase().includes(search)
      );

    const matchesFilter =
      facilityFilter === "All Facilities" ||
      facility.category === facilityFilter;

    return matchesSearch && matchesFilter;
  });

  const getRecommendationScore = (facility) => {
    let score = 40;

    if (recommendationType === "General") {
      if (
        facility.services.includes("General Medicine") ||
        facility.services.includes("General Consultation") ||
        facility.services.includes("Primary Care")
      ) {
        score += 35;
      }
    }

    if (recommendationType === "Emergency") {
      if (facility.services.includes("Emergency Care")) score += 45;
      if (facility.hours === "24 Hours") score += 10;
    }

    if (recommendationType === "Diagnostics") {
      if (
        facility.category === "Diagnostics" ||
        facility.services.includes("Diagnostic Tests") ||
        facility.services.includes("Blood Test")
      ) {
        score += 45;
      }
    }

    if (recommendationType === "Specialist") {
      if (
        facility.category === "Hospitals" ||
        facility.specialty.includes("Specialist")
      ) {
        score += 40;
      }
    }

    if (recommendationType === "Medicine") {
      if (facility.category === "Pharmacy") score += 45;
    }

    if (
      recommendationLocation &&
      facility.location
        .toLowerCase()
        .includes(recommendationLocation.toLowerCase())
    ) {
      score += 20;
    }

    if (selectedPreferences.includes("Nearby")) {
      if (facility.distance <= 3) score += 15;
      else if (facility.distance <= 5) score += 7;
    }

    if (
      selectedPreferences.includes("Available Now") &&
      facility.availability
    ) {
      score += 15;
    }

    if (
      selectedPreferences.includes("Affordable") &&
      facility.affordable
    ) {
      score += 15;
    }

    return Math.min(score, 99);
  };

  const recommendedFacilities = useMemo(() => {
    return facilities
      .map((facility) => ({
        ...facility,
        recommendationScore: getRecommendationScore(facility),
      }))
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 3);
  }, [recommendationType, recommendationLocation, selectedPreferences]);

  const symptomOptions = [
    { id: "fever", label: "Fever", icon: "🌡" },
    { id: "cough", label: "Cough", icon: "◌" },
    { id: "cold", label: "Cold / Runny Nose", icon: "❄" },
    { id: "headache", label: "Headache", icon: "◉" },
    { id: "stomach", label: "Stomach Pain", icon: "○" },
    { id: "vomiting", label: "Vomiting", icon: "↻" },
    { id: "diarrhea", label: "Diarrhea", icon: "≈" },
    { id: "breathing", label: "Breathing Difficulty", icon: "♡" },
    { id: "chest", label: "Chest Discomfort", icon: "♥" },
    { id: "dizziness", label: "Dizziness", icon: "✧" },
    { id: "weakness", label: "Weakness / Fatigue", icon: "⚡" },
    { id: "pain", label: "Other Pain", icon: "✚" },
  ];

  const redFlagOptions = [
    { id: "severeBreathing", label: "Severe difficulty breathing" },
    { id: "severeChest", label: "Severe or persistent chest discomfort" },
    { id: "unconscious", label: "Loss of consciousness or extreme unresponsiveness" },
    { id: "heavyBleeding", label: "Heavy bleeding that does not stop" },
    { id: "severeConfusion", label: "Severe confusion or sudden major change in alertness" },
    { id: "strokeSigns", label: "Sudden trouble speaking, seeing or moving normally" },
    { id: "other", label: "Other warning sign" },
  ];

  const toggleTriageSymptom = (symptom) => {
    setTriageSymptoms((current) =>
      current.includes(symptom)
        ? current.filter((item) => item !== symptom)
        : [...current, symptom]
    );
    setTriageResult(null);
  };

  const toggleRedFlag = (flag) => {
    setTriageRedFlags((current) =>
      current.includes(flag)
        ? current.filter((item) => item !== flag)
        : [...current, flag]
    );
    setTriageResult(null);
  };

  const analyzeTriage = () => {
    if (
      triageSymptoms.length === 0 ||
      !triageSeverity ||
      !triageDuration ||
      !triageAgeGroup
    ) {
      setTriageResult({
        type: "incomplete",
        title: "Please complete the assessment",
        message: "Select at least one symptom and complete all required fields.",
        action: "Complete the required information.",
      });
      return;
    }

    if (triageRedFlags.length > 0) {
      const emergencyFacility = facilities.find((f) =>
        f.services.includes("Emergency Care")
      );

      setTriageResult({
        type: "emergency",
        priority: "URGENT",
        title: "Urgent medical attention may be needed",
        message:
          "The information provided includes a warning sign that may require urgent medical evaluation.",
        action:
          "Seek immediate medical help or contact your local emergency service. Do not rely only on this digital assessment.",
        facility: emergencyFacility,
      });

      setTriageHistory((current) => [
        {
          id: Date.now(),
          date: new Date().toLocaleString(),
          priority: "URGENT",
          symptoms: triageSymptoms,
        },
        ...current,
      ]);

      return;
    }

    let priority = "ROUTINE";
    let title = "Routine care may be appropriate";
    let message =
      "Your selected information does not indicate an obvious urgent warning sign.";
    let action =
      "Consider routine consultation if symptoms continue or concern you.";

    if (triageSeverity === "Severe") {
      priority = "HIGH";
      title = "Prompt medical evaluation recommended";
      message =
        "Because you selected severe symptoms, medical evaluation should be considered promptly.";
      action = "Consider visiting a healthcare facility as soon as possible.";
    } else if (
      triageSeverity === "Moderate" ||
      triageDuration === "More than 1 week"
    ) {
      priority = "MODERATE";
      title = "Medical consultation recommended";
      message =
        "Your symptoms may benefit from assessment by a healthcare professional.";
      action =
        "Consider booking a consultation at a nearby PHC, CHC or hospital.";
    }

    if (
      triageSymptoms.includes("breathing") ||
      triageSymptoms.includes("chest")
    ) {
      priority = "HIGH";
      title = "Prompt medical evaluation recommended";
      message =
        "Breathing difficulty or chest-related symptoms should be assessed by a healthcare professional.";
      action =
        "Consider seeking medical evaluation promptly. If symptoms become severe, seek emergency care.";
    }

    const facility =
      priority === "HIGH"
        ? facilities.find((f) => f.services.includes("Emergency Care"))
        : facilities.find((f) => f.category === "PHC / CHC");

    const result = {
      type: "normal",
      priority,
      title,
      message,
      action,
      facility,
    };

    setTriageResult(result);

    setTriageHistory((current) => [
      {
        id: Date.now(),
        date: new Date().toLocaleString(),
        priority,
        symptoms: triageSymptoms,
      },
      ...current,
    ]);
  };

  const resetTriage = () => {
    setTriageSymptoms([]);
    setTriageSeverity("");
    setTriageDuration("");
    setTriageAgeGroup("");
    setTriageRedFlags([]);
    setTriageOther("");
    setTriageResult(null);
  };

  const handleMenuClick = (menuName) => {
    if (menuName !== activeMenu) {
      setMenuHistory((current) => [...current, activeMenu]);
    }

    setActiveMenu(menuName);
    setShowProfile(false);
    setMobileSidebar(false);

    if (menuName === "Find Facility") {
      setFacilitySearch("");
      setFacilityFilter("All Facilities");
    }
  };

  const handleBack = () => {
    setMenuHistory((current) => {
      if (current.length === 0) {
        setActiveMenu("Dashboard");
        return current;
      }

      const nextHistory = [...current];
      const targetMenu = nextHistory.pop();

      setActiveMenu(targetMenu || "Dashboard");
      return nextHistory;
    });

    setShowProfile(false);
    setMobileSidebar(false);
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfile((current) => ({
        ...current,
        profilePicture: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("swasthya_role");
    localStorage.removeItem("swasthya_user");
    navigate("/");
  };

  const togglePreference = (preference) => {
    setSelectedPreferences((current) =>
      current.includes(preference)
        ? current.filter((item) => item !== preference)
        : [...current, preference]
    );
  };


  const APPOINTMENT_CAPACITY = 5;
  const getTodayISO = () => new Date().toISOString().slice(0, 10);
  const getBookingCount = (date) => {
    const localCount = appointments.filter((a) => a.date === date && a.status !== "Cancelled").length;
    try {
      const registry = JSON.parse(localStorage.getItem("swasthya_appointment_bookings") || "[]");
      return Math.max(localCount, registry.filter((a) => a.date === date && a.status !== "Cancelled").length);
    } catch { return localCount; }
  };
  const selectedCapacityDate = appointmentForm.date || getTodayISO();
  const bookedSeats = getBookingCount(selectedCapacityDate);
  const seatsLeft = Math.max(0, APPOINTMENT_CAPACITY - bookedSeats);
  const isAppointmentFull = seatsLeft === 0;

  const bookAppointment = async () => {
    if (
      isAppointmentFull ||
      !appointmentForm.facility ||
      !appointmentForm.date ||
      !appointmentForm.time
    ) {
      alert(isAppointmentFull ? "This date is fully booked. Please choose another date." : "Please select facility, date and time.");
      return;
    }

    const newAppointment = {
      id: Date.now(),
      date: appointmentForm.date,
      time: appointmentForm.time,
      doctor: "General Physician",
      facility: appointmentForm.facility,
      location: "Choubeypur",
      type: appointmentForm.type,
      status: "Confirmed",
    };

    try {
      await api.post("/patient/appointments", newAppointment);
    } catch {
      console.warn("Appointment booked locally (offline mode)");
    }

    // Keep a shared local booking registry for the prototype so different roles/tabs
    // can see daily capacity and prevent overbooking. Doctor acceptance still confirms the slot.
    let registry = [];
    try { registry = JSON.parse(localStorage.getItem("swasthya_appointment_bookings") || "[]"); } catch {}
    const hasSameSlot = registry.some((item) =>
      item.date === newAppointment.date && item.time === newAppointment.time && item.status !== "Cancelled"
    );
    const appointmentWithStatus = { ...newAppointment, status: hasSameSlot ? "Pending" : "Confirmed" };
    registry.push(appointmentWithStatus);
    localStorage.setItem("swasthya_appointment_bookings", JSON.stringify(registry));
    setAppointments((current) => [appointmentWithStatus, ...current]);
    setAppointmentForm({
      facility: "",
      type: "General Consultation",
      date: "",
      time: "",
    });
    setShowAppointmentForm(false);
  };

  const cancelAppointment = (id) => {
    setAppointments((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: "Cancelled" } : item
      )
    );
  };

  const filteredMedicines = medicines.filter((medicine) => {
    const search = medicineSearch.toLowerCase();
    const matchesSearch =
      medicine.name.toLowerCase().includes(search) ||
      medicine.generic.toLowerCase().includes(search) ||
      medicine.pharmacy.toLowerCase().includes(search);

    const matchesFilter =
      medicineFilter === "All" || medicine.stock === medicineFilter;

    return matchesSearch && matchesFilter;
  });

  const bookDiagnostic = () => {
    if (
      !diagnosticForm.test ||
      !diagnosticForm.centre ||
      !diagnosticForm.date
    ) {
      alert("Please complete all diagnostic booking fields.");
      return;
    }

    setDiagnosticTests((current) => [
      {
        id: Date.now(),
        name: diagnosticForm.test,
        short: "TEST",
        centre: diagnosticForm.centre,
        date: diagnosticForm.date,
        status: "Scheduled",
        report: "Pending",
      },
      ...current,
    ]);

    setDiagnosticForm({
      test: "",
      centre: "",
      date: "",
    });
  };

  const unreadCount = notifications.filter((item) => !item.read).length;

  const markNotificationRead = (id) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, read: true } : item
      )
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        read: true,
      }))
    );
  };

  const toggleReminder = (id) => {
    setFollowUps((current) =>
      current.map((item) =>
        item.id === id ? { ...item, reminder: !item.reminder } : item
      )
    );
  };

  const PageHeader = ({ eyebrow, title, description, icon }) => (
    <div className="module-page-header">
      <div>
        <span className="section-mini-label">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className="module-header-actions">
        <button
          type="button"
          className="module-back-button"
          onClick={handleBack}
        >
          ← Go Back
        </button>

        <div className="module-header-icon">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="patient-dashboard">
      {mobileSidebar && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileSidebar(false)}
        />
      )}

      <aside className={`patient-sidebar ${mobileSidebar ? "mobile-sidebar-open" : ""}`}>
        <button
          className="mobile-sidebar-close"
          onClick={() => setMobileSidebar(false)}
        >
          ×
        </button>

        <div className="dashboard-brand">
          <div className="dashboard-brand-logo">✚</div>
          <div className="dashboard-brand-text">
            <strong>SwasthyaSetu</strong>
            <span>Connected Care</span>
          </div>
        </div>

        <div className="sidebar-role">
          <div className="sidebar-role-icon">♙</div>
          <div>
            <small>LOGGED IN AS</small>
            <strong>Patient</strong>
          </div>
        </div>

        <nav className="dashboard-navigation patient-scroll-navigation">
          <div className="navigation-label">MAIN MENU</div>

          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`dashboard-nav-item ${activeMenu === item.name ? "active" : ""}`}
              onClick={() => handleMenuClick(item.name)}
            >
              <span className="nav-item-icon">{item.icon}</span>
              <span className="nav-item-text">{item.name}</span>
              {activeMenu === item.name && (
                <span className="nav-active-indicator">›</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            className={`sidebar-nav-item ${activeMenu === "Notifications" ? "active" : ""}`}
            onClick={() => handleMenuClick("Notifications")}
          >
            <span className="nav-item-icon">🔔</span>
            <span className="nav-item-text">Notifications</span>
            {unreadCount > 0 && <b className="sidebar-unread-badge">{unreadCount}</b>}
          </button>
          <button
            className="sidebar-help-button"
            onClick={() => alert("For support, please contact your healthcare facility.")}
          >
            <span>?</span>
            Help & Support
          </button>

          <button className="sidebar-logout" onClick={handleLogout}>
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu-icon"
              onClick={() => setMobileSidebar(true)}
            >
              ☰
            </button>

            <div>
              <span className="topbar-section-label">PATIENT PORTAL</span>
              <h1>{activeMenu}</h1>
            </div>
          </div>

          <div className="topbar-right">
            <button
              className="notification-button"
              onClick={() => handleMenuClick("Notifications")}
            >
              <span>🔔</span>
              {unreadCount > 0 && <i>{unreadCount}</i>}
            </button>

            <button
              className="topbar-profile"
              onClick={() => setShowProfile(!showProfile)}
            >
              <div className="profile-avatar">
                {profile.profilePicture ? (
                  <img src={profile.profilePicture} alt="Profile" />
                ) : (
                  (profile.name || "Patient")
                    .trim()
                    .split(/\s+/)
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                )}
              </div>

              <div className="profile-info">
                <strong>{profile.name || "Patient"}</strong>
                <span>Patient</span>
              </div>

              <span className="profile-arrow">▾</span>
            </button>

            {showProfile && (
              <div className="profile-dropdown">
                <div className="dropdown-profile">
                  <div className="profile-avatar large">
                    {profile.profilePicture ? (
                      <img src={profile.profilePicture} alt="Profile" />
                    ) : (
                      (profile.name || "Patient")
                        .trim()
                        .split(/\s+/)
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    )}
                  </div>

                  <div>
                    <strong>{profile.name || "Patient"}</strong>
                    <span>Patient Account</span>
                  </div>
                </div>

                <div className="dropdown-divider" />

                <button
                  onClick={() => {
                    setShowProfile(false);
                    setActiveMenu("My Profile");
                  }}
                >
                  👤 My Profile
                </button>

                <button
                  onClick={() => {
                    setShowProfile(false);
                    setActiveMenu("Settings");
                  }}
                >
                  ⚙ Settings
                </button>

                <button onClick={handleLogout}>↪ Logout</button>
              </div>
            )}
          </div>
        </header>

        <main className="dashboard-content">
          {passwordToast && (
            <div
              style={{
                background: "var(--primary-light, #e6f7f5)",
                color: "var(--primary-dark, #08746e)",
                padding: "12px 18px",
                borderRadius: "10px",
                marginBottom: "20px",
                fontWeight: "600",
                fontSize: "14px",
                border: "1px solid var(--primary, #08746e)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>✓</span> {passwordToast}
            </div>
          )}

          {activeMenu === "Dashboard" && (
            <>
              <section className="welcome-banner">
                <div className="welcome-content">
                  <span className="welcome-eyebrow">YOUR HEALTHCARE JOURNEY</span>
                  <h2>Welcome, {profile.name || "Patient"}.</h2>
                  <p>
                    Stay connected with your healthcare journey and access the care you need.
                  </p>
                </div>

                <div className="welcome-visual">
                  <div className="welcome-circle circle-one" />
                  <div className="welcome-circle circle-two" />
                  <div className="welcome-cross">✚</div>
                </div>
              </section>

              <section className="care-alert">
                <div className="care-alert-icon">!</div>
                <div className="care-alert-content">
                  <span>CARE JOURNEY UPDATE</span>
                  <strong>Your diagnostic referral is awaiting completion.</strong>
                  <p>Complete your diagnostic test before your scheduled follow-up.</p>
                </div>

                <button onClick={() => handleMenuClick("Care Journey")}>
                  View Journey →
                </button>
              </section>

              <section className="dashboard-section">
                <div className="dashboard-section-header">
                  <div>
                    <span className="section-mini-label">QUICK ACCESS</span>
                    <h2>What would you like to do?</h2>
                  </div>
                </div>

                <div className="quick-actions-grid">
                  {[
                    [
                      "Find a Facility",
                      "Locate nearby healthcare services",
                      "⌖",
                      "Find Facility",
                    ],
                    [
                      "Smart Recommendation",
                      "Find the most suitable facility",
                      "✦",
                      "Smart Recommendation",
                    ],
                    [
                      "Digital Triage",
                      "Understand your care requirement",
                      "✚",
                      "Digital Triage",
                    ],
                    [
                      "Book Appointment",
                      "Check available appointments",
                      "▣",
                      "Appointments",
                    ],
                  ].map((item) => (
                    <button
                      key={item[0]}
                      className="quick-action-card"
                      onClick={() => handleMenuClick(item[3])}
                    >
                      <div className="quick-action-icon">{item[2]}</div>
                      <div className="quick-action-content">
                        <h3>{item[0]}</h3>
                        <p>{item[1]}</p>
                      </div>
                      <span className="quick-action-arrow">→</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="dashboard-overview-grid">
                <div className="dashboard-card">
                  <div className="card-header">
                    <div>
                      <span>UPCOMING APPOINTMENT</span>
                      <h3>Your next visit</h3>
                    </div>
                    <div className="card-header-icon">▣</div>
                  </div>

                  <div className="appointment-date">
                    <div className="date-box">
                      <span>SEP</span>
                      <strong>04</strong>
                    </div>
                    <div>
                      <strong>General Consultation</strong>
                      <span>10:30 AM</span>
                    </div>
                  </div>

                  <div className="appointment-facility">
                    <span className="facility-icon">⌖</span>
                    <div>
                      <strong>Community Health Centre</strong>
                      <span>Choubeypur</span>
                    </div>
                    <span className="appointment-status">Confirmed</span>
                  </div>

                  <button
                    className="card-link-button"
                    onClick={() => handleMenuClick("Appointments")}
                  >
                    View appointment →
                  </button>
                </div>

                <div className="dashboard-card">
                  <div className="card-header">
                    <div>
                      <span>REFERRAL STATUS</span>
                      <h3>Active referral</h3>
                    </div>
                    <div className="card-header-icon">↗</div>
                  </div>

                  <div className="referral-status">
                    <div className="referral-progress">
                      <div className="referral-progress-fill" />
                    </div>
                    <div className="referral-progress-labels">
                      <span>Created</span>
                      <span>Accepted</span>
                      <span>Visit</span>
                      <span>Follow-up</span>
                    </div>
                  </div>

                  <div className="referral-details">
                    <div>
                      <small>REFERRED TO</small>
                      <strong>District Hospital</strong>
                    </div>
                    <span className="referral-badge">In Progress</span>
                  </div>

                  <button
                    className="card-link-button"
                    onClick={() => handleMenuClick("Referrals")}
                  >
                    Track referral →
                  </button>
                </div>
              </section>

              <section className="dashboard-lower-grid">
                <div className="dashboard-card">
                  <div className="card-header">
                    <div>
                      <span>CARE JOURNEY</span>
                      <h3>Your healthcare journey</h3>
                    </div>
                    <button
                      className="view-all-button"
                      onClick={() => handleMenuClick("Care Journey")}
                    >
                      View all
                    </button>
                  </div>

                  <div className="dashboard-timeline">
                    {[
                      [
                        "completed",
                        "✓",
                        "Initial consultation",
                        "PHC Choubeypur • Completed",
                        "Aug 25",
                      ],
                      [
                        "completed",
                        "✓",
                        "Referral created",
                        "District Hospital • Accepted",
                        "Aug 26",
                      ],
                      [
                        "current",
                        "→",
                        "Diagnostic test",
                        "Completion pending",
                        "Today",
                      ],
                      [
                        "upcoming",
                        "4",
                        "Follow-up consultation",
                        "Scheduled after diagnostic",
                        "Sep 04",
                      ],
                    ].map((item) => (
                      <div className={`timeline-item ${item[0]}`} key={item[2]}>
                        <div className="timeline-marker">{item[1]}</div>
                        <div className="timeline-content">
                          <strong>{item[2]}</strong>
                          <span>{item[3]}</span>
                        </div>
                        <small>{item[4]}</small>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="card-header">
                    <div>
                      <span>CARE STATUS</span>
                      <h3>Current status</h3>
                    </div>
                    <div className="health-status-icon">♥</div>
                  </div>

                  <div className="health-status-main">
                    <div className="status-circle">✓</div>
                    <div>
                      <strong>Care journey active</strong>
                      <span>Your current care plan is being tracked.</span>
                    </div>
                  </div>

                  <div className="status-items">
                    <div>
                      <span className="status-check">✓</span>
                      Referral accepted
                    </div>
                    <div>
                      <span className="status-check">✓</span>
                      Appointment scheduled
                    </div>
                    <div>
                      <span className="status-pending">!</span>
                      Diagnostic pending
                    </div>
                  </div>
                </div>
              </section>

              <section className="dashboard-section">
                <div className="dashboard-section-header">
                  <div>
                    <span className="section-mini-label">NEARBY SERVICES</span>
                    <h2>Healthcare availability</h2>
                  </div>

                  <button
                    className="section-view-button"
                    onClick={() => handleMenuClick("Find Facility")}
                  >
                    Explore facilities →
                  </button>
                </div>

                <div className="availability-grid">
                  {[
                    ["✚", "General Medicine", "Available nearby"],
                    ["⌕", "Diagnostics", "2 facilities nearby"],
                    ["▤", "Medicines", "Stock information available"],
                  ].map((item) => (
                    <div className="availability-card" key={item[1]}>
                      <div className="availability-icon">{item[0]}</div>
                      <div>
                        <strong>{item[1]}</strong>
                        <span>{item[2]}</span>
                      </div>
                      <span className="availability-status">Available</span>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {activeMenu === "Find Facility" && (
            <section className="module-page">
              <PageHeader
                eyebrow="HEALTHCARE ACCESS"
                title="Find a Healthcare Facility"
                description="Discover healthcare facilities and services available near you."
                icon="⌖"
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <div className="facility-filters" style={{ margin: 0 }}>
                  {[
                    "All Facilities",
                    "Hospitals",
                    "PHC / CHC",
                    "Diagnostics",
                    "Pharmacy",
                  ].map((filter) => (
                    <button
                      key={filter}
                      className={facilityFilter === filter ? "active" : ""}
                      onClick={() => setFacilityFilter(filter)}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    background: "var(--surface)",
                    padding: "4px",
                    borderRadius: "10px",
                    border: "1px solid var(--border)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setFacilityViewMode("grid")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "600",
                      border: "none",
                      cursor: "pointer",
                      background:
                        facilityViewMode === "grid"
                          ? "var(--primary)"
                          : "transparent",
                      color:
                        facilityViewMode === "grid"
                          ? "var(--white)"
                          : "var(--text-muted)",
                    }}
                  >
                    ▤ Grid View
                  </button>

                  <button
                    type="button"
                    onClick={() => setFacilityViewMode("map")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "600",
                      border: "none",
                      cursor: "pointer",
                      background:
                        facilityViewMode === "map"
                          ? "var(--primary)"
                          : "transparent",
                      color:
                        facilityViewMode === "map"
                          ? "var(--white)"
                          : "var(--text-muted)",
                    }}
                  >
                    📍 Interactive Map
                  </button>
                </div>
              </div>

              {facilityViewMode === "map" ? (
                <div
                  style={{
                    height: "600px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-sm)",
                    marginBottom: "32px",
                  }}
                >
                  <FacilityMap
                    onSelectFacility={(fac) => setSelectedFacility(fac)}
                  />
                </div>
              ) : (
                <>
                  <div className="facility-search-card">
                    <div className="facility-search-box">
                      <span>⌕</span>
                      <input
                        value={facilitySearch}
                        onChange={(e) => setFacilitySearch(e.target.value)}
                        placeholder="Search facility, service or specialty..."
                      />
                      {facilitySearch && (
                        <button onClick={() => setFacilitySearch("")}>×</button>
                      )}
                    </div>

                    <button
                      className="facility-search-button"
                      onClick={() => setFacilitySearch(facilitySearch.trim())}
                    >
                      Search
                    </button>
                  </div>

                  <div className="facility-results-header">
                    <div>
                      <span>AVAILABLE FACILITIES</span>
                      <h3>Healthcare facilities near you</h3>
                    </div>
                    <small>{filteredFacilities.length} found</small>
                  </div>

                  <div className="facility-grid">
                    {filteredFacilities.map((facility) => (
                      <div className="facility-card" key={facility.id}>
                        <div className="facility-card-top">
                          <div className="facility-main-icon">
                            {facility.icon}
                          </div>
                          <span className="facility-open">
                            {facility.status}
                          </span>
                        </div>

                        <h3>{facility.name}</h3>
                        <p className="facility-type">
                          {facility.type} • {facility.specialty}
                        </p>

                        <div className="facility-info">
                          ⌖ {facility.location}
                        </div>
                        <div className="facility-info">
                          ◷ {facility.hours}
                        </div>

                        <div className="facility-services">
                          {facility.services.slice(0, 2).map((service) => (
                            <span key={service}>{service}</span>
                          ))}
                        </div>

                        <button
                          className="facility-view-button"
                          onClick={() => setSelectedFacility(facility)}
                        >
                          View Facility →
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>
          )}

          {activeMenu === "Smart Recommendation" && (
            <section className="module-page">
              <PageHeader
                eyebrow="AI-ASSISTED HEALTHCARE ACCESS"
                title="Smart Facility Recommendation"
                description="Get a suitable healthcare facility recommendation based on your care requirement and location."
                icon="✦"
              />

              <div className="smart-info-banner">
                <div className="smart-info-icon">✦</div>
                <div>
                  <strong>Find the right care, closer to you</strong>
                  <p>
                    Select your healthcare need and preferences. SwasthyaSetu will rank suitable facilities.
                  </p>
                </div>
              </div>

              <div className="smart-recommendation-grid">
                <div className="dashboard-card">
                  <div className="card-header">
                    <div>
                      <span>STEP 1</span>
                      <h3>Tell us what care you need</h3>
                    </div>
                  </div>

                  <div className="recommendation-field">
                    <label>Healthcare requirement</label>
                    <select
                      value={recommendationType}
                      onChange={(e) => setRecommendationType(e.target.value)}
                    >
                      <option value="General">General Consultation</option>
                      <option value="Emergency">Emergency Care</option>
                      <option value="Diagnostics">Diagnostic Test</option>
                      <option value="Specialist">Specialist Consultation</option>
                      <option value="Medicine">Medicine / Pharmacy</option>
                    </select>
                  </div>

                  <div className="recommendation-field">
                    <label>Preferred location</label>
                    <input
                      value={recommendationLocation}
                      onChange={(e) => setRecommendationLocation(e.target.value)}
                      placeholder="Enter location"
                    />
                  </div>

                  <div className="recommendation-preferences">
                    <label>Preferences</label>
                    <div className="preference-options">
                      {["Nearby", "Available Now", "Affordable"].map(
                        (preference) => (
                          <button
                            key={preference}
                            className={
                              selectedPreferences.includes(preference)
                                ? "selected"
                                : ""
                            }
                            onClick={() => togglePreference(preference)}
                          >
                            {selectedPreferences.includes(preference) && "✓ "}
                            {preference}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <button
                    className="recommendation-button"
                    onClick={() => {
                      setHasRecommended(true);
                      setTimeout(() => {
                        document
                          .getElementById("recommended-results")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }}
                  >
                    ✦ Find Best Facility →
                  </button>
                </div>

                <div className="dashboard-card">
                  <div className="card-header">
                    <div>
                      <span>HOW IT WORKS</span>
                      <h3>Smart recommendation</h3>
                    </div>
                  </div>

                  <div className="recommendation-steps">
                    {[
                      [
                        "1",
                        "Select your care need",
                        "Tell us the type of healthcare service you need.",
                      ],
                      [
                        "2",
                        "Add your location",
                        "Nearby facilities can be prioritized.",
                      ],
                      [
                        "3",
                        "Choose preferences",
                        "Select nearby, available or affordable options.",
                      ],
                      [
                        "4",
                        "Get ranked facilities",
                        "Suitable facilities are automatically ranked.",
                      ],
                    ].map((item) => (
                      <div className="recommendation-step" key={item[0]}>
                        <div className="recommendation-step-number">{item[0]}</div>
                        <div>
                          <strong>{item[1]}</strong>
                          <p>{item[2]}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <section id="recommended-results" className="recommended-section">
                <div className="dashboard-section-header">
                  <div>
                    <span className="section-mini-label">RECOMMENDED FOR YOU</span>
                    <h2>Suitable healthcare facilities</h2>
                  </div>
                </div>

                {!hasRecommended ? (
                  <div className="recommendation-empty-state">
                    <div className="recommendation-empty-icon">✦</div>
                    <h3>Ready to find your best facility?</h3>
                    <p>Select your requirements and click Find Best Facility.</p>
                  </div>
                ) : (
                  <div className="recommended-facility-grid">
                    {recommendedFacilities.map((facility, index) => (
                      <div
                        className={`recommended-facility-card ${
                          index === 0 ? "best-recommendation" : ""
                        }`}
                        key={facility.id}
                      >
                        <div className="recommended-top">
                          <div className="recommended-icon">{facility.icon}</div>
                          <span className="recommended-score">
                            {index === 0 ? "Best Match" : "Good Match"}
                          </span>
                        </div>

                        <h3>{facility.name}</h3>
                        <p>{facility.specialty}</p>

                        <div className="recommendation-score-box">
                          <div className="recommendation-score-circle">
                            {facility.recommendationScore}%
                          </div>
                          <div>
                            <strong>Recommendation Match</strong>
                            <span>Based on your selection</span>
                          </div>
                        </div>

                        <div className="recommended-details">
                          <span>⌖ {facility.location}</span>
                          <span>◷ {facility.hours}</span>
                        </div>

                        <button onClick={() => setSelectedFacility(facility)}>
                          View Facility →
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </section>
          )}

          {activeMenu === "Digital Triage" && (
            <section className="module-page">
              <PageHeader
                eyebrow="SMART CARE ASSESSMENT"
                title="Digital Triage"
                description="Answer a few simple questions to understand what level of care may be appropriate."
                icon="✚"
              />

              <div className="triage-safety-banner">
                <div className="triage-safety-icon">!</div>
                <div>
                  <strong>Important</strong>
                  <p>
                    This assessment is for guidance only and does not provide a medical diagnosis. If you feel seriously unwell or have an emergency, seek immediate medical help.
                  </p>
                </div>
              </div>

              <div className="dashboard-card triage-card">
                <div className="triage-card-heading">
                  <div className="triage-number">01</div>
                  <div>
                    <span>REQUIRED</span>
                    <h3>What symptoms are you experiencing?</h3>
                    <p>Select all that apply.</p>
                  </div>
                </div>

                <div className="triage-symptoms-grid">
                  {symptomOptions.map((symptom) => {
                    const selected = triageSymptoms.includes(symptom.id);
                    return (
                      <button
                        key={symptom.id}
                        className={selected ? "triage-symptom selected" : "triage-symptom"}
                        onClick={() => toggleTriageSymptom(symptom.id)}
                      >
                        <span>{symptom.icon}</span>
                        {symptom.label}
                        {selected && <b>✓</b>}
                      </button>
                    );
                  })}
                </div>

                <div className="triage-selected-summary">
                  <strong>{triageSymptoms.length}</strong> symptom
                  {triageSymptoms.length !== 1 ? "s" : ""} selected
                </div>
              </div>

              <div className="triage-details-grid">
                <div className="dashboard-card triage-card">
                  <div className="triage-card-heading compact">
                    <div className="triage-number">02</div>
                    <div>
                      <span>REQUIRED</span>
                      <h3>How severe are your symptoms?</h3>
                    </div>
                  </div>

                  <div className="triage-radio-list">
                    {["Mild", "Moderate", "Severe"].map((severity) => (
                      <button
                        key={severity}
                        className={
                          triageSeverity === severity
                            ? "triage-radio-option selected"
                            : "triage-radio-option"
                        }
                        onClick={() => {
                          setTriageSeverity(severity);
                          setTriageResult(null);
                        }}
                      >
                        <span className="triage-radio-circle">
                          {triageSeverity === severity && "●"}
                        </span>
                        <span>
                          <strong>{severity}</strong>
                          <small>
                            {severity === "Mild"
                              ? "Manageable symptoms."
                              : severity === "Moderate"
                              ? "Noticeable symptoms affecting activities."
                              : "Very strong or rapidly worsening symptoms."}
                          </small>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="dashboard-card triage-card">
                  <div className="triage-card-heading compact">
                    <div className="triage-number">03</div>
                    <div>
                      <span>REQUIRED</span>
                      <h3>How long have you had them?</h3>
                    </div>
                  </div>

                  <div className="triage-duration-grid">
                    {["Today", "1–3 days", "4–7 days", "More than 1 week"].map(
                      (duration) => (
                        <button
                          key={duration}
                          className={triageDuration === duration ? "selected" : ""}
                          onClick={() => {
                            setTriageDuration(duration);
                            setTriageResult(null);
                          }}
                        >
                          {duration}
                        </button>
                      )
                    )}
                  </div>

                  <div className="triage-age-field">
                    <label>Age group</label>
                    <select
                      value={triageAgeGroup}
                      onChange={(e) => setTriageAgeGroup(e.target.value)}
                    >
                      <option value="">Select age group</option>
                      <option>Child</option>
                      <option>Teen</option>
                      <option>Adult</option>
                      <option>Older Adult</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="dashboard-card triage-red-flag-card">
                <div className="triage-card-heading">
                  <div className="triage-number warning">04</div>
                  <div>
                    <span>SAFETY CHECK</span>
                    <h3>Do any of these warning signs apply?</h3>
                    <p>Select any that apply. If none apply, leave them unchecked.</p>
                  </div>
                </div>

                <div className="triage-red-flags">
                  {redFlagOptions.map((flag) => {
                    const selected = triageRedFlags.includes(flag.id);
                    return (
                      <button
                        key={flag.id}
                        className={selected ? "triage-red-flag selected" : "triage-red-flag"}
                        onClick={() => toggleRedFlag(flag.id)}
                      >
                        <span className="red-flag-checkbox">
                          {selected && "✓"}
                        </span>
                        {flag.label}
                      </button>
                    );
                  })}
                </div>

                {triageRedFlags.includes("other") && (
                  <div className="triage-other-field">
                    <label>Describe the other warning sign</label>
                    <textarea
                      value={triageOther}
                      onChange={(e) => setTriageOther(e.target.value)}
                      placeholder="Briefly describe what you are experiencing..."
                      rows="4"
                    />
                  </div>
                )}
              </div>

              <div className="triage-actions">
                <button className="triage-reset-button" onClick={resetTriage}>
                  Reset
                </button>
                <button className="triage-analyze-button" onClick={analyzeTriage}>
                  ✦ Analyze Symptoms →
                </button>
              </div>

              {triageResult && (
                <div
                  id="triage-result"
                  className={`triage-result-card ${triageResult.type}`}
                >
                  <div className="triage-result-icon">
                    {triageResult.type === "emergency" ||
                    triageResult.type === "incomplete"
                      ? "!"
                      : "✓"}
                  </div>

                  <div>
                    <span className="triage-result-label">
                      {triageResult.priority || "INCOMPLETE"}
                    </span>
                    <h2>{triageResult.title}</h2>
                    <p>{triageResult.message}</p>

                    <div className="triage-result-action">
                      <strong>Recommended next step</strong>
                      <span>{triageResult.action}</span>
                    </div>

                    {triageResult.facility && (
                      <button
                        className="facility-view-button"
                        onClick={() => setSelectedFacility(triageResult.facility)}
                      >
                        View Suggested Facility →
                      </button>
                    )}
                  </div>
                </div>
              )}

              {triageHistory.length > 0 && (
                <div className="dashboard-card">
                  <div className="card-header">
                    <div>
                      <span>YOUR ACTIVITY</span>
                      <h3>Recent triage assessments</h3>
                    </div>
                  </div>

                  <div className="triage-history-list">
                    {triageHistory.slice(0, 5).map((item) => (
                      <div className="triage-history-item" key={item.id}>
                        <div className="history-icon">✚</div>
                        <div className="history-main">
                          <strong>Digital Triage</strong>
                          <span>
                            {item.symptoms
                              .map(
                                (id) =>
                                  symptomOptions.find((s) => s.id === id)?.label || id
                              )
                              .join(", ")}
                          </span>
                        </div>
                        <div className={`history-priority ${item.priority.toLowerCase()}`}>
                          {item.priority}
                        </div>
                        <small>{item.date}</small>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {activeMenu === "Appointments" && (
            <section className="module-page">
              <PageHeader
                eyebrow="APPOINTMENT MANAGEMENT"
                title="Appointments & Consultations"
                description="View your upcoming visits, book a new healthcare appointment, or launch secure video consultations."
                icon="▣"
              />

              <div className="module-action-bar">
                <div>
                  <strong>
                    {appointments.filter((a) => a.status !== "Cancelled").length}{" "}
                    active appointments
                  </strong>
                  <span>Keep track of your scheduled visits and live calls.</span>
                </div>

                <button
                  className="primary-action"
                  onClick={() => setShowAppointmentForm(!showAppointmentForm)}
                >
                  + Book Appointment
                </button>
              </div>

              {showAppointmentForm && (
                <div className="dashboard-card booking-card">
                  <div className="card-header">
                    <div>
                      <span>NEW APPOINTMENT</span>
                      <h3>Book a healthcare visit or video call</h3>
                    </div>
                  </div>

                  <div className="form-grid">
                    <div>
                      <label>Facility</label>
                      <select
                        value={appointmentForm.facility}
                        onChange={(e) =>
                          setAppointmentForm({
                            ...appointmentForm,
                            facility: e.target.value,
                          })
                        }
                      >
                        <option value="">Select facility</option>
                        {facilities
                          .filter((f) => f.category !== "Pharmacy")
                          .map((facility) => (
                            <option key={facility.id}>{facility.name}</option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label>Appointment type</label>
                      <select
                        value={appointmentForm.type}
                        onChange={(e) =>
                          setAppointmentForm({
                            ...appointmentForm,
                            type: e.target.value,
                          })
                        }
                      >
                        <option value="General Consultation">General Consultation</option>
                        <option value="Video Consultation">Video Consultation 🎥</option>
                        <option value="Specialist Consultation">Specialist Consultation</option>
                        <option value="Health Check-up">Health Check-up</option>
                        <option value="Follow-up Consultation">Follow-up Consultation</option>
                      </select>
                    </div>

                    <div>
                      <label>Date</label>
                      <input
                        type="date"
                        value={appointmentForm.date}
                        onChange={(e) =>
                          setAppointmentForm({
                            ...appointmentForm,
                            date: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label>Time</label>
                      <select
                        value={appointmentForm.time}
                        onChange={(e) =>
                          setAppointmentForm({
                            ...appointmentForm,
                            time: e.target.value,
                          })
                        }
                      >
                        <option value="">Select time</option>
                        <option>09:00 AM</option>
                        <option>10:30 AM</option>
                        <option>11:30 AM</option>
                        <option>02:00 PM</option>
                        <option>04:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className={`appointment-capacity-card ${isAppointmentFull ? "full" : ""}`}>
                    <div className="capacity-copy">
                      <strong>Today's Appointment Capacity</strong>
                      <span>{appointmentForm.date ? `Selected date: ${appointmentForm.date}` : "Today"} · {isAppointmentFull ? "All seats are full" : `${seatsLeft} seat${seatsLeft === 1 ? "" : "s"} left`}</span>
                    </div>
                    <div className="capacity-meter">
                      <div className="capacity-meter-top"><span>{Math.min(bookedSeats, APPOINTMENT_CAPACITY)} / {APPOINTMENT_CAPACITY} booked</span><span>{isAppointmentFull ? "FULL" : `${seatsLeft} left`}</span></div>
                      <div className="capacity-bar"><span style={{ width: `${Math.min(100, (bookedSeats / APPOINTMENT_CAPACITY) * 100)}%` }} /></div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      className="secondary-action"
                      onClick={() => setShowAppointmentForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="primary-action"
                      onClick={bookAppointment}
                    >
                      Confirm Appointment
                    </button>
                  </div>
                </div>
              )}

              <div className="appointment-list">
                {appointments.map((appointment) => (
                  <div className="dashboard-card appointment-list-card" key={appointment.id}>
                    <div className="appointment-list-date">
                      <span>DATE</span>
                      <strong>{appointment.date}</strong>
                      <small>{appointment.time}</small>
                    </div>

                    <div className="appointment-list-main">
                      <span className="card-kicker">{appointment.type}</span>
                      <h3>{appointment.doctor}</h3>
                      <p>
                        {appointment.facility} • {appointment.location}
                      </p>
                    </div>

                    <div className="appointment-list-side" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <span
                        className={`status-pill ${appointment.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {appointment.status}
                      </span>

                      {appointment.type === "Video Consultation" && appointment.status !== "Cancelled" && (
                        <button
                          className="primary-action"
                          onClick={() => setActiveCallAppointment(appointment)}
                          style={{ padding: "8px 16px", fontSize: "13px" }}
                        >
                          Join Call 🎥
                        </button>
                      )}

                      {appointment.status !== "Cancelled" && (
                        <button
                          className="danger-outline"
                          onClick={() => cancelAppointment(appointment.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeMenu === "Referrals" && (
            <section className="module-page">
              <PageHeader
                eyebrow="CARE COORDINATION"
                title="Referrals"
                description="Track referrals between healthcare facilities and monitor their progress."
                icon="↗"
              />

              <div className="referral-list">
                {referrals.map((referral) => (
                  <div className="dashboard-card referral-full-card" key={referral.id}>
                    <div className="referral-full-top">
                      <div>
                        <span className="card-kicker">REFERRAL #{referral.id}</span>
                        <h3>
                          {referral.from} <span>→</span> {referral.to}
                        </h3>
                        <p>{referral.reason}</p>
                      </div>
                      <span className="status-pill in-progress">{referral.status}</span>
                    </div>

                    <div className="referral-large-progress">
                      <div>
                        <span>Progress</span>
                        <strong>{referral.progress}%</strong>
                      </div>
                      <div className="large-progress-bar">
                        <div style={{ width: `${referral.progress}%` }} />
                      </div>
                    </div>

                    <div className="referral-timeline">
                      {[
                        ["Created", true, referral.date],
                        ["Accepted", referral.progress >= 50, "Referral accepted"],
                        ["Visit", referral.progress >= 75, "Visit pending/completed"],
                        ["Follow-up", referral.progress >= 100, "Follow-up"],
                      ].map((step) => (
                        <div
                          className={`referral-step ${step[1] ? "done" : ""}`}
                          key={step[0]}
                        >
                          <div>{step[1] ? "✓" : ""}</div>
                          <strong>{step[0]}</strong>
                          <span>{step[2]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeMenu === "Medicines" && (
            <section className="module-page">
              <PageHeader
                eyebrow="MEDICINE ACCESS"
                title="Medicines"
                description="Search medicines and check their reported availability at nearby pharmacies."
                icon="▤"
              />

              <div className="medicine-search-panel">
                <div className="facility-search-box">
                  <span>⌕</span>
                  <input
                    value={medicineSearch}
                    onChange={(e) => setMedicineSearch(e.target.value)}
                    placeholder="Search medicine or generic name..."
                  />
                </div>

                <div className="medicine-filters">
                  {["All", "In Stock", "Limited", "Out of Stock"].map((filter) => (
                    <button
                      key={filter}
                      className={medicineFilter === filter ? "active" : ""}
                      onClick={() => setMedicineFilter(filter)}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="medicine-grid">
                {filteredMedicines.map((medicine) => (
                  <div className="dashboard-card medicine-card" key={medicine.id}>
                    <div className="medicine-card-top">
                      <div className="medicine-icon">▤</div>
                      <span
                        className={`stock-pill ${medicine.stock
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {medicine.stock}
                      </span>
                    </div>

                    <h3>{medicine.name}</h3>
                    <p>Generic: {medicine.generic}</p>

                    <div className="medicine-info">
                      <span>⌖</span>
                      <div>
                        <strong>{medicine.pharmacy}</strong>
                        <small>{medicine.location}</small>
                      </div>
                    </div>

                    <div className="medicine-bottom">
                      <span>{medicine.quantity}</span>
                      <button
                        onClick={() =>
                          alert(`Availability checked for ${medicine.name}`)
                        }
                      >
                        Check Stock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeMenu === "Diagnostics" && (
            <section className="module-page">
              <PageHeader
                eyebrow="DIAGNOSTIC COORDINATION"
                title="Diagnostics"
                description="Book diagnostic tests and track reports from participating centres."
                icon="⌕"
              />

              <div className="dashboard-card">
                <div className="card-header">
                  <div>
                    <span>BOOK A TEST</span>
                    <h3>Schedule diagnostic test</h3>
                  </div>
                </div>

                <div className="form-grid">
                  <div>
                    <label>Test</label>
                    <select
                      value={diagnosticForm.test}
                      onChange={(e) =>
                        setDiagnosticForm({
                          ...diagnosticForm,
                          test: e.target.value,
                        })
                      }
                    >
                      <option value="">Select test</option>
                      <option>Complete Blood Count</option>
                      <option>Blood Sugar Test</option>
                      <option>Urine Routine Test</option>
                      <option>Lipid Profile</option>
                    </select>
                  </div>

                  <div>
                    <label>Diagnostic centre</label>
                    <select
                      value={diagnosticForm.centre}
                      onChange={(e) =>
                        setDiagnosticForm({
                          ...diagnosticForm,
                          centre: e.target.value,
                        })
                      }
                    >
                      <option value="">Select centre</option>
                      <option>Rural Diagnostic Centre</option>
                      <option>Choubeypur Pathology Lab</option>
                    </select>
                  </div>

                  <div>
                    <label>Preferred date</label>
                    <input
                      type="date"
                      value={diagnosticForm.date}
                      onChange={(e) =>
                        setDiagnosticForm({
                          ...diagnosticForm,
                          date: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button className="primary-action" onClick={bookDiagnostic}>
                    Book Diagnostic Test →
                  </button>
                </div>
              </div>

              <div className="dashboard-section-header">
                <div>
                  <span className="section-mini-label">YOUR TESTS</span>
                  <h2>Diagnostic tests & reports</h2>
                </div>
              </div>

              <div className="diagnostic-list">
                {diagnosticTests.map((test) => (
                  <div className="dashboard-card diagnostic-list-card" key={test.id}>
                    <div className="diagnostic-icon-large">{test.short}</div>

                    <div className="diagnostic-main">
                      <span className="card-kicker">{test.status}</span>
                      <h3>{test.name}</h3>
                      <p>
                        {test.centre} • {test.date}
                      </p>
                    </div>

                    <div className="diagnostic-side">
                      <span
                        className={`status-pill ${
                          test.report === "Available" ? "completed" : "pending"
                        }`}
                      >
                        {test.report}
                      </span>

                      {test.report === "Available" && (
                        <button
                          className="secondary-action"
                          onClick={() => setViewReport(test)}
                        >
                          View Report
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeMenu === "Medical History" && (
            <section className="module-page">
              <PageHeader
                eyebrow="PRIVATE MEDICAL RECORD"
                title="Medical History"
                description="Your complete medical history and documents. This record is visible to you and your consulting doctors."
                icon="▣"
              />

              <div className="dashboard-card">
                <div className="card-header">
                  <div>
                    <span>PERSONAL HEALTH RECORD</span>
                    <h3>Patient information</h3>
                  </div>
                </div>
                <div className="modal-info-grid">
                  <InfoItem label="Name" value={medicalRecord.patient.name} />
                  <InfoItem label="Age" value={`${medicalRecord.patient.age} years`} />
                  <InfoItem label="Gender" value={medicalRecord.patient.gender} />
                  <InfoItem label="Blood Group" value={medicalRecord.patient.bloodGroup} />
                  <InfoItem label="Village" value={medicalRecord.patient.village} />
                  <InfoItem label="Phone" value={medicalRecord.patient.phone} />
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-header">
                  <div><span>VITALS</span><h3>Latest health worker measurements</h3></div>
                </div>
                <div className="modal-info-grid">
                  <InfoItem label="Blood Pressure" value={medicalRecord.vitals.bloodPressure} />
                  <InfoItem label="Blood Sugar" value={medicalRecord.vitals.bloodSugar} />
                  <InfoItem label="Temperature" value={medicalRecord.vitals.temperature} />
                  <InfoItem label="Pulse" value={medicalRecord.vitals.pulse} />
                  <InfoItem label="Recorded On" value={medicalRecord.vitals.date} />
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-header"><div><span>HISTORY</span><h3>Complete medical history</h3></div></div>
                <div className="patient-history-box">
                  {medicalRecord.history.map((item, index) => (
                    <div key={`${item.date}-${index}`}>
                      <span>{item.date} · {item.type}</span>
                      <strong>{item.title}</strong>
                      <small>{item.detail}</small>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-header"><div><span>DOCUMENTS</span><h3>Previous medical documents</h3></div></div>
                <div className="diagnostic-list">
                  {medicalRecord.documents.map((doc) => (
                    <div className="diagnostic-list-card" key={doc.id}>
                      <div className="diagnostic-icon-large">▤</div>
                      <div className="diagnostic-main">
                        <span className="card-kicker">{doc.type}</span>
                        <h3>{doc.name}</h3>
                        <p>{doc.date} · {doc.status}</p>
                      </div>
                      <div className="diagnostic-side">
                        <button className="secondary-action" onClick={() => setViewDocument(doc)}>View Document</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeMenu === "Follow-up" && (
            <section className="module-page">
              <PageHeader
                eyebrow="CONTINUITY OF CARE"
                title="Follow-up"
                description="Keep track of upcoming follow-ups and reminders."
                icon="♥"
              />

              <div className="followup-grid">
                {followUps.map((followUp) => (
                  <div className="dashboard-card followup-card" key={followUp.id}>
                    <div className="followup-top">
                      <div className="followup-icon">♥</div>
                      <span className="status-pill upcoming">{followUp.status}</span>
                    </div>

                    <span className="card-kicker">FOLLOW-UP</span>
                    <h3>{followUp.title}</h3>
                    <p>{followUp.doctor}</p>

                    <div className="followup-info">
                      <span>▣ {followUp.date}</span>
                      <span>◷ {followUp.time}</span>
                      <span>⌖ {followUp.facility}</span>
                    </div>

                    <div className="followup-tele-actions">
                      <button
                        className="primary-action"
                        onClick={() => setActiveCallAppointment({ ...followUp, id: `followup-${followUp.id}`, type: "Video Consultation" })}
                      >
                        🎥 Teleconsultation
                      </button>
                    </div>

                    <div className="reminder-row">
                      <div>
                        <strong>Reminder</strong>
                        <span>Get a reminder for this visit</span>
                      </div>

                      <button
                        className={`toggle-switch ${followUp.reminder ? "on" : ""}`}
                        onClick={() => toggleReminder(followUp.id)}
                      >
                        <span />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeMenu === "Care Journey" && (
            <section className="module-page">
              <PageHeader
                eyebrow="COMPLETE CARE VIEW"
                title="Care Journey"
                description="View your healthcare journey from first consultation through follow-up."
                icon="◈"
              />

              <div className="journey-summary-grid">
                <div className="journey-summary-card">
                  <span>STARTED</span>
                  <strong>Aug 25</strong>
                  <small>Initial consultation</small>
                </div>

                <div className="journey-summary-card">
                  <span>CURRENT STEP</span>
                  <strong>Diagnostics</strong>
                  <small>Completion pending</small>
                </div>

                <div className="journey-summary-card">
                  <span>NEXT STEP</span>
                  <strong>Follow-up</strong>
                  <small>Sep 04, 2026</small>
                </div>
              </div>

              <div className="dashboard-card full-journey-card">
                <div className="card-header">
                  <div>
                    <span>YOUR CARE PATH</span>
                    <h3>Healthcare journey timeline</h3>
                  </div>
                </div>

                <div className="full-journey-timeline">
                  {[
                    [
                      "completed",
                      "✓",
                      "Initial consultation",
                      "PHC Choubeypur",
                      "Aug 25, 2026",
                      "Consultation completed",
                    ],
                    [
                      "completed",
                      "✓",
                      "Referral created",
                      "District Hospital",
                      "Aug 26, 2026",
                      "Referral accepted",
                    ],
                    [
                      "completed",
                      "✓",
                      "Diagnostic appointment",
                      "Rural Diagnostic Centre",
                      "Sep 02, 2026",
                      "Test scheduled",
                    ],
                    [
                      "current",
                      "→",
                      "Diagnostic completion",
                      "Diagnostic Centre",
                      "Pending",
                      "Awaiting completion",
                    ],
                    [
                      "upcoming",
                      "5",
                      "Follow-up consultation",
                      "Community Health Centre",
                      "Sep 04, 2026",
                      "Scheduled after diagnostic",
                    ],
                  ].map((item) => (
                    <div className={`full-journey-item ${item[0]}`} key={item[2]}>
                      <div className="journey-marker">{item[1]}</div>
                      <div className="journey-line-content">
                        <div className="journey-item-top">
                          <div>
                            <span>{item[4]}</span>
                            <h3>{item[2]}</h3>
                          </div>
                          <span className="journey-status">
                            {item[0] === "completed"
                              ? "Completed"
                              : item[0] === "current"
                              ? "Current"
                              : "Upcoming"}
                          </span>
                        </div>
                        <p>{item[3]}</p>
                        <small>{item[5]}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeMenu === "My Profile" && (
            <section className="module-page">
              <PageHeader
                eyebrow="PATIENT ACCOUNT"
                title="My Profile"
                description="Manage your personal information used for your healthcare journey."
                icon="👤"
              />

              <div className="profile-page-grid">
                <div className="dashboard-card profile-main-card">
                  <div className="profile-avatar-upload">
                    <div className="profile-big-avatar">
                      {profile.profilePicture ? (
                        <img src={profile.profilePicture} alt="Profile" />
                      ) : (
                        (profile.name || "Patient")
                          .trim()
                          .split(/\s+/)
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      )}
                    </div>

                    <label
                      htmlFor="profile-picture-input"
                      className="profile-picture-upload-button"
                    >
                      📷 Upload Profile Picture
                    </label>

                    <input
                      id="profile-picture-input"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="profile-picture-input"
                    />
                  </div>

                  <h2>{profile.name}</h2>
                  <span>Patient Account</span>

                  <div style={{ display: "flex", gap: "10px", marginTop: "14px", width: "100%", justifyContent: "center", flexWrap: "wrap" }}>
                    <button
                      className="primary-action"
                      onClick={() => setEditProfile(!editProfile)}
                    >
                      {editProfile ? "Close Edit" : "Edit Profile"}
                    </button>

                    <button
                      className="secondary-action"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      🔑 Change Password
                    </button>
                  </div>
                </div>

                <div className="dashboard-card profile-details-card">
                  <div className="card-header">
                    <div>
                      <span>PERSONAL DETAILS</span>
                      <h3>Profile information</h3>
                    </div>
                  </div>

                  <div className="profile-fields">
                    {[
                      ["name", "Full Name"],
                      ["age", "Age"],
                      ["phone", "Phone"],
                      ["email", "Email"],
                      ["location", "Location"],
                      ["emergencyContact", "Emergency Contact"],
                    ].map(([key, label]) => (
                      <div key={key}>
                        <label>{label}</label>
                        {editProfile ? (
                          <input
                            value={profile[key]}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                [key]: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <strong>{profile[key]}</strong>
                        )}
                      </div>
                    ))}

                    <div>
                      <label>Secret Password</label>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <strong>••••••••</strong>
                        <button
                          type="button"
                          onClick={() => setShowPasswordModal(true)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--primary, #08746e)",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                            textDecoration: "underline",
                            padding: 0,
                          }}
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  </div>

                  {editProfile && (
                    <button
                      className="primary-action"
                      style={{ marginTop: "16px" }}
                      onClick={() => setEditProfile(false)}
                    >
                      Save Changes
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}

          {activeMenu === "Settings" && (
            <section className="module-page">
              <PageHeader
                eyebrow="ACCOUNT SETTINGS"
                title="Settings"
                description="Manage notifications, security and portal preferences."
                icon="⚙"
              />

              <div className="settings-list">
                <div className="dashboard-card settings-card">
                  <div className="card-header">
                    <div>
                      <span>SECURITY</span>
                      <h3>Password & Access</h3>
                    </div>
                  </div>

                  <div className="setting-row">
                    <div>
                      <strong>Account Password</strong>
                      <span>Manage your portal login security.</span>
                    </div>

                    <button
                      type="button"
                      className="secondary-action"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      🔑 Change Password
                    </button>
                  </div>
                </div>

                <div className="dashboard-card settings-card">
                  <div className="card-header">
                    <div>
                      <span>NOTIFICATIONS</span>
                      <h3>Notification preferences</h3>
                    </div>
                  </div>

                  {[
                    [
                      "appointmentReminder",
                      "Appointment reminders",
                      "Receive reminders about upcoming appointments.",
                    ],
                    [
                      "referralUpdates",
                      "Referral updates",
                      "Receive updates when referral status changes.",
                    ],
                    [
                      "medicineUpdates",
                      "Medicine availability",
                      "Receive updates related to medicine availability.",
                    ],
                  ].map((item) => (
                    <div className="setting-row" key={item[0]}>
                      <div>
                        <strong>{item[1]}</strong>
                        <span>{item[2]}</span>
                      </div>

                      <button
                        className={`toggle-switch ${
                          settings[item[0]] ? "on" : ""
                        }`}
                        onClick={() =>
                          setSettings({
                            ...settings,
                            [item[0]]: !settings[item[0]],
                          })
                        }
                      >
                        <span />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeMenu === "Notifications" && (
            <section className="module-page">
              <PageHeader
                eyebrow="UPDATES & ALERTS"
                title="Notifications"
                description="Stay updated about appointments, referrals and your care journey."
                icon="♢"
              />

              <div className="notification-toolbar">
                <strong>{unreadCount} unread</strong>

                {unreadCount > 0 && (
                  <button
                    className="secondary-action"
                    onClick={markAllNotificationsRead}
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="notification-list">
                {notifications.map((notification) => (
                  <div
                    className={`dashboard-card notification-card ${
                      notification.read ? "read" : "unread"
                    }`}
                    key={notification.id}
                    onClick={() => markNotificationRead(notification.id)}
                  >
                    <div className="notification-icon">
                      {notification.type === "appointment"
                        ? "▣"
                        : notification.type === "referral"
                        ? "↗"
                        : "♥"}
                    </div>

                    <div className="notification-main">
                      <div>
                        <h3>{notification.title}</h3>
                        {!notification.read && <span className="unread-dot" />}
                      </div>
                      <p>{notification.message}</p>
                      <small>{notification.time}</small>
                    </div>

                    {!notification.read && (
                      <span className="new-label">NEW</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeMenu === "Help & Support" && (
            <section className="module-page">
              <PageHeader
                eyebrow="SUPPORT"
                title="Help & Support"
                description="Get assistance with your SwasthyaSetu patient portal."
                icon="?"
              />

              <div className="support-grid">
                <div className="dashboard-card">
                  <div className="support-icon">?</div>
                  <h3>Need help?</h3>
                  <p>
                    Contact your participating healthcare facility for appointment or care-related assistance.
                  </p>
                  <button
                    className="primary-action"
                    onClick={() =>
                      alert("Support request feature is ready to connect with your backend.")
                    }
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {viewReport && (
        <div className="document-viewer-overlay" onClick={() => setViewReport(null)}>
          <div className="document-viewer" onClick={(e) => e.stopPropagation()}>
            <div className="document-viewer-header">
              <div><span>DIAGNOSTIC REPORT</span><h2>{viewReport.name}</h2></div>
              <button onClick={() => setViewReport(null)}>×</button>
            </div>
            <div className="dummy-report">
              <div className="report-brand">SwasthyaSetu Diagnostic Centre</div>
              <h3>{viewReport.name} — LAB REPORT</h3>
              <p><strong>Patient:</strong> Shivam &nbsp; <strong>Date:</strong> {viewReport.date}</p>
              <table><thead><tr><th>Parameter</th><th>Result</th><th>Reference Range</th></tr></thead>
                <tbody>
                  <tr><td>Glucose (Fasting)</td><td>132 mg/dL</td><td>70–100 mg/dL</td></tr>
                  <tr><td>Hemoglobin</td><td>13.8 g/dL</td><td>13–17 g/dL</td></tr>
                  <tr><td>RBC Count</td><td>4.7 million/µL</td><td>4.5–5.9 million/µL</td></tr>
                  <tr><td>WBC Count</td><td>7,200 /µL</td><td>4,000–11,000 /µL</td></tr>
                </tbody></table>
              <p className="report-note">Demo report for prototype demonstration. Final interpretation should be made by a qualified clinician.</p>
            </div>
          </div>
        </div>
      )}

      {viewDocument && (
        <div className="document-viewer-overlay" onClick={() => setViewDocument(null)}>
          <div className="document-viewer" onClick={(e) => e.stopPropagation()}>
            <div className="document-viewer-header"><div><span>{viewDocument.type}</span><h2>{viewDocument.name}</h2></div><button onClick={() => setViewDocument(null)}>×</button></div>
            <div className="dummy-document">
              <div className="report-brand">SWASTHYASETU • PATIENT DOCUMENT</div>
              <h3>{viewDocument.name}</h3>
              <p><strong>Patient:</strong> Shivam</p><p><strong>Document ID:</strong> {viewDocument.id}</p><p><strong>Date:</strong> {viewDocument.date}</p>
              <hr/><p>This is a sample medical document included in the prototype. It demonstrates secure patient/doctor document viewing and record continuity.</p>
              <div className="document-signature">Digitally recorded • SwasthyaSetu Demo</div>
            </div>
          </div>
        </div>
      )}

      {activeCallAppointment && (
        <CallModal 
          roomId={activeCallAppointment._id || activeCallAppointment.id || "swasthya-telehealth-room"} 
          userId={profile.id || profile._id || "patient-user"} 
          callType="video"
          onClose={() => setActiveCallAppointment(null)} 
        />
      )}

      {showPasswordModal && (
        <div
          className="facility-modal-overlay"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            className="facility-modal"
            style={{ maxWidth: "440px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="facility-modal-header">
              <div className="facility-modal-icon">🔑</div>
              <button
                className="facility-modal-close"
                onClick={() => setShowPasswordModal(false)}
              >
                ×
              </button>
            </div>

            <div className="facility-modal-content">
              <h2>Change Password</h2>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
                Update your login password for your patient portal account.
              </p>

              <form onSubmit={handleUpdatePassword}>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter at least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoFocus
                    style={{
                      width: "100%",
                      height: "42px",
                      padding: "0 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "var(--surface)",
                      fontSize: "14px",
                    }}
                  />
                </div>

                <div className="facility-modal-footer" style={{ padding: 0 }}>
                  <button
                    type="button"
                    className="facility-modal-secondary"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="facility-modal-primary">
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {selectedFacility && (
        <div
          className="facility-modal-overlay"
          onClick={() => setSelectedFacility(null)}
        >
          <div
            className="facility-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="facility-modal-header">
              <div className="facility-modal-icon">
                {selectedFacility.icon || "✚"}
              </div>
              <button
                className="facility-modal-close"
                onClick={() => setSelectedFacility(null)}
              >
                ×
              </button>
            </div>

            <div className="facility-modal-content">
              <span className="facility-modal-status">
                ● {selectedFacility.status || "Open"}
              </span>
              <h2>{selectedFacility.name}</h2>
              <p className="facility-modal-type">
                {selectedFacility.type} • {selectedFacility.specialty || "Primary Care"}
              </p>

              <div className="facility-modal-info">
                <div>
                  <span>⌖</span>
                  <div>
                    <small>LOCATION</small>
                    <strong>{selectedFacility.location}</strong>
                  </div>
                </div>

                <div>
                  <span>◷</span>
                  <div>
                    <small>OPENING HOURS</small>
                    <strong>{selectedFacility.hours || "24 Hours"}</strong>
                  </div>
                </div>

                <div>
                  <span>☎</span>
                  <div>
                    <small>CONTACT</small>
                    <strong>{selectedFacility.phone || "+91 98765 43210"}</strong>
                  </div>
                </div>
              </div>

              <div className="facility-modal-description">
                <h3>About this facility</h3>
                <p>
                  {selectedFacility.description ||
                    "Essential public healthcare facility serving local community needs."}
                </p>
              </div>

              {selectedFacility.services && (
                <div className="facility-modal-services">
                  <h3>Available services</h3>
                  <div>
                    {selectedFacility.services.map((service) => (
                      <span key={service}>✓ {service}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="facility-modal-footer">
              <button
                className="facility-modal-secondary"
                onClick={() => setSelectedFacility(null)}
              >
                Close
              </button>

              <button
                className="facility-modal-primary"
                onClick={() => {
                  const targetFacilityName = selectedFacility.name;
                  setSelectedFacility(null);
                  handleMenuClick("Appointments");
                  setShowAppointmentForm(true);
                  setAppointmentForm((current) => ({
                    ...current,
                    facility: targetFacilityName,
                  }));
                }}
              >
                Book / Continue →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDashboard;
