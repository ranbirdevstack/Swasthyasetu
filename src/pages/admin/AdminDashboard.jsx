import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosClient.js";
import FacilityMap from "../../components/FacilityMap.jsx";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [previousMenu, setPreviousMenu] = useState("Dashboard");
  const [menuHistory, setMenuHistory] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedReferral, setSelectedReferral] = useState(null);

  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showFacilityDetails, setShowFacilityDetails] = useState(false);
  const [showReferralDetails, setShowReferralDetails] = useState(false);

  // Facility View Toggle: 'grid' | 'map'
  const [facilityViewMode, setFacilityViewMode] = useState("grid");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState("");

  const [toast, setToast] = useState("");

  // =========================================================
  // ADMIN PROFILE (WITH PHONE & PASSWORD)
  // =========================================================

  const fileInputRef = useRef(null);

  const [adminProfile, setAdminProfile] = useState({
    name: "SwasthyaSetu Admin",
    role: "System Administrator",
    department: "Healthcare Network Administration",
    organization: "SwasthyaSetu",
    accessLevel: "Full Network Access",
    email: "admin@swasthyasetu.in",
    phone: "9876543210",
    password: "password123",
    image: "",
  });

  const [editProfile, setEditProfile] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: "SwasthyaSetu Admin",
    role: "System Administrator",
    department: "Healthcare Network Administration",
    organization: "SwasthyaSetu",
    accessLevel: "Full Network Access",
    email: "admin@swasthyasetu.in",
    phone: "9876543210",
    password: "password123",
  });

  // Load real registrations & sync local/backend users
  useEffect(() => {
    const savedUser = localStorage.getItem("swasthya_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setAdminProfile((prev) => ({
          ...prev,
          name: parsed.name || prev.name,
          email: parsed.email || prev.email,
          phone: parsed.phone || prev.phone,
          password: parsed.password || prev.password,
        }));
      } catch (err) {
        console.warn("Failed parsing saved admin user", err);
      }
    }

    const fetchUsers = async () => {
      try {
        const response = await api.get("/admin/users");
        if (response.data?.users) {
          setUsers(response.data.users);
          return;
        }
      } catch (err) {
        const saved = localStorage.getItem("swasthyasetu_registrations");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const mapped = parsed.map((item) => ({
              id: item.id || Date.now(),
              name: item.name,
              role:
                item.role === "doctor"
                  ? "Doctor"
                  : item.role === "health-worker" || item.role === "worker"
                  ? "Health Worker"
                  : "Patient",
              phone: item.phone,
              email: item.email,
              facility: item.facility || "Primary Health Centre",
              status: item.status || "Pending",
              joined: new Date(item.registeredAt || Date.now()).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
            }));

            setUsers((prev) => {
              const existingEmails = new Set(prev.map((u) => u.email));
              const newItems = mapped.filter((m) => !existingEmails.has(m.email));
              return [...newItems, ...prev];
            });
          } catch (e) {
            console.error("Failed to parse local registrations", e);
          }
        }
      }
    };

    fetchUsers();
  }, []);

  // =========================================================
  // USERS MOCK STORE
  // =========================================================

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Dr. Sharma",
      role: "Doctor",
      phone: "9876543203",
      email: "dr.sharma@swasthyasetu.in",
      facility: "SwasthyaSetu Community Health Centre",
      status: "Approved",
      joined: "25 Aug 2026",
    },
    {
      id: 2,
      name: "Dr. Priya Singh",
      role: "Doctor",
      phone: "9765432104",
      email: "priya.singh@swasthyasetu.in",
      facility: "District Hospital",
      status: "Pending",
      joined: "29 Aug 2026",
    },
    {
      id: 3,
      name: "Ravi Kumar",
      role: "Health Worker",
      phone: "9876543210",
      email: "ravi.worker@swasthyasetu.in",
      facility: "PHC Choubeypur",
      status: "Approved",
      joined: "20 Aug 2026",
    },
    {
      id: 4,
      name: "Sunita Devi",
      role: "Patient",
      phone: "9543210987",
      email: "sunita.patient@gmail.com",
      facility: "CHC Choubeypur",
      status: "Active",
      joined: "30 Aug 2026",
    },
    {
      id: 5,
      name: "Amit Singh",
      role: "Patient",
      phone: "9432109876",
      email: "amit.singh@gmail.com",
      facility: "PHC Choubeypur",
      status: "Active",
      joined: "27 Aug 2026",
    },
    {
      id: 6,
      name: "Neha Verma",
      role: "Health Worker",
      phone: "9321098765",
      email: "neha.worker@swasthyasetu.in",
      facility: "PHC Harhua",
      status: "Pending",
      joined: "30 Aug 2026",
    },
  ]);

  // =========================================================
  // FACILITIES
  // =========================================================

  const [facilities, setFacilities] = useState([
    {
      id: 1,
      name: "SwasthyaSetu Community Health Centre",
      type: "CHC",
      location: "Choubeypur, Varanasi",
      contact: "0542-2612001",
      doctors: 8,
      workers: 14,
      patients: 1260,
      status: "Active",
      services: "General Medicine, Emergency, Diagnostics",
    },
    {
      id: 2,
      name: "District Hospital Varanasi",
      type: "Hospital",
      location: "Varanasi",
      contact: "0542-2508001",
      doctors: 32,
      workers: 48,
      patients: 4820,
      status: "Active",
      services: "Multi-specialty, ICU, Surgery",
    },
    {
      id: 3,
      name: "PHC Choubeypur",
      type: "PHC",
      location: "Choubeypur, Varanasi",
      contact: "0542-2612004",
      doctors: 4,
      workers: 9,
      patients: 840,
      status: "Active",
      services: "Primary Care, Pharmacy",
    },
    {
      id: 4,
      name: "Diagnostic Centre Harhua",
      type: "Diagnostics",
      location: "Harhua, Varanasi",
      contact: "0542-2622010",
      doctors: 2,
      workers: 7,
      patients: 530,
      status: "Under Review",
      services: "Blood Test, X-Ray, Ultrasound",
    },
    {
      id: 5,
      name: "Jan Aushadhi Pharmacy",
      type: "Pharmacy",
      location: "Choubeypur, Varanasi",
      contact: "0542-2612009",
      doctors: 0,
      workers: 5,
      patients: 740,
      status: "Active",
      services: "Generic Medicines, Prescription Medicines",
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
      from: "CHC Choubeypur",
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
      from: "PHC Harhua",
      to: "District Hospital",
      reason: "Hypertension review",
      date: "24 Aug 2026",
      status: "In Progress",
    },
  ]);

  // =========================================================
  // CARE GAPS
  // =========================================================

  const [careGaps, setCareGaps] = useState([
    {
      id: 1,
      patient: "Rahul Kumar",
      gap: "Diabetes follow-up overdue",
      facility: "CHC Choubeypur",
      priority: "High",
      lastContact: "20 Aug 2026",
      status: "Open",
    },
    {
      id: 2,
      patient: "Ramesh Yadav",
      gap: "Cardiology referral pending",
      facility: "PHC Choubeypur",
      priority: "Critical",
      lastContact: "18 Aug 2026",
      status: "Open",
    },
    {
      id: 3,
      patient: "Sunita Devi",
      gap: "Diagnostic test pending",
      facility: "PHC Choubeypur",
      priority: "Medium",
      lastContact: "26 Aug 2026",
      status: "Open",
    },
    {
      id: 4,
      patient: "Amit Singh",
      gap: "Blood pressure monitoring",
      facility: "PHC Harhua",
      priority: "Low",
      lastContact: "24 Aug 2026",
      status: "Resolved",
    },
  ]);

  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New doctor registration",
      message: "Dr. Priya Singh is waiting for admin approval.",
      time: "10 min ago",
      read: false,
    },
    {
      id: 2,
      title: "Facility under review",
      message: "Diagnostic Centre Harhua requires verification.",
      time: "35 min ago",
      read: false,
    },
    {
      id: 3,
      title: "Critical care gap",
      message: "Ramesh Yadav has a critical unresolved care gap.",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 4,
      title: "Referral update",
      message: "Sunita Devi's diagnostic referral is completed.",
      time: "2 hours ago",
      read: true,
    },
  ]);

  // =========================================================
  // TOAST & MENU NAVIGATION
  // =========================================================

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

    setPreviousMenu(activeMenu);
    setActiveMenu(menu);
    setSearch("");
    setSelectedUser(null);
    setSelectedFacility(null);
    setSelectedReferral(null);
    setShowUserDetails(false);
    setShowFacilityDetails(false);
    setShowReferralDetails(false);
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
    if (showUserDetails) {
      setShowUserDetails(false);
      return;
    }
    if (showFacilityDetails) {
      setShowFacilityDetails(false);
      return;
    }
    if (showReferralDetails) {
      setShowReferralDetails(false);
      return;
    }
    if (editProfile) {
      setEditProfile(false);
      return;
    }
    if (notificationOpen) {
      setNotificationOpen(false);
      return;
    }
    if (showProfile) {
      setShowProfile(false);
      return;
    }

    if (menuHistory.length > 0) {
      const history = [...menuHistory];
      const previousPage = history.pop();

      setMenuHistory(history);
      setActiveMenu(previousPage || "Dashboard");
      setPreviousMenu(history[history.length - 1] || "Dashboard");
      setSearch("");
      setSelectedUser(null);
      setSelectedFacility(null);
      setSelectedReferral(null);
      setShowUserDetails(false);
      setShowFacilityDetails(false);
      setShowReferralDetails(false);
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
      return;
    }

    setActiveMenu("Dashboard");
    setSearch("");
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("swasthya_role");
    localStorage.removeItem("swasthya_user");
    navigate("/");
  };

  // =========================================================
  // PASSWORD MANAGEMENT & SYNC
  // =========================================================

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!newPasswordInput || newPasswordInput.length < 6) {
      showToast("Password must be at least 6 characters.");
      return;
    }

    setAdminProfile((prev) => ({ ...prev, password: newPasswordInput }));
    setProfileForm((prev) => ({ ...prev, password: newPasswordInput }));

    try {
      const savedMockUsers = localStorage.getItem("swasthya_mock_users");
      if (savedMockUsers) {
        const usersList = JSON.parse(savedMockUsers);
        const updated = usersList.map((u) =>
          u.email.toLowerCase() === adminProfile.email.toLowerCase()
            ? { ...u, password: newPasswordInput }
            : u
        );
        localStorage.setItem("swasthya_mock_users", JSON.stringify(updated));
      }

      const activeUser = localStorage.getItem("swasthya_user");
      if (activeUser) {
        const user = JSON.parse(activeUser);
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
      setAdminProfile((prev) => ({
        ...prev,
        image: e.target.result,
      }));
      showToast("Profile photo updated successfully.");
    };
    reader.readAsDataURL(file);
  };

  const openEditProfile = () => {
    setProfileForm({
      name: adminProfile.name,
      role: adminProfile.role,
      department: adminProfile.department,
      organization: adminProfile.organization,
      accessLevel: adminProfile.accessLevel,
      email: adminProfile.email,
      phone: adminProfile.phone,
      password: adminProfile.password,
    });
    setEditProfile(true);
  };

  const saveProfile = (e) => {
    e.preventDefault();
    setAdminProfile((prev) => ({
      ...prev,
      ...profileForm,
    }));

    try {
      const savedMockUsers = localStorage.getItem("swasthya_mock_users");
      if (savedMockUsers && profileForm.password) {
        const usersList = JSON.parse(savedMockUsers);
        const updated = usersList.map((u) =>
          u.email.toLowerCase() === adminProfile.email.toLowerCase()
            ? { ...u, password: profileForm.password }
            : u
        );
        localStorage.setItem("swasthya_mock_users", JSON.stringify(updated));
      }
    } catch {}

    setEditProfile(false);
    showToast("Profile updated successfully.");
  };

  const updateProfileField = (field, value) => {
    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const ProfileAvatar = ({ large = false }) => {
    return adminProfile.image ? (
      <img
        src={adminProfile.image}
        alt="Admin profile"
        className={large ? "admin-avatar-image large" : "admin-avatar-image"}
      />
    ) : (
      <div
        className={
          large ? "admin-avatar-fallback large" : "admin-avatar-fallback"
        }
      >
        SA
      </div>
    );
  };

  // =========================================================
  // USER ACTIONS
  // =========================================================

  const updateUserStatus = async (id, status) => {
    try {
      await api.patch(`/admin/users/${id}/status`, { status });
    } catch {
      const saved = localStorage.getItem("swasthyasetu_registrations");
      if (saved) {
        const parsed = JSON.parse(saved);
        const updated = parsed.map((u) => (u.id === id ? { ...u, status } : u));
        localStorage.setItem("swasthyasetu_registrations", JSON.stringify(updated));
      }
    }

    setUsers((current) =>
      current.map((user) => (user.id === id ? { ...user, status } : user))
    );

    showToast(`User ${status.toLowerCase()} successfully.`);
  };

  const updateFacilityStatus = (id, status) => {
    setFacilities((current) =>
      current.map((facility) =>
        facility.id === id ? { ...facility, status } : facility
      )
    );
    showToast(`Facility marked as ${status}.`);
  };

  const updateReferralStatus = (id, status) => {
    setReferrals((current) =>
      current.map((referral) =>
        referral.id === id ? { ...referral, status } : referral
      )
    );
    showToast(`Referral marked as ${status}.`);
  };

  const resolveCareGap = (id) => {
    setCareGaps((current) =>
      current.map((gap) =>
        gap.id === id ? { ...gap, status: "Resolved" } : gap
      )
    );
    showToast("Care gap marked as resolved.");
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

  // =========================================================
  // FILTERS
  // =========================================================

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.role} ${user.facility} ${user.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredFacilities = facilities.filter((facility) =>
    `${facility.name} ${facility.type} ${facility.location} ${facility.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredReferrals = referrals.filter((referral) =>
    `${referral.patient} ${referral.from} ${referral.to} ${referral.reason} ${referral.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredCareGaps = careGaps.filter((gap) =>
    `${gap.patient} ${gap.gap} ${gap.facility} ${gap.priority} ${gap.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // =========================================================
  // DASHBOARD RENDER
  // =========================================================

  const renderDashboard = () => (
    <>
      <PageHeader
        title={`Welcome, ${adminProfile.name}`}
        subtitle="Here's what's happening across the SwasthyaSetu healthcare network."
        action={
          <button
            className="admin-primary-btn"
            onClick={() => handleMenu("User Management")}
          >
            <span>＋</span>
            Manage Users
          </button>
        }
      />

      <div className="admin-stats-grid">
        <StatCard
          icon="👥"
          label="Total Users"
          value="1,284"
          change="+48 this month"
        />

        <StatCard
          icon="🩺"
          label="Active Doctors"
          value="86"
          change="+6 this month"
        />

        <StatCard
          icon="🏥"
          label="Healthcare Facilities"
          value="42"
          change="+3 this month"
        />

        <StatCard
          icon="⚠"
          label="Pending Approvals"
          value="07"
          change="3 urgent"
          urgent
        />
      </div>

      <div className="admin-dashboard-grid">
        <div className="admin-panel">
          <div className="panel-header">
            <div>
              <h3>Pending Approvals</h3>
              <p>Registrations waiting for admin review</p>
            </div>

            <button
              className="panel-link"
              onClick={() => handleMenu("Doctor Approvals")}
            >
              View all →
            </button>
          </div>

          <div className="admin-approval-list">
            {users
              .filter((user) => user.status === "Pending")
              .slice(0, 4)
              .map((user) => (
                <ApprovalRow
                  key={user.id}
                  user={user}
                  onApprove={() => updateUserStatus(user.id, "Approved")}
                  onReject={() => updateUserStatus(user.id, "Rejected")}
                  onView={() => {
                    setSelectedUser(user);
                    setShowUserDetails(true);
                  }}
                />
              ))}
          </div>
        </div>

        <div className="admin-panel">
          <div className="panel-header">
            <div>
              <h3>Network Overview</h3>
              <p>Current SwasthyaSetu network status</p>
            </div>
          </div>

          <div className="network-overview">
            <NetworkItem
              icon="🩺"
              label="Doctors"
              value="86"
              status="82 active"
            />

            <NetworkItem
              icon="👨‍⚕️"
              label="Health Workers"
              value="164"
              status="156 active"
            />

            <NetworkItem
              icon="👥"
              label="Patients"
              value="1,034"
              status="998 active"
            />

            <NetworkItem
              icon="🏥"
              label="Facilities"
              value="42"
              status="39 active"
            />
          </div>
        </div>
      </div>

      <div className="admin-dashboard-grid lower">
        <div className="admin-panel">
          <div className="panel-header">
            <div>
              <h3>Recent Referrals</h3>
              <p>Latest referral activity across facilities</p>
            </div>

            <button
              className="panel-link"
              onClick={() => handleMenu("Referrals")}
            >
              View all →
            </button>
          </div>

          <div className="admin-referral-list">
            {referrals.slice(0, 4).map((referral) => (
              <ReferralRow
                key={referral.id}
                referral={referral}
                onClick={() => {
                  setSelectedReferral(referral);
                  setShowReferralDetails(true);
                }}
              />
            ))}
          </div>
        </div>

        <div className="admin-panel">
          <div className="panel-header">
            <div>
              <h3>Care Gap Alerts</h3>
              <p>Patients requiring administrative attention</p>
            </div>

            <button
              className="panel-link"
              onClick={() => handleMenu("Care Gaps")}
            >
              View all →
            </button>
          </div>

          <div className="care-gap-list">
            {careGaps.slice(0, 4).map((gap) => (
              <CareGapRow
                key={gap.id}
                gap={gap}
                onResolve={() => resolveCareGap(gap.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );

  // =========================================================
  // USER MANAGEMENT RENDER
  // =========================================================

  const renderUserManagement = () => (
    <>
      <PageHeader
        title="User Management"
        subtitle="Manage doctors, health workers and patients registered on SwasthyaSetu."
      />

      <div className="admin-filter-bar">
        <div className="admin-search">
          <span>⌕</span>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
          />
        </div>

        <button
          className="admin-secondary-btn"
          onClick={() => showToast("User filters opened.")}
        >
          ⚙ Filter
        </button>
      </div>

      <div className="admin-mini-stats">
        <MiniStat label="All Users" value="1,284" />
        <MiniStat label="Doctors" value="86" />
        <MiniStat label="Health Workers" value="164" />
        <MiniStat label="Patients" value="1,034" />
      </div>

      <div className="admin-panel full-panel">
        <div className="panel-header">
          <div>
            <h3>All Registered Users</h3>
            <p>{filteredUsers.length} users found</p>
          </div>
        </div>

        <div className="admin-user-table">
          <div className="admin-table-header">
            <span>User</span>
            <span>Role</span>
            <span>Facility</span>
            <span>Status</span>
            <span>Joined</span>
            <span></span>
          </div>

          {filteredUsers.map((user) => (
            <div className="admin-table-row" key={user.id}>
              <div className="admin-user-info">
                <div className="admin-avatar">{user.name.charAt(0)}</div>

                <div>
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
              </div>

              <span className="admin-role">{user.role}</span>
              <span>{user.facility}</span>
              <StatusBadge status={user.status} />
              <span>{user.joined}</span>

              <button
                className="small-icon-btn"
                onClick={() => {
                  setSelectedUser(user);
                  setShowUserDetails(true);
                }}
              >
                →
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  // =========================================================
  // APPROVALS RENDER
  // =========================================================

  const renderApprovals = (role) => {
    const approvalUsers = users.filter(
      (user) => user.role === role && user.status === "Pending"
    );

    return (
      <>
        <PageHeader
          title={`${role} Approvals`}
          subtitle={`Review and approve new ${role.toLowerCase()} registrations before they can access the portal.`}
        />

        <div className="approval-summary">
          <MiniStat
            label="Pending"
            value={String(approvalUsers.length).padStart(2, "0")}
          />
          <MiniStat label="Approved Today" value="08" />
          <MiniStat label="Rejected" value="03" />
          <MiniStat
            label="Total Registered"
            value={role === "Doctor" ? "86" : "164"}
          />
        </div>

        <div className="admin-panel full-panel">
          <div className="panel-header">
            <div>
              <h3>Pending {role} Registrations</h3>
              <p>Review submitted registration details before approval.</p>
            </div>
          </div>

          {approvalUsers.length === 0 ? (
            <div className="admin-empty-state">
              <div>✓</div>
              <h3>No pending approvals</h3>
              <p>All {role.toLowerCase()} registrations have been reviewed.</p>
            </div>
          ) : (
            <div className="approval-full-list">
              {approvalUsers.map((user) => (
                <div className="approval-card" key={user.id}>
                  <div className="admin-avatar large">{user.name.charAt(0)}</div>

                  <div className="approval-info">
                    <strong>{user.name}</strong>
                    <span>
                      {user.role} · {user.facility}
                    </span>
                    <small>
                      {user.email} · {user.phone}
                    </small>
                    <small>Registration date: {user.joined}</small>
                  </div>

                  <StatusBadge status="Pending" />

                  <div className="approval-actions">
                    <button
                      className="small-secondary-btn"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowUserDetails(true);
                      }}
                    >
                      Review
                    </button>

                    <button
                      className="small-success-btn"
                      onClick={() => updateUserStatus(user.id, "Approved")}
                    >
                      ✓ Approve
                    </button>

                    <button
                      className="small-danger-btn"
                      onClick={() => updateUserStatus(user.id, "Rejected")}
                    >
                      × Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  };

  // =========================================================
  // FACILITIES RENDER (WITH INTERACTIVE MAP VIEW)
  // =========================================================

  const renderFacilities = () => (
    <>
      <PageHeader
        title="Healthcare Facilities"
        subtitle="Monitor and manage healthcare facilities connected to SwasthyaSetu."
        action={
          <button
            className="admin-primary-btn"
            onClick={() => showToast("Add facility form opened.")}
          >
            ＋ Add Facility
          </button>
        }
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
        <div className="admin-facility-stats" style={{ margin: 0 }}>
          <MiniStat label="Total Facilities" value="42" />
          <MiniStat label="Active" value="39" />
          <MiniStat label="Under Review" value="03" />
        </div>

        {/* View Switch: Grid vs Interactive Map */}
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
              padding: "7px 16px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              background:
                facilityViewMode === "grid" ? "var(--primary)" : "transparent",
              color:
                facilityViewMode === "grid" ? "var(--white)" : "var(--text-muted)",
            }}
          >
            ▤ Grid View
          </button>

          <button
            type="button"
            onClick={() => setFacilityViewMode("map")}
            style={{
              padding: "7px 16px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              background:
                facilityViewMode === "map" ? "var(--primary)" : "transparent",
              color:
                facilityViewMode === "map" ? "var(--white)" : "var(--text-muted)",
            }}
          >
            📍 Interactive Map
          </button>
        </div>
      </div>

      {facilityViewMode === "map" ? (
        <div
          style={{
            height: "640px",
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
            marginBottom: "32px",
          }}
        >
          <FacilityMap
            onSelectFacility={(fac) => {
              setSelectedFacility(fac);
              setShowFacilityDetails(true);
            }}
          />
        </div>
      ) : (
        <>
          <div className="admin-filter-bar">
            <div className="admin-search">
              <span>⌕</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search facilities..."
              />
            </div>

            <button
              className="admin-secondary-btn"
              onClick={() => showToast("Facility filters opened.")}
            >
              ⚙ Filter
            </button>
          </div>

          <div className="admin-panel full-panel">
            <div className="panel-header">
              <div>
                <h3>Facility Network</h3>
                <p>{filteredFacilities.length} facilities found</p>
              </div>
            </div>

            <div className="admin-facility-grid">
              {filteredFacilities.map((facility) => (
                <div className="admin-facility-card" key={facility.id}>
                  <div className="facility-card-top">
                    <div className="facility-main-icon">🏥</div>
                    <StatusBadge status={facility.status} />
                  </div>

                  <h3>{facility.name}</h3>
                  <p className="facility-type">{facility.type}</p>

                  <div className="facility-detail-line">⌖ {facility.location}</div>
                  <div className="facility-detail-line">☎ {facility.contact}</div>

                  <div className="facility-counts">
                    <span>
                      <strong>{facility.doctors}</strong> Doctors
                    </span>
                    <span>
                      <strong>{facility.workers}</strong> Workers
                    </span>
                    <span>
                      <strong>{facility.patients}</strong> Patients
                    </span>
                  </div>

                  <div className="facility-card-actions">
                    <button
                      className="admin-secondary-btn"
                      onClick={() => {
                        setSelectedFacility(facility);
                        setShowFacilityDetails(true);
                      }}
                    >
                      View Details
                    </button>

                    {facility.status === "Active" ? (
                      <button
                        className="small-warning-btn"
                        onClick={() =>
                          updateFacilityStatus(facility.id, "Under Review")
                        }
                      >
                        Review
                      </button>
                    ) : (
                      <button
                        className="small-success-btn"
                        onClick={() =>
                          updateFacilityStatus(facility.id, "Active")
                        }
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );

  // =========================================================
  // REFERRALS RENDER
  // =========================================================

  const renderReferrals = () => (
    <>
      <PageHeader
        title="Referral Management"
        subtitle="Monitor patient referrals across the healthcare network."
      />

      <div className="admin-filter-bar">
        <div className="admin-search">
          <span>⌕</span>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search referrals..."
          />
        </div>
      </div>

      <div className="admin-referral-stats">
        <MiniStat label="Total Referrals" value="328" />
        <MiniStat label="Pending" value="24" />
        <MiniStat label="In Progress" value="46" />
        <MiniStat label="Completed" value="258" />
      </div>

      <div className="admin-panel full-panel">
        <div className="panel-header">
          <div>
            <h3>Referral Tracking</h3>
            <p>{filteredReferrals.length} referrals displayed</p>
          </div>
        </div>

        <div className="admin-referral-table">
          <div className="admin-referral-header">
            <span>Patient</span>
            <span>From</span>
            <span>Referred To</span>
            <span>Reason</span>
            <span>Date</span>
            <span>Status</span>
            <span></span>
          </div>

          {filteredReferrals.map((referral) => (
            <div className="admin-referral-row" key={referral.id}>
              <div className="admin-user-info">
                <div className="admin-avatar">{referral.patient.charAt(0)}</div>
                <strong>{referral.patient}</strong>
              </div>

              <span>{referral.from}</span>
              <span>{referral.to}</span>
              <span>{referral.reason}</span>
              <span>{referral.date}</span>
              <StatusBadge status={referral.status} />

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
          ))}
        </div>
      </div>
    </>
  );

  // =========================================================
  // CARE GAPS RENDER
  // =========================================================

  const renderCareGaps = () => (
    <>
      <PageHeader
        title="Care Gaps"
        subtitle="Identify and monitor patients who may be missing important healthcare services."
      />

      <div className="care-gap-stats">
        <MiniStat label="Open Gaps" value="18" />
        <MiniStat label="Critical" value="04" />
        <MiniStat label="High Priority" value="07" />
        <MiniStat label="Resolved" value="62" />
      </div>

      <div className="admin-filter-bar">
        <div className="admin-search">
          <span>⌕</span>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search care gaps..."
          />
        </div>

        <button
          className="admin-secondary-btn"
          onClick={() => showToast("Care gap filters opened.")}
        >
          ⚙ Filter
        </button>
      </div>

      <div className="admin-panel full-panel">
        <div className="panel-header">
          <div>
            <h3>Care Gap Monitoring</h3>
            <p>Track unresolved gaps in patient care.</p>
          </div>
        </div>

        <div className="care-gap-full-list">
          {filteredCareGaps.map((gap) => (
            <div className="care-gap-card" key={gap.id}>
              <div
                className={`care-gap-priority ${gap.priority
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                !
              </div>

              <div className="care-gap-info">
                <strong>{gap.patient}</strong>
                <span>{gap.gap}</span>
                <small>
                  {gap.facility} · Last contact: {gap.lastContact}
                </small>
              </div>

              <StatusBadge status={gap.priority} />
              <StatusBadge status={gap.status} />

              {gap.status !== "Resolved" && (
                <button
                  className="small-success-btn"
                  onClick={() => resolveCareGap(gap.id)}
                >
                  ✓ Resolve
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );

  // =========================================================
  // QUALITY DASHBOARD
  // =========================================================

  const renderQualityDashboard = () => (
    <>
      <PageHeader
        title="Quality Dashboard"
        subtitle="Monitor healthcare service quality and continuity indicators."
      />

      <div className="quality-stats-grid">
        <QualityCard
          label="Appointment Completion"
          value="94%"
          change="↑ 6%"
        />

        <QualityCard
          label="Referral Completion"
          value="88%"
          change="↑ 4%"
        />

        <QualityCard
          label="Follow-up Compliance"
          value="92%"
          change="↑ 8%"
        />

        <QualityCard
          label="Patient Satisfaction"
          value="91%"
          change="↑ 3%"
        />
      </div>

      <div className="admin-dashboard-grid">
        <div className="admin-panel">
          <div className="panel-header">
            <div>
              <h3>Service Quality</h3>
              <p>Key performance indicators</p>
            </div>
          </div>

          <div className="quality-bars">
            <QualityBar label="Appointment Completion" value={94} />
            <QualityBar label="Referral Completion" value={88} />
            <QualityBar label="Follow-up Compliance" value={92} />
            <QualityBar label="Diagnostic Completion" value={84} />
            <QualityBar label="Patient Satisfaction" value={91} />
          </div>
        </div>

        <div className="admin-panel">
          <div className="panel-header">
            <div>
              <h3>Facility Performance</h3>
              <p>Top performing facilities</p>
            </div>
          </div>

          <div className="facility-performance-list">
            <PerformanceRow
              rank="01"
              name="District Hospital Varanasi"
              score="96%"
            />

            <PerformanceRow
              rank="02"
              name="CHC Choubeypur"
              score="93%"
            />

            <PerformanceRow
              rank="03"
              name="PHC Harhua"
              score="90%"
            />

            <PerformanceRow
              rank="04"
              name="PHC Choubeypur"
              score="87%"
            />
          </div>
        </div>
      </div>
    </>
  );

  // =========================================================
  // REFERRAL ANALYTICS
  // =========================================================

  const renderReferralAnalytics = () => (
    <>
      <PageHeader
        title="Referral Analytics"
        subtitle="Analyze referral patterns, completion rates and healthcare network movement."
      />

      <div className="analytics-grid">
        <AnalyticsCard
          label="Total Referrals"
          value="328"
          text="↑ 12% from last month"
        />

        <AnalyticsCard
          label="Completed"
          value="258"
          text="78.6% completion rate"
        />

        <AnalyticsCard
          label="In Progress"
          value="46"
          text="14% of total referrals"
        />

        <AnalyticsCard
          label="Pending"
          value="24"
          text="7.3% awaiting action"
        />
      </div>

      <div className="admin-panel analytics-chart-panel">
        <div className="panel-header">
          <div>
            <h3>Referral Activity</h3>
            <p>Referral volume over the last 7 days</p>
          </div>
        </div>

        <div className="fake-chart admin-chart">
          {[52, 68, 48, 82, 65, 91, 76].map((height, index) => (
            <div className="chart-column" key={index}>
              <div className="chart-bar" style={{ height: `${height}%` }}></div>
              <span>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-dashboard-grid lower">
        <div className="admin-panel">
          <div className="panel-header">
            <div>
              <h3>Referral Sources</h3>
              <p>Where referrals are coming from</p>
            </div>
          </div>

          <AnalyticsRow label="PHC" value="142" percentage="43%" />
          <AnalyticsRow label="CHC" value="108" percentage="33%" />
          <AnalyticsRow label="District Hospital" value="52" percentage="16%" />
          <AnalyticsRow label="Other" value="26" percentage="8%" />
        </div>

        <div className="admin-panel">
          <div className="panel-header">
            <div>
              <h3>Referral Destinations</h3>
              <p>Most used healthcare facilities</p>
            </div>
          </div>

          <AnalyticsRow label="District Hospital" value="136" percentage="41%" />
          <AnalyticsRow label="CHC" value="94" percentage="29%" />
          <AnalyticsRow label="Diagnostic Centres" value="62" percentage="19%" />
          <AnalyticsRow label="Specialist Hospitals" value="36" percentage="11%" />
        </div>
      </div>
    </>
  );

  // =========================================================
  // NOTIFICATIONS RENDER
  // =========================================================

  const renderNotifications = () => (
    <>
      <PageHeader
        title="Notifications"
        subtitle="Stay updated with registrations, facilities, referrals and care alerts."
      />

      <div className="admin-panel full-panel">
        <div className="panel-header">
          <div>
            <h3>Recent Notifications</h3>
            <p>Latest updates from the admin dashboard.</p>
          </div>

          <button className="panel-link" onClick={markAllNotificationsRead}>
            Mark all as read
          </button>
        </div>

        <div className="notification-page-list">
          {notifications.map((notification) => (
            <button
              className={`admin-notification-item ${
                !notification.read ? "unread" : ""
              }`}
              key={notification.id}
              onClick={() => markNotificationRead(notification.id)}
            >
              <div className="notification-icon">🔔</div>

              <div>
                <strong>{notification.title}</strong>
                <p>{notification.message}</p>
                <small>{notification.time}</small>
              </div>

              {!notification.read && <span className="new-label">NEW</span>}
            </button>
          ))}
        </div>
      </div>
    </>
  );

  // =========================================================
  // PROFILE RENDER
  // =========================================================

  const renderProfile = () => (
    <>
      <PageHeader
        title="Admin Profile"
        subtitle="Manage your administrator information and portal credentials."
        action={
          <button className="admin-primary-btn" onClick={openEditProfile}>
            ✎ Edit Profile
          </button>
        }
      />

      {!editProfile ? (
        <div className="admin-profile-layout doctor-style-profile-layout">
          <div className="admin-panel admin-profile-card doctor-style-profile-card">
            <div className="admin-profile-cover"></div>

            <div className="admin-profile-avatar-wrapper">
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

            <div className="admin-profile-info profile-main-info">
              <h2>{adminProfile.name}</h2>
              <p>{adminProfile.role}</p>
              <span>{adminProfile.department}</span>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "16px", justifyContent: "center" }}>
              <button
                className="admin-secondary-btn profile-edit-button"
                onClick={openEditProfile}
              >
                ✎ Edit Profile
              </button>
              <button
                className="admin-primary-btn"
                onClick={() => setShowPasswordModal(true)}
              >
                🔑 Change Password
              </button>
            </div>

            <div className="admin-profile-details profile-details">
              <InfoItem label="Role" value={adminProfile.role} />
              <InfoItem label="Organization" value={adminProfile.organization} />
              <InfoItem label="Access Level" value={adminProfile.accessLevel} />
              <InfoItem label="Department" value={adminProfile.department} />
              <InfoItem label="Phone" value={adminProfile.phone} />
              <InfoItem label="Email" value={adminProfile.email} />
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

            <div className="admin-bio doctor-bio">
              <h3>About Administrator</h3>
              <p>
                Administrator account responsible for managing users,
                healthcare facilities, approvals, referrals, care gaps,
                analytics and system-level settings across Varanasi district.
              </p>
            </div>
          </div>

          <div className="admin-panel availability-panel admin-system-access-panel">
            <h3>System Access</h3>
            <p>
              Your account has administrative access to the complete
              SwasthyaSetu healthcare network.
            </p>

            <div className="access-list">
              <AccessItem label="User Management" enabled />
              <AccessItem label="Doctor Approvals" enabled />
              <AccessItem label="Health Worker Approvals" enabled />
              <AccessItem label="Facility Management" enabled />
              <AccessItem label="Referrals & Care Gaps" enabled />
              <AccessItem label="Analytics & Reports" enabled />
              <AccessItem label="System Settings" enabled />
            </div>
          </div>
        </div>
      ) : (
        <div className="admin-panel edit-profile-panel">
          <div className="edit-profile-heading">
            <div>
              <span>PROFILE SETTINGS</span>
              <h2>Edit Administrator Profile</h2>
              <p>Update your administrator information below.</p>
            </div>

            <button
              type="button"
              className="admin-secondary-btn"
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
                className="admin-secondary-btn"
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

          <form onSubmit={saveProfile} className="admin-edit-profile-form">
            <div className="admin-form-grid">
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
                label="Department"
                value={profileForm.department}
                onChange={(e) => updateProfileField("department", e.target.value)}
              />

              <FormField
                label="Organization"
                value={profileForm.organization}
                onChange={(e) => updateProfileField("organization", e.target.value)}
              />

              <FormField
                label="Access Level"
                value={profileForm.accessLevel}
                onChange={(e) => updateProfileField("accessLevel", e.target.value)}
              />

              <FormField
                label="Phone Number"
                value={profileForm.phone}
                onChange={(e) => updateProfileField("phone", e.target.value)}
              />

              <FormField
                label="Email Address"
                type="email"
                value={profileForm.email}
                onChange={(e) => updateProfileField("email", e.target.value)}
              />

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
                className="admin-secondary-btn"
                onClick={() => setEditProfile(false)}
              >
                Cancel
              </button>

              <button type="submit" className="admin-primary-btn">
                ✓ Save Profile
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );

  // =========================================================
  // SETTINGS RENDER
  // =========================================================

  const renderSettings = () => (
    <>
      <PageHeader
        title="Settings"
        subtitle="Manage your admin account, password and dashboard preferences."
        action={
          <button
            className="admin-secondary-btn"
            onClick={() => handleMenu("Profile")}
          >
            ← Back to Profile
          </button>
        }
      />

      <div className="admin-settings-grid">
        <div className="admin-panel settings-section">
          <div className="settings-heading">
            <span>🔐</span>
            <div>
              <h3>Security & Password</h3>
              <p>Protect administrator access and credentials.</p>
            </div>
          </div>

          <div className="setting-row">
            <div>
              <strong>Account Password</strong>
              <span>Update your secure administrator login password.</span>
            </div>

            <button
              className="admin-primary-btn"
              onClick={() => setShowPasswordModal(true)}
            >
              🔑 Change Password
            </button>
          </div>

          <SettingRow
            title="Two-Factor Authentication"
            text="Add an extra verification step when signing in."
            defaultChecked
          />
        </div>

        <div className="admin-panel settings-section">
          <div className="settings-heading">
            <span>🔔</span>
            <div>
              <h3>Notification Preferences</h3>
              <p>Choose which administrative updates you want to receive.</p>
            </div>
          </div>

          <SettingRow
            title="Registration Alerts"
            text="Receive alerts when doctors or health workers register."
            defaultChecked
          />

          <SettingRow
            title="Referral Alerts"
            text="Receive updates about referral activities."
            defaultChecked
          />

          <SettingRow
            title="Care Gap Alerts"
            text="Receive notifications for critical care gaps."
            defaultChecked
          />

          <SettingRow
            title="Facility Alerts"
            text="Receive updates about facility status."
            defaultChecked
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
      case "User Management":
        return renderUserManagement();
      case "Doctor Approvals":
        return renderApprovals("Doctor");
      case "Health Worker Approvals":
        return renderApprovals("Health Worker");
      case "Facilities":
        return renderFacilities();
      case "Referrals":
        return renderReferrals();
      case "Care Gaps":
        return renderCareGaps();
      case "Quality Dashboard":
        return renderQualityDashboard();
      case "Referral Analytics":
        return renderReferralAnalytics();
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
        { label: "User Management", icon: "♙" },
        { label: "Doctor Approvals", icon: "🩺" },
        { label: "Health Worker Approvals", icon: "♟" },
      ],
    },
    {
      section: "NETWORK",
      items: [
        { label: "Facilities", icon: "▣" },
        { label: "Referrals", icon: "↗" },
        { label: "Care Gaps", icon: "⚠" },
      ],
    },
    {
      section: "INSIGHTS",
      items: [
        { label: "Quality Dashboard", icon: "▥" },
        { label: "Referral Analytics", icon: "▤" },
      ],
    },
  ];

  return (
    <div className="admin-dashboard-page">
      {/* SIDEBAR */}
      <aside
        className={`admin-sidebar ${
          mobileMenuOpen ? "mobile-admin-sidebar-open" : ""
        }`}
        style={
          mobileMenuOpen
            ? {
                transform: "translateX(0)",
                visibility: "visible",
                zIndex: 2000,
              }
            : undefined
        }
      >
        <div className="admin-brand">
          <div className="admin-brand-icon">✚</div>
          <div>
            <strong>SwasthyaSetu</strong>
            <span>Admin Portal</span>
          </div>
        </div>

        <div className="admin-sidebar-profile">
          <ProfileAvatar />
          <div>
            <strong>{adminProfile.name}</strong>
            <span>{adminProfile.role}</span>
          </div>
        </div>

        <nav className="admin-navigation">
          {menuItems.map((group) => (
            <div className="admin-nav-group" key={group.section}>
              <small>{group.section}</small>
              {group.items.map((item) => (
                <button
                  key={item.label}
                  className={`admin-nav-item ${
                    activeMenu === item.label ? "active" : ""
                  }`}
                  onClick={() => handleMenu(item.label)}
                >
                  <span className="admin-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.label === "Doctor Approvals" && <b>1</b>}
                  {item.label === "Health Worker Approvals" && <b>1</b>}
                  {item.label === "Care Gaps" && <b>4</b>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <button
            className={`admin-nav-item ${
              activeMenu === "Notifications" ? "active" : ""
            }`}
            onClick={() => handleMenu("Notifications")}
          >
            <span className="admin-nav-icon">♢</span>
            <span>Notifications</span>
            {unreadCount > 0 && <b>{unreadCount}</b>}
          </button>

          <button
            className={`admin-nav-item ${
              activeMenu === "Profile" ? "active" : ""
            }`}
            onClick={() => handleMenu("Profile")}
          >
            <span className="admin-nav-icon">👤</span>
            <span>Profile</span>
          </button>

          <button
            className={`admin-nav-item ${
              activeMenu === "Settings" ? "active" : ""
            }`}
            onClick={() => handleMenu("Settings")}
          >
            <span className="admin-nav-icon">⚙</span>
            <span>Settings</span>
          </button>

          <button className="admin-logout" onClick={handleLogout}>
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div
          className="mobile-admin-sidebar-overlay"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* MAIN */}
      <main className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="mobile-admin-menu-toggle"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle admin menu"
            aria-expanded={mobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className="mobile-admin-brand">
            <div>✚</div>
            <strong>SwasthyaSetu</strong>
          </div>

          <div className="admin-breadcrumb">
            <button
              className="top-back-btn"
              onClick={handleBack}
              title="Go Back"
            >
              <span>←</span>
              <strong>Go Back</strong>
            </button>

            <span>Admin Portal</span>
            <b>/</b>
            <strong>{activeMenu}</strong>
          </div>

          <div className="admin-top-actions">
            <button
              className="admin-topbar-icon-btn"
              onClick={() => setNotificationOpen(!notificationOpen)}
            >
              🔔
              {unreadCount > 0 && <i>{unreadCount}</i>}
            </button>

            <div className="admin-profile-wrapper">
              <button
                className="admin-top-profile"
                onClick={() => setShowProfile(!showProfile)}
              >
                <ProfileAvatar />
                <div>
                  <strong>{adminProfile.name}</strong>
                  <span>{adminProfile.role}</span>
                </div>
                <span className="profile-arrow">⌄</span>
              </button>

              {showProfile && (
                <div className="admin-profile-dropdown">
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
            <div className="admin-notification-dropdown">
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

        <section className="admin-content">{renderContent()}</section>
      </main>

      {/* USER DETAILS MODAL */}
      {showUserDetails && selectedUser && (
        <Modal title="User Details" onClose={() => setShowUserDetails(false)}>
          <div className="modal-patient">
            <div className="admin-avatar large">{selectedUser.name.charAt(0)}</div>
            <div>
              <h3>{selectedUser.name}</h3>
              <p>{selectedUser.role}</p>
            </div>
            <StatusBadge status={selectedUser.status} />
          </div>

          <div className="modal-info-grid">
            <InfoItem label="Email" value={selectedUser.email} />
            <InfoItem label="Phone" value={selectedUser.phone} />
            <InfoItem label="Role" value={selectedUser.role} />
            <InfoItem label="Facility" value={selectedUser.facility} />
            <InfoItem label="Joined" value={selectedUser.joined} />
            <InfoItem label="Status" value={selectedUser.status} />
          </div>

          <div className="modal-actions">
            {selectedUser.status === "Pending" && (
              <>
                <button
                  className="admin-success-btn"
                  onClick={() => {
                    updateUserStatus(selectedUser.id, "Approved");
                    setShowUserDetails(false);
                  }}
                >
                  ✓ Approve
                </button>

                <button
                  className="admin-danger-btn"
                  onClick={() => {
                    updateUserStatus(selectedUser.id, "Rejected");
                    setShowUserDetails(false);
                  }}
                >
                  × Reject
                </button>
              </>
            )}

            {selectedUser.status === "Approved" && (
              <button
                className="admin-warning-btn"
                onClick={() => updateUserStatus(selectedUser.id, "Suspended")}
              >
                Suspend User
              </button>
            )}

            {selectedUser.status === "Suspended" && (
              <button
                className="admin-success-btn"
                onClick={() => updateUserStatus(selectedUser.id, "Approved")}
              >
                Activate User
              </button>
            )}

            <button
              className="admin-secondary-btn"
              onClick={() => setShowUserDetails(false)}
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* FACILITY DETAILS MODAL */}
      {showFacilityDetails && selectedFacility && (
        <Modal
          title="Facility Details"
          onClose={() => setShowFacilityDetails(false)}
        >
          <div className="facility-modal-heading">
            <div className="facility-main-icon large">🏥</div>
            <div>
              <h3>{selectedFacility.name}</h3>
              <p>{selectedFacility.type}</p>
            </div>
            <StatusBadge status={selectedFacility.status} />
          </div>

          <div className="modal-info-grid">
            <InfoItem label="Location" value={selectedFacility.location} />
            <InfoItem label="Contact" value={selectedFacility.contact} />
            <InfoItem label="Doctors" value={String(selectedFacility.doctors)} />
            <InfoItem label="Health Workers" value={String(selectedFacility.workers)} />
            <InfoItem label="Patients" value={String(selectedFacility.patients)} />
            <InfoItem label="Services" value={selectedFacility.services} />
          </div>

          <div className="modal-actions">
            {selectedFacility.status === "Active" ? (
              <button
                className="admin-warning-btn"
                onClick={() => {
                  updateFacilityStatus(selectedFacility.id, "Under Review");
                  setShowFacilityDetails(false);
                }}
              >
                Put Under Review
              </button>
            ) : (
              <button
                className="admin-success-btn"
                onClick={() => {
                  updateFacilityStatus(selectedFacility.id, "Active");
                  setShowFacilityDetails(false);
                }}
              >
                ✓ Activate Facility
              </button>
            )}

            <button
              className="admin-secondary-btn"
              onClick={() => setShowFacilityDetails(false)}
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
            <div className="admin-avatar large">
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
            <InfoItem label="Referred To" value={selectedReferral.to} />
            <InfoItem label="Reason" value={selectedReferral.reason} />
            <InfoItem label="Date" value={selectedReferral.date} />
          </div>

          <div className="modal-actions">
            {selectedReferral.status === "Pending" && (
              <button
                className="admin-primary-btn"
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
                className="admin-success-btn"
                onClick={() => {
                  updateReferralStatus(selectedReferral.id, "Completed");
                  setShowReferralDetails(false);
                }}
              >
                ✓ Mark Completed
              </button>
            )}

            <button
              className="admin-secondary-btn"
              onClick={() => setShowReferralDetails(false)}
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <Modal
          title="Change Admin Password"
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
              <button type="submit" className="admin-primary-btn">
                Update Password
              </button>
              <button
                type="button"
                className="admin-secondary-btn"
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
        <div className="admin-toast">
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
    <div className="admin-page-header">
      <div>
        <span className="admin-page-eyebrow">
          SWASTHYASETU · ADMIN PORTAL
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
    <div className="admin-stat-card">
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
    <div className="admin-mini-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ApprovalRow({ user, onApprove, onReject, onView }) {
  return (
    <div className="approval-row">
      <div className="admin-avatar">{user.name.charAt(0)}</div>
      <div className="approval-row-info">
        <strong>{user.name}</strong>
        <span>
          {user.role} · {user.facility}
        </span>
      </div>
      <StatusBadge status="Pending" />
      <div className="approval-row-actions">
        <button
          className="small-success-btn"
          onClick={onApprove}
          title="Approve"
        >
          ✓
        </button>
        <button className="small-danger-btn" onClick={onReject} title="Reject">
          ×
        </button>
        <button className="small-icon-btn" onClick={onView} title="View">
          →
        </button>
      </div>
    </div>
  );
}

function NetworkItem({ icon, label, value, status }) {
  return (
    <div className="network-item">
      <div className="network-icon">{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{status}</small>
      </div>
    </div>
  );
}

function ReferralRow({ referral, onClick }) {
  return (
    <button className="admin-referral-row-small" onClick={onClick}>
      <div className="admin-avatar">{referral.patient.charAt(0)}</div>
      <div>
        <strong>{referral.patient}</strong>
        <span>{referral.reason}</span>
      </div>
      <StatusBadge status={referral.status} />
      <span className="row-arrow">→</span>
    </button>
  );
}

function CareGapRow({ gap, onResolve }) {
  return (
    <div className="care-gap-row">
      <div
        className={`care-gap-dot ${gap.priority
          .toLowerCase()
          .replace(" ", "-")}`}
      >
        !
      </div>
      <div>
        <strong>{gap.patient}</strong>
        <span>{gap.gap}</span>
      </div>
      <StatusBadge status={gap.priority} />
      {gap.status !== "Resolved" && (
        <button
          className="care-gap-complete"
          onClick={onResolve}
          title="Resolve"
        >
          ✓
        </button>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = status.toLowerCase().replaceAll(" ", "-");
  return (
    <span className={`admin-status ${normalized}`}>
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

function QualityCard({ label, value, change }) {
  return (
    <div className="admin-quality-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{change}</small>
    </div>
  );
}

function QualityBar({ label, value }) {
  return (
    <div className="quality-bar-item">
      <div>
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div className="quality-progress">
        <span style={{ width: `${value}%` }}></span>
      </div>
    </div>
  );
}

function PerformanceRow({ rank, name, score }) {
  return (
    <div className="performance-row">
      <strong>{rank}</strong>
      <span>{name}</span>
      <b>{score}</b>
    </div>
  );
}

function AnalyticsCard({ label, value, text }) {
  return (
    <div className="admin-analytics-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{text}</small>
    </div>
  );
}

function AnalyticsRow({ label, value, percentage }) {
  return (
    <div className="analytics-row">
      <div>
        <strong>{label}</strong>
        <span>{value}</span>
      </div>
      <div className="analytics-row-bar">
        <span style={{ width: percentage }}></span>
      </div>
      <b>{percentage}</b>
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

function SettingRow({ title, text, defaultChecked }) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="setting-row">
      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
      <button
        type="button"
        className={`toggle-switch ${checked ? "on" : ""}`}
        onClick={() => setChecked(!checked)}
        aria-label={title}
      >
        <span></span>
      </button>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default AdminDashboard;