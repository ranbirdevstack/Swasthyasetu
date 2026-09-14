import { Outlet, Link } from "react-router-dom";
import "./AuthLayout.css";

function AuthLayout() {
  return (
    <div className="auth-layout-container">
      {/* Background Decorative Graphic Elements */}
      <div className="auth-bg-circle circle-top-left" />
      <div className="auth-bg-circle circle-bottom-right" />

      {/* Main Authentication Card Wrapper */}
      <div className="auth-card-wrapper">
        {/* Brand Header */}
        <header className="auth-brand-header">
          <Link to="/" className="auth-brand-link">
            <div className="auth-brand-icon">✚</div>
            <div className="auth-brand-text">
              <strong>SwasthyaSetu</strong>
              <span>Connected Rural Health</span>
            </div>
          </Link>
        </header>

        {/* Dynamic Nested Routes (Login, Register, Role Selection) */}
        <main className="auth-card-body">
          <Outlet />
        </main>

        {/* Auth Layout Footer */}
        <footer className="auth-footer">
          <p>© {new Date().getFullYear()} SwasthyaSetu. All rights reserved.</p>
          <div className="auth-footer-links">
            <a href="#privacy">Privacy Policy</a>
            <span>•</span>
            <a href="#terms">Terms of Service</a>
            <span>•</span>
            <a href="#support">Emergency Help</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default AuthLayout;