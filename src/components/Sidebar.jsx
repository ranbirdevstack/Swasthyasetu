function Sidebar({
  role = "patient",
  activePage = "dashboard",
  onNavigate,
  onExit,
  isOpen = false,
  onClose,
  unreadCount = 0,
}) {
  const menuItems = {
    patient: [
      { id: "dashboard", label: "Overview", icon: "⌂" },
      { id: "facilities", label: "Find Facility", icon: "⌖" },
      { id: "triage", label: "Digital Triage", icon: "✚" },
      { id: "referrals", label: "My Referrals", icon: "↗" },
      { id: "medicines", label: "Medicine & Diagnostics", icon: "▣" },
      { id: "followup", label: "Follow-up", icon: "♥" },
    ],
    worker: [
      { id: "dashboard", label: "Dashboard", icon: "⌂" },
      { id: "patients", label: "Patients", icon: "♙" },
      { id: "triage", label: "Digital Triage", icon: "✚" },
      { id: "referrals", label: "Referrals", icon: "↗" },
      { id: "followup", label: "Follow-up", icon: "♥" },
      { id: "facilities", label: "Facility Services", icon: "▣" },
    ],
    doctor: [
      { id: "dashboard", label: "Dashboard", icon: "⌂" },
      { id: "queue", label: "Consultation Queue", icon: "▤" },
      { id: "referrals", label: "Referrals", icon: "↗" },
      { id: "patients", label: "Patient Records", icon: "♙" },
      { id: "followup", label: "Follow-up", icon: "♥" },
    ],
    admin: [
      { id: "dashboard", label: "Dashboard", icon: "⌂" },
      { id: "facilities", label: "Facilities", icon: "⌖" },
      { id: "referrals", label: "Referral Analytics", icon: "↗" },
      { id: "gaps", label: "Care Gaps", icon: "⚠" },
      { id: "quality", label: "Quality Dashboard", icon: "◈" },
    ],
  };

  const items = menuItems[role] || [];

  const handleNav = (id) => {
    if (onNavigate) onNavigate(id);
    if (onClose) onClose();
  };

  return (
    <>
      <style>{`
        .dashboard-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 265px;
          height: 100vh;
          background: #ffffff;
          border-right: 1px solid #e7edf3;
          display: flex;
          flex-direction: column;
          z-index: 100;
          overflow-y: auto;
          box-sizing: border-box;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif;
        }

        .dashboard-sidebar * {
          box-sizing: border-box;
        }

        .sidebar-brand {
          height: 82px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #edf1f5;
          flex-shrink: 0;
        }

        .sidebar-logo-button {
          border: 0;
          background: transparent;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          padding: 0;
          text-align: left;
        }

        .sidebar-logo {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #087f8c, #10a6a8);
          color: #ffffff;
          font-size: 22px;
          font-weight: 800;
          box-shadow: 0 6px 16px rgba(8, 127, 140, 0.22);
          flex-shrink: 0;
        }

        .sidebar-logo-button strong {
          display: block;
          font-size: 19px;
          color: #17344c;
          line-height: 1.2;
        }

        .sidebar-logo-button span {
          display: block;
          margin-top: 2px;
          font-size: 11px;
          color: #8291a3;
          font-weight: 600;
        }

        .sidebar-close-btn {
          display: none;
          border: 0;
          background: #f1f5f9;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          color: #475569;
          font-size: 18px;
          cursor: pointer;
          align-items: center;
          justify-content: center;
        }

        .sidebar-section-title {
          padding: 16px 20px 8px;
          color: #9aa7b5;
          font-size: 11px;
          letter-spacing: 0.9px;
          font-weight: 800;
        }

        .sidebar-navigation {
          padding: 0 12px;
          flex: 1;
        }

        .sidebar-item {
          width: 100%;
          min-height: 44px;
          border: 0;
          background: transparent;
          border-radius: 10px;
          color: #627286;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          margin-bottom: 4px;
          cursor: pointer;
          text-align: left;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .sidebar-item:hover {
          background: #f1f7f8;
          color: #087f8c;
        }

        .sidebar-item.active {
          background: #e5f4f5;
          color: #087f8c;
          font-weight: 700;
        }

        .sidebar-item-icon {
          width: 20px;
          text-align: center;
          font-size: 18px;
          line-height: 1;
        }

        .sidebar-item-label {
          flex: 1;
        }

        .sidebar-unread-badge {
          margin-left: auto;
          margin-right: 6px;
          background: #ef4444;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 9999px;
          line-height: 1.2;
        }

        .sidebar-active-indicator {
          font-size: 18px;
          color: #087f8c;
          font-weight: 700;
        }

        .sidebar-bottom {
          padding: 14px 14px 20px;
          border-top: 1px solid #edf1f5;
          flex-shrink: 0;
        }

        .sidebar-help {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 12px;
          margin-bottom: 12px;
        }

        .sidebar-help-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .sidebar-help strong {
          display: block;
          font-size: 13px;
          color: #17344c;
        }

        .sidebar-help p {
          margin: 2px 0 6px;
          font-size: 11px;
          color: #64748b;
          line-height: 1.4;
        }

        .sidebar-help button {
          border: 0;
          background: transparent;
          color: #087f8c;
          padding: 0;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .sidebar-help button:hover {
          text-decoration: underline;
        }

        .sidebar-exit {
          width: 100%;
          border: 0;
          background: transparent;
          color: #d55c5c;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          text-align: left;
          transition: background 0.2s ease;
        }

        .sidebar-exit:hover {
          background: #fff1f1;
        }

        .sidebar-overlay {
          display: none;
        }

        @media (max-width: 900px) {
          .dashboard-sidebar {
            width: 285px;
            max-width: 88vw;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            z-index: 2000;
            visibility: hidden;
          }

          .dashboard-sidebar.mobile-sidebar-open {
            transform: translateX(0);
            visibility: visible;
          }

          .sidebar-close-btn {
            display: flex;
          }

          .sidebar-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.45);
            backdrop-filter: blur(2px);
            z-index: 1990;
            cursor: pointer;
          }
        }
      `}</style>

      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`dashboard-sidebar ${isOpen ? "mobile-sidebar-open" : ""}`}
      >
        <div className="sidebar-brand">
          <button
            type="button"
            className="sidebar-logo-button"
            onClick={() => handleNav("dashboard")}
          >
            <div className="sidebar-logo" aria-hidden="true">
              ✚
            </div>
            <div>
              <strong>SwasthyaSetu</strong>
              <span>Connected Care</span>
            </div>
          </button>

          {onClose && (
            <button
              type="button"
              className="sidebar-close-btn"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              ✕
            </button>
          )}
        </div>

        <div className="sidebar-section-title">MAIN MENU</div>

        <nav className="sidebar-navigation">
          {items.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-item ${isActive ? "active" : ""}`}
                onClick={() => handleNav(item.id)}
              >
                <span className="sidebar-item-icon" aria-hidden="true">
                  {item.icon}
                </span>

                <span className="sidebar-item-label">{item.label}</span>

                {item.id === "referrals" && unreadCount > 0 && (
                  <b className="sidebar-unread-badge">{unreadCount}</b>
                )}

                {isActive && (
                  <span className="sidebar-active-indicator" aria-hidden="true">
                    ›
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <div className="sidebar-help-icon" aria-hidden="true">
              ?
            </div>
            <div>
              <strong>Need help?</strong>
              <p>Contact your support team.</p>
              <button
                type="button"
                onClick={() => alert("Contacting rural support desk...")}
              >
                Get Support →
              </button>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-exit"
            onClick={onExit}
          >
            <span aria-hidden="true">↩</span>
            Exit Portal
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;