import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RoleSelection() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");

  const roles = [
    {
      id: "patient",
      icon: "👤",
      title: "Patient",
      description:
        "Find healthcare facilities, manage appointments, track referrals and follow-ups.",
      color: "blue",
    },
    {
      id: "worker", // Aligned with App.jsx / ProtectedRoute ("worker")
      icon: "🩺",
      title: "Health Worker",
      description:
        "Register patients, assist with triage, referrals and follow-up activities.",
      color: "green",
    },
    {
      id: "doctor",
      icon: "⚕️",
      title: "Doctor",
      description:
        "Review patient information, consultations, referrals and care requirements.",
      color: "purple",
    },
    {
      id: "admin",
      icon: "📊",
      title: "Administrator",
      description:
        "Monitor facilities, referral performance, care gaps and healthcare analytics.",
      color: "orange",
    },
  ];

  const handleContinue = () => {
    if (!selectedRole) return;

    // Persist under the standardized keys used by App.jsx
    localStorage.setItem("swasthya_role", selectedRole);
    localStorage.setItem("userRole", selectedRole);

    // Notify App.jsx listener immediately
    window.dispatchEvent(new Event("swasthya_role_updated"));

    navigate(`/login?role=${selectedRole}`);
  };

  return (
    <div className="role-page">
      <div className="role-background"></div>

      <div className="role-container">
        <div className="role-header">
          <button
            className="back-button"
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </button>

          <div className="role-brand">
            <div className="brand-icon">+</div>
            <span>SwasthyaSetu</span>
          </div>
        </div>

        <div className="role-content">
          <div className="role-intro">
            <span className="section-badge">WELCOME TO SWASTHYASETU</span>

            <h1>
              Choose Your <span>Role</span>
            </h1>

            <p>
              Select your role to access a healthcare experience designed
              specifically for your needs.
            </p>
          </div>

          <div className="roles-grid">
            {roles.map((role) => (
              <button
                key={role.id}
                className={`role-card ${
                  selectedRole === role.id ? "selected" : ""
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <div className={`role-icon ${role.color}`}>
                  {role.icon}
                </div>

                <div className="role-card-content">
                  <h2>{role.title}</h2>

                  <p>{role.description}</p>

                  <span className="role-select">
                    {selectedRole === role.id
                      ? "Selected ✓"
                      : "Select Role →"}
                  </span>
                </div>

                <div className="selection-indicator">
                  {selectedRole === role.id && "✓"}
                </div>
              </button>
            ))}
          </div>

          <div className="role-action">
            <button
              className={`continue-button ${
                selectedRole ? "active" : ""
              }`}
              onClick={handleContinue}
              disabled={!selectedRole}
            >
              Continue
              <span>→</span>
            </button>

            {!selectedRole && (
              <p className="selection-hint">
                Please select a role to continue
              </p>
            )}
          </div>
        </div>

        <div className="role-footer">
          <span>© 2026 SwasthyaSetu</span>
          <span>Smart Rural Healthcare Access & Care Continuity</span>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;