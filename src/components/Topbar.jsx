function Topbar({
  role = "patient",
  onRoleChange,
  onHome,
  onMenuToggle,
  onNotificationsClick,
  onLanguageChange,
  unreadCount = 0,
  isOnline = true,
  user,
}) {
  const roleNames = {
    patient: "Patient",
    worker: "Health Worker",
    doctor: "Doctor",
    admin: "Administrator",
  };

  const roleName = roleNames[role] || "User";
  const displayName = user?.name || roleName;

  return (
    <>
      <style>{`
        .dashboard-topbar {
          position: sticky;
          top: 0;
          height: 76px;
          padding: 0 28px;
          background: rgba(255, 255, 255, 0.97);
          border-bottom: 1px solid #e8edf2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 80;
          backdrop-filter: blur(12px);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif;
          box-sizing: border-box;
        }

        .dashboard-topbar * {
          box-sizing: border-box;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mobile-home-button,
        .mobile-menu-btn {
          width: 38px;
          height: 38px;
          border: 1px solid #dce5e9;
          border-radius: 10px;
          background: #ffffff;
          color: #34454d;
          font-size: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mobile-home-button:hover,
        .mobile-menu-btn:hover {
          background: #f1f8f6;
          border-color: #b8d9d0;
          color: #087f8c;
        }

        .topbar-title {
          display: flex;
          flex-direction: column;
        }

        .topbar-title span {
          color: #087f8c;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .topbar-title strong {
          color: #17344c;
          font-size: 16px;
          line-height: 1.2;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .connectivity-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          color: #475569;
        }

        .connectivity-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
        }

        .connectivity-dot.offline {
          background: #f59e0b;
        }

        .language-button {
          height: 38px;
          padding: 0 10px;
          border: 1px solid #e2e9ee;
          border-radius: 10px;
          background: #ffffff;
          color: #52677c;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 700;
          transition: all 0.2s ease;
        }

        .language-button:hover {
          background: #f3f8f9;
          border-color: #cfe2e5;
          color: #087f8c;
        }

        .notification-button {
          width: 38px;
          height: 38px;
          position: relative;
          border: 1px solid #e2e9ee;
          border-radius: 10px;
          background: #ffffff;
          color: #52677c;
          cursor: pointer;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .notification-button:hover {
          background: #f3f8f9;
          border-color: #cfe2e5;
        }

        .notification-count {
          position: absolute;
          top: -4px;
          right: -4px;
          min-width: 17px;
          height: 17px;
          padding: 0 4px;
          border-radius: 20px;
          background: #ef4444;
          color: #ffffff;
          border: 2px solid #ffffff;
          font-size: 9px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        .user-profile-button {
          border: 0;
          background: transparent;
          display: flex;
          align-items: center;
          gap: 9px;
          cursor: pointer;
          padding: 4px 6px;
          border-radius: 10px;
          transition: background 0.2s ease;
          text-align: left;
        }

        .user-profile-button:hover {
          background: #f1f7f8;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #d9eff0;
          color: #087f8c;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }

        .user-profile-info strong {
          display: block;
          font-size: 13px;
          color: #17344c;
          line-height: 1.2;
        }

        .user-profile-info small {
          display: block;
          font-size: 11px;
          color: #8291a3;
        }

        .profile-caret {
          color: #8b99a7;
          font-size: 13px;
          margin-left: 2px;
        }

        @media (max-width: 768px) {
          .dashboard-topbar {
            padding: 0 16px;
            height: 64px;
          }

          .connectivity-status {
            display: none;
          }

          .user-profile-info,
          .profile-caret {
            display: none;
          }
        }
      `}</style>

      <header className="dashboard-topbar">
        <div className="topbar-left">
          {onMenuToggle && (
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={onMenuToggle}
              aria-label="Toggle navigation menu"
            >
              ☰
            </button>
          )}

          {onHome && (
            <button
              type="button"
              className="mobile-home-button"
              onClick={onHome}
              aria-label="Back to home"
            >
              ←
            </button>
          )}

          <div className="topbar-title">
            <span>SWASTHYASETU</span>
            <strong>Healthcare Network</strong>
          </div>
        </div>

        <div className="topbar-actions">
          <div className="connectivity-status">
            <span
              className={`connectivity-dot ${!isOnline ? "offline" : ""}`}
              aria-hidden="true"
            />
            <span>{isOnline ? "Low-connectivity ready" : "Offline mode"}</span>
          </div>

          <button
            type="button"
            className="language-button"
            onClick={onLanguageChange}
            title="Change Language"
            aria-label="Change Language"
          >
            <span>अ</span>
            <span>/</span>
            <span>A</span>
          </button>

          <button
            type="button"
            className="notification-button"
            onClick={onNotificationsClick}
            title="Notifications"
            aria-label={`Notifications, ${unreadCount} unread`}
          >
            🔔
            {unreadCount > 0 && (
              <span className="notification-count">{unreadCount}</span>
            )}
          </button>

          <button
            type="button"
            className="user-profile-button"
            onClick={onRoleChange}
            aria-label={`Profile options for ${displayName}`}
          >
            <span className="user-avatar" aria-hidden="true">
              👤
            </span>

            <span className="user-profile-info">
              <strong>{displayName}</strong>
              <small>{roleName}</small>
            </span>

            <span className="profile-caret" aria-hidden="true">
              ▾
            </span>
          </button>
        </div>
      </header>
    </>
  );
}

export default Topbar;