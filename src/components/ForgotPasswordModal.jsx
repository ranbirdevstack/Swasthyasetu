import { useState } from "react";

function ForgotPasswordModal({ isOpen, onClose, onPasswordResetSuccess }) {
  const [step, setStep] = useState(1); // 1: Identifier Input -> 2: OTP & New Password
  const [identifier, setIdentifier] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Step 1: Generate OTP and display demo SMS alert
  const handleSendOtp = (e) => {
    e.preventDefault();
    setError("");

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier) {
      setError("Please enter your registered Mobile Number or ABHA ID.");
      return;
    }

    // Generate random 6-digit numeric verification token
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setDemoOtp(generated);
    setStep(2);

    // Simulated SMS gateway alert
    alert(
      `[SwasthyaSetu Demo SMS Gateway]\n\n` +
      `Verification OTP for ${cleanIdentifier} is: ${generated}\n` +
      `Valid for 5 minutes. Enter this code on screen to set your new password.`
    );
  };

  // Step 2: Verify OTP code and save new secret password
  const handleResetPassword = (e) => {
    e.preventDefault();
    setError("");

    if (enteredOtp.trim() !== demoOtp) {
      setError("Invalid OTP! Check the 6-digit code shown in the demo alert.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      alert("Password reset successfully! You can now log in with your new credentials.");
      
      if (onPasswordResetSuccess) {
        onPasswordResetSuccess(newPassword);
      }
      handleClose();
    }, 600);
  };

  const handleClose = () => {
    setStep(1);
    setIdentifier("");
    setDemoOtp("");
    setEnteredOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setIsSubmitting(false);
    onClose();
  };

  return (
    <>
      <style>{`
        .forgot-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
        }

        .forgot-modal-card {
          background: #ffffff;
          border-radius: 16px;
          width: 100%;
          max-width: 420px;
          padding: 28px;
          box-shadow: 0 16px 36px rgba(8, 127, 140, 0.18);
          position: relative;
          box-sizing: border-box;
          font-family: 'Inter', system-ui, sans-serif;
          animation: modalFadeIn 0.2s ease-out;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }

        .forgot-modal-close-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          background: #f1f5f9;
          border: none;
          color: #64748b;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .forgot-modal-close-btn:hover {
          background: #e2e8f0;
          color: #1e293b;
        }

        .forgot-modal-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          color: #087f8c;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .forgot-modal-title {
          font-size: 20px;
          font-weight: 800;
          color: #17344c;
          margin: 0 0 8px;
        }

        .forgot-modal-desc {
          font-size: 13px;
          color: #64748b;
          margin: 0 0 20px;
          line-height: 1.45;
        }

        .forgot-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 14px;
          text-align: left;
        }

        .forgot-input-group label {
          font-size: 12px;
          font-weight: 700;
          color: #17344c;
        }

        .forgot-input-group input {
          height: 42px;
          padding: 0 14px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 14px;
          color: #17344c;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }

        .forgot-input-group input:focus {
          border-color: #087f8c;
          box-shadow: 0 0 0 3px rgba(8, 127, 140, 0.12);
        }

        .forgot-error-banner {
          background: #fff0ef;
          color: #d65f5f;
          padding: 9px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 14px;
          border: 1px solid #fecaca;
        }

        .forgot-action-btn {
          width: 100%;
          height: 44px;
          background: #087f8c;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 6px;
          transition: background 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .forgot-action-btn:hover:not(:disabled) {
          background: #066670;
        }

        .forgot-action-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .forgot-back-link {
          width: 100%;
          background: none;
          border: none;
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 10px;
          padding: 4px;
          text-align: center;
        }

        .forgot-back-link:hover {
          color: #17344c;
          text-decoration: underline;
        }
      `}</style>

      <div className="forgot-modal-backdrop" onClick={handleClose}>
        <div className="forgot-modal-card" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="forgot-modal-close-btn"
            onClick={handleClose}
            aria-label="Close"
          >
            ✕
          </button>

          <span className="forgot-modal-badge">Self-Service Account Recovery</span>
          <h3 className="forgot-modal-title">
            {step === 1 ? "Forgot Password" : "Set New Password"}
          </h3>
          <p className="forgot-modal-desc">
            {step === 1
              ? "Enter your registered Mobile Number to receive an OTP verification alert."
              : `Enter the code received for ${identifier} and choose your new password.`}
          </p>

          {error && <div className="forgot-error-banner">{error}</div>}

          {step === 1 ? (
            <form onSubmit={handleSendOtp}>
              <div className="forgot-input-group">
                <label htmlFor="recovery-target">Mobile Number</label>
                <input
                  id="recovery-target"
                  type="text"
                  placeholder="e.g. 9876543210 "
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <button type="submit" className="forgot-action-btn">
                Send OTP (Alert) →
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="forgot-input-group">
                <label htmlFor="recovery-otp">6-Digit Verification Code</label>
                <input
                  id="recovery-otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter code from alert"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="forgot-input-group">
                <label htmlFor="new-pass-field">New Secret Password</label>
                <input
                  id="new-pass-field"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="forgot-input-group">
                <label htmlFor="confirm-pass-field">Confirm New Password</label>
                <input
                  id="confirm-pass-field"
                  type="password"
                  placeholder="Re-type new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="forgot-action-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Password & Return"}
              </button>

              <button
                type="button"
                className="forgot-back-link"
                onClick={() => setStep(1)}
              >
                ← Back to enter Mobile 
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default ForgotPasswordModal;