import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosClient.js";
import FacilityMap from "../../components/FacilityMap.jsx";
import CallModal from "../../components/CallModal.jsx";
import { getPatientRecord, addDoctorConsultation } from "../../api/medicalRecords.js";
import "./DoctorDashboard.css";

function DoctorDashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [menuHistory, setMenuHistory] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [showProfile, setShowProfile] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [consultationPatient, setConsultationPatient] = useState(null);
  const [activeCallAppointment, setActiveCallAppointment] = useState(null);
  const [consultationForm, setConsultationForm] = useState({ diagnosis: "", medicine: "", diagnostics: "", notes: "" });
  const [patientRecord, setPatientRecord] = useState(null);

  const [showPrescription, setShowPrescription] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [showPatientDetails, setShowPatientDetails] = useState(false);

  const [referralViewMode, setReferralViewMode] = useState("list");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState("");

  const [toast, setToast] = useState("");

  const [doctorProfile, setDoctorProfile] = useState({
    id: "",
    name: "Dr. Sharma",
    specialization: "General Physician",
    qualification: "MBBS, MD",
    experience: "8 Years",
    facility: "SwasthyaSetu Community Health Centre",
    consultationHours: "09:00 AM – 04:00 PM",
    phone: "9876543203",
    email: "dr.sharma@swasthyasetu.in",
    registration: "MED-2026-78421",
    bio: "Experienced general physician focused on accessible, coordinated rural healthcare and care continuity.",
    image: "",
  });

  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ ...doctorProfile });

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patient: "Rahul Kumar",
      age: 42,
      gender: "Male",
      time: "09:30 AM",
      type: "Follow-up",
      status: "Waiting",
      reason: "Diabetes follow-up",
    },
    {
      id: 2,
      patient: "Sunita Devi",
      age: 35,
      gender: "Female",
      time: "10:15 AM",
      type: "Video Consultation",
      status: "Confirmed",
      reason: "Fever & weakness",
    },
    {
      id: 3,
      patient: "Amit Singh",
      age: 51,
      gender: "Male",
      time: "11:00 AM",
      type: "Follow-up",
      status: "Confirmed",
      reason: "Blood pressure review",
    },
    {
      id: 4,
      patient: "Pooja Verma",
      age: 28,
      gender: "Female",
      time: "12:30 PM",
      type: "Consultation",
      status: "Pending",
      reason: "General consultation",
    },
    {
      id: 5,
      patient: "Ramesh Yadav",
      age: 64,
      gender: "Male",
      time: "02:00 PM",
      type: "Follow-up",
      status: "Confirmed",
      reason: "Heart health follow-up",
    },
  ]);

  const [patients, setPatients] = useState([
    {
      id: 101,
      name: "Rahul Kumar",
      age: 42,
      gender: "Male",
      phone: "9876543201",
      condition: "Type 2 Diabetes",
      lastVisit: "28 Aug 2026",
      risk: "Moderate",
    },
    {
      id: 102,
      name: "Sunita Devi",
      age: 35,
      gender: "Female",
      phone: "9765432102",
      condition: "Viral Fever",
      lastVisit: "30 Aug 2026",
      risk: "Low",
    },
    {
      id: 103,
      name: "Amit Singh",
      age: 51,
      gender: "Male",
      phone: "9654321018",
      condition: "Hypertension",
      lastVisit: "25 Aug 2026",
      risk: "Moderate",
    },
    {
      id: 104,
      name: "Pooja Verma",
      age: 28,
      gender: "Female",
      phone: "9543210973",
      condition: "General Checkup",
      lastVisit: "21 Aug 2026",
      risk: "Low",
    },
    {
      id: 105,
      name: "Ramesh Yadav",
      age: 64,
      gender: "Male",
      phone: "9432109864",
      condition: "Cardiac Monitoring",
      lastVisit: "20 Aug 2026",
      risk: "High",
    },
  ]);

  const [referrals, setReferrals] = useState([
    {
      id: 1,
      patient: "Ramesh Yadav",
      destination: "District Hospital Varanasi",
      reason: "Cardiology consultation",
      date: "29 Aug 2026",
      status: "Active",
    },
    {
      id: 2,
      patient: "Rahul Kumar",
      destination: "Community Health Centre Choubeypur",
      reason: "Diabetes management",
      date: "27 Aug 2026",
      status: "Pending",
    },
    {
      id: 3,
      patient: "Sunita Devi",
      destination: "Diagnostic Centre Harhua",
      reason: "Blood test",
      date: "25 Aug 2026",
      status: "Completed",
    },
  ]);

  const [followUps, setFollowUps] = useState([
    {
      id: 1,
      patient: "Rahul Kumar",
      date: "02 Sep 2026",
      reason: "Diabetes review",
      status: "Due Soon",
    },
    {
      id: 2,
      patient: "Amit Singh",
      date: "04 Sep 2026",
      reason: "BP monitoring",
      status: "Upcoming",
    },
    {
      id: 3,
      patient: "Ramesh Yadav",
      date: "01 Sep 2026",
      reason: "Cardiac follow-up",
      status: "Urgent",
    },
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New appointment request",
      message: "Pooja Verma requested a consultation.",
      time: "10 min ago",
      read: false,
    },
    {
      id: 2,
      title: "Referral update",
      message: "Ramesh Yadav's referral to District Hospital is active.",
      time: "35 min ago",
      read: false,
    },
    {
      id: 3,
      title: "Follow-up reminder",
      message: "3 patient follow-ups are due this week.",
      time: "1 hour ago",
      read: false,
    },
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem("swasthya_user");
    const cachedName = localStorage.getItem("userName");

    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setDoctorProfile((prev) => ({
          ...prev,
          id: parsed.id || parsed._id || prev.id,
          name: parsed.name || prev.name,
          email: parsed.email || prev.email,
          phone: parsed.phone || prev.phone,
          password: parsed.password || prev.password,
        }));
      } catch (err) {
        console.warn("Failed parsing saved doctor user", err);
      }
    } else if (cachedName) {
      setDoctorProfile((prev) => ({ ...prev, name: cachedName }));
    }

    const fetchDoctorData = async () => {
      try {
        const res = await api.get("/doctors/dashboard");
        if (res.data && res.data.success) {
          if (res.data.profile) {
            setDoctorProfile(res.data.profile);
            setProfileForm(res.data.profile);
          }
          if (res.data.appointments) setAppointments(res.data.appointments);
          if (res.data.patients) setPatients(res.data.patients);
          if (res.data.referrals) setReferrals(res.data.referrals);
          if (res.data.followUps) setFollowUps(res.data.followUps);
          if (res.data.notifications) setNotifications(res.data.notifications);
        }
      } catch (err) {
        console.warn("Failed fetching live database records for doctor dashboard", err);
      }
    };

    fetchDoctorData();
  }, []);

  const [settings, setSettings] = useState({
    appointmentNotifications: true,
    referralNotifications: true,
    followUpNotifications: true,
    emailNotifications: false,
    smsNotifications: true,
    onlineConsultation: true,
    showAvailability: true,
    twoFactor: false,
  });

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast("");
    }, 2500);
  };

  const handleMenu = (menu) => {
    if (menu === activeMenu) {
      setMobileMenuOpen(false);
      return;
    }

    setMenuHistory((prev) => {
      if (prev[prev.length - 1] === activeMenu) return prev;
      return [...prev, activeMenu];
    });

    setActiveMenu(menu);
    setSearch("");
    setSelectedPatient(null);
    setSelectedAppointment(null);
    setConsultationPatient(null);
    setShowPrescription(false);
    setShowReferral(false);
    setShowPatientDetails(false);
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
    if (showPatientDetails) {
      setShowPatientDetails(false);
      return;
    }
    if (selectedPatient) {
      setSelectedPatient(null);
      return;
    }
    if (selectedAppointment) {
      setSelectedAppointment(null);
      return;
    }
    if (showPrescription) {
      setShowPrescription(false);
      return;
    }
    if (showReferral) {
      setShowReferral(false);
      return;
    }
    if (consultationPatient) {
      setConsultationPatient(null);
      return;
    }
    if (activeMenu === "Profile" && editProfile) {
      setEditProfile(false);
      return;
    }

    if (menuHistory.length > 0) {
      const history = [...menuHistory];
      const previousPage = history.pop();

      setMenuHistory(history);
      setActiveMenu(previousPage || "Dashboard");
      setSearch("");
      setSelectedPatient(null);
      setSelectedAppointment(null);
      setConsultationPatient(null);
      setShowPrescription(false);
      setShowReferral(false);
      setShowPatientDetails(false);
      setNotificationOpen(false);
      setShowProfile(false);
      setEditProfile(false);
      setMobileMenuOpen(false);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    if (activeMenu === "Dashboard") {
      navigate("/roles");
    } else {
      setActiveMenu("Dashboard");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!newPasswordInput || newPasswordInput.length < 6) {
      showToast("Password must be at least 6 characters.");
      return;
    }

    try {
      await api.put("/auth/update-password", { newPassword: newPasswordInput });
      setShowPasswordModal(false);
      setNewPasswordInput("");
      showToast("Password updated successfully in database.");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update password.");
    }
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
      setDoctorProfile((prev) => ({
        ...prev,
        image: e.target.result,
      }));
      showToast("Profile photo updated successfully.");
    };
    reader.readAsDataURL(file);
  };

  const openEditProfile = () => {
    setProfileForm({ ...doctorProfile });
    setEditProfile(true);
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put("/doctors/profile", profileForm);
      if (res.data && res.data.success) {
        setDoctorProfile(res.data.data);
      }
    } catch (err) {
      setDoctorProfile((prev) => ({ ...prev, ...profileForm }));
      console.warn("Profile updated locally", err);
    }

    setEditProfile(false);
    showToast("Profile updated successfully.");
  };

  const updateProfileField = (field, value) => {
    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveSettings = () => {
    showToast("Settings saved successfully.");
  };

  const handleAcceptAppointment = (appointmentId) => {
    setAppointments((current) => {
      const target = current.find((a) => (a._id || a.id) === appointmentId);
      if (!target) return current;
      const conflict = current.some((a) =>
        (a._id || a.id) !== appointmentId &&
        a.time === target.time &&
        a.status === "Confirmed"
      );
      if (conflict) {
        showToast("This time slot is already confirmed for another patient.");
        return current;
      }
      showToast(`Appointment accepted for ${target.patient}.`);
      return current.map((a) => (a._id || a.id) === appointmentId ? { ...a, status: "Confirmed" } : a);
    });
  };

  const handleStartConsultation = (patient) => {
    if (activeMenu !== "Consultations") {
      setMenuHistory((prev) => {
        if (prev[prev.length - 1] === activeMenu) return prev;
        return [...prev, activeMenu];
      });
    }
    setConsultationPatient(patient);
    const existingRecord = getPatientRecord(patient.name);
    const syncedRecord = {
      ...existingRecord,
      patient: {
        ...existingRecord.patient,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone || existingRecord.patient.phone
      }
    };
    localStorage.setItem("swasthyasetu_medical_records", JSON.stringify({
      ...JSON.parse(localStorage.getItem("swasthyasetu_medical_records") || "{}"),
      [patient.name]: syncedRecord
    }));
    setPatientRecord(syncedRecord);
    setConsultationForm({ diagnosis: "", medicine: "", diagnostics: "", notes: "" });
    setActiveMenu("Consultations");
    setMobileMenuOpen(false);
    showToast(`Consultation started for ${patient.name}`);
  };

  const handleCompleteConsultation = () => {
    if (!consultationPatient) return;

    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.patient === consultationPatient.name
          ? { ...appointment, status: "Completed" }
          : appointment
      )
    );

    const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const updated = addDoctorConsultation(consultationPatient.name, {
      date,
      doctor: doctorProfile.name,
      diagnosis: consultationForm.diagnosis || "Clinical assessment completed",
      medicine: consultationForm.medicine || "No medicine added",
      diagnostics: consultationForm.diagnostics || "No diagnostic order",
      notes: consultationForm.notes || "No additional notes"
    });
    setPatientRecord(updated);
    showToast("Consultation completed successfully.");
    setConsultationPatient(null);
  };

  const handleCreateReferral = async (event) => {
    if (event) event.preventDefault();
    const newReferralPayload = {
      patient: selectedPatient?.name || "Ramesh Yadav",
      destination: "District Hospital Varanasi",
      reason: "Cardiology consultation",
      status: "Active",
    };

    try {
      const res = await api.post("/doctors/referrals", newReferralPayload);
      if (res.data && res.data.success) {
        setReferrals((prev) => [res.data.data, ...prev]);
      }
    } catch (err) {
      const fallbackRef = { id: Date.now(), ...newReferralPayload, date: "Today" };
      setReferrals((prev) => [fallbackRef, ...prev]);
    }

    setShowReferral(false);
    showToast("Referral created successfully.");
  };

  const handleFollowUpComplete = async (id) => {
    try {
      await api.put(`/doctors/followups/${id}`, { status: "Completed" });
    } catch (err) {
      console.warn("Updated follow-up locally", err);
    }
    setFollowUps((prev) =>
      prev.map((item) =>
        (item._id === id || item.id === id) ? { ...item, status: "Completed" } : item
      )
    );
    showToast("Follow-up marked as completed.");
  };

  const markAllNotificationsRead = async () => {
    try {
      await api.put("/doctors/notifications/read-all");
    } catch (err) {
      console.warn("Marked notifications read locally", err);
    }
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        read: true,
      }))
    );
    showToast("All notifications marked as read.");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredPatients = patients.filter((patient) =>
    `${patient.name} ${patient.condition || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredAppointments = appointments.filter((appointment) =>
    `${appointment.patient} ${appointment.reason || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const ProfileAvatar = ({ large = false }) => {
    return doctorProfile.image ? (
      <img
        src={doctorProfile.image}
        alt="Doctor profile"
        className={
          large ? "doctor-avatar-image large" : "doctor-avatar-image"
        }
      />
    ) : (
      <div
        className={
          large ? "doctor-avatar-fallback large" : "doctor-avatar-fallback"
        }
      >
        DS
      </div>
    );
  };

  const renderDashboard = () => (
    <>
      <PageHeader
        title={`Welcome, ${doctorProfile.name}`}
        subtitle="Here's what's happening with your patients and consultations today."
        showBack={false}
        onBack={handleBack}
        action={
          <button
            className="doctor-primary-btn"
            onClick={() => handleMenu("Appointments")}
          >
            <span>＋</span>
            View Appointments
          </button>
        }
      />

      <div className="doctor-stats-grid">
        <StatCard
          icon="📅"
          label="Today's Appointments"
          value={appointments.length.toString()}
          change="+3 today"
        />

        <StatCard
          icon="👥"
          label="Total Patients"
          value={patients.length.toString()}
          change="+8 this month"
        />

        <StatCard
          icon="🩺"
          label="Pending Consultations"
          value="05"
          change="2 urgent"
          urgent
        />

        <StatCard
          icon="🔄"
          label="Active Follow-ups"
          value={followUps.length.toString()}
          change="4 due soon"
        />
      </div>

      <div className="doctor-dashboard-grid">
        <div className="doctor-panel">
          <div className="panel-header">
            <div>
              <h3>Today's Appointments</h3>
              <p>Your upcoming patient consultations</p>
            </div>

            <button
              className="panel-link"
              onClick={() => handleMenu("Appointments")}
            >
              View all →
            </button>
          </div>

          <div className="appointment-list">
            {appointments.slice(0, 4).map((appointment) => (
              <AppointmentRow
                key={appointment._id || appointment.id}
                appointment={appointment}
                onClick={() => setSelectedAppointment(appointment)}
              />
            ))}
          </div>
        </div>

        <div className="doctor-panel">
          <div className="panel-header">
            <div>
              <h3>Quick Actions</h3>
              <p>Frequently used doctor tools</p>
            </div>
          </div>

          <div className="quick-actions">
            <QuickAction
              icon="👤"
              title="Find Patient"
              text="Search patient records"
              onClick={() => handleMenu("Patients")}
            />

            <QuickAction
              icon="🩺"
              title="Start Consultation"
              text="Begin patient consultation"
              onClick={() => handleMenu("Consultations")}
            />

            <QuickAction
              icon="🔄"
              title="Create Referral"
              text="Refer patient to facility"
              onClick={() => setShowReferral(true)}
            />

            <QuickAction
              icon="💊"
              title="Prescription"
              text="Create a digital prescription"
              onClick={() => setShowPrescription(true)}
            />
          </div>
        </div>
      </div>

      <div className="doctor-dashboard-grid lower">
        <div className="doctor-panel">
          <div className="panel-header">
            <div>
              <h3>Recent Patients</h3>
              <p>Recently visited patients</p>
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

        <div className="doctor-panel">
          <div className="panel-header">
            <div>
              <h3>Follow-up Alerts</h3>
              <p>Patients requiring attention</p>
            </div>
          </div>

          <div className="followup-list">
            {followUps.map((item) => (
              <FollowUpRow
                key={item._id || item.id}
                item={item}
                onComplete={handleFollowUpComplete}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderAppointments = () => (
    <>
      <PageHeader
        title="Appointments"
        subtitle="Manage today's and upcoming patient appointments."
        showBack={true}
        onBack={handleBack}
      />

      <div className="doctor-filter-bar">
        <div className="doctor-search">
          <span>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient or reason..."
          />
        </div>
      </div>

      <div className="doctor-panel full-panel">
        <div className="panel-header">
          <div>
            <h3>Appointment Schedule</h3>
            <p>{filteredAppointments.length} appointments found</p>
          </div>
        </div>

        <div className="appointment-full-list">
          {filteredAppointments.map((appointment) => (
            <div className="appointment-card" key={appointment._id || appointment.id}>
              <div className="appointment-time">
                <strong>{appointment.time}</strong>
                <span>{appointment.type}</span>
              </div>

              <div className="appointment-patient">
                <div className="patient-avatar">
                  {appointment.patient?.charAt(0) || "P"}
                </div>

                <div>
                  <strong>{appointment.patient}</strong>
                  <span>
                    {appointment.age} years · {appointment.gender}
                  </span>
                  <small>{appointment.reason}</small>
                </div>
              </div>

              <StatusBadge status={appointment.status} />

              <div className="appointment-actions" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {(appointment.status === "Pending" || appointment.status === "Waiting") && (
                  <button
                    className="small-primary-btn"
                    onClick={() => handleAcceptAppointment(appointment._id || appointment.id)}
                  >
                    ✓ Accept Appointment
                  </button>
                )}

                {appointment.type === "Video Consultation" && appointment.status !== "Completed" && (
                  <button
                    className="doctor-primary-btn"
                    onClick={() => setActiveCallAppointment(appointment)}
                    style={{ padding: "6px 12px", fontSize: "13px" }}
                  >
                    Start Call 🎥
                  </button>
                )}

                {appointment.status !== "Completed" && (
                  <>
                    <button
                      className="small-primary-btn"
                      onClick={() => navigate(`/consultation/room-${appointment._id || appointment.id}?type=video`)}
                      style={{ backgroundColor: "#28a745" }}
                    >
                      🎥 Video
                    </button>
                    <button
                      className="small-primary-btn"
                      onClick={() => navigate(`/consultation/room-${appointment._id || appointment.id}?type=voice`)}
                      style={{ backgroundColor: "#17a2b8" }}
                    >
                      📞 Voice
                    </button>
                  </>
                )}

                <button
                  className="small-icon-btn"
                  onClick={() => setSelectedAppointment(appointment)}
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

  const renderPatients = () => (
    <>
      <PageHeader
        title="Patient Records"
        subtitle="Search and manage your assigned patient history."
        showBack={true}
        onBack={handleBack}
      />

      <div className="doctor-filter-bar">
        <div className="doctor-search">
          <span>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patients..."
          />
        </div>
      </div>

      <div className="doctor-panel full-panel">
        <div className="panel-header">
          <div>
            <h3>All Patients</h3>
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

  const renderConsultations = () => (
    <>
      <PageHeader
        title="Consultations"
        subtitle="Conduct and manage digital patient consultations."
        showBack={true}
        onBack={handleBack}
      />

      {!consultationPatient ? (
        <div className="consultation-empty">
          <div className="empty-icon">🩺</div>
          <h3>No active consultation</h3>
          <p>Select an appointment or patient to start a clinical session.</p>

          <button
            className="doctor-primary-btn"
            onClick={() => handleMenu("Appointments")}
          >
            View Appointments
          </button>
        </div>
      ) : (
        <div className="consultation-workspace">
          <div className="consultation-patient-header">
            <div className="large-patient-avatar">
              {consultationPatient.name?.charAt(0) || "P"}
            </div>

            <div>
              <span>Current Consultation</span>
              <h2>{consultationPatient.name}</h2>
              <p>
                {consultationPatient.age} years · {consultationPatient.gender} · {consultationPatient.condition}
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button
                className="doctor-primary-btn"
                onClick={() => setActiveCallAppointment(consultationPatient)}
                style={{ padding: "8px 16px" }}
              >
                Video Call 🎥
              </button>

              <button
                className="doctor-secondary-btn"
                onClick={() => setConsultationPatient(null)}
              >
                End Session
              </button>
            </div>
          </div>          <div className="consultation-grid">
            <div className="doctor-panel">
              <h3>Patient Information</h3>
              <div className="info-grid">
                <InfoItem label="Condition" value={consultationPatient.condition} />
                <InfoItem label="Last Visit" value={consultationPatient.lastVisit} />
                <InfoItem label="Risk Level" value={consultationPatient.risk} />
                <InfoItem label="Contact" value={consultationPatient.phone} />
              </div>
              {patientRecord?.vitals && (
                <div className="patient-history-box" style={{ marginTop: "18px" }}>
                  <h4>Latest Health Worker Vitals</h4>
                  <div><span>BP</span><strong>{patientRecord.vitals.bloodPressure}</strong></div>
                  <div><span>Blood Sugar</span><strong>{patientRecord.vitals.bloodSugar}</strong></div>
                  <div><span>Temperature</span><strong>{patientRecord.vitals.temperature}</strong></div>
                  <div><span>Pulse</span><strong>{patientRecord.vitals.pulse}</strong></div>
                </div>
              )}
            </div>

            <div className="doctor-panel">
              <h3>Clinical Assessment</h3>
              <div className="medical-note">
                <label>Diagnosis</label>
                <textarea value={consultationForm.diagnosis} onChange={(e) => setConsultationForm({ ...consultationForm, diagnosis: e.target.value })} placeholder="Enter diagnosis..." />
                <label>Medicine</label>
                <textarea value={consultationForm.medicine} onChange={(e) => setConsultationForm({ ...consultationForm, medicine: e.target.value })} placeholder="Enter prescribed medicines..." />
                <label>Diagnostics</label>
                <textarea value={consultationForm.diagnostics} onChange={(e) => setConsultationForm({ ...consultationForm, diagnostics: e.target.value })} placeholder="Enter tests / diagnostic advice..." />
                <label>Clinical Notes</label>
                <textarea value={consultationForm.notes} onChange={(e) => setConsultationForm({ ...consultationForm, notes: e.target.value })} placeholder="Enter clinical notes..." />
              </div>
              <div className="consultation-actions">
                <button
                  className="doctor-primary-btn"
                  onClick={handleCompleteConsultation}
                >
                  ✓ Complete Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  const renderReferrals = () => (
    <>
      <PageHeader
        title="Referrals"
        subtitle="Track, route, and manage patient referrals across healthcare facilities."
        showBack={true}
        onBack={handleBack}
        action={
          <button
            className="doctor-primary-btn"
            onClick={() => setShowReferral(true)}
          >
            ＋ New Referral
          </button>
        }
      />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", gap: "12px", flexWrap: "wrap" }}>
        <div className="referral-stats" style={{ margin: 0 }}>
          <MiniStat label="Active Referrals" value={referrals.length.toString()} />
        </div>

        <div style={{ display: "flex", background: "var(--surface)", padding: "4px", borderRadius: "10px", border: "1px solid var(--border)" }}>
          <button
            type="button"
            onClick={() => setReferralViewMode("list")}
            style={{
              padding: "7px 16px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              background: referralViewMode === "list" ? "var(--primary)" : "transparent",
              color: referralViewMode === "list" ? "var(--white)" : "var(--text-muted)",
            }}
          >
            ▤ List View
          </button>

          <button
            type="button"
            onClick={() => setReferralViewMode("map")}
            style={{
              padding: "7px 16px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              background: referralViewMode === "map" ? "var(--primary)" : "transparent",
              color: referralViewMode === "map" ? "var(--white)" : "var(--text-muted)",
            }}
          >
            📍 Facility Network Map
          </button>
        </div>
      </div>

      {referralViewMode === "map" ? (
        <div style={{ height: "600px", borderRadius: "16px", overflow: "hidden", border: "1px solid var(--border)", marginBottom: "32px" }}>
          <FacilityMap
            onSelectFacility={(fac) => {
              showToast(`Selected ${fac.name} for referral.`);
            }}
          />
        </div>
      ) : (
        <div className="doctor-panel full-panel">
          <div className="panel-header">
            <div>
              <h3>Referral Tracking</h3>
              <p>Monitor the status of referred patients.</p>
            </div>
          </div>

          <div className="referral-list">
            {referrals.map((referral) => (
              <div className="referral-card" key={referral._id || referral.id}>
                <div className="referral-icon">🔄</div>
                <div className="referral-info">
                  <strong>{referral.patient}</strong>
                  <span>→ {referral.destination || referral.to}</span>
                  <small>{referral.reason}</small>
                </div>
                <div className="referral-date">
                  <span>Date</span>
                  <strong>{referral.date}</strong>
                </div>
                <StatusBadge status={referral.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  const renderPrescriptions = () => (
    <>
      <PageHeader
        title="Prescriptions"
        subtitle="Create and manage digital prescriptions for patients."
        showBack={true}
        onBack={handleBack}
        action={
          <button
            className="doctor-primary-btn"
            onClick={() => setShowPrescription(true)}
          >
            ＋ New Prescription
          </button>
        }
      />
      <div className="prescription-grid">
        <PrescriptionCard
          patient="Rahul Kumar"
          status="Completed"
          description="Diabetes management prescription"
          medicines={["Metformin — 500 mg · Twice daily"]}
          onClick={() => showToast("Prescription preview opened.")}
        />
      </div>
    </>
  );

  const renderFollowUps = () => (
    <>
      <PageHeader
        title="Follow-ups"
        subtitle="Monitor patients who need continued care and scheduled reviews."
        showBack={true}
        onBack={handleBack}
      />
      <div className="doctor-panel full-panel">
        <div className="panel-header">
          <div>
            <h3>Follow-up Schedule</h3>
            <p>Keep track of continuity of care.</p>
          </div>
        </div>

        <div className="followup-table">
          {followUps.map((item) => (
            <div className="followup-card" key={item._id || item.id}>
              <div className="followup-patient">
                <strong>{item.patient}</strong>
                <span>{item.reason}</span>
              </div>
              <StatusBadge status={item.status} />
              {item.status !== "Completed" && (
                <button
                  className="small-primary-btn"
                  onClick={() => handleFollowUpComplete(item._id || item.id)}
                >
                  Complete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderAnalytics = () => (
    <>
      <PageHeader
        title="Analytics"
        subtitle="Overview of your patient care and consultation activity."
        showBack={true}
        onBack={handleBack}
      />
      <div className="analytics-grid">
        <AnalyticsCard title="Patients This Month" value={patients.length.toString()} text="Live Data" />
        <AnalyticsCard title="Consultations" value={appointments.length.toString()} text="Total scheduled" />
      </div>
    </>
  );

  const renderProfile = () => (
    <>
      <PageHeader
        title="Doctor Profile"
        subtitle="Manage your professional information, consultation hours and credentials."
        showBack={true}
        onBack={handleBack}
        action={
          <button className="doctor-primary-btn" onClick={openEditProfile}>
            ✎ Edit Profile
          </button>
        }
      />

      {!editProfile ? (
        <div className="profile-layout">
          <div className="doctor-panel profile-card-main">
            <div className="profile-cover"></div>
            <div className="profile-avatar-wrapper">
              <ProfileAvatar large />
              <button
                className="change-photo-btn"
                onClick={() => fileInputRef.current?.click()}
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

            <div className="profile-main-info">
              <h2>{doctorProfile.name}</h2>
              <p>{doctorProfile.specialization}</p>
              <span>{doctorProfile.qualification} · {doctorProfile.experience} Experience</span>
            </div>

            <div className="profile-details">
              <InfoItem label="Healthcare Facility" value={doctorProfile.facility} />
              <InfoItem label="Specialization" value={doctorProfile.specialization} />
              <InfoItem label="Experience" value={doctorProfile.experience} />
              <InfoItem label="Phone" value={doctorProfile.phone} />
              <InfoItem label="Email" value={doctorProfile.email} />
              <InfoItem label="Registration ID" value={doctorProfile.registration} />
            </div>

            <div className="doctor-bio">
              <h3>About Doctor</h3>
              <p>{doctorProfile.bio}</p>
            </div>
          </div>
        </div>
      ) : (
        renderEditProfile()
      )}
    </>
  );

  const renderEditProfile = () => (
    <div className="doctor-panel edit-profile-panel">
      <div className="edit-profile-heading">
        <div>
          <span>PROFILE SETTINGS</span>
          <h2>Edit Professional Profile</h2>
        </div>
        <button
          className="doctor-secondary-btn"
          onClick={() => setEditProfile(false)}
        >
          ← Back to Profile
        </button>
      </div>

      <form onSubmit={saveProfile}>
        <div className="edit-form-grid">
          <FormField
            label="Doctor Name"
            value={profileForm.name}
            onChange={(e) => updateProfileField("name", e.target.value)}
          />
          <FormField
            label="Specialization"
            value={profileForm.specialization}
            onChange={(e) => updateProfileField("specialization", e.target.value)}
          />
          <FormField
            label="Phone Number"
            value={profileForm.phone}
            onChange={(e) => updateProfileField("phone", e.target.value)}
          />
        </div>

        <div className="edit-profile-actions">
          <button type="submit" className="doctor-primary-btn">
            ✓ Save Profile
          </button>
        </div>
      </form>
    </div>
  );

  const renderSettings = () => (
    <>
      <PageHeader
        title="Settings"
        subtitle="Manage your account security, notifications and availability preferences."
        showBack={true}
        onBack={handleBack}
      />
      <div className="doctor-panel settings-content">
        <section className="settings-section">
          <div className="setting-row">
            <div>
              <strong>Account Password</strong>
              <p>Update your secure doctor login credentials.</p>
            </div>
            <button
              className="doctor-primary-btn"
              onClick={() => setShowPasswordModal(true)}
            >
              🔑 Change Password
            </button>
          </div>
        </section>
      </div>
    </>
  );

  const renderNotifications = () => (
    <>
      <PageHeader
        title="Notifications"
        subtitle="Stay updated with patient activity and clinical alerts."
        showBack={true}
        onBack={handleBack}
      />
      <div className="doctor-panel full-panel">
        <div className="panel-header">
          <button className="panel-link" onClick={markAllNotificationsRead}>
            Mark all as read
          </button>
        </div>
        <div className="notification-page-list">
          {notifications.map((notification) => (
            <div className="notification-page-item" key={notification._id || notification.id}>
              <div>🔔</div>
              <div>
                <strong>{notification.title}</strong>
                <p>{notification.message}</p>
                <small>{notification.time}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard": return renderDashboard();
      case "Appointments": return renderAppointments();
      case "Patients": return renderPatients();
      case "Consultations": return renderConsultations();
      case "Referrals": return renderReferrals();
      case "Prescriptions": return renderPrescriptions();
      case "Follow-ups": return renderFollowUps();
      case "Analytics": return renderAnalytics();
      case "Profile": return renderProfile();
      case "Settings": return renderSettings();
      case "Notifications": return renderNotifications();
      default: return renderDashboard();
    }
  };

  const menuItems = [
    { section: "MAIN", items: [{ label: "Dashboard", icon: "⌂" }, { label: "Appointments", icon: "▣" }, { label: "Patients", icon: "♙" }, { label: "Consultations", icon: "◉" }] },
    { section: "PATIENT CARE", items: [{ label: "Referrals", icon: "↗" }, { label: "Prescriptions", icon: "＋" }, { label: "Follow-ups", icon: "↻" }] },
    { section: "INSIGHTS", items: [{ label: "Analytics", icon: "▥" }] },
  ];

  return (
    <div className="doctor-dashboard-page">
      <aside className={`doctor-sidebar ${mobileMenuOpen ? "mobile-sidebar-open" : ""}`}>
        <div className="doctor-brand">
          <div className="doctor-brand-icon">✚</div>
          <div>
            <strong>SwasthyaSetu</strong>
            <span>Doctor Portal</span>
          </div>
        </div>

        <div className="doctor-sidebar-profile">
          <ProfileAvatar />
          <div>
            <strong>{doctorProfile.name}</strong>
            <span>{doctorProfile.specialization}</span>
          </div>
        </div>

        <nav className="doctor-navigation">
          {menuItems.map((group) => (
            <div className="doctor-nav-group" key={group.section}>
              <small>{group.section}</small>
              {group.items.map((item) => (
                <button
                  key={item.label}
                  className={`doctor-nav-item ${activeMenu === item.label ? "active" : ""}`}
                  onClick={() => handleMenu(item.label)}
                >
                  <span className="doctor-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="doctor-sidebar-bottom">
          <button className={`doctor-nav-item ${activeMenu === "Notifications" ? "active" : ""}`} onClick={() => handleMenu("Notifications")}>
            <span>🔔</span> Notifications {unreadCount > 0 && <b>{unreadCount}</b>}
          </button>
          <button className={`doctor-nav-item ${activeMenu === "Profile" ? "active" : ""}`} onClick={() => handleMenu("Profile")}>
            <span>👤</span> Profile
          </button>
          <button className={`doctor-nav-item ${activeMenu === "Settings" ? "active" : ""}`} onClick={() => handleMenu("Settings")}>
            <span>⚙</span> Settings
          </button>
          <button className="doctor-logout" onClick={handleLogout}>
            <span>↪</span> Logout
          </button>
        </div>
      </aside>

      <main className="doctor-main">
        <header className="doctor-topbar">
          <button type="button" className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span></span><span></span><span></span>
          </button>
          <div className="doctor-breadcrumb">
            <span>Doctor Portal</span><b>/</b><strong>{activeMenu}</strong>
          </div>
          <div className="doctor-top-profile-wrap">
            <button className="doctor-top-profile" onClick={() => setProfileMenuOpen((v) => !v)} title="Open profile" aria-expanded={profileMenuOpen}>
              <ProfileAvatar />
              <span><strong>{doctorProfile.name}</strong><small>{doctorProfile.specialization}</small></span>
              <b className="profile-chevron">⌄</b>
            </button>
            {profileMenuOpen && (
              <div className="doctor-profile-popover">
                <div className="doctor-profile-popover-head">
                  <ProfileAvatar />
                  <div><strong>{doctorProfile.name}</strong><span>{doctorProfile.specialization}</span></div>
                </div>
                <button onClick={() => { setProfileMenuOpen(false); handleMenu("Profile"); setEditProfile(false); }}>👤 Profile</button>
                <button onClick={() => { setProfileMenuOpen(false); setEditProfile(true); handleMenu("Profile"); }}>✎ Edit Profile</button>
                <button className="profile-logout" onClick={() => { setProfileMenuOpen(false); handleLogout(); }}>↪ Logout</button>
              </div>
            )}
          </div>
        </header>

        <section className="doctor-content">{renderContent()}</section>
      </main>

      {selectedAppointment && (
        <Modal
          title="Appointment Details"
          onClose={() => setSelectedAppointment(null)}
        >
          <div className="modal-patient">
            <div className="large-patient-avatar">
              {selectedAppointment.patient.charAt(0)}
            </div>
            <div>
              <h3>{selectedAppointment.patient}</h3>
              <p>
                {selectedAppointment.age} years · {selectedAppointment.gender}
              </p>
            </div>
          </div>

          <div className="modal-info-grid">
            <InfoItem label="Appointment" value={selectedAppointment.time} />
            <InfoItem label="Type" value={selectedAppointment.type} />
            <InfoItem label="Reason" value={selectedAppointment.reason} />
            <InfoItem label="Status" value={selectedAppointment.status} />
          </div>

          <div className="modal-actions">
            {selectedAppointment.type === "Video Consultation" && selectedAppointment.status !== "Completed" && (
              <button
                className="doctor-primary-btn"
                onClick={() => {
                  setActiveCallAppointment(selectedAppointment);
                  setSelectedAppointment(null);
                }}
              >
                Start Video Call 🎥
              </button>
            )}

            {selectedAppointment.status !== "Completed" && (
              <button
                className="doctor-primary-btn"
                onClick={() => {
                  const patient = patients.find(
                    (p) => p.name === selectedAppointment.patient
                  );
                  setSelectedAppointment(null);
                  if (patient) {
                    handleStartConsultation(patient);
                  }
                }}
              >
                Start Consultation
              </button>
            )}

            <button
              className="doctor-secondary-btn"
              onClick={() => setSelectedAppointment(null)}
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {showPatientDetails && selectedPatient && (
        <Modal
          title="Patient Details"
          onClose={() => setShowPatientDetails(false)}
        >
          <div className="modal-patient">
            <div className="large-patient-avatar">
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
            <InfoItem label="Last Visit" value={selectedPatient.lastVisit} />
            <InfoItem label="Contact" value={selectedPatient.phone} />
            <InfoItem label="Risk Level" value={selectedPatient.risk} />
          </div>

          {(() => {
            const record = getPatientRecord(selectedPatient.name);
            return (
              <>
                <div className="patient-history-box">
                  <h4>Complete Medical History</h4>
                  {record.history.map((item, index) => (
                    <div key={`${item.date}-${index}`}>
                      <span>{item.date} · {item.type}</span>
                      <strong>{item.title}</strong>
                      <small>{item.detail}</small>
                    </div>
                  ))}
                </div>
                <div className="patient-history-box">
                  <h4>Previous Medical Documents</h4>
                  {record.documents.map((doc) => (
                    <div key={doc.id}>
                      <span>{doc.date} · {doc.type}</span>
                      <strong>{doc.name}</strong>
                      <small>{doc.status} · Doctor/Patient access</small>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}

          <div className="modal-actions">
            <button
              className="doctor-primary-btn"
              onClick={() => {
                setShowPatientDetails(false);
                handleStartConsultation(selectedPatient);
              }}
            >
              Start Consultation
            </button>

            <button
              className="doctor-secondary-btn"
              onClick={() => setShowPatientDetails(false)}
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {showPrescription && (
        <Modal
          title="Create Prescription"
          onClose={() => setShowPrescription(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowPrescription(false);
              showToast("Prescription created and attached to patient record.");
            }}
          >
            <div className="form-group">
              <label>Patient</label>
              <select defaultValue="" required>
                <option value="">Select patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.name}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Medicine Name</label>
              <input placeholder="e.g. Paracetamol / Metformin" required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Dosage</label>
                <input placeholder="e.g. 500 mg" required />
              </div>

              <div className="form-group">
                <label>Frequency</label>
                <select defaultValue="Twice daily">
                  <option>Once daily</option>
                  <option>Twice daily</option>
                  <option>Three times daily</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Instructions</label>
              <textarea placeholder="e.g. Take after meals for 5 days..." />
            </div>

            <div className="modal-actions">
              <button type="submit" className="doctor-primary-btn">
                Create Prescription
              </button>
              <button
                type="button"
                className="doctor-secondary-btn"
                onClick={() => setShowPrescription(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showReferral && (
        <Modal
          title="Create New Referral"
          onClose={() => setShowReferral(false)}
        >
          <form onSubmit={handleCreateReferral}>
            <div className="form-group">
              <label>Patient</label>
              <select defaultValue="" required>
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
              <select defaultValue="District Hospital Varanasi">
                <option>District Hospital Varanasi</option>
                <option>Community Health Centre Choubeypur</option>
                <option>Diagnostic Centre Harhua</option>
                <option>Specialist Hospital Varanasi</option>
              </select>
            </div>

            <div className="form-group">
              <label>Reason for Referral</label>
              <textarea
                placeholder="Enter clinical reasons and recommended interventions..."
                required
              />
            </div>

            <div className="modal-actions">
              <button type="submit" className="doctor-primary-btn">
                Create Referral
              </button>
              <button
                type="button"
                className="doctor-secondary-btn"
                onClick={() => setShowReferral(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showPasswordModal && (
        <Modal title="Change Doctor Password" onClose={() => setShowPasswordModal(false)}>
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
              <button type="submit" className="doctor-primary-btn">Update Password</button>
              <button type="button" className="doctor-secondary-btn" onClick={() => setShowPasswordModal(false)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {activeCallAppointment && (
        <CallModal 
          roomId={activeCallAppointment._id || activeCallAppointment.id || "doctor-telehealth-room"} 
          userId={doctorProfile.id || doctorProfile._id || "doctor-user"} 
          callType="video"
          onClose={() => setActiveCallAppointment(null)} 
        />
      )}

      {toast && (
        <div className="doctor-toast">
          <span>✓</span>
          {toast}
        </div>
      )}
    </div>
  );
}

function PageHeader({ title, subtitle, showBack = true, onBack, action }) {
  return (
    <div className="doctor-page-header">
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {showBack && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="doctor-secondary-btn"
            style={{ padding: "6px 12px", fontSize: "13px", cursor: "pointer" }}
          >
            ← Go Back
          </button>
        )}
        <div>
          <span className="doctor-page-eyebrow">SWASTHYASETU · DOCTOR PORTAL</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

function StatCard({ icon, label, value, change, urgent }) {
  return (
    <div className="doctor-stat-card">
      <div className="stat-top">
        <div className="stat-icon">{icon}</div>
        <span className={urgent ? "stat-urgent" : ""}>{change}</span>
      </div>
      <strong>{value}</strong>
      <p>{label}</p>
    </div>
  );
}

function AppointmentRow({ appointment, onClick }) {
  return (
    <button className="appointment-row" onClick={onClick}>
      <div className="appointment-row-time">{appointment.time}</div>
      <div className="patient-avatar">{appointment.patient?.charAt(0) || "P"}</div>
      <div className="appointment-row-info">
        <strong>{appointment.patient}</strong>
        <span>{appointment.reason}</span>
      </div>
      <StatusBadge status={appointment.status} />
      <span className="row-arrow">→</span>
    </button>
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
        <span>Patient</span><span>Condition</span><span>Last Visit</span><span>Risk</span><span></span>
      </div>
      {patients.map((patient) => (
        <button className="patient-table-row" key={patient._id || patient.id} onClick={() => onPatient(patient)}>
          <div className="table-patient">
            <div className="patient-avatar">{patient.name?.charAt(0) || "P"}</div>
            <div>
              <strong>{patient.name}</strong>
              <span>{patient.age} yrs · {patient.gender}</span>
            </div>
          </div>
          <span>{patient.condition}</span>
          <span>{patient.lastVisit}</span>
          <StatusBadge status={patient.risk} />
          <b>→</b>
        </button>
      ))}
    </div>
  );
}

function FollowUpRow({ item, onComplete }) {
  return (
    <div className="followup-row">
      <div className="followup-avatar">{item.patient?.charAt(0) || "P"}</div>
      <div>
        <strong>{item.patient}</strong>
        <span>{item.reason}</span>
      </div>
      <div className="followup-right">
        <StatusBadge status={item.status} />
        {item.status !== "Completed" && (
          <button onClick={() => onComplete(item._id || item.id)} title="Mark complete">✓</button>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = (status || "pending").toLowerCase().replaceAll(" ", "-");
  return (
    <span className={`doctor-status ${normalized}`}>
      <i></i>{status}
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

function MiniStat({ label, value }) {
  return (
    <div className="mini-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function FormField({ label, value, onChange, type = "text" }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input type={type} value={value || ""} onChange={onChange} />
    </div>
  );
}

function AnalyticsCard({ title, value, text }) {
  return (
    <div className="doctor-panel analytics-card">
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{text}</small>
    </div>
  );
}

function PrescriptionCard({ patient, status, description, medicines, onClick }) {
  return (
    <div className="doctor-panel prescription-card">
      <div className="prescription-top">
        <span className="prescription-icon">💊</span>
        <StatusBadge status={status} />
      </div>
      <h3>{patient}</h3>
      <p>{description}</p>
      {medicines.map((medicine) => (
        <div className="medicine-line" key={medicine}><span>{medicine}</span></div>
      ))}
      <button className="full-width-secondary" onClick={onClick}>View Prescription</button>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="doctor-modal-overlay" onClick={onClose}>
      <div className="doctor-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
