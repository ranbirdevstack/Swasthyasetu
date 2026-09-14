import { useState } from "react";
import Button from "./Button.jsx";

function Navbar({ onGetStarted }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="site-navbar">

      <div className="navbar-container">

        <a
          href="#top"
          className="navbar-brand"
          onClick={closeMenu}
        >

          <div className="brand-logo">
            <span>✚</span>
          </div>

          <div className="brand-content">
            <strong>
              SwasthyaSetu
            </strong>

            <span>
              Connected Care. Better Health.
            </span>
          </div>

        </a>

        <nav
          className={`navbar-menu ${
            menuOpen ? "navbar-menu-open" : ""
          }`}
        >

          <a
            href="#features"
            onClick={closeMenu}
          >
            Features
          </a>

          <a
            href="#how-it-works"
            onClick={closeMenu}
          >
            How It Works
          </a>

          <a
            href="#impact"
            onClick={closeMenu}
          >
            Impact
          </a>

          <a
            href="#about"
            onClick={closeMenu}
          >
            About
          </a>
          <a
            href="#feedback"
            onClick={closeMenu}
          >
            Feedback
          </a>

          <Button
            variant="outline"
            size="small"
            onClick={() => {
              closeMenu();
              onGetStarted();
            }}
          >
            Get Started
          </Button>

        </nav>

        <button
          className={`mobile-menu-button ${
            menuOpen ? "active" : ""
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>

    </header>
  );
}

export default Navbar;