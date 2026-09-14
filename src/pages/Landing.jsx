import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/axiosClient.js";
import { enqueueAction } from "../api/syncQueue.js";
import aboutBanner from "../assets/about-banner.png";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Button from "../components/Button.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

function Landing() {
  const navigate = useNavigate();

  // Get Started → Role Selection
  const handleGetStarted = () => {
    navigate("/roles");
  };

  // Feedback form state
  const [feedback, setFeedback] = useState({
    name: "",
    role: "Health Worker",
    district: "",
    rating: "5",
    message: "",
  });
  const [feedbackStatus, setFeedbackStatus] = useState({ state: "idle", msg: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedbackChange = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedbackStatus({ state: "idle", msg: "" });

    try {
      if (navigator.onLine) {
        await apiClient.post("/feedback", feedback);
        setFeedbackStatus({
          state: "success",
          msg: "Feedback submitted successfully.",
        });
      } else {
        await enqueueAction("/feedback", "POST", feedback);
        setFeedbackStatus({
          state: "offline",
          msg: "Saved offline. Will sync when back online.",
        });
      }
      setFeedback({
        name: "",
        role: "Health Worker",
        district: "",
        rating: "5",
        message: "",
      });
    } catch (err) {
      await enqueueAction("/feedback", "POST", feedback);
      setFeedbackStatus({
        state: "offline",
        msg: "Feedback recorded locally. Thank you!",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: "⌖",
      title: "Smart Facility Discovery",
      description:
        "Find healthcare facilities based on location, services, availability and accessibility.",
    },
    {
      icon: "✚",
      title: "Assisted Digital Triage",
      description:
        "Guide patients toward appropriate care using a simple, assisted symptom assessment.",
    },
    {
      icon: "◈",
      title: "Smart Facility Recommendation",
      description:
        "Recommend the most suitable available facility instead of simply showing the nearest one.",
    },
    {
      icon: "↗",
      title: "Referral Tracking",
      description:
        "Track referrals across healthcare facilities and identify patients who are still waiting.",
    },
    {
      icon: "⚠",
      title: "Care Gap Detection",
      description:
        "Identify pending referrals, missed follow-ups and unavailable services before care is interrupted.",
    },
    {
      icon: "▣",
      title: "Medicine & Diagnostics",
      description:
        "Improve visibility into medicine stocks and diagnostic service availability.",
    },
    {
      icon: "♥",
      title: "High-Risk Follow-up",
      description:
        "Help frontline teams identify and follow up with patients who need continued attention.",
    },
    {
      icon: "अ",
      title: "Multilingual & Offline Ready",
      description:
        "Designed for diverse communities and healthcare settings with limited connectivity.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Discover",
      description:
        "Patients or health workers search for healthcare services and available facilities.",
    },
    {
      number: "02",
      title: "Assess",
      description:
        "Assisted digital triage helps understand the patient's immediate care requirement.",
    },
    {
      number: "03",
      title: "Recommend",
      description:
        "The platform considers multiple factors to recommend a suitable accessible facility.",
    },
    {
      number: "04",
      title: "Connect",
      description:
        "Appointments, referrals, diagnostics and medicine availability are connected.",
    },
    {
      number: "05",
      title: "Follow Up",
      description:
        "The system detects care gaps and helps healthcare workers close the patient's care journey.",
    },
  ];

  const impactStats = [
    {
      value: "01",
      label: "Unified Care Journey",
      description: "Connects multiple stages of rural healthcare.",
    },
    {
      value: "02",
      label: "Smarter Decisions",
      description: "Recommendations consider real-world availability.",
    },
    {
      value: "03",
      label: "Better Visibility",
      description: "Administrators can identify recurring service gaps.",
    },
    {
      value: "04",
      label: "Continuous Care",
      description: "Follow-ups and referrals remain visible.",
    },
  ];

  return (
    <div className="landing-page" id="top">
      {/* =====================================================
          NAVBAR
      ===================================================== */}
      <Navbar onGetStarted={handleGetStarted} />

      <main>
        {/* =====================================================
            HERO SECTION
        ===================================================== */}
        <section className="hero-section">
          <div className="hero-background-grid"></div>

          <div className="hero-container">
            <div className="hero-content">
              <div className="hero-eyebrow">
                <span className="eyebrow-dot"></span>
                SMART RURAL HEALTHCARE NETWORK
                <span className="eyebrow-line"></span>
              </div>

              <h1>
                Right Care.
                <br />
                <span>Right Facility.</span>
                <br />
                Complete Care.
              </h1>

              <p className="hero-description">
                SwasthyaSetu connects patients, health workers, doctors and public
                healthcare facilities to create a more accessible, connected and
                continuous healthcare journey for rural communities.
              </p>

              <div className="hero-actions">
                <Button size="large" onClick={handleGetStarted}>
                  Explore Healthcare Services
                  <span>→</span>
                </Button>

                <a href="#how-it-works" className="hero-secondary-action">
                  <span className="play-icon">▶</span>
                  See how it works
                </a>
              </div>

              <div className="hero-trust">
                <div className="trust-item">
                  <span>✓</span>
                  Role-based access
                </div>

                <div className="trust-item">
                  <span>✓</span>
                  Low-connectivity ready
                </div>

                <div className="trust-item">
                  <span>✓</span>
                  Multilingual ready
                </div>
              </div>
            </div>

            {/* HERO NETWORK VISUAL */}
            <div className="hero-visual">
              <div className="hero-orbit orbit-one"></div>
              <div className="hero-orbit orbit-two"></div>
              <div className="hero-orbit orbit-three"></div>

              <div className="hero-network">
                <div className="network-line line-patient"></div>
                <div className="network-line line-worker"></div>
                <div className="network-line line-doctor"></div>
                <div className="network-line line-admin"></div>

                <div className="network-node node-patient">
                  <span>♙</span>
                  <small>Patient</small>
                </div>

                <div className="network-node node-worker">
                  <span>✚</span>
                  <small>Health Worker</small>
                </div>

                <div className="network-node node-doctor">
                  <span>⚕</span>
                  <small>Doctor</small>
                </div>

                <div className="network-node node-admin">
                  <span>◈</span>
                  <small>Admin</small>
                </div>

                <div className="network-core">
                  <div className="core-ring">
                    <div className="core-symbol">✚</div>
                  </div>

                  <strong>SwasthyaSetu</strong>

                  <span>Connected Care</span>
                </div>

                <div className="floating-card floating-card-top">
                  <span className="floating-card-icon">⌖</span>

                  <div>
                    <small>Smart Recommendation</small>
                    <strong>Best facility identified</strong>
                  </div>

                  <span className="floating-check">✓</span>
                </div>

                <div className="floating-card floating-card-bottom">
                  <span className="floating-card-icon">♥</span>

                  <div>
                    <small>Care Continuity</small>
                    <strong>Follow-up on track</strong>
                  </div>

                  <span className="floating-check">✓</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-scroll-indicator">
            <span></span>
            Scroll to explore
          </div>
        </section>

        {/* =====================================================
            NETWORK STRIP
        ===================================================== */}
        <section className="network-strip">
          <div className="network-strip-container">
            <span>ONE CONNECTED HEALTHCARE JOURNEY</span>

            <div className="network-strip-line"></div>

            <div className="network-strip-items">
              <span>Patients</span>
              <i>→</i>
              <span>Health Workers</span>
              <i>→</i>
              <span>PHCs</span>
              <i>→</i>
              <span>Hospitals</span>
              <i>→</i>
              <span>Diagnostics</span>
              <i>→</i>
              <span>Administration</span>
            </div>
          </div>
        </section>

        {/* =====================================================
            PROBLEM / INTRO
        ===================================================== */}
        <section className="intro-section" id="about">
          <div className="intro-container">
            <div className="intro-label">THE CHALLENGE</div>

            <div className="intro-content">
              <div className="intro-title">
                <h2>
                  Healthcare access is
                  <span>more than distance.</span>
                </h2>
              </div>

              <div className="intro-description">
                <p>
                  For many rural and underserved communities, reaching a
                  healthcare facility is only the beginning of the journey.
                </p>

                <p>
                  Limited specialists, unavailable diagnostics, medicine
                  shortages, delayed referrals, fragmented records and missed
                  follow-ups can turn a simple healthcare need into a long and
                  uncertain process.
                </p>

                <div className="intro-highlight">
                  <span>→</span>
                  SwasthyaSetu focuses on connecting the
                  <strong>entire care journey.</strong>
                </div>
              </div>
            </div>

            <div className="about-banner">
              <img
                src={aboutBanner}
                alt="SwasthyaSetu connected rural healthcare"
              />
            </div>
          </div>
        </section>

        {/* =====================================================
            FEATURES
        ===================================================== */}
        <section className="features-section" id="features">
          <div className="features-container">
            <SectionHeading
              eyebrow="THE PLATFORM"
              title="Everything needed for connected rural care."
              subtitle="SwasthyaSetu brings essential healthcare access and care-continuity capabilities into one coordinated platform."
            />

            <div className="features-grid">
              {features.map((feature, index) => (
                <article
                  className={`feature-card feature-card-${index + 1}`}
                  key={feature.title}
                >
                  <div className="feature-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="feature-icon">{feature.icon}</div>

                  <h3>{feature.title}</h3>

                  <p>{feature.description}</p>

                  <div className="feature-arrow">→</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            SMART RECOMMENDATION
        ===================================================== */}
        <section className="recommendation-section">
          <div className="recommendation-container">
            <div className="recommendation-visual">
              <div className="recommendation-window">
                <div className="window-header">
                  <div className="window-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                  <span>Smart Facility Recommendation</span>

                  <span>● Live</span>
                </div>

                <div className="window-body">
                  <div className="recommendation-search">
                    <span>⌖</span>

                    <div>
                      <small>Looking for</small>
                      <strong>General consultation</strong>
                    </div>

                    <span>✕</span>
                  </div>

                  <div className="recommendation-result-label">
                    RECOMMENDED FOR YOU
                  </div>

                  <div className="recommendation-result">
                    <div className="result-rank">#1</div>

                    <div className="result-info">
                      <strong>Community Health Centre</strong>
                      <span>4.2 km • General Medicine</span>

                      <div className="result-tags">
                        <span>Doctor available</span>
                        <span>Diagnostics</span>
                        <span>Medicines</span>
                      </div>
                    </div>

                    <div className="result-score">
                      <strong>94%</strong>
                      <small>match</small>
                    </div>
                  </div>

                  <div className="recommendation-result secondary">
                    <div className="result-rank">#2</div>

                    <div className="result-info">
                      <strong>Primary Health Centre</strong>
                      <span>2.1 km • General Medicine</span>

                      <div className="result-tags">
                        <span>Doctor available</span>
                      </div>
                    </div>

                    <div className="result-score">
                      <strong>82%</strong>
                      <small>match</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="recommendation-content">
              <span className="section-eyebrow">BEYOND NEAREST</span>

              <h2>
                The nearest facility isn't always the
                <span>right facility.</span>
              </h2>

              <p>
                SwasthyaSetu evaluates multiple real-world factors before
                recommending where a patient should go.
              </p>

              <div className="recommendation-factors">
                <div>
                  <span>01</span>
                  Distance
                </div>

                <div>
                  <span>02</span>
                  Required service
                </div>

                <div>
                  <span>03</span>
                  Doctor availability
                </div>

                <div>
                  <span>04</span>
                  Diagnostics
                </div>

                <div>
                  <span>05</span>
                  Medicine availability
                </div>
              </div>

              <div className="recommendation-note">
                <span>✦</span>
                Recommendation is designed to balance accessibility with care
                requirements.
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            HOW IT WORKS
        ===================================================== */}
        <section className="how-section" id="how-it-works">
          <div className="how-container">
            <SectionHeading
              eyebrow="HOW IT WORKS"
              title="From first search to continuous care."
              subtitle="The platform connects the important steps of a patient's healthcare journey."
            />

            <div className="steps-wrapper">
              <div className="steps-line"></div>

              {steps.map((step) => (
                <div className="step-item" key={step.number}>
                  <div className="step-number">{step.number}</div>

                  <div className="step-content">
                    <h3>{step.title}</h3>

                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            CARE CONTINUITY
        ===================================================== */}
        <section className="continuity-section">
          <div className="continuity-container">
            <div className="continuity-content">
              <span className="section-eyebrow">CARE CONTINUITY</span>

              <h2>
                Don't let patients
                <span>disappear between facilities.</span>
              </h2>

              <p>
                A referral should not be the end of a healthcare interaction.
                SwasthyaSetu keeps referrals, follow-ups and service gaps visible
                so healthcare teams can act before care is interrupted.
              </p>

              <div className="continuity-points">
                <div className="continuity-point">
                  <span>✓</span>
                  Pending referrals remain visible
                </div>

                <div className="continuity-point">
                  <span>✓</span>
                  Missed follow-ups can be identified
                </div>

                <div className="continuity-point">
                  <span>✓</span>
                  Service availability gaps become measurable
                </div>

                <div className="continuity-point">
                  <span>✓</span>
                  High-risk patients can be prioritized
                </div>
              </div>
            </div>

            <div className="continuity-visual">
              <div className="journey-card">
                <div className="journey-header">
                  <div>
                    <small>CARE JOURNEY</small>
                    <strong>Patient #SS-1048</strong>
                  </div>

                  <span className="journey-status">Active</span>
                </div>

                <div className="journey-timeline">
                  <div className="journey-item completed">
                    <div className="journey-marker">✓</div>

                    <div>
                      <strong>Initial consultation</strong>
                      <span>PHC Choubeypur • Completed</span>
                    </div>
                  </div>

                  <div className="journey-item completed">
                    <div className="journey-marker">✓</div>

                    <div>
                      <strong>Referral created</strong>
                      <span>CHC Shivpur • Completed</span>
                    </div>
                  </div>

                  <div className="journey-item current">
                    <div className="journey-marker">→</div>

                    <div>
                      <strong>Diagnostic test</strong>
                      <span>Awaiting completion</span>
                    </div>
                  </div>

                  <div className="journey-item">
                    <div className="journey-marker">4</div>

                    <div>
                      <strong>Follow-up</strong>
                      <span>Scheduled after diagnostic</span>
                    </div>
                  </div>
                </div>

                <div className="journey-alert">
                  <span>⚠</span>

                  <div>
                    <strong>Care gap detected</strong>
                    <small>Diagnostic completion is pending.</small>
                  </div>

                  <button type="button">Review</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            IMPACT
        ===================================================== */}
        <section className="impact-section" id="impact">
          <div className="impact-container">
            <SectionHeading
              eyebrow="EXPECTED IMPACT"
              title="Designed to improve the healthcare journey."
              subtitle="SwasthyaSetu focuses on practical improvements across access, continuity and healthcare-system visibility."
            />

            <div className="impact-grid">
              {impactStats.map((stat) => (
                <div className="impact-card" key={stat.value}>
                  <span className="impact-number">{stat.value}</span>

                  <h3>{stat.label}</h3>

                  <p>{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            USP
        ===================================================== */}
        <section className="usp-section">
          <div className="usp-container">
            <div className="usp-mark">✦</div>

            <span>WHAT MAKES SWASTHYASETU DIFFERENT</span>

            <blockquote>
              “SwasthyaSetu goes beyond finding the nearest hospital—it identifies
              care gaps, recommends the most suitable available facility, tracks the
              patient's healthcare journey, and provides actionable insights to
              improve the quality of rural healthcare.”
            </blockquote>

            <div className="usp-line"></div>

            <p>ACCESS + RECOMMENDATION + CONTINUITY + INSIGHT</p>
          </div>
        </section>

        {/* =====================================================
            FIELD FEEDBACK
        ===================================================== */}
        <section className="intro-section" id="feedback">
          <div className="intro-container">
            <SectionHeading
              eyebrow="FEEDBACK"
              title="Share Your Field Experience"
              subtitle="Help us improve SwasthyaSetu for every village and healthcare post."
            />

            <div
              style={{
                maxWidth: "640px",
                margin: "0 auto",
                background: "var(--surface-white)",
                padding: "28px",
                borderRadius: "16px",
                border: "1px solid var(--border)",
              }}
            >
              {feedbackStatus.msg && (
                <div
                  style={{
                    padding: "10px 14px",
                    marginBottom: "16px",
                    borderRadius: "8px",
                    background: "var(--primary-light)",
                    color: "var(--primary-dark)",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  {feedbackStatus.msg}
                </div>
              )}

              <form onSubmit={handleFeedbackSubmit}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                    marginBottom: "14px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: "600",
                        marginBottom: "6px",
                      }}
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={feedback.name}
                      onChange={handleFeedbackChange}
                      placeholder="Enter name"
                      style={{
                        width: "100%",
                        height: "42px",
                        padding: "0 12px",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        background: "var(--surface)",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: "600",
                        marginBottom: "6px",
                      }}
                    >
                      Your Role
                    </label>
                    <select
                      name="role"
                      value={feedback.role}
                      onChange={handleFeedbackChange}
                      style={{
                        width: "100%",
                        height: "42px",
                        padding: "0 12px",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        background: "var(--surface)",
                        cursor: "pointer",
                      }}
                    >
                      <option value="Health Worker">Health Worker</option>
                      <option value="Doctor">Doctor</option>
                      <option value="Admin">Admin</option>
                      <option value="Patient">Patient</option>
                    </select>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                    marginBottom: "14px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: "600",
                        marginBottom: "6px",
                      }}
                    >
                      District / Location
                    </label>
                    <input
                      type="text"
                      name="district"
                      required
                      value={feedback.district}
                      onChange={handleFeedbackChange}
                      placeholder="e.g. Varanasi"
                      style={{
                        width: "100%",
                        height: "42px",
                        padding: "0 12px",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        background: "var(--surface)",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: "600",
                        marginBottom: "6px",
                      }}
                    >
                      Rating
                    </label>
                    <select
                      name="rating"
                      value={feedback.rating}
                      onChange={handleFeedbackChange}
                      style={{
                        width: "100%",
                        height: "42px",
                        padding: "0 12px",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        background: "var(--surface)",
                        cursor: "pointer",
                      }}
                    >
                      <option value="5">★★★★★ (Excellent)</option>
                      <option value="4">★★★★☆ (Good)</option>
                      <option value="3">★★★☆☆ (Average)</option>
                      <option value="2">★★☆☆☆ (Poor)</option>
                      <option value="1">★☆☆☆☆ (Critical Issues)</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: "18px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "600",
                      marginBottom: "6px",
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows="3"
                    required
                    value={feedback.message}
                    onChange={handleFeedbackChange}
                    placeholder="Write your feedback..."
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "var(--surface)",
                      resize: "vertical",
                    }}
                  />
                </div>

                <Button size="medium" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Feedback →"}
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* =====================================================
            CTA
        ===================================================== */}
        <section className="cta-section">
          <div className="cta-container">
            <div className="cta-glow"></div>

            <div className="cta-content">
              <span className="section-eyebrow">START THE JOURNEY</span>

              <h2>
                Better access.
                <br />
                Better continuity.
                <br />
                <span>Better rural healthcare.</span>
              </h2>

              <p>
                Explore how SwasthyaSetu brings patients, healthcare workers,
                doctors and administrators together through one connected care
                platform.
              </p>

              <Button size="large" onClick={handleGetStarted}>
                Enter SwasthyaSetu
                <span>→</span>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer onGetStarted={handleGetStarted} />
    </div>
  );
}

export default Landing;