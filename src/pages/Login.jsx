import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../api/axiosClient.js";
import ForgotPasswordModal from "../components/ForgotPasswordModal.jsx";

// =========================================================
// DEFAULT DEMO USERS
// =========================================================
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

  // =========================================================
  // GET ROLE
  // =========================================================
  const params = new URLSearchParams(location.search);

  const rawRole =
    params.get("role") ||
    localStorage.getItem("swasthya_role") ||
    "patient";

  const role = rawRole === "health-worker" ? "worker" : rawRole;

  // =========================================================
  // STATES
  // =========================================================
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  // =========================================================
  // LOAD USERS
  //
  // IMPORTANT:
  // We combine:
  // 1. Default demo users
  // 2. Previously saved mock users
  // 3. Users saved during registration
  //
  // This fixes the old-registration login problem.
  // =========================================================
  const [mockUsers, setMockUsers] = useState(() => {
    try {
      const usersMap = new Map();

      // ---------------------------------------------
      // 1. Add default demo users
      // ---------------------------------------------
      DEFAULT_MOCK_USERS.forEach((user) => {
        const key = `${user.email?.toLowerCase()}-${user.role}`;
        usersMap.set(key, user);
      });

      // ---------------------------------------------
      // 2. Add users from mock storage
      // ---------------------------------------------
      const savedMockUsers = localStorage.getItem("swasthya_mock_users");

      if (savedMockUsers) {
        const parsedMockUsers = JSON.parse(savedMockUsers);

        if (Array.isArray(parsedMockUsers)) {
          parsedMockUsers.forEach((user) => {
            if (!user?.email) return;

            const normalizedUser = {
              ...user,
              email: user.email.trim().toLowerCase(),
              phone: user.phone
                ? String(user.phone).replace(/\D/g, "")
                : "",
              role:
                user.role === "health-worker"
                  ? "worker"
                  : user.role,
            };

            const key = `${normalizedUser.email}-${normalizedUser.role}`;
            usersMap.set(key, normalizedUser);
          });
        }
      }

      // ---------------------------------------------
      // 3. Add users from registration storage
      // ---------------------------------------------
      const savedRegistrations = localStorage.getItem(
        "swasthyasetu_registrations"
      );

      if (savedRegistrations) {
        const registrations = JSON.parse(savedRegistrations);

        if (Array.isArray(registrations)) {
          registrations.forEach((registration) => {
            if (!registration?.email) return;

            const normalizedRegistration = {
              ...registration,
              email: registration.email.trim().toLowerCase(),
              phone: registration.phone
                ? String(registration.phone).replace(/\D/g, "")
                : "",
              role:
                registration.role === "health-worker"
                  ? "worker"
                  : registration.role,
            };

            const key = `${normalizedRegistration.email}-${normalizedRegistration.role}`;

            usersMap.set(key, {
              email: normalizedRegistration.email,
              phone: normalizedRegistration.phone,
              password: normalizedRegistration.password,
              role: normalizedRegistration.role,
              name: normalizedRegistration.name,
              status: normalizedRegistration.status,
            });
          });
        }
      }

      return Array.from(usersMap.values());
    } catch (error) {
      console.error("Failed to load local users:", error);
      return DEFAULT_MOCK_USERS;
    }
  });

  // =========================================================
  // ROLE LABELS
  // =========================================================
  const roleNames = {
    patient: "Patient",
    worker: "Health Worker",
    "health-worker": "Health Worker",
    doctor: "Doctor",
    admin: "Administrator",
  };

  const currentRole = roleNames[role] || "Healthcare User";

  // =========================================================
  // ROUTING MAP
  // =========================================================
  const redirectMap = {
    patient: "/patient/dashboard",
    worker: "/worker-dashboard",
    doctor: "/doctor-dashboard",
    admin: "/admin-dashboard",
  };

  // =========================================================
  // PASSWORD RESET
  // =========================================================
  const handlePasswordResetSuccess = (newPassword) => {
    const cleanId = identifier.trim().toLowerCase();

    const updatedUsers = mockUsers.map((user) => {
      const emailMatch =
        user.email?.toLowerCase() === cleanId;

      const phoneMatch =
        user.phone === cleanId;

      if (emailMatch || phoneMatch) {
        return {
          ...user,
          password: newPassword,
        };
      }

      return user;
    });

    setMockUsers(updatedUsers);

    localStorage.setItem(
      "swasthya_mock_users",
      JSON.stringify(updatedUsers)
    );

    // Also update registration storage
    try {
      const savedRegistrations = localStorage.getItem(
        "swasthyasetu_registrations"
      );

      if (savedRegistrations) {
        const registrations = JSON.parse(savedRegistrations);

        const updatedRegistrations = registrations.map((registration) => {
          const emailMatch =
            registration.email?.toLowerCase() === cleanId;

          const phoneMatch =
            registration.phone === cleanId;

          if (emailMatch || phoneMatch) {
            return {
              ...registration,
              password: newPassword,
            };
          }

          return registration;
        });

        localStorage.setItem(
          "swasthyasetu_registrations",
          JSON.stringify(updatedRegistrations)
        );
      }
    } catch (error) {
      console.warn(
        "Could not update registration password:",
        error
      );
    }

    setPassword(newPassword);
    setErrorMsg("");
  };

  // =========================================================
  // REGISTER
  // =========================================================
  const handleRegister = () => {
    navigate(`/registration?role=${role}`);
  };

  // =========================================================
  // LOGIN
  // =========================================================
  const handleLogin = async (event) => {
    event.preventDefault();

    if (!role) {
      alert("Please select a role first.");
      navigate("/roles");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const cleanIdentifier = identifier.trim().toLowerCase();

    // IMPORTANT:
    // Do NOT trim the password.
    // Passwords must be checked exactly as registered.
    const cleanPassword = password;

    // =======================================================
    // 1. FIND LOCAL USER
    //
    // Check BOTH email and phone.
    // Check the selected role too.
    // =======================================================
    const matchedUser = mockUsers.find((user) => {
      const emailMatch =
        user.email?.trim().toLowerCase() === cleanIdentifier;

      const phoneMatch =
        user.phone &&
        String(user.phone).replace(/\D/g, "") ===
          cleanIdentifier.replace(/\D/g, "");

      const roleMatch =
        user.role === role ||
        (role === "worker" && user.role === "health-worker");

      return (emailMatch || phoneMatch) && roleMatch;
    });

    // =======================================================
    // 2. IF LOCAL USER EXISTS → CHECK PASSWORD
    // =======================================================
    if (matchedUser) {
      if (matchedUser.password !== cleanPassword) {
        setErrorMsg("Incorrect username or password");
        setLoading(false);
        return;
      }

      // =====================================================
      // SUCCESSFUL LOCAL LOGIN
      // =====================================================
      const sessionUser = {
        email: matchedUser.email,
        phone: matchedUser.phone,
        name: matchedUser.name,
        role: matchedUser.role,
        token: "demo-jwt-token-" + Date.now(),
      };

      localStorage.setItem(
        "token",
        sessionUser.token
      );

      localStorage.setItem(
        "swasthya_user",
        JSON.stringify(sessionUser)
      );

      localStorage.setItem(
        "swasthya_role",
        sessionUser.role
      );

      localStorage.setItem(
        "userRole",
        sessionUser.role
      );

      localStorage.setItem(
        "userName",
        sessionUser.name
      );

      // Remember login if selected
      if (rememberMe) {
        localStorage.setItem(
          "swasthya_remembered_identifier",
          cleanIdentifier
        );
      } else {
        localStorage.removeItem(
          "swasthya_remembered_identifier"
        );
      }

      if (onLogin) {
        onLogin(sessionUser);
      }

      window.dispatchEvent(
        new Event("swasthya_role_updated")
      );

      setTimeout(() => {
        setLoading(false);
        navigate(
          redirectMap[sessionUser.role] ||
            redirectMap[role] ||
            "/roles"
        );
      }, 350);

      return;
    }

    // =======================================================
    // 3. USER NOT FOUND LOCALLY
    //
    // Try backend API.
    // =======================================================
    try {
      const response = await apiClient.post(
        "/auth/login",
        {
          identifier: cleanIdentifier,
          password: cleanPassword,
          role,
        }
      );

      const { token, user } = response.data || {};

      if (token) {
        localStorage.setItem(
          "token",
          token
        );
      }

      const sessionUser = {
        ...(user || {}),
        role: user?.role || role,
        email:
          user?.email ||
          (cleanIdentifier.includes("@")
            ? cleanIdentifier
            : ""),
        phone:
          user?.phone ||
          (!cleanIdentifier.includes("@")
            ? cleanIdentifier
            : ""),
        name:
          user?.name ||
          cleanIdentifier,
      };

      localStorage.setItem(
        "swasthya_user",
        JSON.stringify(sessionUser)
      );

      localStorage.setItem(
        "swasthya_role",
        sessionUser.role
      );

      localStorage.setItem(
        "userRole",
        sessionUser.role
      );

      localStorage.setItem(
        "userName",
        sessionUser.name
      );

      if (rememberMe) {
        localStorage.setItem(
          "swasthya_remembered_identifier",
          cleanIdentifier
        );
      }

      if (onLogin) {
        onLogin(sessionUser);
      }

      window.dispatchEvent(
        new Event("swasthya_role_updated")
      );

      setLoading(false);

      navigate(
        redirectMap[sessionUser.role] ||
          redirectMap[role] ||
          "/roles"
      );

      return;
    } catch (error) {
      console.error("Login error:", error);

      setErrorMsg(
        "Incorrect username or password"
      );

      setLoading(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================
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
            <div className="login-brand-icon">
              +
            </div>

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
              Connecting patients, healthcare workers,
              doctors and healthcare facilities through
              one intelligent care continuity platform.
            </p>

          </div>

          <div className="login-highlights">

            <div className="highlight-item">
              <div>✓</div>
              <span>
                Connected Healthcare Network
              </span>
            </div>

            <div className="highlight-item">
              <div>✓</div>
              <span>
                Smart Facility Recommendation
              </span>
            </div>

            <div className="highlight-item">
              <div>✓</div>
              <span>
                Continuous Care & Follow-up
              </span>
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
            <div className="login-brand-icon">
              +
            </div>

            <span>SwasthyaSetu</span>
          </div>

          <div className="login-header">

            <span className="selected-role">
              {currentRole}
            </span>

            <h2>Welcome Back</h2>

            <p>
              Sign in to continue to your
              SwasthyaSetu account.
            </p>

          </div>

          <form onSubmit={handleLogin}>

            {/* ERROR MESSAGE */}
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

            {/* EMAIL / PHONE */}
            <div className="input-group">

              <label htmlFor="email">
                Email or Mobile Number
              </label>

              <div className="input-box">

                <span className="field-icon">
                  ✉
                </span>

                <input
                  id="email"
                  type="text"
                  value={identifier}
                  onChange={(event) =>
                    setIdentifier(event.target.value)
                  }
                  placeholder="Enter email or mobile number"
                  autoComplete="username"
                  required
                />

              </div>
            </div>

            {/* PASSWORD */}
            <div className="input-group">

              <div className="password-heading">

                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setIsForgotModalOpen(true)
                  }
                >
                  Forgot Password?
                </button>

              </div>

              <div className="input-box">

                <span className="field-icon">
                  🔒
                </span>

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>
            </div>

            {/* REMEMBER ME */}
            <label className="remember-me">

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(
                    event.target.checked
                  )
                }
              />

              <span>
                Remember me
              </span>

            </label>

            {/* SIGN IN */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}

              <span>→</span>
            </button>

          </form>

          {/* REGISTER */}
          <div className="login-register-section">

            <p>
              Don't have an account?
            </p>

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
            onClick={() =>
              navigate("/roles")
            }
          >
            Continue with a different role
          </button>

          <div className="security-message">
            🔐 Your healthcare information is
            protected with secure access controls.
          </div>

        </div>

        <div className="login-footer">

          <span>
            © 2026 SwasthyaSetu
          </span>

          <span>
            Smart Rural Healthcare Access & Care
            Continuity
          </span>

        </div>

      </section>

      {/* =====================================================
          FORGOT PASSWORD MODAL
      ===================================================== */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() =>
          setIsForgotModalOpen(false)
        }
        onPasswordResetSuccess={
          handlePasswordResetSuccess
        }
      />

    </div>
  );
}

export default Login;