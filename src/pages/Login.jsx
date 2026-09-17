import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../api/axiosClient.js";
import ForgotPasswordModal from "../components/ForgotPasswordModal.jsx";

// Initial mock database for offline authentication & testing
const DEFAULT_MOCK_USERS = [
  {
    email: "shivam@example.com",
    phone: "9876543210",
    password: "password123",
    role: "patient",
    name: "Shivam Kumar",
  },
  {
    email: "ravi.worker@swasthyasetu.in",
    phone: "9876543210",
    password: "password123",
    role: "worker",
    name: "Ravi Kumar (ASHA/ANM)",
  },
  {
    email: "dr.sharma@swasthyasetu.in",
    phone: "9876543203",
    password: "password123",
    role: "doctor",
    name: "Dr. Alok Sharma",
  },
  {
    email: "admin@swasthyasetu.in",
    phone: "9876543210",
    password: "password123",
    role: "admin",
    name: "District Admin (Varanasi)",
  },
];

function Login({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();

  /* =========================
      GET ROLE FROM URL
  ========================= */

  const params = new URLSearchParams(location.search);

  const rawRole =
    params.get("role") ||
    localStorage.getItem("swasthya_role") ||
    "patient";

  // Keep role naming consistent throughout the application
  const role = rawRole === "health-worker" ? "worker" : rawRole;

  /* =========================
      LOGIN & MODAL STATES
  ========================= */

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  /* =========================
      MOCK USER STORE
  ========================= */

  const [mockUsers, setMockUsers] = useState(() => {
    try {
      const saved = localStorage.getItem("swasthya_mock_users");

      if (!saved) {
        return DEFAULT_MOCK_USERS;
      }

      const parsed = JSON.parse(saved);

      // Prevent broken localStorage data from crashing login
      if (!Array.isArray(parsed)) {
        return DEFAULT_MOCK_USERS;
      }

      return parsed;
    } catch {
      return DEFAULT_MOCK_USERS;
    }
  });

  /* =========================
      ROLE LABELS
  ========================= */

  const roleNames = {
    patient: "Patient",
    worker: "Health Worker",
    "health-worker": "Health Worker",
    doctor: "Doctor",
    admin: "Administrator",
  };

  const currentRole = roleNames[role] || "Healthcare User";

  /* =========================
      ROUTING MAP
  ========================= */

  const redirectMap = {
    patient: "/patient/dashboard",
    worker: "/worker-dashboard",
    doctor: "/doctor-dashboard",
    admin: "/admin-dashboard",
  };

  /* =========================
      PASSWORD RESET HANDLER
  ========================= */

  const handlePasswordResetSuccess = (newPassword) => {
    const cleanId = identifier.trim().toLowerCase();

    if (!cleanId) {
      setErrorMsg("Please enter your email or mobile number first.");
      return;
    }

    const updatedUsers = mockUsers.map((u) => {
      const userEmail = String(u.email || "").toLowerCase();
      const userPhone = String(u.phone || "");

      const matchesUser =
        u.role === role &&
        (userEmail === cleanId || userPhone === cleanId);

      if (matchesUser) {
        return {
          ...u,
          password: newPassword,
        };
      }

      return u;
    });

    const userWasUpdated = updatedUsers.some((u, index) => {
      return u.password !== mockUsers[index]?.password;
    });

    if (!userWasUpdated) {
      setErrorMsg("Account not found for the selected role.");
      return;
    }

    setMockUsers(updatedUsers);

    localStorage.setItem(
      "swasthya_mock_users",
      JSON.stringify(updatedUsers)
    );

    setPassword(newPassword);
    setErrorMsg("");
    setIsForgotModalOpen(false);
  };

  /* =========================
      REGISTER NAVIGATION
  ========================= */

  const handleRegister = () => {
    navigate(`/registration?role=${role}`);
  };

  /* =========================
      LOGIN SUBMISSION
  ========================= */

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select a role first.");
      navigate("/roles");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const cleanIdentifier = identifier.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanIdentifier || !cleanPassword) {
      setErrorMsg("Please enter your email/mobile number and password.");
      setLoading(false);
      return;
    }

    try {
      /* =========================
          1. CHECK LOCAL MOCK USERS
      ========================= */

      const matchedUser = mockUsers.find((u) => {
        const userEmail = String(u.email || "").toLowerCase();
        const userPhone = String(u.phone || "");

        return (
          u.role === role &&
          (userEmail === cleanIdentifier ||
            userPhone === cleanIdentifier)
        );
      });

      /* =========================
          2. LOCAL USER FOUND
      ========================= */

      if (matchedUser) {
        if (matchedUser.password !== cleanPassword) {
          setErrorMsg("Incorrect username or password.");
          return;
        }

        const sessionUser = {
          email: matchedUser.email,
          phone: matchedUser.phone,
          name: matchedUser.name,
          role: matchedUser.role,
          token: "demo-jwt-token-" + Date.now(),
        };

        localStorage.setItem("token", sessionUser.token);
        localStorage.setItem(
          "swasthya_user",
          JSON.stringify(sessionUser)
        );
        localStorage.setItem("swasthya_role", sessionUser.role);
        localStorage.setItem("userRole", sessionUser.role);
        localStorage.setItem("userName", sessionUser.name);

        if (onLogin) {
          onLogin(sessionUser);
        }

        window.dispatchEvent(new Event("swasthya_role_updated"));

        navigate(redirectMap[sessionUser.role] || "/roles");

        return;
      }

      /* =========================
          3. TRY BACKEND API
      ========================= */

      const response = await apiClient.post("/auth/login", {
        identifier: cleanIdentifier,
        password: cleanPassword,
        role,
      });

      const { token, user } = response.data || {};

      if (!token || !user) {
        setErrorMsg("Invalid login response from server.");
        return;
      }

      const loggedInRole =
        user.role === "health-worker" ? "worker" : user.role;

      // Prevent a backend account from entering another role dashboard
      if (loggedInRole !== role) {
        setErrorMsg("This account does not belong to the selected role.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem(
        "swasthya_user",
        JSON.stringify(user)
      );
      localStorage.setItem("swasthya_role", loggedInRole);
      localStorage.setItem("userRole", loggedInRole);
      localStorage.setItem("userName", user.name || "");

      if (onLogin) {
        onLogin({
          ...user,
          role: loggedInRole,
        });
      }

      window.dispatchEvent(new Event("swasthya_role_updated"));

      navigate(redirectMap[loggedInRole] || "/roles");
    } catch (err) {
      console.error("Login error:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Incorrect username or password.";

      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* =====================================================
          LEFT SECTION
      ===================================================== */}

      <section className="login-left">
        <div className="login-left-overlay"></div>

        <div className="login-left-content">
          <button
            className="change-role-btn"
            onClick={() => navigate("/roles")}
          >
            ← Change Role
          </button>

          <div className="login-brand">
            <div className="login-brand-icon">+</div>
            <span>SwasthyaSetu</span>
          </div>

          <div className="login-introduction">
            <span className="login-small-label">
              SMART RURAL HEALTHCARE
            </span>

            <h1>
              Healthcare
              <br />
              <span>Without Boundaries.</span>
            </h1>

            <p>
              Connecting patients, healthcare workers, doctors and
              healthcare facilities through one intelligent care
              continuity platform.
            </p>
          </div>

          <div className="login-highlights">
            <div className="highlight-item">
              <div>✓</div>
              <span>Connected Healthcare Network</span>
            </div>

            <div className="highlight-item">
              <div>✓</div>
              <span>Smart Facility Recommendation</span>
            </div>

            <div className="highlight-item">
              <div>✓</div>
              <span>Continuous Care & Follow-up</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          RIGHT SECTION
      ===================================================== */}

      <section className="login-right">
        <div className="login-card">
          <div className="mobile-brand">
            <div className="login-brand-icon">+</div>
            <span>SwasthyaSetu</span>
          </div>

          <div className="login-header">
            <span className="selected-role">{currentRole}</span>

            <h2>Welcome Back</h2>

            <p>
              Sign in to continue to your SwasthyaSetu account.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            {errorMsg && (
              <div
                style={{
                  color: "#dc2626",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  padding: "9px 12px",
                  fontSize: "13px",
                  fontWeight: "600",
                  marginBottom: "14px",
                }}
              >
                {errorMsg}
              </div>
            )}

            {/* EMAIL / IDENTIFIER */}

            <div className="input-group">
              <label htmlFor="email">
                Email or Mobile Number
              </label>

              <div className="input-box">
                <span className="field-icon">✉</span>

                <input
                  id="email"
                  type="text"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder="Enter email or mobile number"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div className="input-group">
              <div className="password-heading">
                <label htmlFor="password">Password</label>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg("");
                    setIsForgotModalOpen(true);
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              <div className="input-box">
                <span className="field-icon">🔒</span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* REMEMBER ME */}

            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(e.target.checked)
                }
              />

              <span>Remember me</span>
            </label>

            {/* SIGN IN BUTTON */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
              <span>→</span>
            </button>
          </form>

          {/* REGISTER YOURSELF */}

          <div className="login-register-section">
            <p>Don't have an account?</p>

            <button
              type="button"
              className="register-yourself-btn"
              onClick={handleRegister}
            >
              Register Yourself
            </button>
          </div>

          <div className="login-divider">
            <span>OR</span>
          </div>

          <button
            className="different-role-btn"
            onClick={() => navigate("/roles")}
          >
            Continue with a different role
          </button>

          <div className="security-message">
            🔐 Your healthcare information is protected with secure
            access controls.
          </div>
        </div>

        <div className="login-footer">
          <span>© 2026 SwasthyaSetu</span>
          <span>
            Smart Rural Healthcare Access & Care Continuity
          </span>
        </div>
      </section>

      {/* SELF-SERVICE PASSWORD RECOVERY MODAL */}

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        onPasswordResetSuccess={handlePasswordResetSuccess}
      />
    </div>
  );
}

export default Login;