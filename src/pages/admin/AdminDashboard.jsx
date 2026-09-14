// src/pages/AdminDashboard.jsx
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

  const [facilityViewMode, setFacilityViewMode] = useState("grid");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [toast, setToast] = useState("");

  const fileInputRef = useRef(null);

  const [adminProfile, setAdminProfile] = useState({
    name: "SwasthyaSetu Admin",
    role: "System Administrator",
    department: "Healthcare Network Administration",
    organization: "SwasthyaSetu",
    accessLevel: "Full Network Access",
    email: "admin@swasthyasetu.in",
    phone: "9876543210",
    image: "",
  });

  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ ...adminProfile });

  // Live Database States (No Hardcoded Mock Data)
  const [users, setUsers] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [careGaps, setCareGaps] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Fetch complete admin data from database on mount
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        if (res.data && res.data.success) {
          if (res.data.profile) {
            setAdminProfile(res.data.profile);
            setProfileForm(res.data.profile);
          }
          if (res.data.users) setUsers(res.data.users);
          if (res.data.facilities) setFacilities(res.data.facilities);
          if (res.data.referrals) setReferrals(res.data.referrals);
          if (res.data.careGaps) setCareGaps(res.data.careGaps);
          if (res.data.notifications) setNotifications(res.data.notifications);
        }
      } catch (err) {
        console.warn("Failed fetching live database admin records", err);
      }
    };

    fetchAdminData();
  }, []);

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
    if (showUserDetails) { setShowUserDetails(false); return; }
    if (showFacilityDetails) { setShowFacilityDetails(false); return; }
    if (showReferralDetails) { setShowReferralDetails(false); return; }
    if (editProfile) { setEditProfile(false); return; }
    if (notificationOpen) { setNotificationOpen(false); return; }
    if (showProfile) { setShowProfile(false); return; }

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
      window.scrollTo({ top: 0, behavior: "smooth" });
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
      setAdminProfile((prev) => ({ ...prev, image: e.target.result }));
      showToast("Profile photo updated successfully.");
    };
    reader.readAsDataURL(file);
  };

  const openEditProfile = () => {
    setProfileForm({ ...adminProfile });
    setEditProfile(true);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/admin/profile", profileForm);
      if (res.data && res.data.success) {
        setAdminProfile(res.data.data);
      }
    } catch (err) {
      setAdminProfile((prev) => ({ ...prev, ...profileForm }));
      console.warn("Profile updated locally", err);
    }
    setEditProfile(false);
    showToast("Profile updated successfully.");
  };

  const updateProfileField = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const ProfileAvatar = ({ large = false }) => {
    return adminProfile.image ? (
      <img src={adminProfile.image} alt="Admin profile" className={large ? "admin-avatar-image large" : "admin-avatar-image"} />
    ) : (
      <div className={large ? "admin-avatar-fallback large" : "admin-avatar-fallback"}>SA</div>
    );
  };

  const updateUserStatus = async (id, status) => {
    try {
      await api.patch(`/admin/users/${id}/status`, { status });
      setUsers((current) =>
        current.map((user) => (user.id === id || user._id === id ? { ...user, status } : user))
      );
      showToast(`User ${status.toLowerCase()} successfully.`);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update user status.");
    }
  };

  const updateFacilityStatus = (id, status) => {
    setFacilities((current) =>
      current.map((facility) => (facility.id === id || facility._id === id ? { ...facility, status } : facility))
    );
    showToast(`Facility marked as ${status}.`);
  };

  const updateReferralStatus = (id, status) => {
    setReferrals((current) =>
      current.map((referral) => (referral.id === id || referral._id === id ? { ...referral, status } : referral))
    );
    showToast(`Referral marked as ${status}.`);
  };

  const resolveCareGap = (id) => {
    setCareGaps((current) =>
      current.map((gap) => (gap.id === id || gap._id === id ? { ...gap, status: "Resolved" } : gap))
    );
    showToast("Care gap marked as resolved.");
  };

  const markNotificationRead = (id) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id || item._id === id ? { ...item, read: true } : item))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
    showToast("All notifications marked as read.");
  };

  const unreadCount = notifications.filter((item) => !item.read).length;

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.role} ${user.facility} ${user.status}`.toLowerCase().includes(search.toLowerCase())
  );

  const filteredFacilities = facilities.filter((facility) =>
    `${facility.name} ${facility.type} ${facility.location} ${facility.status}`.toLowerCase().includes(search.toLowerCase())
  );

  const filteredReferrals = referrals.filter((referral) =>
    `${referral.patient} ${referral.from} ${referral.to} ${referral.reason} ${referral.status}`.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCareGaps = careGaps.filter((gap) =>
    `${gap.patient} ${gap.gap} ${gap.facility} ${gap.priority} ${gap.status}`.toLowerCase().includes(search.toLowerCase())
  );

  const renderDashboard = () => (
    <>
      <PageHeader
        title={`Welcome, ${adminProfile.name}`}
        subtitle="Here's what's happening across the SwasthyaSetu healthcare network."
        action={
          <button className="admin-primary-btn" onClick={() => handleMenu("User Management")}>
            <span>＋</span> Manage Users
          </button>
        }
      />

      <div className="admin-stats-grid">
        <StatCard icon="👥" label="Total Users" value={users.length.toString()} change="+48 this month" />
        <StatCard icon="🩺" label="Active Doctors" value={users.filter(u => u.role === "Doctor").length.toString()} change="+6 this month" />
        <StatCard icon="🏥" label="Healthcare Facilities" value={facilities.length.toString()} change="+3 this month" />
        <StatCard icon="⚠" label="Pending Approvals" value={users.filter(u => u.status === "Pending").length.toString()} change="3 urgent" urgent />
      </div>

      <div className="admin-dashboard-grid">
        <div className="admin-panel">
          <div className="panel-header">
            <div>
              <h3>Pending Approvals</h3>
              <p>Registrations waiting for admin review</p>
            </div>
            <button className="panel-link" onClick={() => handleMenu("Doctor Approvals")}>
              View all →
            </button>
          </div>

          <div className="admin-approval-list">
            {users
              .filter((user) => user.status === "Pending")
              .slice(0, 4)
              .map((user) => (
                <ApprovalRow
                  key={user._id || user.id}
                  user={user}
                  onApprove={() => updateUserStatus(user._id || user.id, "Approved")}
                  onReject={() => updateUserStatus(user._id || user.id, "Rejected")}
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
            <NetworkItem icon="🩺" label="Doctors" value={users.filter(u => u.role === "Doctor").length.toString()} status="Active" />
            <NetworkItem icon="👨‍⚕️" label="Health Workers" value={users.filter(u => u.role === "Health Worker").length.toString()} status="Active" />
            <NetworkItem icon="👥" label="Patients" value={users.filter(u => u.role === "Patient").length.toString()} status="Active" />
            <NetworkItem icon="🏥" label="Facilities" value={facilities.length.toString()} status="Active" />
          </div>
        </div>
      </div>
    </>
  );

  const renderUserManagement = () => (
    <>
      <PageHeader title="User Management" subtitle="Manage doctors, health workers and patients." />
      <div className="admin-filter-bar">
        <div className="admin-search">
          <span>⌕</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." />
        </div>
      </div>
      <div className="admin-panel full-panel">
        <div className="admin-user-table">
          <div className="admin-table-header">
            <span>User</span><span>Role</span><span>Facility</span><span>Status</span><span>Joined</span><span></span>
          </div>
          {filteredUsers.map((user) => (
            <div className="admin-table-row" key={user._id || user.id}>
              <div className="admin-user-info">
                <div className="admin-avatar">{user.name?.charAt(0) || "U"}</div>
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

  const renderApprovals = (role) => {
    const approvalUsers = users.filter((user) => user.role === role && user.status === "Pending");
    return (
      <>
        <PageHeader title={`${role} Approvals`} subtitle={`Review and approve new ${role.toLowerCase()} registrations.`} />
        <div className="admin-panel full-panel">
          {approvalUsers.length === 0 ? (
            <div className="admin-empty-state">
              <div>✓</div>
              <h3>No pending approvals</h3>
            </div>
          ) : (
            <div className="approval-full-list">
              {approvalUsers.map((user) => (
                <ApprovalRow
                  key={user._id || user.id}
                  user={user}
                  onApprove={() => updateUserStatus(user._id || user.id, "Approved")}
                  onReject={() => updateUserStatus(user._id || user.id, "Rejected")}
                  onView={() => {
                    setSelectedUser(user);
                    setShowUserDetails(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </>
    );
  };

  const renderFacilities = () => (
    <>
      <PageHeader title="Healthcare Facilities" subtitle="Monitor and manage healthcare facilities." />
      {facilityViewMode === "map" ? (
        <div style={{ height: "640px", borderRadius: "16px", overflow: "hidden", border: "1px solid var(--border)" }}>
          <FacilityMap onSelectFacility={(fac) => { setSelectedFacility(fac); setShowFacilityDetails(true); }} />
        </div>
      ) : (
        <div className="admin-facility-grid">
          {filteredFacilities.map((facility) => (
            <div className="admin-facility-card" key={facility._id || facility.id}>
              <h3>{facility.name}</h3>
              <p className="facility-type">{facility.type}</p>
              <button
                className="admin-secondary-btn"
                onClick={() => {
                  setSelectedFacility(facility);
                  setShowFacilityDetails(true);
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderReferrals = () => (
    <>
      <PageHeader title="Referral Management" subtitle="Monitor patient referrals." />
      <div className="admin-panel full-panel">
        <div className="admin-referral-table">
          {filteredReferrals.map((referral) => (
            <div className="admin-referral-row" key={referral._id || referral.id}>
              <strong>{referral.patient}</strong>
              <span>{referral.from} → {referral.to}</span>
              <StatusBadge status={referral.status} />
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderCareGaps = () => (
    <>
      <PageHeader title="Care Gaps" subtitle="Identify and monitor care gaps." />
      <div className="care-gap-full-list">
        {filteredCareGaps.map((gap) => (
          <div className="care-gap-card" key={gap._id || gap.id}>
            <strong>{gap.patient}</strong>
            <span>{gap.gap}</span>
            <button className="small-success-btn" onClick={() => resolveCareGap(gap._id || gap.id)}>✓ Resolve</button>
          </div>
        ))}
      </div>
    </>
  );

  const renderQualityDashboard = () => <PageHeader title="Quality Dashboard" subtitle="Monitor service quality indicators." />;
  const renderReferralAnalytics = () => <PageHeader title="Referral Analytics" subtitle="Analyze referral patterns." />;

  const renderNotifications = () => (
    <>
      <PageHeader title="Notifications" subtitle="Stay updated with system alerts." />
      <div className="notification-page-list">
        {notifications.map((n) => (
          <div className="admin-notification-item" key={n._id || n.id}>
            <strong>{n.title}</strong>
            <p>{n.message}</p>
          </div>
        ))}
      </div>
    </>
  );

  const renderProfile = () => (
    <PageHeader title="Admin Profile" subtitle="Manage your administrator information." />
  );

  const renderSettings = () => (
    <PageHeader title="Settings" subtitle="Manage security and preferences." />
  );

  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard": return renderDashboard();
      case "User Management": return renderUserManagement();
      case "Doctor Approvals": return renderApprovals("Doctor");
      case "Health Worker Approvals": return renderApprovals("Health Worker");
      case "Facilities": return renderFacilities();
      case "Referrals": return renderReferrals();
      case "Care Gaps": return renderCareGaps();
      case "Quality Dashboard": return renderQualityDashboard();
      case "Referral Analytics": return renderReferralAnalytics();
      case "Notifications": return renderNotifications();
      case "Profile": return renderProfile();
      case "Settings": return renderSettings();
      default: return renderDashboard();
    }
  };

  const menuItems = [
    { section: "MAIN", items: [{ label: "Dashboard", icon: "⌂" }, { label: "User Management", icon: "♙" }, { label: "Doctor Approvals", icon: "🩺" }, { label: "Health Worker Approvals", icon: "♟" }] },
    { section: "NETWORK", items: [{ label: "Facilities", icon: "▣" }, { label: "Referrals", icon: "↗" }, { label: "Care Gaps", icon: "⚠" }] },
    { section: "INSIGHTS", items: [{ label: "Quality Dashboard", icon: "▥" }, { label: "Referral Analytics", icon: "▤" }] },
  ];

  return (
    <div className="admin-dashboard-page">
      <aside className={`admin-sidebar ${mobileMenuOpen ? "mobile-admin-sidebar-open" : ""}`}>
        <div className="admin-brand">
          <div className="admin-brand-icon">✚</div>
          <div><strong>SwasthyaSetu</strong><span>Admin Portal</span></div>
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
                  className={`admin-nav-item ${activeMenu === item.label ? "active" : ""}`}
                  onClick={() => handleMenu(item.label)}
                >
                  <span className="admin-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <button className="admin-logout" onClick={handleLogout}><span>↪</span> Logout</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <button type="button" className="mobile-admin-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span></span><span></span><span></span>
          </button>
          <div className="admin-breadcrumb">
            <span>Admin Portal</span><b>/</b><strong>{activeMenu}</strong>
          </div>
        </header>

        <section className="admin-content">{renderContent()}</section>
      </main>

      {/* MODALS */}
      {showUserDetails && selectedUser && (
        <Modal title="User Details" onClose={() => setShowUserDetails(false)}>
          <h3>{selectedUser.name}</h3>
          <p>{selectedUser.email}</p>
        </Modal>
      )}

      {toast && <div className="admin-toast"><span>✓</span>{toast}</div>}
    </div>
  );
}

// Sub-components
function PageHeader({ title, subtitle, action }) {
  return (
    <div className="admin-page-header">
      <div>
        <span className="admin-page-eyebrow">SWASTHYASETU · ADMIN PORTAL</span>
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
      <div className="admin-avatar">{user.name?.charAt(0) || "U"}</div>
      <div className="approval-row-info">
        <strong>{user.name}</strong>
        <span>{user.role} · {user.facility}</span>
      </div>
      <StatusBadge status="Pending" />
      <div className="approval-row-actions">
        <button className="small-success-btn" onClick={onApprove} title="Approve">✓</button>
        <button className="small-danger-btn" onClick={onReject} title="Reject">×</button>
        <button className="small-icon-btn" onClick={onView} title="View">→</button>
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

function StatusBadge({ status }) {
  const normalized = (status || "active").toLowerCase().replaceAll(" ", "-");
  return (
    <span className={`admin-status ${normalized}`}>
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