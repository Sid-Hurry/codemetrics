import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Cpu } from 'lucide-react';

export default function Landing({ user }) {
  const navigate = useNavigate();

  const handleCTA = () => {
    if (user) {
      navigate('/app');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="zenity-light-wrapper">
      {/* Scoped CSS Style Injection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

        /* Theme tokens */
        .zenity-light-wrapper {
          --b-color: #000000;
          --bg-color: #ffffff;
          --bg-alt: #f8f9fa;
          --text-color: #000000;
          --text-muted: #5e6b7e;
          --accent-blue: #3b36fc;
          
          background-color: var(--bg-color);
          color: var(--text-color);
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow-x: hidden;
        }

        /* Navbar Layout */
        .navbar-grid {
          display: grid;
          grid-template-columns: 200px 1fr 240px;
          border-bottom: 1px solid var(--b-color);
          height: 72px;
          align-items: center;
          position: sticky;
          top: 0;
          background-color: var(--bg-color);
          z-index: 100;
        }

        @media (max-width: 900px) {
          .navbar-grid {
            grid-template-columns: 150px 1fr auto;
            padding: 0 1rem;
          }
          .nav-cell-links {
            display: none !important;
          }
        }

        .nav-cell {
          height: 100%;
          display: flex;
          align-items: center;
          padding: 0 2rem;
          position: relative;
        }

        .nav-cell-logo {
          border-right: 1px solid var(--b-color);
        }

        .nav-cell-links {
          justify-content: center;
          gap: 3rem;
        }

        .nav-cell-cta {
          border-left: 1px solid var(--b-color);
          justify-content: flex-end;
          padding-right: 2.5rem;
        }

        @media (max-width: 900px) {
          .nav-cell-logo { border: none; padding: 0; }
          .nav-cell-cta { border: none; padding: 0; }
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-weight: 900;
          font-size: 1.25rem;
          letter-spacing: -0.5px;
          color: var(--text-color);
          text-decoration: none;
        }

        .nav-logo-icon {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background-color: var(--b-color);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-logo-inner {
          width: 10px;
          height: 10px;
          background-color: var(--bg-color);
          clip-path: polygon(40% 0%, 40% 40%, 0% 40%, 60% 100%, 60% 60%, 100% 60%);
        }

        .nav-link-tag {
          color: var(--text-color);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 600;
          transition: opacity 0.2s ease;
        }

        .nav-link-tag:hover {
          opacity: 0.7;
        }

        .btn-nav-signin {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          color: var(--text-color);
          text-decoration: none;
          font-size: 0.95rem;
          padding: 0.5rem 1.25rem;
          border: 1px solid transparent;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.75rem;
        }

        .btn-nav-signin:hover {
          background-color: var(--bg-hover);
          border-color: var(--border-color);
        }

        .btn-nav-getstarted {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          background-color: var(--b-color);
          color: var(--bg-color);
          border: 1px solid var(--b-color);
          text-decoration: none;
          font-size: 0.95rem;
          padding: 0.5rem 1.25rem;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .btn-nav-getstarted:hover {
          background-color: var(--bg-color);
          color: var(--text-color);
        }

        /* Hero Area */
        .hero-container {
          max-width: 1160px;
          margin: 0 auto;
          width: 100%;
          padding: 6rem 2.5rem 4rem 2.5rem;
          position: relative;
          text-align: left;
        }

        .zenity-title-normal {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 4rem;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -2px;
          color: var(--text-color);
          margin: 1.5rem 0;
          max-width: 900px;
        }

        @media (max-width: 900px) {
          .zenity-title-normal {
            font-size: 3rem;
            letter-spacing: -1.5px;
          }
        }

        @media (max-width: 600px) {
          .zenity-title-normal {
            font-size: 2.25rem;
            letter-spacing: -1px;
          }
        }

        .hero-subtext-normal {
          font-family: 'Inter', sans-serif;
          font-size: 1.15rem;
          font-weight: 500;
          color: var(--text-muted);
          max-width: 800px;
          line-height: 1.6;
          margin-bottom: 2.5rem;
        }

        /* Bauhaus Grid Features Section */
        .bauhaus-grid-section {
          max-width: 1160px;
          margin: 2rem auto 4rem auto;
          width: 100%;
          padding: 0 2.5rem;
          position: relative;
        }

        .bauhaus-grid-header {
          border-top: 1px solid var(--b-color);
          border-bottom: 1px solid var(--b-color);
          padding: 1.5rem 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          position: relative;
        }

        .bauhaus-grid-title {
          font-size: 1.8rem;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .bauhaus-card-table {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1px solid var(--b-color);
        }

        @media (max-width: 900px) {
          .bauhaus-card-table {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 550px) {
          .bauhaus-card-table {
            grid-template-columns: 1fr;
          }
        }

        .bauhaus-cell {
          border-right: 1px solid var(--b-color);
          padding: 2.5rem 2rem;
          text-align: left;
          background-color: var(--bg-color);
          transition: background-color 0.2s ease;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .bauhaus-cell:last-child {
          border-right: none;
        }

        @media (max-width: 900px) {
          .bauhaus-cell:nth-child(2n) { border-right: none; }
          .bauhaus-cell:nth-child(1), .bauhaus-cell:nth-child(2) { border-bottom: 1px solid var(--b-color); }
        }

        @media (max-width: 550px) {
          .bauhaus-cell { border-right: none !important; border-bottom: 1px solid var(--b-color); }
          .bauhaus-cell:last-child { border-bottom: none; }
        }

        .bauhaus-cell:hover {
          background-color: var(--bg-alt);
        }

        .bauhaus-cell-title {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 0.25rem;
        }

        .bauhaus-cell-desc {
          font-family: 'Inter', sans-serif;
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        /* Mockup Analyzer Section (Light Theme) */
        .analyzer-preview-section {
          max-width: 1160px;
          margin: 6rem auto;
          width: 100%;
          padding: 0 2.5rem;
        }

        .analyzer-grid-split {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 4rem;
          align-items: center;
        }

        @media (max-width: 900px) {
          .analyzer-grid-split {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
        }

        .analyzer-mock-container {
          border: 1px solid var(--b-color);
          background-color: var(--bg-color);
          padding: 1.75rem;
          position: relative;
          box-shadow: 10px 10px 0px var(--b-color);
          text-align: left;
        }

        .analyzer-mock-header {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid var(--b-color);
          padding-bottom: 0.75rem;
          margin-bottom: 1.5rem;
          font-family: monospace;
          font-size: 0.8rem;
        }

        .mock-dashboard-blocks {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 1.25rem;
        }

        @media (max-width: 550px) {
          .mock-dashboard-blocks {
            grid-template-columns: 1fr;
          }
        }

        .mock-block-card {
          border: 1px solid var(--b-color);
          padding: 1rem;
          background-color: var(--bg-color);
        }

        .mock-score-gauge {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 0;
        }

        .mock-score-outline {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          border: 6px double var(--b-color);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .mock-score-number {
          font-size: 2.25rem;
          font-weight: 900;
          color: var(--b-color);
        }

        .mock-score-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 1px;
          color: var(--text-muted);
        }

        .mock-bar-row {
          display: flex;
          flex-direction: column;
          margin-bottom: 0.75rem;
        }

        .mock-bar-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 0.2rem;
        }

        .mock-bar-track {
          height: 5px;
          background-color: var(--bg-alt);
          border: 1px solid var(--b-color);
          overflow: hidden;
        }

        .mock-bar-fill {
          height: 100%;
          background-color: var(--b-color);
        }

        /* Action Buttons */
        .zenity-btn-black {
          background-color: var(--b-color);
          color: var(--bg-color);
          border: 1px solid var(--b-color);
          padding: 0.8rem 2.2rem;
          font-size: 1rem;
          font-weight: 800;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .zenity-btn-black:hover {
          background-color: var(--bg-color);
          color: var(--b-color);
        }

        /* Minimalist Footer */
        .zenity-light-footer {
          border-top: 1px solid var(--b-color);
          padding: 3rem 2.5rem;
          text-align: center;
          background-color: var(--bg-color);
          font-size: 0.85rem;
          color: var(--text-muted);
          position: relative;
          z-index: 10;
        }
      `}</style>

      {/* Navbar Grid */}
      <header className="navbar-grid">
        <div className="nav-cell nav-cell-logo">
          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">
              <div className="nav-logo-inner"></div>
            </div>
            <span>CodeMetrics</span>
          </Link>
        </div>

        <div className="nav-cell nav-cell-links">
          <a href="#features" className="nav-link-tag">Features</a>
          <a href="#methodology" className="nav-link-tag">Methodology</a>
          <a href="#insights" className="nav-link-tag">Growth Engine</a>
        </div>

        <div className="nav-cell nav-cell-cta">
          {user ? (
            <Link to="/app" className="btn-nav-getstarted">
              Open Workspace
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-nav-signin">
                Sign In
              </Link>
              <Link to="/register" className="btn-nav-getstarted">
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Container */}
      <section className="hero-container">
        {/* Title Block adapted to AI GitHub Profile Analyzer headline */}
        <h1 className="zenity-title-normal">
          AI GitHub Profile Analyzer & Career Growth Engine
        </h1>

        <p className="hero-subtext-normal">
          Evaluate your public GitHub profile metrics, calculate impact scores, map target career tracks, identify skill gaps, and generate personalized capstone projects.
        </p>

        <div className="hero-cta-wrapper">
          <button 
            onClick={handleCTA}
            className="zenity-btn-black"
          >
            <span>{user ? 'Open Dashboard' : 'Analyze Profile Now'}</span>
            <ArrowRight style={{ width: '18px', height: '18px' }} />
          </button>
        </div>
      </section>

      {/* Bauhaus Grid Features Section */}
      <section id="features" className="bauhaus-grid-section">
        <div className="bauhaus-grid-header">
          <h2 className="bauhaus-grid-title">Built for Developer Self-Improvement</h2>
        </div>

        <div className="bauhaus-card-table">
          {/* Card 1 */}
          <div className="bauhaus-cell">
            <h3 className="bauhaus-cell-title">Profile Auditing</h3>
            <p className="bauhaus-cell-desc">
              Calculate completeness scores and developer ranking tiers based on stars, followers, and code contributions.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bauhaus-cell">
            <h3 className="bauhaus-cell-title">Language Analytics</h3>
            <p className="bauhaus-cell-desc">
              Deconstruct programming language footprints with interactive ratio distributions and repository weight checks.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bauhaus-cell">
            <h3 className="bauhaus-cell-title">Career Trajectories</h3>
            <p className="bauhaus-cell-desc">
              Let Gemini classify your optimal path (e.g. Frontend, Backend, DevOps, Data) along with readiness confidence levels.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bauhaus-cell">
            <h3 className="bauhaus-cell-title">Capstone Planning</h3>
            <p className="bauhaus-cell-desc">
              Unlock 5 curated developer projects custom-matched to bridge your technology skill gaps.
            </p>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section id="insights" className="analyzer-preview-section">
        <div className="analyzer-grid-split">
          {/* Left Column: Mockup */}
          <div className="analyzer-mock-container">
            <div className="analyzer-mock-header">
              <span>MOCK_PROFILE_insights</span>
              <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>● CONFIDENCE: 92%</span>
            </div>

            <div className="mock-dashboard-blocks">
              <div className="mock-block-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Users style={{ width: '16px', height: '16px' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: '800' }}>AUDITED DEV PROFILE</span>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '0.2rem' }}>Linus Torvalds</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>Target: Backend Engineer</div>

                <div style={{ marginTop: '1.25rem' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Stack Focus</div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.6rem', border: '1px solid var(--b-color)', padding: '0.15rem 0.4rem', fontWeight: 'bold' }}>Docker</span>
                    <span style={{ fontSize: '0.6rem', border: '1px solid var(--b-color)', padding: '0.15rem 0.4rem', fontWeight: 'bold' }}>Redis</span>
                    <span style={{ fontSize: '0.6rem', border: '1px solid var(--b-color)', padding: '0.15rem 0.4rem', fontWeight: 'bold' }}>MySQL</span>
                  </div>
                </div>
              </div>

              <div className="mock-block-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className="mock-score-gauge">
                  <div className="mock-score-outline">
                    <span className="mock-score-number">88</span>
                    <span className="mock-score-label">INDEX</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mock-block-card" style={{ marginTop: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cpu style={{ width: '14px', height: '14px' }} />
                <span>AI GAP RESOLUTION ROADMAP</span>
              </div>
              
              <div className="mock-bar-row">
                <div className="mock-bar-info">
                  <span>System Architecture / Docker</span>
                  <span>75% Readiness</span>
                </div>
                <div className="mock-bar-track">
                  <div className="mock-bar-fill" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className="mock-bar-row">
                <div className="mock-bar-info">
                  <span>Distributed Caching / Redis</span>
                  <span>45% Readiness</span>
                </div>
                <div className="mock-bar-track">
                  <div className="mock-bar-fill" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Text content */}
          <div style={{ textalign: 'left' }} id="methodology">
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1.5px', lineHeight: '1.05', marginBottom: '1.5rem' }}>
              GitHub Insights & AI Advisor
            </h2>
            <p style={{ fontFamily: 'Inter', fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2.5rem' }}>
              Unlike generic LLM assistants, CodeMetrics compiles structured reports. It lists specific gaps, assigns custom timelines, and details 5 capstone project stacks so you can build real repositories.
            </p>

            <button 
              onClick={handleCTA}
              className="zenity-btn-black"
            >
              <span>{user ? 'Open Workspace' : 'Analyze Profile Now'}</span>
              <ArrowRight style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="zenity-light-footer">
        <div>&copy; 2026 CodeMetrics Growth Platform. All rights reserved.</div>
      </footer>
    </div>
  );
}
