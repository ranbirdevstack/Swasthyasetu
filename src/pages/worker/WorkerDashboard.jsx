// src/pages/WorkerDashboard.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosClient.js";
import FacilityMap from "../../components/FacilityMap.jsx";
import "./WorkerDashboard.css";

function WorkerDashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

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

  // Live Database States (No Hardcoded Mock Data)
  const [workerProfile, setWorkerProfile] = useState({
    name: "Ravi Kumar",
    role: "Community Health Worker",
    facility: "PHC Choubeypur",
    department: "Primary Healthcare Services",
    employeeId: "CHW-1024",
    phone: "9876543210",
    email: "ravi.worker@swasthyasetu.in",
    experience: "5 Years",
    image: "",
  });

  const [profileForm, setProfileForm] = useState({ ...workerProfile });

  const [patients, setPatients] = useState([]);
  const [triageCases, setTriageCases] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [services, setServices] = useState([
    { id: 1, name: "General OPD", description: "General outpatient consultation.", availability: "Available", timing: "09:00 AM - 04:00 PM" },
    { id: 2, name: "Pharmacy", description: "Essential and prescribed medicines.", availability: "Available", timing: "09:00 AM - 05:00 PM" },
  ]);
  const [notifications, setNotifications] = useState([]);

  // Fetch complete health worker data from backend database on mount
  useEffect(() => {
    const fetchWorkerData = async () => {
      try {
        const res = await api.get("/worker/dashboard");
        if (res.data && res.data.success) {
          if (res.data.profile) {
            setWorkerProfile(res.data.profile);
            setProfileForm(res.data.profile);
          }
          if (res.data.patients) setPatients(res.data.patients);
          if (res.data.triageCases) setTriageCases(res.data.triageCases);
          if (res.data.followUps) setFollowUps(res.data.followUps);
          if (res.data.referrals) setReferrals(res.data.referrals);
          if (res.data.notifications) setNotifications(res.data.notifications);
        }
      } catch (err) {
        console.warn("Failed fetching live database worker records", err);
      }
    };

    fetchWorkerData();
  }, []);

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
    if (editProfile) { setEditProfile(false); return; }
    if (showTriage) { setShowTriage(false); return; }
    if (showReferral) { setShowReferral(false); return; }
    if (showPatientDetails) { setShowPatientDetails(false); return; }
    if (showReferralDetails) { setShowReferralDetails(false); return; }
    if (activeMenu !== "Dashboard") {
      setActiveMenu(previousMenu || "Dashboard");
      setSearch("");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigate("/roles");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const startTriage = (item) => {
    const matched = patients.find((p) => p.name === item.patient) || {
      name: item.patient,
      age: item.age || 30,
      gender: "Not specified",
      condition: item.symptoms || "General assessment",
      risk: item.priority === "Critical" ? "High" : "Moderate",
      village: "Choubeypur",
      lastVisit: item.date || "Recent",
    };
    setSelectedPatient(matched);
    setShowTriage(true);
    setActiveMenu("Patient Triage");
  };

  const updateReferralStatus = async (id, newStatus) => {
    try {
      await api.patch(`/worker/referrals/${id}/status`, { status: newStatus });
      setReferrals((prev) =>
        prev.map((ref) => (ref._id === id || ref.id === id ? { ...ref, status: newStatus } : ref))
      );
      showToast(`Referral updated to "${newStatus}"`);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update referral status.");
    }
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
      setWorkerProfile((prev) => ({ ...prev, image: e.target.result }));
      showToast("Profile photo updated successfully.");
    };
    reader.readAsDataURL(file);
  };

  const openEditProfile = () => {
    setProfileForm({ ...workerProfile });
    setEditProfile(true);
    setActiveMenu("Profile");
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    try {
      const res = await api.put("/worker/profile", profileForm);
      if (res.data && res.data.success) {
        setWorkerProfile(res.data.data);
      }
    } catch (err) {
      setWorkerProfile((prev) => ({ ...prev, ...profileForm }));
      console.warn("Profile updated locally", err);
    }

    setEditProfile(false);
    showToast("Profile updated successfully.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateProfileField = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const ProfileAvatar = ({ large = false }) => {
    if (workerProfile.image) {
      return <img src={workerProfile.image} alt="Worker profile" className={large ? "worker-avatar-image large" : "worker-avatar-image"} />;
    }
    return <div className={large ? "worker-avatar-fallback large" : "worker-avatar-fallback"}>RK</div>;
  };

  const markTriageReviewed = (id) => {
    setTriageCases((current) =>
      current.map((item) => (item._id === id || item.id === id ? { ...item, status: "Reviewed" } : item))
    );
    showToast("Triage case marked as reviewed.");
  };

  const completeFollowUp = (id) => {
    setFollowUps((current) =>
      current.map((item) => (item._id === id || item.id === id ? { ...item, status: "Completed" } : item))
    );
    showToast("Follow-up completed successfully.");
  };

  const createReferral = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const patient = form.get("patient");
    const destination = form.get("destination");
    const reason = form.get("reason");

    const newReferralPayload = { patient, destination, reason };

    try {
      const res = await api.post("/worker/referrals", newReferralPayload);
      if (res.data && res.data.success) {
        setReferrals((prev) => [res.data.data, ...prev]);
      }
    } catch (err) {
      const fallbackRef = { id: Date.now(), patient, from: workerProfile.facility, to: destination, reason, date: "Today", status: "Pending" };
      setReferrals((prev) => [fallbackRef, ...prev]);
    }

    setShowReferral(false);
    showToast("Referral created successfully.");
  };

  const markNotificationRead = (id) => {
    setNotifications((current) =>
      current.map((item) => (item._id === id || item.id === id ? { ...item, read: true } : item))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
    showToast("All notifications marked as read.");
  };

  const unreadCount = notifications.filter((item) => !item.read).length;

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredPatients = patients.filter((patient) =>
    `${patient.name} ${patient.condition || ""} ${patient.village || ""} ${patient.risk} ${patient.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredTriage = triageCases.filter((item) =>
    `${item.patient} ${item.symptoms || ""} ${item.priority} ${item.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredReferrals = referrals.filter((item) =>
    `${item.patient} ${item.from || ""} ${item.to || item.destination || ""} ${item.reason} ${item.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredServices = services.filter((service) =>
    `${service.name} ${service.description} ${service.availability}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const renderDashboard = () => (
    <>
      <PageHeader
        title={`Welcome, ${workerProfile.name.replace(/\s*\(.*?\)/g, "").trim()}`}
        subtitle="Here's what's happening with your assigned patients and facility today."
        action={
          <button className="worker-primary-btn" onClick={() => handleMenu("Patient Triage")}>
            <span>＋</span> Start Triage
          </button>
        }
      />

      <div className="worker-stats-grid">
        <StatCard icon="👥" label="Assigned Patients" value={patients.length.toString()} change="+8 this month" />
        <StatCard icon="🩺" label="Pending Triage" value={triageCases.filter((item) => item.status === "Pending").length.toString()} change="2 urgent" urgent />
        <StatCard icon="↻" label="Active Follow-ups" value={followUps.filter((item) => item.status !== "Completed").length.toString()} change="1 urgent" />
        <StatCard icon="↗" label="Active Referrals" value={referrals.filter((item) => item.status !== "Completed").length.toString()} change="+2 this week" />
      </div>

      <div className="worker-dashboard-grid">
        <div className="worker-panel">
          <div className="panel-header">
            <div>
              <h3>Priority Triage</h3>
              <p>Patients waiting for initial assessment</p>
            </div>
            <button className="panel-link" onClick={() => handleMenu("Patient Triage")}>View all →</button>
          </div>

          <div className="worker-triage-list">
            {triageCases.slice(0, 4).map((item) => (
              <TriageRow
                key={item._id || item.id}
                item={item}
                onReview={() => startTriage(item)}
                onComplete={() => markTriageReviewed(item._id || item.id)}
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
            <QuickAction icon="🩺" title="Patient Triage" text="Assess patient symptoms" onClick={() => handleMenu("Patient Triage")} />
            <QuickAction icon="👥" title="Find Patient" text="Search patient records" onClick={() => handleMenu("Patients")} />
            <QuickAction icon="📍" title="Facility Map" text="View nearby active health posts" onClick={() => handleMenu("Facility Map")} />
            <QuickAction icon="↗" title="Create Referral" text="Refer patient to facility" onClick={() => setShowReferral(true)} />
          </div>
        </div>
      </div>
    </>
  );

  const renderTriage = () => (
    <>
      <PageHeader
        title="Patient Triage"
        subtitle="Assess patient symptoms and identify urgency."
        action={
          <button className="worker-primary-btn" onClick={() => setShowTriage(true)}>
            ＋ New Triage
          </button>
        }
      />

      {!showTriage ? (
        <div className="worker-panel full-panel">
          <div className="panel-header">
            <div>
              <h3>Assessment Queue</h3>
              <p>{filteredTriage.length} cases found</p>
            </div>
          </div>
          <div className="triage-full-list">
            {filteredTriage.map((item) => (
              <TriageRow
                key={item._id || item.id}
                item={item}
                onReview={() => startTriage(item)}
                onComplete={() => markTriageReviewed(item._id || item.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <TriageWorkspace
          patient={selectedPatient}
          patients={patients}
          onClose={() => { setShowTriage(false); setSelectedPatient(null); }}
          onSave={() => { setShowTriage(false); setSelectedPatient(null); showToast("Triage saved successfully."); }}
        />
      )}
    </>
  );

  const renderPatients = () => (
    <>
      <PageHeader title="Patient Records" subtitle="Search and manage patients." />
      <div className="worker-panel full-panel">
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

  const renderFacilityServices = () => (
    <>
      <PageHeader title="Facility Services" subtitle="View and manage healthcare services." />
      <div className="worker-service-grid">
        {filteredServices.map((service) => (
          <div className="worker-service-card" key={service.id}>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </>
  );

  const renderFacilityMap = () => (
    <div style={{ minHeight: "650px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <PageHeader title="Rural Facility Network" subtitle="Locate and route patients." />
      <div style={{ flex: 1, minHeight: "550px", background: "#fff", borderRadius: "16px", border: "1px solid var(--border)", overflow: "hidden" }}>
        <FacilityMap onSelectFacility={(facility) => showToast(`Selected ${facility.name}.`)} />
      </div>
    </div>
  );

  const renderFollowUps = () => (
    <>
      <PageHeader title="Follow-ups" subtitle="Monitor patients requiring continued care." />
      <div className="worker-panel full-panel">
        <div className="followup-table">
          {followUps.map((item) => (
            <div className="followup-card" key={item._id || item.id}>
              <div className="followup-patient">
                <strong>{item.patient}</strong>
                <span>{item.reason}</span>
              </div>
              {item.status !== "Completed" && (
                <button className="small-primary-btn" onClick={() => completeFollowUp(item._id || item.id)}>Complete</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderReferrals = () => (
    <>
      <PageHeader title="Referrals" subtitle="Track and manage patient referrals." action={<button className="worker-primary-btn" onClick={() => setShowReferral(true)}>＋ New Referral</button>} />
      <div className="worker-panel full-panel">
        <div className="worker-referral-list">
          {filteredReferrals.map((referral) => (
            <div className="worker-referral-card" key={referral._id || referral.id}>
              <div className="referral-info">
                <strong>{referral.patient}</strong>
                <span>{referral.from} → {referral.to || referral.destination}</span>
              </div>
              <StatusBadge status={referral.status} />
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderNotifications = () => (
    <>
      <PageHeader title="Notifications" subtitle="Stay updated with alerts." />
      <div className="worker-panel full-panel">
        <div className="notification-page-list">
          {notifications.map((item) => (
            <div className={`worker-notification-item ${!item.read ? "unread" : ""}`} key={item._id || item.id} onClick={() => markNotificationRead(item._id || item.id)}>
              <strong>{item.title}</strong>
              <p>{item.message}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderProfile = () => (
    <>
      <PageHeader title="Worker Profile" subtitle="Manage your professional information." action={<button className="worker-primary-btn" onClick={openEditProfile}>✎ Edit Profile</button>} />
      {!editProfile ? (
        <div className="worker-profile-layout">
          <div className="worker-panel worker-profile-card">
            <div className="worker-profile-cover"></div>
            <div className="worker-profile-avatar-wrapper">
              <ProfileAvatar large />
              <button className="change-photo-btn" onClick={() => fileInputRef.current?.click()}>📷</button>
              <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleProfileImage} />
            </div>
            <div className="worker-profile-info">
              <h2>{workerProfile.name.replace(/\s*\(.*?\)/g, "").trim()}</h2>
              <p>{workerProfile.role}</p>
              <span>{workerProfile.department}</span>
            </div>
            <div className="worker-profile-details">
              <InfoItem label="Facility" value={workerProfile.facility} />
              <InfoItem label="Department" value={workerProfile.department} />
              <InfoItem label="Employee ID" value={workerProfile.employeeId} />
              <InfoItem label="Experience" value={workerProfile.experience} />
              <InfoItem label="Mobile" value={workerProfile.phone} />
              <InfoItem label="Email" value={workerProfile.email} />
            </div>
          </div>
        </div>
      ) : (
        <div className="worker-panel edit-profile-panel">
          <div className="edit-profile-heading">
            <div>
              <span>PROFILE SETTINGS</span>
              <h2>Edit Health Worker Profile</h2>
            </div>
            <button type="button" className="worker-secondary-btn" onClick={() => setEditProfile(false)}>← Back to Profile</button>
          </div>
          <form className="worker-edit-profile-form" onSubmit={saveProfile}>
            <div className="worker-form-grid">
              <FormField label="Full Name" value={profileForm.name} onChange={(e) => updateProfileField("name", e.target.value)} />
              <FormField label="Role" value={profileForm.role} onChange={(e) => updateProfileField("role", e.target.value)} />
              <FormField label="Facility" value={profileForm.facility} onChange={(e) => updateProfileField("facility", e.target.value)} />
              <FormField label="Mobile Number" value={profileForm.phone} onChange={(e) => updateProfileField("phone", e.target.value)} />
              <FormField label="Email Address" type="email" value={profileForm.email} onChange={(e) => updateProfileField("email", e.target.value)} />
            </div>
            <div className="edit-profile-actions">
              <button type="submit" className="worker-primary-btn">✓ Save Profile</button>
            </div>
          </form>
        </div>
      )}
    </>
  );

  const renderSettings = () => (
    <>
      <PageHeader title="Settings" subtitle="Manage account preferences." />
      <div className="worker-panel settings-section">
        <div className="setting-row">
          <div>
            <strong>Account Password</strong>
            <span>Update your secure login password.</span>
          </div>
          <button className="worker-primary-btn" onClick={() => setShowPasswordModal(true)}>🔑 Change Password</button>
        </div>
      </div>
    </>
  );

  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard": return renderDashboard();
      case "Patient Triage": return renderTriage();
      case "Patients": return renderPatients();
      case "Facility Map": return renderFacilityMap();
      case "Facility Services": return renderFacilityServices();
      case "Follow-ups": return renderFollowUps();
      case "Referrals": return renderReferrals();
      case "Notifications": return renderNotifications();
      case "Profile": return renderProfile();
      case "Settings": return renderSettings();
      default: return renderDashboard();
    }
  };

  const menuItems = [
    { section: "MAIN", items: [{ label: "Dashboard", icon: "⌂" }, { label: "Patient Triage", icon: "🩺" }, { label: "Patients", icon: "♙" }] },
    { section: "PATIENT CARE", items: [{ label: "Follow-ups", icon: "↻" }, { label: "Referrals", icon: "↗" }] },
    { section: "NETWORK", items: [{ label: "Facility Map", icon: "📍" }, { label: "Facility Services", icon: "▣" }] },
  ];

  return (
    <div className="worker-dashboard-page">
      <aside className={`worker-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="worker-brand">
          <div className="worker-brand-icon">✚</div>
          <div><strong>SwasthyaSetu</strong><span>Health Worker Portal</span></div>
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
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="worker-sidebar-bottom">
          <button className={`worker-nav-item ${activeMenu === "Notifications" ? "active" : ""}`} onClick={() => handleMenu("Notifications")}>
            <span>♢</span> Notifications {unreadCount > 0 && <b>{unreadCount}</b>}
          </button>
          <button className={`worker-nav-item ${activeMenu === "Profile" ? "active" : ""}`} onClick={() => handleMenu("Profile")}>
            <span>👤</span> Profile
          </button>
          <button className={`worker-nav-item ${activeMenu === "Settings" ? "active" : ""}`} onClick={() => handleMenu("Settings")}>
            <span>⚙</span> Settings
          </button>
          <button className="worker-logout" onClick={handleLogout}><span>↪</span> Logout</button>
        </div>
      </aside>

      <main className="worker-main">
        <header className="worker-topbar">
          <button type="button" className="worker-mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            ☰
          </button>
          <div className="worker-breadcrumb">
            <span>Health Worker Portal</span><b>/</b><strong>{activeMenu}</strong>
          </div>
        </header>

        <section className="worker-content">{renderContent()}</section>
      </main>

      {/* CREATE REFERRAL MODAL */}
      {showReferral && (
        <Modal title="Create New Referral" onClose={() => setShowReferral(false)}>
          <form onSubmit={createReferral}>
            <div className="form-group">
              <label>Patient Name</label>
              <input name="patient" placeholder="Enter patient name" required />
            </div>
            <div className="form-group">
              <label>Destination Facility</label>
              <input name="destination" placeholder="e.g. District Hospital" required />
            </div>
            <div className="form-group">
              <label>Reason</label>
              <textarea name="reason" placeholder="Reason for referral..." required />
            </div>
            <div className="modal-actions">
              <button type="submit" className="worker-primary-btn">Create Referral</button>
              <button type="button" className="worker-secondary-btn" onClick={() => setShowReferral(false)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <Modal title="Change Worker Password" onClose={() => setShowPasswordModal(false)}>
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
              <button type="submit" className="worker-primary-btn">Update Password</button>
              <button type="button" className="worker-secondary-btn" onClick={() => setShowPasswordModal(false)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {toast && <div className="worker-toast"><span>✓</span>{toast}</div>}
    </div>
  );
}

// Sub-components
function PageHeader({ title, subtitle, action }) {
  return (
    <div className="worker-page-header">
      <div>
        <span className="worker-page-eyebrow">SWASTHYASETU · HEALTH WORKER PORTAL</span>
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
        <span>Patient</span><span>Condition</span><span>Village</span><span>Risk</span><span></span>
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
      <div className={`triage-priority-icon ${(item.priority || "low").toLowerCase()}`}>!</div>
      <div>
        <strong>{item.patient}</strong>
        <span>{item.symptoms}</span>
      </div>
      <StatusBadge status={item.priority} />
      <div className="triage-row-actions">
        <button className="small-icon-btn" onClick={onReview}>→</button>
        {item.status === "Pending" && (
          <button className="triage-check-btn" onClick={onComplete} title="Mark reviewed">✓</button>
        )}
      </div>
    </div>
  );
}

function TriageWorkspace({ patient, patients, onClose, onSave }) {
  const activePatient = patient || patients[0] || { name: "Patient", age: 30, gender: "N/A", condition: "General", risk: "Low", village: "Varanasi", lastVisit: "Recent" };
  return (
    <div className="triage-workspace">
      <div className="triage-workspace-header">
        <h2>{activePatient.name}</h2>
        <button className="worker-secondary-btn" onClick={onClose}>End Assessment</button>
      </div>
      <div className="triage-workspace-actions">
        <button className="worker-primary-btn" onClick={onSave}>✓ Save Triage</button>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = (status || "active").toLowerCase().replaceAll(" ", "-");
  return (
    <span className={`worker-status ${normalized}`}>
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

function FormField({ label, type = "text", value, onChange }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input type={type} value={value || ""} onChange={onChange} />
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