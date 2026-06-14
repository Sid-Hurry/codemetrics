import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Cpu } from 'lucide-react';

export default function Landing({ user }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash === '#features') {
      const element = document.getElementById('features');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, []);

  const handleCTA = () => {
    if (user) {
      navigate('/app');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
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
          <div style={{ textAlign: 'left' }} id="methodology">
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
    </>
  );
}
