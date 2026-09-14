function Footer({ onGetStarted }) {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style>{`
        .site-footer {
          width: 100%;
          background: #0f172a;
          color: #94a3b8;
          padding: 64px 24px 32px;
          border-top: 1px solid #1e293b;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif;
          box-sizing: border-box;
        }

        .site-footer * {
          box-sizing: border-box;
        }

        .footer-main {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
          padding-bottom: 48px;
          border-bottom: 1px solid #1e293b;
        }

        .footer-brand {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .footer-logo {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #087f8c, #10a6a8);
          color: #ffffff;
          font-size: 24px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(8, 127, 140, 0.35);
        }

        .footer-brand h3 {
          margin: 0 0 8px;
          font-size: 20px;
          color: #f8fafc;
          font-weight: 700;
        }

        .footer-brand p {
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
          color: #94a3b8;
        }

        .footer-column {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-column h4 {
          margin: 0 0 4px;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #f8fafc;
        }

        .footer-column a {
          color: #94a3b8;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s ease;
        }

        .footer-column a:hover {
          color: #14b8a6;
        }

        .footer-column span {
          font-size: 14px;
          color: #64748b;
        }

        .footer-column button {
          align-self: flex-start;
          background: transparent;
          border: 0;
          padding: 0;
          color: #14b8a6;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .footer-column button:hover {
          opacity: 0.8;
          text-decoration: underline;
        }

        .footer-bottom {
          max-width: 1200px;
          margin: 28px auto 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 13px;
          color: #64748b;
        }

        .footer-bottom p {
          margin: 0;
        }

        .footer-bottom-badges {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        @media (max-width: 900px) {
          .footer-main {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }

          .footer-brand {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 540px) {
          .site-footer {
            padding: 48px 16px 24px;
          }

          .footer-main {
            grid-template-columns: 1fr;
            gap: 28px;
          }

          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo" aria-hidden="true">
              ✚
            </div>
            <div>
              <h3>SwasthyaSetu</h3>
              <p>
                Smart Rural Healthcare Access
                <br />
                & Care Continuity Platform.
              </p>
            </div>
          </div>

          <div className="footer-column">
            <h4>Platform</h4>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#impact">Impact</a>
            <button
              type="button"
              onClick={onGetStarted}
              aria-label="Get started with SwasthyaSetu"
            >
              Get Started →
            </button>
          </div>

          <div className="footer-column">
            <h4>Care Network</h4>
            <span>Patients</span>
            <span>Health Workers</span>
            <span>Doctors</span>
            <span>Administrators</span>
          </div>

          <div className="footer-column">
            <h4>Principles</h4>
            <span>Secure by design</span>
            <span>Role-based access</span>
            <span>Multilingual ready</span>
            <span>Low-connectivity ready</span>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} SwasthyaSetu. All rights reserved.</p>

          <div className="footer-bottom-badges">
            <span>Secure</span>
            <span>•</span>
            <span>Accessible</span>
            <span>•</span>
            <span>Care-focused</span>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;