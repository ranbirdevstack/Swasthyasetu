import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosClient.js";
import FacilityMap from "../../components/FacilityMap.jsx";
import "./WorkerDashboard.css";

function WorkerDashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // =========================================================
  // MAIN STATE
  // =========================================================

  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [previousMenu, setPreviousMenu] = useState("Dashboard");

  const [search, setSearch] = useState("");

  const [showProfile, setShowProfile] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedReferral, setSelectedReferral] = useState(null);

  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [showReferralDetails, setShowReferralDetails] = useState(false);

  const [showTriage, setShowTriage] = useState(false);
  const [showReferral, setShowReferral] = useState(false);

  const [editProfile, setEditProfile] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState("");

  const [toast, setToast] = useState("");

  // =========================================================
  // WORKER PROFILE (WITH PASSWORD & MOBILE)
  // =========================================================

  const [workerProfile, setWorkerProfile] = useState({
    name: "Ravi Kumar",
    role: "Community Health Worker",
    facility: "PHC Choubeypur",
    department: "Primary Healthcare Services",
    employeeId: "CHW-1024",
    phone: "9876543210",
    email: "ravi.worker@swasthyasetu.in",
    password: "password123",
    experience: "5 Years",
    image: "",
  });

  const [profileForm, setProfileForm] = useState({
    name: "Ravi Kumar",
    role: "Community Health Worker",
    facility: "PHC Choubeypur",
    department: "Primary Healthcare Services",
    employeeId: "CHW-1024",
    phone: "9876543210",
    mobile: "9876543210",
    email: "ravi.worker@swasthyasetu.in",
    password: "password123",
    experience: "5 Years",
  });

  // Hydrate health worker profile and dashboard data from backend / local cache
  useEffect(() => {
    const savedUser = localStorage.getItem("swasthya_user");
    const cachedName = localStorage.getItem("userName");

    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setWorkerProfile((prev) => ({
          ...prev,
          name: parsed.name ? parsed.name.replace(/\s*\(.*?\)/g, "").trim() : prev.name,
          email: parsed.email || prev.email,
          phone: parsed.phone || prev.phone,
          password: parsed.password || prev.password,
        }));
      } catch (err) {
        console.warn("Failed parsing saved worker user", err);
      }
    } else if (cachedName) {
      setWorkerProfile((prev) => ({
        ...prev,
        name: cachedName.replace(/\s*\(.*?\)/g, "").trim(),
      }));
    }

    const fetchWorkerData = async () => {
      try {
        const res = await api.get("/worker/dashboard");
        if (res.data) {
          if (res.data.profile) {
            setWorkerProfile((prev) => ({
              ...prev,
              ...res.data.profile,
              name: res.data.profile.name
                ? res.data.profile.name.replace(/\s*\(.*?\)/g, "").trim()
                : prev.name,
            }));
          }
          if (res.data.triageCases) setTriageCases(res.data.triageCases);
          if (res.data.followUps) setFollowUps(res.data.followUps);
          if (res.data.referrals) setReferrals(res.data.referrals);
        }
      } catch (err) {
        console.warn("Worker dashboard running in offline fallback mode");
      }
    };

    fetchWorkerData();
  }, []);

  // =========================================================
  // PATIENTS
  // =========================================================

  const [patients] = useState([
    {
      id: 1,
      name: "Rahul Kumar",
      age: 42,
      gender: "Male",
      phone: "9876543201",
      condition: "Type 2 Diabetes",
      lastVisit: "28 Aug 2026",
      risk: "Moderate",
      village: "Choubeypur",
      assignedDoctor: "Dr. Sharma",
      status: "Active",
    },
    {
      id: 2,
      name: "Sunita Devi",
      age: 35,
      gender: "Female",
      phone: "9765432102",
      condition: "Viral Fever",
      lastVisit: "30 Aug 2026",
      risk: "Low",
      village: "Choubeypur",
      assignedDoctor: "Dr. Sharma",
      status: "Active",
    },
    {
      id: 3,
      name: "Amit Singh",
      age: 51,
      gender: "Male",
      phone: "9654321018",
      condition: "Hypertension",
      lastVisit: "25 Aug 2026",
      risk: "Moderate",
      village: "Harhua",
      assignedDoctor: "Dr. Priya Singh",
      status: "Active",
    },
    {
      id: 4,
      name: "Pooja Verma",
      age: 28,
      gender: "Female",
      phone: "9543210973",
      condition: "General Checkup",
      lastVisit: "21 Aug 2026",
      risk: "Low",
      village: "Harhua",
      assignedDoctor: "Dr. Sharma",
      status: "Active",
    },
    {
      id: 5,
      name: "Ramesh Yadav",
      age: 64,
      gender: "Male",
      phone: "9432109864",
      condition: "Cardiac Monitoring",
      lastVisit: "20 Aug 2026",
      risk: "High",
      village: "Choubeypur",
      assignedDoctor: "Dr. Priya Singh",
      status: "Needs Attention",
    },
    {
      id: 6,
      name: "Meena Patel",
      age: 46,
      gender: "Female",
      phone: "9321098711",
      condition: "Asthma",
      lastVisit: "18 Aug 2026",
      risk: "Moderate",
      village: "Chiraigaon",
      assignedDoctor: "Dr. Sharma",
      status: "Active",
    },
  ]);

  // =========================================================
  // TRIAGE
  // =========================================================

  const [triageCases, setTriageCases] = useState([
    {
      id: 1,
      patient: "Ramesh Yadav",
      age: 64,
      symptoms: "Chest discomfort and breathlessness",
      priority: "Critical",
      date: "30 Aug 2026",
      status: "Pending",
    },
    {
      id: 2,
      patient: "Rahul Kumar",
      age: 42,
      symptoms: "High blood sugar and weakness",
      priority: "High",
      date: "30 Aug 2026",
      status: "Pending",
    },
    {
      id: 3,
      patient: "Sunita Devi",
      age: 35,
      symptoms: "Fever for two days",
      priority: "Medium",
      date: "30 Aug 2026",
      status: "Reviewed",
    },
    {
      id: 4,
      patient: "Pooja Verma",
      age: 28,
      symptoms: "General weakness",
      priority: "Low",
      date: "29 Aug 2026",
      status: "Reviewed",
    },
  ]);

  // =========================================================
  // FOLLOW UPS
  // =========================================================

  const [followUps, setFollowUps] = useState([
    {
      id: 1,
      patient: "Rahul Kumar",
      date: "02 Sep 2026",
      reason: "Diabetes review",
      priority: "Due Soon",
      status: "Pending",
    },
    {
      id: 2,
      patient: "Amit Singh",
      date: "04 Sep 2026",
      reason: "BP monitoring",
      priority: "Upcoming",
      status: "Pending",
    },
    {
      id: 3,
      patient: "Ramesh Yadav",
      date: "01 Sep 2026",
      reason: "Cardiac follow-up",
      priority: "Urgent",
      status: "Pending",
    },
    {
      id: 4,
      patient: "Meena Patel",
      date: "06 Sep 2026",
      reason: "Asthma review",
      priority: "Upcoming",
      status: "Pending",
    },
  ]);

  // =========================================================
  // REFERRALS
  // =========================================================

  const [referrals, setReferrals] = useState([
    {
      id: 1,
      patient: "Ramesh Yadav",
      from: "PHC Choubeypur",
      to: "District Hospital",
      reason: "Cardiology consultation",
      date: "29 Aug 2026",
      status: "In Progress",
    },
    {
      id: 2,
      patient: "Rahul Kumar",
      from: "PHC Choubeypur",
      to: "Community Health Centre",
      reason: "Diabetes management",
      date: "27 Aug 2026",
      status: "Pending",
    },
    {
      id: 3,
      patient: "Sunita Devi",
      from: "PHC Choubeypur",
      to: "Diagnostic Centre",
      reason: "Blood test",
      date: "25 Aug 2026",
      status: "Completed",
    },
    {
      id: 4,
      patient: "Amit Singh",
      from: "PHC Choubeypur",
      to: "District Hospital",
      reason: "Hypertension review",
      date: "24 Aug 2026",
      status: "In Progress",
    },
  ]);

  // =========================================================
  // FACILITY SERVICES
  // =========================================================

  const [services] = useState([
    {
      id: 1,
      name: "General OPD",
      description: "General outpatient consultation and basic examination.",
      availability: "Available",
      timing: "09:00 AM - 04:00 PM",
    },
    {
      id: 2,
      name: "Pharmacy",
      description: "Essential and prescribed medicines.",
      availability: "Available",
      timing: "09:00 AM - 05:00 PM",
    },
    {
      id: 3,
      name: "Basic Diagnostics",
      description: "Blood pressure, sugar testing and basic screening.",
      availability: "Available",
      timing: "09:00 AM - 03:00 PM",
    },
    {
      id: 4,
      name: "Emergency Support",
      description: "Initial emergency assessment and referral support.",
      availability: "Limited",
      timing: "24 Hours",
    },
    {
      id: 5,
      name: "Vaccination",
      description: "Routine vaccination and immunization support.",
      availability: "Available",
      timing: "10:00 AM - 02:00 PM",
    },
    {
      id: 6,
      name: "Teleconsultation Support",
      description: "Assisted digital consultation with doctors.",
      availability: "Available",
      timing: "10:00 AM - 04:00 PM",
    },
  ]);

  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Critical triage case",
      message: "Ramesh Yadav requires urgent clinical attention.",
      time: "10 min ago",
      read: false,
    },
    {
      id: 2,
      title: "Referral update",
      message: "Ramesh Yadav's referral is now in progress.",
      time: "30 min ago",
      read: false,
    },
    {
      id: 3,
      title: "Follow-up reminder",
      message: "3 follow-ups require action this week.",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 4,
      title: "Service update",
      message: "Teleconsultation support is available today.",
      time: "2 hours ago",
      read: true,
    },
  ]);

  // =========================================================
  // SETTINGS
  // =========================================================

  const [settings, setSettings] = useState({
    triageAlerts: true,
    referralAlerts: true,
    followUpReminders: true,
    facilityAlerts: true,
    onlineConsultation: true,
    showAvailability: true,
    twoFactor: false,
  });

  // =========================================================
  // HELPERS & ACTIONS
  // =========================================================

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
      setToast("");
    }, 2500);
  };

  const handleMenu = (menu) => {
    setPreviousMenu(activeMenu);
    setActiveMenu(menu);

    setSearch("");
    setSelectedPatient(null);
    setSelectedReferral(null);
    setShowPatientDetails(false);
    setShowReferralDetails(false);
    setShowTriage(false);
    setShowReferral(false);
    setNotificationOpen(false);
    setShowProfile(false);
    setEditProfile(false);
    setMobileMenuOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleBack = () => {
    if (editProfile) {
      setEditProfile(false);
      return;
    }
    if (showTriage) {
      setShowTriage(false);
      return;
    }
    if (showReferral) {
      setShowReferral(false);
      return;
    }
    if (showPatientDetails) {
      setShowPatientDetails(false);
      return;
    }
    if (showReferralDetails) {
      setShowReferralDetails(false);
      return;
    }
    if (activeMenu !== "Dashboard") {
      setActiveMenu(previousMenu || "Dashboard");
      setSearch("");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }
    navigate("/roles");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("swasthya_role");
    localStorage.removeItem("swasthya_user");
    navigate("/");
  };

  const startTriage = (item) => {
    const matched = patients.find((p) => p.name === item.patient) || {
      name: item.patient,
      age: item.age,
      gender: "Not specified",
      condition: item.symptoms,
      risk: item.priority === "Critical" ? "High" : "Moderate",
      village: "Choubeypur",
      lastVisit: item.date,
    };
    setSelectedPatient(matched);
    setShowTriage(true);
    setActiveMenu("Patient Triage");
  };

  const updateReferralStatus = async (id, newStatus) => {
    try {
      await api.patch(`/worker/referrals/${id}/status`, { status: newStatus });
    } catch {
      console.warn("Referral status updated locally (offline mode)");
    }

    setReferrals((prev) =>
      prev.map((ref) => (ref.id === id ? { ...ref, status: newStatus } : ref))
    );
    showToast(`Referral updated to "${newStatus}"`);
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!newPasswordInput || newPasswordInput.length < 6) {
      showToast("Password must be at least 6 characters.");
      return;
    }

    const cleanName = workerProfile.name.replace(/\s*\(.*?\)/g, "").trim();
    setWorkerProfile((prev) => ({ ...prev, name: cleanName, password: newPasswordInput }));
    setProfileForm((prev) => ({ ...prev, name: cleanName, password: newPasswordInput }));

    // Synchronize to localStorage for offline authentication
    try {
      const savedMockUsers = localStorage.getItem("swasthya_mock_users");
      if (savedMockUsers) {
        const users = JSON.parse(savedMockUsers);
        const updated = users.map((u) =>
          u.email.toLowerCase() === workerProfile.email.toLowerCase()
            ? { ...u, name: cleanName, password: newPasswordInput }
            : u
        );
        localStorage.setItem("swasthya_mock_users", JSON.stringify(updated));
      }

      const activeUser = localStorage.getItem("swasthya_user");
      if (activeUser) {
        const user = JSON.parse(activeUser);
        user.name = cleanName;
        user.password = newPasswordInput;
        localStorage.setItem("swasthya_user", JSON.stringify(user));
      }
    } catch (err) {
      console.warn("Failed saving password locally", err);
    }

    setShowPasswordModal(false);
    setNewPasswordInput("");
    showToast("Password updated successfully.");
  };

  const handleProfileImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setWorkerProfile((prev) => ({
        ...prev,
        image: e.target.result,
      }));
      showToast("Profile photo updated successfully.");
    };
    reader.readAsDataURL(file);
  };

  const openEditProfile = () => {
    const cleanName = workerProfile.name.replace(/\s*\(.*?\)/g, "").trim();
    setProfileForm({
      name: cleanName,
      role: workerProfile.role,
      facility: workerProfile.facility,
      department: workerProfile.department,
      employeeId: workerProfile.employeeId,
      phone: workerProfile.phone,
      mobile: workerProfile.mobile || workerProfile.phone,
      email: workerProfile.email,
      password: workerProfile.password,
      experience: workerProfile.experience,
    });
    setEditProfile(true);
    setActiveMenu("Profile");
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    const cleanName = profileForm.name ? profileForm.name.replace(/\s*\(.*?\)/g, "").trim() : workerProfile.name;
    const updatedForm = { ...profileForm, name: cleanName };

    try {
      await api.put("/worker/profile", updatedForm);
    } catch (err) {
      console.warn("Worker profile saved locally (offline mode)");
    }

    setWorkerProfile((prev) => ({
      ...prev,
      ...updatedForm,
    }));

    if (cleanName) {
      localStorage.setItem("userName", cleanName);
    }

    // Sync edited profile & password if changed inside edit profile form
    try {
      const savedMockUsers = localStorage.getItem("swasthya_mock_users");
      if (savedMockUsers) {
        const users = JSON.parse(savedMockUsers);
        const updated = users.map((u) =>
          u.email.toLowerCase() === workerProfile.email.toLowerCase()
            ? { ...u, name: cleanName, password: updatedForm.password }
            : u
        );
        localStorage.setItem("swasthya_mock_users", JSON.stringify(updated));
      }

      const activeUser = localStorage.getItem("swasthya_user");
      if (activeUser) {
        const user = JSON.parse(activeUser);
        user.name = cleanName;
        user.password = updatedForm.password;
        localStorage.setItem("swasthya_user", JSON.stringify(user));
      }
    } catch {}

    setEditProfile(false);
    showToast("Profile updated successfully.");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const updateProfileField = (field, value) => {
    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const ProfileAvatar = ({ large = false }) => {
    if (workerProfile.image) {
      return (
        <img
          src={workerProfile.image}
          alt="Worker profile"
          className={
            large ? "worker-avatar-image large" : "worker-avatar-image"
          }
        />
      );
    }
    return (
      <div
        className={
          large ? "worker-avatar-fallback large" : "worker-avatar-fallback"
        }
      >
        RK
      </div>
    );
  };

  const markTriageReviewed = async (id) => {
    try {
      await api.patch(`/worker/triage/${id}/status`, { status: "Reviewed" });
    } catch {
      console.warn("Triage status updated locally (offline mode)");
    }

    setTriageCases((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: "Reviewed" } : item
      )
    );
    showToast("Triage case marked as reviewed.");
  };

  const completeFollowUp = async (id) => {
    try {
      await api.patch(`/worker/followups/${id}/complete`, {
        status: "Completed",
      });
    } catch {
      console.warn("Follow-up status updated locally (offline mode)");
    }

    setFollowUps((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: "Completed" } : item
      )
    );
    showToast("Follow-up completed successfully.");
  };

  const createReferral = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const patient = form.get("patient");
    const destination = form.get("destination");
    const reason = form.get("reason");

    const newReferral = {
      id: Date.now(),
      patient: patient || "New Patient",
      from: workerProfile.facility,
      to: destination || "District Hospital",
      reason: reason || "Clinical consultation",
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Pending",
    };

    try {
      await api.post("/worker/referrals", newReferral);
    } catch {
      console.warn("Referral created locally (offline mode)");
    }

    setReferrals((current) => [newReferral, ...current]);
    setShowReferral(false);
    showToast("Referral created successfully.");
  };

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
    showToast("All notifications marked as read.");
  };

  const unreadCount = notifications.filter((item) => !item.read).length;

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // =========================================================
  // FILTERS
  // =========================================================

  const filteredPatients = patients.filter((patient) =>
    `${patient.name} ${patient.condition} ${patient.village} ${patient.risk} ${patient.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredTriage = triageCases.filter((item) =>
    `${item.patient} ${item.symptoms} ${item.priority} ${item.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredReferrals = referrals.filter((item) =>
    `${item.patient} ${item.from} ${item.to} ${item.reason} ${item.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredServices = services.filter((service) =>
    `${service.name} ${service.description} ${service.availability}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // =========================================================
  // DASHBOARD
  // =========================================================

  const renderDashboard = () => (
    <>
      <PageHeader
        title={`Welcome, ${workerProfile.name.replace(/\s*\(.*?\)/g, "").trim()}`}
        subtitle="Here's what's happening with your assigned patients and facility today."
        action={
          <button
            className="worker-primary-btn"
            onClick={() => handleMenu("Patient Triage")}
          >
            <span>＋</span>
            Start Triage
          </button>
        }
      />

      <div className="worker-stats-grid">
        <StatCard
          icon="👥"
          label="Assigned Patients"
          value="126"
          change="+8 this month"
        />

        <StatCard
          icon="🩺"
          label="Pending Triage"
          value={
            triageCases.filter((item) => item.status === "Pending").length
          }
          change="2 urgent"
          urgent
        />

        <StatCard
          icon="↻"
          label="Active Follow-ups"
          value={
            followUps.filter((item) => item.status !== "Completed").length
          }
          change="1 urgent"
        />

        <StatCard
          icon="↗"
          label="Active Referrals"
          value={
            referrals.filter((item) => item.status !== "Completed").length
          }
          change="+2 this week"
        />
      </div>

      <div className="worker-dashboard-grid">
        <div className="worker-panel">
          <div className="panel-header">
            <div>
              <h3>Priority Triage</h3>
              <p>Patients waiting for initial assessment</p>
            </div>

            <button
              className="panel-link"
              onClick={() => handleMenu("Patient Triage")}
            >
              View all →
            </button>
          </div>

          <div className="worker-triage-list">
            {triageCases.slice(0, 4).map((item) => (
              <TriageRow
                key={item.id}
                item={item}
                onReview={() => startTriage(item)}
                onComplete={() => markTriageReviewed(item.id)}
              />
            ))}
          </div>
        </div>

        <div className="worker-panel">
          <div className="panel-header">
            <div>
              <h3>Quick Actions</h3>
              <p>Frequently used health worker tools</p>
            </div>
          </div>

          <div className="quick-actions">
            <QuickAction
              icon="🩺"
              title="Patient Triage"
              text="Assess patient symptoms"
              onClick={() => handleMenu("Patient Triage")}
            />

            <QuickAction
              icon="👥"
              title="Find Patient"
              text="Search patient records"
              onClick={() => handleMenu("Patients")}
            />

            <QuickAction
              icon="📍"
              title="Facility Map"
              text="View nearby active health posts"
              onClick={() => handleMenu("Facility Map")}
            />

            <QuickAction
              icon="↗"
              title="Create Referral"
              text="Refer patient to facility"
              onClick={() => setShowReferral(true)}
            />
          </div>
        </div>
      </div>

      <div className="worker-dashboard-grid lower">
        <div className="worker-panel">
          <div className="panel-header">
            <div>
              <h3>Recent Patients</h3>
              <p>Patients recently managed by you</p>
            </div>

            <button
              className="panel-link"
              onClick={() => handleMenu("Patients")}
            >
              View all →
            </button>
          </div>

          <PatientTable
            patients={patients.slice(0, 4)}
            onPatient={(patient) => {
              setSelectedPatient(patient);
              setShowPatientDetails(true);
            }}
          />
        </div>

        <div className="worker-panel">
          <div className="panel-header">
            <div>
              <h3>Follow-up Alerts</h3>
              <p>Patients requiring continued care</p>
            </div>
          </div>

          <div className="followup-list">
            {followUps.slice(0, 4).map((item) => (
              <FollowUpRow
                key={item.id}
                item={item}
                onComplete={completeFollowUp}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );

  // =========================================================
  // TRIAGE PAGE
  // =========================================================

  const renderTriage = () => (
    <>
      <PageHeader
        title="Patient Triage"
        subtitle="Assess patient symptoms, identify urgency and prepare patients for appropriate care."
        action={
          <button
            className="worker-primary-btn"
            onClick={() => setShowTriage(true)}
          >
            ＋ New Triage
          </button>
        }
      />

      {!showTriage ? (
        <>
          <div className="worker-filter-bar">
            <div className="worker-search">
              <span>⌕</span>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search triage cases..."
              />
            </div>

            <button
              className="worker-secondary-btn"
              onClick={() => showToast("Triage filters opened.")}
            >
              ⚙ Filter
            </button>
          </div>

          <div className="worker-mini-stats">
            <MiniStat
              label="Pending"
              value={
                triageCases.filter((item) => item.status === "Pending").length
              }
            />
            <MiniStat label="Critical" value="01" />
            <MiniStat label="High Priority" value="01" />
            <MiniStat
              label="Reviewed"
              value={
                triageCases.filter((item) => item.status === "Reviewed").length
              }
            />
          </div>

          <div className="worker-panel full-panel">
            <div className="panel-header">
              <div>
                <h3>Assessment Queue</h3>
                <p>{filteredTriage.length} cases found</p>
              </div>
            </div>

            <div className="triage-full-list">
              {filteredTriage.map((item) => (
                <div className="triage-card" key={item.id}>
                  <div className="triage-icon">🩺</div>

                  <div className="triage-info">
                    <strong>{item.patient}</strong>
                    <span>
                      {item.age} years · {item.symptoms}
                    </span>
                    <small>Assessment date: {item.date}</small>
                  </div>

                  <StatusBadge status={item.priority} />
                  <StatusBadge status={item.status} />

                  <div className="triage-actions">
                    <button
                      className="small-secondary-btn"
                      onClick={() => startTriage(item)}
                    >
                      Assess
                    </button>

                    {item.status === "Pending" && (
                      <button
                        className="small-success-btn"
                        onClick={() => markTriageReviewed(item.id)}
                      >
                        ✓ Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <TriageWorkspace
          patient={selectedPatient}
          patients={patients}
          onClose={() => {
            setShowTriage(false);
            setSelectedPatient(null);
          }}
          onSave={() => {
            setShowTriage(false);
            setSelectedPatient(null);
            showToast("Triage assessment saved successfully.");
          }}
        />
      )}
    </>
  );

  // =========================================================
  // PATIENTS PAGE
  // =========================================================

  const renderPatients = () => (
    <>
      <PageHeader
        title="Patient Records"
        subtitle="Search and manage patients assigned to your healthcare facility."
        action={
          <button
            className="worker-primary-btn"
            onClick={() => showToast("Add patient form opened.")}
          >
            ＋ Add Patient
          </button>
        }
      />

      <div className="worker-filter-bar">
        <div className="worker-search">
          <span>⌕</span>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient, condition or village..."
          />
        </div>

        <button
          className="worker-secondary-btn"
          onClick={() => showToast("Patient filters opened.")}
        >
          ⚙ Filter
        </button>
      </div>

      <div className="worker-mini-stats">
        <MiniStat label="Total Patients" value="126" />
        <MiniStat label="High Risk" value="09" />
        <MiniStat label="Moderate Risk" value="32" />
        <MiniStat label="Needs Attention" value="07" />
      </div>

      <div className="worker-panel full-panel">
        <div className="panel-header">
          <div>
            <h3>Assigned Patients</h3>
            <p>{filteredPatients.length} patients found</p>
          </div>
        </div>

        <PatientTable
          patients={filteredPatients}
          onPatient={(patient) => {
            setSelectedPatient(patient);
            setShowPatientDetails(true);
          }}
        />
      </div>
    </>
  );

  // =========================================================
  // FACILITY SERVICES PAGE
  // =========================================================

  const renderFacilityServices = () => (
    <>
      <PageHeader
        title="Facility Services"
        subtitle="View and manage healthcare services available at your facility."
      />

      <div className="worker-filter-bar">
        <div className="worker-search">
          <span>⌕</span>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
          />
        </div>
      </div>

      <div className="worker-service-grid">
        {filteredServices.map((service) => (
          <div className="worker-service-card" key={service.id}>
            <div className="service-card-top">
              <div className="service-icon">🏥</div>
              <StatusBadge status={service.availability} />
            </div>

            <h3>{service.name}</h3>
            <p>{service.description}</p>

            <div className="service-time">
              <span>Available Timing</span>
              <strong>{service.timing}</strong>
            </div>

            <button
              className="worker-secondary-btn"
              onClick={() => showToast(`${service.name} details opened.`)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </>
  );

  // =========================================================
  // FACILITY MAP PAGE (NETWORK VIEW)
  // =========================================================

  const renderFacilityMap = () => (
    <div className="worker-facility-map-view" style={{ minHeight: "650px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <PageHeader
        title="Rural Facility Network"
        subtitle="Locate and route patients to active PHCs, CHCs, and District Hospitals in Varanasi district."
        action={
          <button
            className="worker-secondary-btn"
            onClick={() => showToast("Scanning nearby facility capacity...")}
          >
            ↻ Refresh Status
          </button>
        }
      />

      <div style={{ flex: 1, minHeight: "550px", background: "var(--surface-white)", borderRadius: "16px", border: "1px solid var(--border)", overflow: "hidden", position: "relative" }}>
        <FacilityMap
          onSelectFacility={(facility) => {
            showToast(`Selected ${facility.name} for patient referral.`);
          }}
        />
      </div>
    </div>
  );

  // =========================================================
  // FOLLOW UPS PAGE
  // =========================================================

  const renderFollowUps = () => (
    <>
      <PageHeader
        title="Follow-ups"
        subtitle="Monitor patients who need continued care and timely follow-up."
      />

      <div className="worker-mini-stats">
        <MiniStat label="Due Today" value="03" />
        <MiniStat label="Due Soon" value="07" />
        <MiniStat label="Upcoming" value="12" />
        <MiniStat label="Completed" value="46" />
      </div>

      <div className="worker-panel full-panel">
        <div className="panel-header">
          <div>
            <h3>Follow-up Schedule</h3>
            <p>Maintain continuity of care for assigned patients.</p>
          </div>
        </div>

        <div className="followup-table">
          {followUps.map((item) => (
            <div className="followup-card" key={item.id}>
              <div className="followup-date">
                <strong>{item.date.split(" ")[0]}</strong>
                <span>{item.date.split(" ")[1]}</span>
              </div>

              <div className="followup-patient">
                <strong>{item.patient}</strong>
                <span>{item.reason}</span>
              </div>

              <StatusBadge status={item.priority} />

              <div>
                {item.status !== "Completed" ? (
                  <button
                    className="small-primary-btn"
                    onClick={() => completeFollowUp(item.id)}
                  >
                    Complete
                  </button>
                ) : (
                  <StatusBadge status="Completed" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  // =========================================================
  // REFERRALS PAGE
  // =========================================================

  const renderReferrals = () => (
    <>
      <PageHeader
        title="Referrals"
        subtitle="Create, monitor and track patient referrals across healthcare facilities."
        action={
          <button
            className="worker-primary-btn"
            onClick={() => setShowReferral(true)}
          >
            ＋ New Referral
          </button>
        }
      />

      <div className="worker-filter-bar">
        <div className="worker-search">
          <span>⌕</span>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search referrals..."
          />
        </div>
      </div>

      <div className="worker-mini-stats">
        <MiniStat label="Total Referrals" value="48" />
        <MiniStat label="Pending" value="09" />
        <MiniStat label="In Progress" value="12" />
        <MiniStat label="Completed" value="27" />
      </div>

      <div className="worker-panel full-panel">
        <div className="panel-header">
          <div>
            <h3>Referral Tracking</h3>
            <p>{filteredReferrals.length} referrals displayed</p>
          </div>
        </div>

        <div className="worker-referral-list">
          {filteredReferrals.map((referral) => (
            <div className="worker-referral-card" key={referral.id}>
              <div className="referral-main-icon">↗</div>

              <div className="referral-info">
                <strong>{referral.patient}</strong>
                <span>
                  {referral.from} → {referral.to}
                </span>
                <small>{referral.reason}</small>
              </div>

              <div className="referral-date">
                <span>Date</span>
                <strong>{referral.date}</strong>
              </div>

              <StatusBadge status={referral.status} />

              <div className="referral-actions">
                <button
                  className="small-icon-btn"
                  onClick={() => {
                    setSelectedReferral(referral);
                    setShowReferralDetails(true);
                  }}
                >
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  // =========================================================
  // NOTIFICATIONS PAGE
  // =========================================================

  const renderNotifications = () => (
    <>
      <PageHeader
        title="Notifications"
        subtitle="Stay updated with patient activity, triage, referrals and follow-up alerts."
      />

      <div className="worker-panel full-panel">
        <div className="panel-header">
          <div>
            <h3>Recent Notifications</h3>
            <p>Latest updates from your health worker dashboard.</p>
          </div>

          <button className="panel-link" onClick={markAllNotificationsRead}>
            Mark all as read
          </button>
        </div>

        <div className="notification-page-list">
          {notifications.map((item) => (
            <button
              key={item.id}
              className={`worker-notification-item ${!item.read ? "unread" : ""}`}
              onClick={() => markNotificationRead(item.id)}
            >
              <div className="notification-icon">🔔</div>

              <div>
                <strong>{item.title}</strong>
                <p>{item.message}</p>
                <small>{item.time}</small>
              </div>

              {!item.read && <span className="new-label">NEW</span>}
            </button>
          ))}
        </div>
      </div>
    </>
  );

  // =========================================================
  // PROFILE PAGE (WITH PASSWORD FIELD & MODAL TRIGGER)
  // =========================================================

  const renderProfile = () => (
    <>
      <PageHeader
        title="Worker Profile"
        subtitle="Manage your professional information, facility credentials and security."
        action={
          <button className="worker-primary-btn" onClick={openEditProfile}>
            ✎ Edit Profile
          </button>
        }
      />

      {!editProfile ? (
        <div className="worker-profile-layout">
          <div className="worker-panel worker-profile-card">
            <div className="worker-profile-cover"></div>

            <div className="worker-profile-avatar-wrapper">
              <ProfileAvatar large />

              <button
                className="change-photo-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Change profile photo"
              >
                📷
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleProfileImage}
              />
            </div>

            <div className="worker-profile-info">
              <h2>{workerProfile.name.replace(/\s*\(.*?\)/g, "").trim()}</h2>
              <p>{workerProfile.role}</p>
              <span>{workerProfile.department}</span>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "16px", justifyContent: "center" }}>
              <button
                className="worker-secondary-btn profile-edit-button"
                onClick={openEditProfile}
              >
                ✎ Edit Profile
              </button>
              <button
                className="worker-primary-btn"
                onClick={() => setShowPasswordModal(true)}
              >
                🔑 Change Password
              </button>
            </div>

            <div className="worker-profile-details">
              <InfoItem label="Facility" value={workerProfile.facility} />
              <InfoItem label="Department" value={workerProfile.department} />
              <InfoItem label="Employee ID" value={workerProfile.employeeId} />
              <InfoItem label="Experience" value={workerProfile.experience} />
              <InfoItem label="Mobile" value={workerProfile.phone} />
              <InfoItem label="Email" value={workerProfile.email} />
              <div className="info-item">
                <span>Account Password</span>
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
              <InfoItem label="Account Status" value="Active" />
            </div>

            <div className="worker-bio">
              <h3>About Health Worker</h3>
              <p>
                Community health worker responsible for primary patient support,
                initial triage, follow-up coordination, referral assistance and
                facility service support.
              </p>
            </div>
          </div>

          <div className="worker-panel worker-access-panel">
            <h3>Assigned Responsibilities</h3>
            <p>
              Your current health worker responsibilities across the
              SwasthyaSetu network.
            </p>

            <div className="worker-access-list">
              <AccessItem label="Patient Registration" enabled />
              <AccessItem label="Patient Triage" enabled />
              <AccessItem label="Follow-up Coordination" enabled />
              <AccessItem label="Referral Support" enabled />
              <AccessItem label="Facility Services" enabled />
              <AccessItem label="Doctor Coordination" enabled />
            </div>
          </div>
        </div>
      ) : (
        <div className="worker-panel edit-profile-panel">
          <div className="edit-profile-heading">
            <div>
              <span>PROFILE SETTINGS</span>
              <h2>Edit Health Worker Profile</h2>
              <p>Update your professional information below.</p>
            </div>

            <button
              type="button"
              className="worker-secondary-btn"
              onClick={() => setEditProfile(false)}
            >
              ← Back to Profile
            </button>
          </div>

          <div className="edit-profile-photo">
            <ProfileAvatar large />

            <div>
              <h3>Profile Photo</h3>
              <p>Upload a clear professional profile photo.</p>

              <button
                type="button"
                className="worker-secondary-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                📷 Change Photo
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleProfileImage}
              />
            </div>
          </div>

          <form className="worker-edit-profile-form" onSubmit={saveProfile}>
            <div className="worker-form-grid">
              <FormField
                label="Full Name"
                value={profileForm.name}
                onChange={(e) => updateProfileField("name", e.target.value)}
              />

              <FormField
                label="Role"
                value={profileForm.role}
                onChange={(e) => updateProfileField("role", e.target.value)}
              />

              <FormField
                label="Facility"
                value={profileForm.facility}
                onChange={(e) => updateProfileField("facility", e.target.value)}
              />

              <FormField
                label="Department"
                value={profileForm.department}
                onChange={(e) => updateProfileField("department", e.target.value)}
              />

              <FormField
                label="Employee ID"
                value={profileForm.employeeId}
                onChange={(e) => updateProfileField("employeeId", e.target.value)}
              />

              <FormField
                label="Experience"
                value={profileForm.experience}
                onChange={(e) => updateProfileField("experience", e.target.value)}
              />

              <FormField
                label="Mobile Number"
                value={profileForm.phone}
                onChange={(e) => updateProfileField("phone", e.target.value)}
              />

              <FormField
                label="Email Address"
                type="email"
                value={profileForm.email}
                onChange={(e) => updateProfileField("email", e.target.value)}
              />

              {/* Password field inside Edit Profile */}
              <FormField
                label="Portal Password"
                type="password"
                value={profileForm.password}
                onChange={(e) => updateProfileField("password", e.target.value)}
              />
            </div>

            <div className="edit-profile-actions">
              <button
                type="button"
                className="worker-secondary-btn"
                onClick={() => setEditProfile(false)}
              >
                Cancel
              </button>

              <button type="submit" className="worker-primary-btn">
                ✓ Save Profile
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );

  // =========================================================
  // SETTINGS PAGE
  // =========================================================

  const renderSettings = () => (
    <>
      <PageHeader
        title="Settings"
        subtitle="Manage your health worker account, notifications and work preferences."
        action={
          <button
            className="worker-secondary-btn"
            onClick={() => handleMenu("Profile")}
          >
            ← Back to Profile
          </button>
        }
      />

      <div className="worker-settings-grid">
        <div className="worker-panel settings-section">
          <div className="settings-heading">
            <span>🔐</span>
            <div>
              <h3>Security & Password</h3>
              <p>Protect your health worker portal credentials.</p>
            </div>
          </div>

          <div className="setting-row">
            <div>
              <strong>Account Password</strong>
              <span>Update your secure login password.</span>
            </div>

            <button
              className="worker-primary-btn"
              onClick={() => setShowPasswordModal(true)}
            >
              🔑 Change Password
            </button>
          </div>

          <SettingRow
            title="Two-Factor Authentication"
            text="Add an additional security verification step at login."
            checked={settings.twoFactor}
            onToggle={() => toggleSetting("twoFactor")}
          />
        </div>

        <div className="worker-panel settings-section">
          <div className="settings-heading">
            <span>🔔</span>
            <div>
              <h3>Notification Preferences</h3>
              <p>Choose which updates you want to receive.</p>
            </div>
          </div>

          <SettingRow
            title="Triage Alerts"
            text="Receive alerts for critical patient triage cases."
            checked={settings.triageAlerts}
            onToggle={() => toggleSetting("triageAlerts")}
          />

          <SettingRow
            title="Referral Notifications"
            text="Get notified about referral status changes."
            checked={settings.referralAlerts}
            onToggle={() => toggleSetting("referralAlerts")}
          />

          <SettingRow
            title="Follow-up Reminders"
            text="Receive reminders about upcoming patient follow-ups."
            checked={settings.followUpReminders}
            onToggle={() => toggleSetting("followUpReminders")}
          />

          <SettingRow
            title="Facility Alerts"
            text="Receive updates about facility services."
            checked={settings.facilityAlerts}
            onToggle={() => toggleSetting("facilityAlerts")}
          />
        </div>

        <div className="worker-panel settings-section">
          <div className="settings-heading">
            <span>🩺</span>
            <div>
              <h3>Work Preferences</h3>
              <p>Configure your work and consultation preferences.</p>
            </div>
          </div>

          <SettingRow
            title="Online Consultation"
            text="Allow assisted digital consultation requests."
            checked={settings.onlineConsultation}
            onToggle={() => toggleSetting("onlineConsultation")}
          />

          <SettingRow
            title="Show Availability"
            text="Display your working availability to connected teams."
            checked={settings.showAvailability}
            onToggle={() => toggleSetting("showAvailability")}
          />
        </div>
      </div>
    </>
  );

  // =========================================================
  // CONTENT SWITCH
  // =========================================================

  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return renderDashboard();
      case "Patient Triage":
        return renderTriage();
      case "Patients":
        return renderPatients();
      case "Facility Map":
        return renderFacilityMap();
      case "Facility Services":
        return renderFacilityServices();
      case "Follow-ups":
        return renderFollowUps();
      case "Referrals":
        return renderReferrals();
      case "Notifications":
        return renderNotifications();
      case "Profile":
        return renderProfile();
      case "Settings":
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  const menuItems = [
    {
      section: "MAIN",
      items: [
        { label: "Dashboard", icon: "⌂" },
        { label: "Patient Triage", icon: "🩺" },
        { label: "Patients", icon: "♙" },
      ],
    },
    {
      section: "PATIENT CARE",
      items: [
        { label: "Follow-ups", icon: "↻" },
        { label: "Referrals", icon: "↗" },
      ],
    },
    {
      section: "NETWORK",
      items: [
        { label: "Facility Map", icon: "📍" },
        { label: "Facility Services", icon: "▣" },
      ],
    },
  ];

  return (
    <div className="worker-dashboard-page">
      {/* SIDEBAR */}
      <aside className={`worker-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="worker-brand">
          <div className="worker-brand-icon">✚</div>
          <div>
            <strong>SwasthyaSetu</strong>
            <span>Health Worker Portal</span>
          </div>
        </div>

        <div className="worker-sidebar-profile">
          <ProfileAvatar />
          <div>
            <strong>{workerProfile.name.replace(/\s*\(.*?\)/g, "").trim()}</strong>
            <span>{workerProfile.role}</span>
          </div>
        </div>

        <nav className="worker-navigation">
          {menuItems.map((group) => (
            <div className="worker-nav-group" key={group.section}>
              <small>{group.section}</small>
              {group.items.map((item) => (
                <button
                  key={item.label}
                  className={`worker-nav-item ${activeMenu === item.label ? "active" : ""}`}
                  onClick={() => handleMenu(item.label)}
                >
                  <span className="worker-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.label === "Patient Triage" && <b>2</b>}
                  {item.label === "Follow-ups" && <b>4</b>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="worker-sidebar-bottom">
          <button
            className={`worker-nav-item ${activeMenu === "Notifications" ? "active" : ""}`}
            onClick={() => handleMenu("Notifications")}
          >
            <span className="worker-nav-icon">♢</span>
            <span>Notifications</span>
            {unreadCount > 0 && <b>{unreadCount}</b>}
          </button>

          <button
            className={`worker-nav-item ${activeMenu === "Profile" ? "active" : ""}`}
            onClick={() => handleMenu("Profile")}
          >
            <span className="worker-nav-icon">👤</span>
            <span>Profile</span>
          </button>

          <button
            className={`worker-nav-item ${activeMenu === "Settings" ? "active" : ""}`}
            onClick={() => handleMenu("Settings")}
          >
            <span className="worker-nav-icon">⚙</span>
            <span>Settings</span>
          </button>

          <button className="worker-logout" onClick={handleLogout}>
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div
          className="worker-mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* MAIN */}
      <main className="worker-main">
        <header className="worker-topbar">
          <div className="worker-mobile-left">
            <button
              type="button"
              className="worker-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open menu"
            >
              ☰
            </button>

            <button
              type="button"
              className="worker-mobile-back-btn"
              onClick={handleBack}
              aria-label="Go back"
            >
              ←
            </button>

            <div className="mobile-worker-brand">
              <div>✚</div>
              <strong>SwasthyaSetu</strong>
            </div>
          </div>

          <div className="worker-breadcrumb">
            <button
              className="worker-top-back-btn"
              onClick={handleBack}
              title="Go Back"
            >
              <span>←</span>
              <strong>Go Back</strong>
            </button>

            <span>Health Worker Portal</span>
            <b>/</b>
            <strong>{activeMenu}</strong>
          </div>

          <div className="worker-top-actions">
            <button
              className="worker-topbar-icon-btn"
              onClick={() => setNotificationOpen(!notificationOpen)}
            >
              🔔
              {unreadCount > 0 && <i>{unreadCount}</i>}
            </button>

            <div className="worker-profile-wrapper">
              <button
                className="worker-top-profile"
                onClick={() => setShowProfile(!showProfile)}
              >
                <ProfileAvatar />
                <div>
                  <strong>{workerProfile.name.replace(/\s*\(.*?\)/g, "").trim()}</strong>
                  <span>{workerProfile.role}</span>
                </div>
                <span className="profile-arrow">⌄</span>
              </button>

              {showProfile && (
                <div className="worker-profile-dropdown">
                  <button
                    onClick={() => {
                      setShowProfile(false);
                      handleMenu("Profile");
                    }}
                  >
                    👤 My Profile
                  </button>

                  <button
                    onClick={() => {
                      setShowProfile(false);
                      handleMenu("Settings");
                    }}
                  >
                    ⚙ Settings
                  </button>

                  <button onClick={handleLogout}>↪ Logout</button>
                </div>
              )}
            </div>
          </div>

          {notificationOpen && (
            <div className="worker-notification-dropdown">
              <div className="dropdown-title">
                <strong>Notifications</strong>
                <span>{unreadCount} new</span>
              </div>

              {notifications.slice(0, 4).map((notification) => (
                <button
                  className="dropdown-notification"
                  key={notification.id}
                  onClick={() => markNotificationRead(notification.id)}
                >
                  <div>🔔</div>
                  <div>
                    <strong>{notification.title}</strong>
                    <p>{notification.message}</p>
                    <small>{notification.time}</small>
                  </div>
                </button>
              ))}

              <button
                className="notification-view-all"
                onClick={() => {
                  setNotificationOpen(false);
                  handleMenu("Notifications");
                }}
              >
                View all notifications →
              </button>
            </div>
          )}
        </header>

        <section className="worker-content">{renderContent()}</section>
      </main>

      {/* PATIENT DETAILS MODAL */}
      {showPatientDetails && selectedPatient && (
        <Modal
          title="Patient Details"
          onClose={() => setShowPatientDetails(false)}
        >
          <div className="modal-patient">
            <div className="worker-avatar-fallback large">
              {selectedPatient.name.charAt(0)}
            </div>
            <div>
              <h3>{selectedPatient.name}</h3>
              <p>
                {selectedPatient.age} years · {selectedPatient.gender}
              </p>
            </div>
            <StatusBadge status={selectedPatient.risk} />
          </div>

          <div className="modal-info-grid">
            <InfoItem label="Condition" value={selectedPatient.condition} />
            <InfoItem label="Village" value={selectedPatient.village} />
            <InfoItem label="Phone" value={selectedPatient.phone} />
            <InfoItem label="Last Visit" value={selectedPatient.lastVisit} />
            <InfoItem
              label="Assigned Doctor"
              value={selectedPatient.assignedDoctor}
            />
            <InfoItem label="Status" value={selectedPatient.status} />
          </div>

          <div className="patient-history-box">
            <h4>Recent Patient Activity</h4>
            <div>
              <span>30 Aug 2026</span>
              <strong>Initial health assessment</strong>
            </div>
            <div>
              <span>28 Aug 2026</span>
              <strong>Follow-up completed</strong>
            </div>
            <div>
              <span>22 Aug 2026</span>
              <strong>Doctor consultation completed</strong>
            </div>
          </div>

          <div className="modal-actions">
            <button
              className="worker-primary-btn"
              onClick={() => {
                setShowPatientDetails(false);
                setShowTriage(true);
                setActiveMenu("Patient Triage");
              }}
            >
              Start Triage
            </button>

            <button
              className="worker-secondary-btn"
              onClick={() => setShowPatientDetails(false)}
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* REFERRAL DETAILS MODAL */}
      {showReferralDetails && selectedReferral && (
        <Modal
          title="Referral Details"
          onClose={() => setShowReferralDetails(false)}
        >
          <div className="modal-patient">
            <div className="worker-avatar-fallback large">
              {selectedReferral.patient.charAt(0)}
            </div>
            <div>
              <h3>{selectedReferral.patient}</h3>
              <p>Patient Referral</p>
            </div>
            <StatusBadge status={selectedReferral.status} />
          </div>

          <div className="modal-info-grid">
            <InfoItem label="From" value={selectedReferral.from} />
            <InfoItem label="To" value={selectedReferral.to} />
            <InfoItem label="Reason" value={selectedReferral.reason} />
            <InfoItem label="Date" value={selectedReferral.date} />
          </div>

          <div className="modal-actions">
            {selectedReferral.status === "Pending" && (
              <button
                className="worker-primary-btn"
                onClick={() => {
                  updateReferralStatus(selectedReferral.id, "In Progress");
                  setShowReferralDetails(false);
                }}
              >
                Start Referral
              </button>
            )}

            {selectedReferral.status === "In Progress" && (
              <button
                className="worker-primary-btn"
                onClick={() => {
                  updateReferralStatus(selectedReferral.id, "Completed");
                  setShowReferralDetails(false);
                }}
              >
                ✓ Mark Completed
              </button>
            )}

            <button
              className="worker-secondary-btn"
              onClick={() => setShowReferralDetails(false)}
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* CREATE REFERRAL MODAL */}
      {showReferral && (
        <Modal title="Create New Referral" onClose={() => setShowReferral(false)}>
          <form onSubmit={createReferral}>
            <div className="form-group">
              <label>Patient</label>
              <select name="patient" defaultValue="" required>
                <option value="">Select patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.name}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Referral Facility</label>
              <select
                name="destination"
                defaultValue="District Hospital"
                required
              >
                <option>District Hospital</option>
                <option>Community Health Centre</option>
                <option>Diagnostic Centre</option>
                <option>Specialist Hospital</option>
              </select>
            </div>

            <div className="form-group">
              <label>Reason for Referral</label>
              <textarea
                name="reason"
                placeholder="Enter reason for referral..."
                required
              />
            </div>

            <div className="modal-actions">
              <button type="submit" className="worker-primary-btn">
                Create Referral
              </button>
              <button
                type="button"
                className="worker-secondary-btn"
                onClick={() => setShowReferral(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <Modal
          title="Change Worker Password"
          onClose={() => setShowPasswordModal(false)}
        >
          <form onSubmit={handleSavePassword}>
            <div className="form-group">
              <label>New Secret Password</label>
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button type="submit" className="worker-primary-btn">
                Update Password
              </button>
              <button
                type="button"
                className="worker-secondary-btn"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* TOAST */}
      {toast && (
        <div className="worker-toast">
          <span>✓</span>
          {toast}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SUB-COMPONENTS
========================================================= */

function PageHeader({ title, subtitle, action }) {
  return (
    <div className="worker-page-header">
      <div>
        <span className="worker-page-eyebrow">
          SWASTHYASETU · HEALTH WORKER PORTAL
        </span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

function StatCard({ icon, label, value, change, urgent }) {
  return (
    <div className="worker-stat-card">
      <div className="stat-top">
        <div className="stat-icon">{icon}</div>
        <span className={urgent ? "stat-urgent" : ""}>{change}</span>
      </div>
      <strong>{value}</strong>
      <p>{label}</p>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="worker-mini-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function QuickAction({ icon, title, text, onClick }) {
  return (
    <button className="quick-action" onClick={onClick}>
      <div className="quick-action-icon">{icon}</div>
      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
      <b>→</b>
    </button>
  );
}

function PatientTable({ patients, onPatient }) {
  return (
    <div className="patient-table">
      <div className="patient-table-header">
        <span>Patient</span>
        <span>Condition</span>
        <span>Village</span>
        <span>Risk</span>
        <span></span>
      </div>

      {patients.map((patient) => (
        <button
          className="patient-table-row"
          key={patient.id}
          onClick={() => onPatient(patient)}
        >
          <div className="table-patient">
            <div className="patient-avatar">{patient.name.charAt(0)}</div>
            <div>
              <strong>{patient.name}</strong>
              <span>
                {patient.age} yrs · {patient.gender}
              </span>
            </div>
          </div>
          <span>{patient.condition}</span>
          <span>{patient.village}</span>
          <StatusBadge status={patient.risk} />
          <b>→</b>
        </button>
      ))}
    </div>
  );
}

function TriageRow({ item, onReview, onComplete }) {
  return (
    <div className="triage-row">
      <div
        className={`triage-priority-icon ${item.priority
          .toLowerCase()
          .replace(" ", "-")}`}
      >
        !
      </div>
      <div>
        <strong>{item.patient}</strong>
        <span>{item.symptoms}</span>
      </div>
      <StatusBadge status={item.priority} />
      <div className="triage-row-actions">
        <button className="small-icon-btn" onClick={onReview}>
          →
        </button>
        {item.status === "Pending" && (
          <button
            className="triage-check-btn"
            onClick={onComplete}
            title="Mark reviewed"
          >
            ✓
          </button>
        )}
      </div>
    </div>
  );
}

function TriageWorkspace({ patient, patients, onClose, onSave }) {
  const activePatient = patient || patients[0];

  return (
    <div className="triage-workspace">
      <div className="triage-workspace-header">
        <div className="modal-patient">
          <div className="worker-avatar-fallback large">
            {activePatient.name.charAt(0)}
          </div>
          <div>
            <span className="workspace-label">CURRENT TRIAGE</span>
            <h2>{activePatient.name}</h2>
            <p>
              {activePatient.age} years · {activePatient.gender} ·{" "}
              {activePatient.condition}
            </p>
          </div>
        </div>
        <button className="worker-secondary-btn" onClick={onClose}>
          End Assessment
        </button>
      </div>

      <div className="triage-workspace-grid">
        <div className="worker-panel">
          <h3>Patient Information</h3>
          <div className="modal-info-grid">
            <InfoItem label="Condition" value={activePatient.condition} />
            <InfoItem label="Risk Level" value={activePatient.risk} />
            <InfoItem label="Last Visit" value={activePatient.lastVisit} />
            <InfoItem label="Village" value={activePatient.village} />
          </div>

          <div className="form-group triage-field">
            <label>Chief Symptoms</label>
            <textarea
              defaultValue=""
              placeholder="Enter patient symptoms..."
            />
          </div>

          <div className="triage-vitals-grid">
            <div className="form-group">
              <label>Temperature</label>
              <input placeholder="e.g. 98.6 °F" />
            </div>
            <div className="form-group">
              <label>Blood Pressure</label>
              <input placeholder="e.g. 120/80" />
            </div>
            <div className="form-group">
              <label>Blood Sugar</label>
              <input placeholder="e.g. 140 mg/dL" />
            </div>
            <div className="form-group">
              <label>Pulse</label>
              <input placeholder="e.g. 78 bpm" />
            </div>
          </div>
        </div>

        <div className="worker-panel">
          <h3>Triage Assessment</h3>
          <div className="form-group triage-field">
            <label>Priority Level</label>
            <select defaultValue="">
              <option value="">Select priority</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div className="form-group triage-field">
            <label>Initial Assessment</label>
            <textarea placeholder="Enter initial clinical observations..." />
          </div>

          <div className="form-group triage-field">
            <label>Recommended Action</label>
            <select defaultValue="">
              <option value="">Select action</option>
              <option>Immediate Doctor Review</option>
              <option>Schedule Consultation</option>
              <option>Refer to Facility</option>
              <option>Routine Follow-up</option>
            </select>
          </div>

          <div className="form-group triage-field">
            <label>Worker Notes</label>
            <textarea placeholder="Add additional notes..." />
          </div>

          <div className="triage-workspace-actions">
            <button className="worker-secondary-btn" onClick={onClose}>
              Cancel
            </button>
            <button className="worker-primary-btn" onClick={onSave}>
              ✓ Save Triage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FollowUpRow({ item, onComplete }) {
  return (
    <div className="followup-row">
      <div className="followup-avatar">{item.patient.charAt(0)}</div>
      <div>
        <strong>{item.patient}</strong>
        <span>{item.reason}</span>
      </div>
      <div className="followup-right">
        <StatusBadge status={item.priority} />
        {item.status !== "Completed" && (
          <button onClick={() => onComplete(item.id)} title="Mark complete">
            ✓
          </button>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = status.toLowerCase().replaceAll(" ", "-");
  return (
    <span className={`worker-status ${normalized}`}>
      <i></i>
      {status}
    </span>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="info-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function AccessItem({ label, enabled }) {
  return (
    <div className="access-item">
      <span>{enabled ? "✓" : "×"}</span>
      <strong>{label}</strong>
      <small>{enabled ? "Enabled" : "Disabled"}</small>
    </div>
  );
}

function FormField({ label, type = "text", value, onChange }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input type={type} value={value} onChange={onChange} />
    </div>
  );
}

function SettingRow({ title, text, checked, onToggle }) {
  return (
    <div className="setting-row">
      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
      <button
        type="button"
        className={`toggle-switch ${checked ? "on" : ""}`}
        onClick={onToggle}
        aria-label={title}
      >
        <span></span>
      </button>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="worker-modal-overlay" onClick={onClose}>
      <div className="worker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default WorkerDashboard;