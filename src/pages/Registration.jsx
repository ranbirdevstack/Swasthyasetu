import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosClient.js";
import "./Registration.css";

function Registration() {
  const navigate = useNavigate();
  const location = useLocation();

  /* =========================================================
     GET ROLE FROM URL
  ========================================================= */

  const params = new URLSearchParams(location.search);
  const rawRole = params.get("role");
  // Normalize "health-worker" or "worker" to standard key
  const role = rawRole === "worker" ? "health-worker" : rawRole;

  /* =========================================================
     ROLE NAMES
  ========================================================= */

  const roleNames = {
    patient: "Patient",
    doctor: "Doctor",
    "health-worker": "Health Worker",
    admin: "Administrator",
  };

  const currentRole =
    roleNames[role] || "Healthcare User";

  /* =========================================================
     STATES
  ========================================================= */

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* =========================================================
     FORM
  ========================================================= */

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    // Patient
    dob: "",
    gender: "",
    address: "",

    // Doctor
    medicalRegistrationNo: "",
    specialization: "",
    qualification: "",
    experience: "",
    facility: "",

    // Health Worker
    workerId: "",
    workerQualification: "",
    workerExperience: "",

    // Admin
    department: "",
    adminCode: "",
  });

  /* =========================================================
     ROLE DESCRIPTION
  ========================================================= */

  const roleDescription = useMemo(() => {
    switch (role) {
      case "patient":
        return (
          "Create your patient account to access healthcare " +
          "services and manage your care."
        );

      case "doctor":
        return (
          "Register as a doctor. Your account will remain " +
          "pending until an administrator approves it."
        );

      case "health-worker":
        return (
          "Register as a health worker. Your account will " +
          "remain pending until an administrator approves it."
        );

      case "admin":
        return (
          "Create an administrator account for authorized " +
          "SwasthyaSetu network management."
        );

      default:
        return (
          "Please select a valid role before registration."
        );
    }
  }, [role]);

  /* =========================================================
     GO BACK
  ========================================================= */

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/roles");
    }
  };

  /* =========================================================
     FIELD UPDATE
  ========================================================= */

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
    setSuccess("");
  };

  /* =========================================================
     VALIDATION
  ========================================================= */

  const validateForm = () => {
    if (!roleNames[role]) {
      return "Please select a valid role.";
    }

    if (!form.name.trim()) {
      return "Please enter your full name.";
    }

    if (form.name.trim().length < 3) {
      return "Full name must contain at least 3 characters.";
    }

   
   

    if (!form.phone.trim()) {
      return "Please enter your mobile number.";
    }

    const cleanPhone =
      form.phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      return "Please enter a valid 10-digit mobile number.";
    }

    if (!form.password) {
      return "Please enter a password.";
    }

    if (form.password.length < 6) {
      return "Password must contain at least 6 characters.";
    }

    if (!form.confirmPassword) {
      return "Please confirm your password.";
    }

    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }

    /* =====================================================
       PATIENT
    ===================================================== */

    if (role === "patient") {
      if (!form.dob) {
        return "Please select your date of birth.";
      }

      if (!form.gender) {
        return "Please select your gender.";
      }

      if (!form.address.trim()) {
        return "Please enter your address.";
      }
    }

    /* =====================================================
       DOCTOR
    ===================================================== */

    if (role === "doctor") {
      if (!form.medicalRegistrationNo.trim()) {
        return (
          "Please enter your medical registration number."
        );
      }

      if (!form.specialization.trim()) {
        return "Please enter your specialization.";
      }

      if (!form.qualification.trim()) {
        return "Please enter your qualification.";
      }

      if (!form.experience.trim()) {
        return "Please enter your experience.";
      }

      if (!form.facility.trim()) {
        return "Please enter your healthcare facility.";
      }
    }

    /* =====================================================
       HEALTH WORKER
    ===================================================== */

    if (role === "health-worker") {
      if (!form.workerId.trim()) {
        return "Please enter your worker ID.";
      }

      if (!form.workerQualification.trim()) {
        return "Please enter your qualification.";
      }

      if (!form.workerExperience.trim()) {
        return "Please enter your experience.";
      }

      if (!form.facility.trim()) {
        return "Please enter your healthcare facility.";
      }
    }

    /* =====================================================
       ADMIN
    ===================================================== */

    if (role === "admin") {
      if (!form.department.trim()) {
        return "Please enter your department.";
      }

      if (!form.adminCode.trim()) {
        return "Please enter the admin authorization code.";
      }
    }

    return "";
  };


/* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    const cleanPhone = form.phone.replace(/\D/g, "");

    const payload = {
      role: role === "health-worker" ? "worker" : role,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: cleanPhone,
      password: form.password,

      // Role-specific payload details
      dob: form.dob,
      gender: form.gender,
      address: form.address.trim(),

      medicalRegistrationNo: form.medicalRegistrationNo.trim(),
      specialization: form.specialization.trim(),
      qualification: form.qualification.trim(),
      experience: form.experience.trim(),
      facility: form.facility.trim(),

      workerId: form.workerId.trim(),
      workerQualification: form.workerQualification.trim(),
      workerExperience: form.workerExperience.trim(),

      department: form.department.trim(),
      adminCode: form.adminCode.trim(),

      status: role === "patient" ? "Active" : "Pending",
      registeredAt: new Date().toISOString(),
    };

    let registrationSuccessful = false;

    try {
      // 1. Try Backend Registration
      const response = await api.post("/auth/register", payload);
      const { token, user } = response.data || {};

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("userRole", user?.role || payload.role);
        localStorage.setItem("userName", user?.name || payload.name);
      }
      registrationSuccessful = true;
    } catch (apiError) {
      // 2. Fallback to LocalStorage for offline/demo operation & Mock Store sync
      const savedData = localStorage.getItem("swasthyasetu_registrations");
      const existingRegistrations = savedData ? JSON.parse(savedData) : [];

      const duplicate = existingRegistrations.find(
        (item) =>
          item.email?.toLowerCase() === payload.email ||
          item.phone === payload.phone
      );

      if (duplicate) {
        setSubmitting(false);
        setError("An account with this email or mobile number already exists.");
        return;
      }

      const newRegistration = { ...payload, id: Date.now() };
      existingRegistrations.push(newRegistration);
      localStorage.setItem(
        "swasthyasetu_registrations",
        JSON.stringify(existingRegistrations)
      );

      // Sync into offline mock users so login immediately recognizes credentials
      try {
        const mockUsersStorage = localStorage.getItem("swasthya_mock_users");
        let mockUsersList = mockUsersStorage ? JSON.parse(mockUsersStorage) : [];
        
        // Check if already in mock users
        const mockDuplicate = mockUsersList.find(
          (u) => u.email.toLowerCase() === payload.email
        );
        if (!mockDuplicate) {
          mockUsersList.push({
            email: payload.email,
            phone: payload.phone,
            password: payload.password,
            role: payload.role,
            name: payload.name,
          });
          localStorage.setItem("swasthya_mock_users", JSON.stringify(mockUsersList));
        }
      } catch (mockErr) {
        console.warn("Failed syncing new registration to mock users storage", mockErr);
      }

      registrationSuccessful = true;
    } finally {
      setSubmitting(false);
    }

    if (!registrationSuccessful) return;

    // Role-based post-registration feedback & routing
    if (role === "patient") {
      setSuccess("Registration successful. Redirecting to your dashboard...");
      // Save minimal active session info for immediate dashboard load
      localStorage.setItem("swasthya_user", JSON.stringify(payload));
      localStorage.setItem("swasthya_role", "patient");
      localStorage.setItem("userName", payload.name);
      setTimeout(() => {
        navigate("/patient/dashboard");
      }, 1000);
      return;
    }

    if (role === "doctor") {
      setSuccess("Registration submitted successfully. Your doctor account is pending admin approval.");
      resetForm();
      return;
    }

    if (role === "health-worker") {
      setSuccess("Registration submitted successfully. Your health worker account is pending admin approval.");
      resetForm();
      return;
    }

    if (role === "admin") {
      setSuccess("Administrator registration submitted successfully. Your account requires authorized approval.");
      resetForm();
    }
  };

  /* =========================================================
     RESET FORM
  ========================================================= */

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",

      dob: "",
      gender: "",
      address: "",

      medicalRegistrationNo: "",
      specialization: "",
      qualification: "",
      experience: "",
      facility: "",

      workerId: "",
      workerQualification: "",
      workerExperience: "",

      department: "",
      adminCode: "",
    });

    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  /* =========================================================
     INVALID ROLE
  ========================================================= */

  if (!roleNames[role]) {
    return (
      <div className="register-invalid-page">

        <div className="register-invalid-card">

          <div className="register-brand-icon">
            ✚
          </div>

          <h2>
            Invalid Registration Role
          </h2>

          <p>
            Please select Patient, Doctor,
            Health Worker or Administrator
            before creating an account.
          </p>

          <button
            type="button"
            className="register-primary-btn"
            onClick={() => navigate("/roles")}
          >
            ← Choose Role
          </button>

        </div>

      </div>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="register-page">

      {/* =====================================================
          LEFT SECTION
      ===================================================== */}

      <section className="register-left">

        <div className="register-left-overlay"></div>

        <div className="register-left-content">

          {/* GO BACK */}

          <button
            type="button"
            className="register-back-btn"
            onClick={handleBack}
            title="Go Back"
          >
            ← Go Back
          </button>

          {/* BRAND */}

          <div className="register-brand">

            <div className="register-brand-icon">
              ✚
            </div>

            <div>

              <strong>
                SwasthyaSetu
              </strong>

              <span>
                Smart Rural Healthcare
              </span>

            </div>

          </div>

          {/* INTRO */}

          <div className="register-intro">

            <span>
              CREATE YOUR ACCOUNT
            </span>

            <h1>

              Join the

              <br />

              <strong>
                SwasthyaSetu
              </strong>

              <br />

              Healthcare Network.

            </h1>

            <p>
              {roleDescription}
            </p>

          </div>

          {/* POINTS */}

          <div className="register-points">

            <div>

              <span>
                ✓
              </span>

              <p>
                Secure healthcare access
              </p>

            </div>

            <div>

              <span>
                ✓
              </span>

              <p>
                Connected care continuity
              </p>

            </div>

            <div>

              <span>
                ✓
              </span>

              <p>
                Rural healthcare network
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          RIGHT SECTION
      ===================================================== */}

      <section className="register-right">

        <div className="register-card">

          {/* MOBILE BRAND */}

          <div className="register-mobile-brand">

            <div className="register-brand-icon">
              ✚
            </div>

            <strong>
              SwasthyaSetu
            </strong>

          </div>

          {/* HEADER */}

          <div className="register-header">

            <span className="register-role-badge">
              {currentRole}
            </span>

            <h2>
              Create Account
            </h2>

            <p>
              Enter your details to create
              your SwasthyaSetu account.
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="register-message error">

              <span>
                !
              </span>

              <div>
                {error}
              </div>

            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="register-message success">

              <span>
                ✓
              </span>

              <div>
                {success}
              </div>

            </div>
          )}

          {/* FORM */}

          <form onSubmit={handleSubmit}>

            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}

            <div className="register-section-title">
              Personal Information
            </div>

            <div className="register-form-grid">

              <FormInput
                label="Full Name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(event) =>
                  updateField(
                    "name",
                    event.target.value
                  )
                }
              />

              <FormInput
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(event) =>
                  updateField(
                    "email",
                    event.target.value
                  )
                }
              />

              <FormInput
                label="Mobile Number"
                type="tel"
                placeholder="10-digit mobile number"
                value={form.phone}
                onChange={(event) =>
                  updateField(
                    "phone",
                    event.target.value
                  )
                }
              />

              {/* PATIENT */}

              {role === "patient" && (
                <>
                  <FormInput
                    label="Date of Birth"
                    type="date"
                    value={form.dob}
                    onChange={(event) =>
                      updateField(
                        "dob",
                        event.target.value
                      )
                    }
                  />

                  <FormSelect
                    label="Gender"
                    value={form.gender}
                    onChange={(event) =>
                      updateField(
                        "gender",
                        event.target.value
                      )
                    }
                    options={[
                      "Male",
                      "Female",
                      "Other",
                    ]}
                    placeholder="Select gender"
                  />

                  <div className="register-full-field">

                    <FormTextarea
                      label="Address"
                      placeholder="Enter your address"
                      value={form.address}
                      onChange={(event) =>
                        updateField(
                          "address",
                          event.target.value
                        )
                      }
                    />

                  </div>
                </>
              )}

            </div>

            {/* =================================================
                DOCTOR
            ================================================= */}

            {role === "doctor" && (
              <>
                <div className="register-section-title">
                  Professional Information
                </div>

                <div className="register-form-grid">

                  <FormInput
                    label="Medical Registration Number"
                    placeholder="Enter registration number"
                    value={
                      form.medicalRegistrationNo
                    }
                    onChange={(event) =>
                      updateField(
                        "medicalRegistrationNo",
                        event.target.value
                      )
                    }
                  />

                  <FormInput
                    label="Specialization"
                    placeholder="e.g. General Medicine"
                    value={
                      form.specialization
                    }
                    onChange={(event) =>
                      updateField(
                        "specialization",
                        event.target.value
                      )
                    }
                  />

                  <FormInput
                    label="Qualification"
                    placeholder="e.g. MBBS"
                    value={
                      form.qualification
                    }
                    onChange={(event) =>
                      updateField(
                        "qualification",
                        event.target.value
                      )
                    }
                  />

                  <FormInput
                    label="Experience"
                    placeholder="e.g. 8 years"
                    value={
                      form.experience
                    }
                    onChange={(event) =>
                      updateField(
                        "experience",
                        event.target.value
                      )
                    }
                  />

                  <div className="register-full-field">

                    <FormInput
                      label="Healthcare Facility"
                      placeholder="Enter your healthcare facility"
                      value={form.facility}
                      onChange={(event) =>
                        updateField(
                          "facility",
                          event.target.value
                        )
                      }
                    />

                  </div>

                </div>
              </>
            )}

            {/* =================================================
                HEALTH WORKER
            ================================================= */}

            {role === "health-worker" && (
              <>
                <div className="register-section-title">
                  Professional Information
                </div>

                <div className="register-form-grid">

                  <FormInput
                    label="Worker ID"
                    placeholder="Enter worker ID"
                    value={form.workerId}
                    onChange={(event) =>
                      updateField(
                        "workerId",
                        event.target.value
                      )
                    }
                  />

                  <FormInput
                    label="Qualification"
                    placeholder="Enter qualification"
                    value={
                      form.workerQualification
                    }
                    onChange={(event) =>
                      updateField(
                        "workerQualification",
                        event.target.value
                      )
                    }
                  />

                  <FormInput
                    label="Experience"
                    placeholder="e.g. 5 years"
                    value={
                      form.workerExperience
                    }
                    onChange={(event) =>
                      updateField(
                        "workerExperience",
                        event.target.value
                      )
                    }
                  />

                  <div className="register-full-field">

                    <FormInput
                      label="Healthcare Facility"
                      placeholder="Enter your facility"
                      value={form.facility}
                      onChange={(event) =>
                        updateField(
                          "facility",
                          event.target.value
                        )
                      }
                    />

                  </div>

                </div>
              </>
            )}

            {/* =================================================
                ADMIN
            ================================================= */}

            {role === "admin" && (
              <>
                <div className="register-section-title">
                  Administrator Information
                </div>

                <div className="register-form-grid">

                  <FormInput
                    label="Department"
                    placeholder="Enter department"
                    value={form.department}
                    onChange={(event) =>
                      updateField(
                        "department",
                        event.target.value
                      )
                    }
                  />

                  <FormInput
                    label="Admin Authorization Code"
                    placeholder="Enter authorized admin code"
                    value={form.adminCode}
                    onChange={(event) =>
                      updateField(
                        "adminCode",
                        event.target.value
                      )
                    }
                  />

                </div>
              </>
            )}

            {/* =================================================
                SECURITY
            ================================================= */}

            <div className="register-section-title">
              Security
            </div>

            <div className="register-form-grid">

              <PasswordInput
                label="Password"
                placeholder="Create a password"
                value={form.password}
                show={showPassword}
                onToggle={() =>
                  setShowPassword(
                    (previous) =>
                      !previous
                  )
                }
                onChange={(event) =>
                  updateField(
                    "password",
                    event.target.value
                  )
                }
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                show={showConfirmPassword}
                onToggle={() =>
                  setShowConfirmPassword(
                    (previous) =>
                      !previous
                  )
                }
                onChange={(event) =>
                  updateField(
                    "confirmPassword",
                    event.target.value
                  )
                }
              />

            </div>

            {/* APPROVAL NOTE */}

            <div className="register-approval-note">

              <span>
                🔐
              </span>

              <div>

                {role === "patient" && (
                  <>
                    Your patient account will be
                    activated after successful
                    registration.
                  </>
                )}

                {role === "doctor" && (
                  <>
                    Your doctor registration will
                    remain pending until an
                    administrator reviews and
                    approves your account.
                  </>
                )}

                {role === "health-worker" && (
                  <>
                    Your health worker registration
                    will remain pending until an
                    administrator reviews and
                    approves your account.
                  </>
                )}

                {role === "admin" && (
                  <>
                    Administrator access is restricted
                    and requires authorized approval.
                  </>
                )}

              </div>

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="register-submit-btn"
              disabled={submitting}
            >

              {submitting
                ? "Creating Account..."
                : "Create Account"}

              {!submitting && (
                <span>
                  →
                </span>
              )}

            </button>

          </form>

          {/* LOGIN */}

          <div className="register-login-text">

            <span>
              Already have an account?
            </span>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/login?role=${role}`
                )
              }
            >
              Sign In
            </button>

          </div>

        </div>

        {/* FOOTER */}

        <div className="register-footer">

          <span>
            © 2026 SwasthyaSetu
          </span>

          <span>
            Smart Rural Healthcare Access &
            Care Continuity
          </span>

        </div>

      </section>

    </div>
  );
}

/* =========================================================
   FORM INPUT
========================================================= */

function FormInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="register-field">

      <label>
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />

    </div>
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

function FormTextarea({
  label,
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="register-field">

      <label>
        {label}
      </label>

      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />

    </div>
  );
}

/* =========================================================
   SELECT
========================================================= */

function FormSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
}) {
  return (
    <div className="register-field">

      <label>
        {label}
      </label>

      <select
        value={value}
        onChange={onChange}
      >

        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}

/* =========================================================
   Password
========================================================= */

function PasswordInput({
  label,
  placeholder,
  value,
  show,
  onToggle,
  onChange,
}) {
  return (
    <div className="register-field">

      <label>
        {label}
      </label>

      <div className="register-password-box">

        <input
          type={
            show
              ? "text"
              : "password"
          }
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />

        <button
          type="button"
          onClick={onToggle}
        >
          {show ? "Hide" : "Show"}
        </button>

      </div>

    </div>
  );
}

export default Registration;