import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, BarChart3, Compass, Briefcase, Check } from 'lucide-react';

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
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 2.5rem',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: '#ffffff',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            CodeMetrics
          </span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem', fontSize: '0.9rem', fontWeight: '500' }}>
          <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Features</a>
          <a href="#methodology" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Methodology</a>
          <a href="#career" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Growth Engine</a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <Link to="/app" className="btn btn-primary" style={{ width: 'auto', padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
              Go to Workspace
            </Link>
          ) : (
            <>
              <Link to="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ width: 'auto', padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '5rem 2.5rem',
        textAlign: 'center',
        maxWidth: '900px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div className="badge badge-indigo" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Introducing Developer Growth Engine
        </div>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '800',
          color: 'var(--text-primary)',
          lineHeight: '1.15',
          letterSpacing: '-1.5px',
          margin: 0
        }}>
          AI Career Intelligence & Project Recommendations
        </h1>
        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          margin: '0.5rem 0 1.5rem',
          maxWidth: '720px'
        }}>
          Evaluate your public GitHub profile metrics, calculate impact scores, mapping target career tracks, identifying skill gaps, and generating personalized capstone projects.
        </p>

        <button 
          onClick={handleCTA}
          className="btn btn-primary" 
          style={{ width: 'auto', padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: '600' }}
        >
          {user ? 'Open Dashboard' : 'Analyze Profile Now'}
        </button>
      </section>

      {/* Features Grid */}
      <section id="features" style={{
        padding: '5rem 2.5rem',
        backgroundColor: '#fafafa',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              Built for Developer Self-Improvement
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
              Advanced analytics and career maps, decoupled from simple messaging interfaces.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div className="card" style={{ margin: 0, padding: '1.75rem', backgroundColor: '#ffffff' }}>
              <div style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                <Search style={{ width: '24px', height: '24px', strokeWidth: 1.5 }} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Profile Auditing
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Calculate completeness scores and developer ranking tiers based on stars, followers, and code contributions.
              </p>
            </div>

            <div className="card" style={{ margin: 0, padding: '1.75rem', backgroundColor: '#ffffff' }}>
              <div style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                <BarChart3 style={{ width: '24px', height: '24px', strokeWidth: 1.5 }} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Language Analytics
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Deconstruct programming language footprints with interactive ratio distributions and repository weight checks.
              </p>
            </div>

            <div className="card" style={{ margin: 0, padding: '1.75rem', backgroundColor: '#ffffff' }}>
              <div style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                <Compass style={{ width: '24px', height: '24px', strokeWidth: 1.5 }} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Career Trajectories
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Let Gemini classify your optimal path (e.g. Frontend, Backend, DevOps, Data) along with readiness confidence levels.
              </p>
            </div>

            <div className="card" style={{ margin: 0, padding: '1.75rem', backgroundColor: '#ffffff' }}>
              <div style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                <Briefcase style={{ width: '24px', height: '24px', strokeWidth: 1.5 }} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Capstone Planning
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Unlock 5 curated developer projects custom-matched to bridge your technology skill gaps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section id="career" style={{ padding: '5rem 2.5rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px', lineHeight: '1.2' }}>
              An Intelligent Career Advisor, Not a Chatbot
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginTop: '1rem' }}>
              Unlike generic LLM assistants, CodeMetrics compiles structured reports. It lists specific gaps, assigns custom timelines, and details 5 capstone project stacks so you can build real repositories.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--text-primary)', display: 'inline-flex', marginTop: '0.2rem' }}>
                  <Check style={{ width: '16px', height: '16px', strokeWidth: 2.5 }} />
                </span>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>Skill Gap Mapping</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Identify high-priority technologies to master.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--text-primary)', display: 'inline-flex', marginTop: '0.2rem' }}>
                  <Check style={{ width: '16px', height: '16px', strokeWidth: 2.5 }} />
                </span>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>Targeted Capstone Spec</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>5 detailed custom specs ready to implement.</p>
                </div>
              </div>
            </div>
          </div>

          <div id="methodology" style={{
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1.5rem',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>MOCK_PROFILE_insights</span>
              <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>CONFIDENCE: 92%</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ height: '12px', width: '40%', backgroundColor: '#f1f5f9', borderRadius: '4px' }}></div>
              <div style={{ height: '35px', width: '100%', backgroundColor: '#f8fafc', borderRadius: '4px', border: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', paddingLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Target: Backend Engineer
              </div>
              <div style={{ height: '8px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '4px' }}></div>
              <div style={{ height: '8px', width: '90%', backgroundColor: '#f1f5f9', borderRadius: '4px' }}></div>
              <div style={{ height: '8px', width: '75%', backgroundColor: '#f1f5f9', borderRadius: '4px' }}></div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <span style={{ padding: '0.15rem 0.4rem', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.65rem', color: 'var(--text-muted)' }}>Docker</span>
                <span style={{ padding: '0.15rem 0.4rem', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.65rem', color: 'var(--text-muted)' }}>Redis</span>
                <span style={{ padding: '0.15rem 0.4rem', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.65rem', color: 'var(--text-muted)' }}>MySQL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-color)',
        padding: '2rem',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}>
        <div>&copy; 2026 CodeMetrics Growth Platform. All rights reserved.</div>
      </footer>
    </div>
  );
}
