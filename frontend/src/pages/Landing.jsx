import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleCTA = () => {
    if (token) {
      navigate('/app/search');
    } else {
      navigate('/login');
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Header/Navbar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 2.5rem',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000
      }}>
        <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          CodeMetrics
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <a href="#features" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none' }}>Features</a>
          <a href="#methodology" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none' }}>Methodology</a>
          <a href="#compare" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none' }}>Candidate Duel</a>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {token ? (
            <Link to="/app/search" className="btn btn-primary" style={{ padding: '0.5rem 1rem', width: 'auto', borderRadius: '6px' }}>
              Go to Workspace
            </Link>
          ) : (
            <>
              <Link to="/login" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600', textDecoration: 'none', padding: '0.5rem 1rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', width: 'auto', borderRadius: '6px' }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* 2. Hero Section */}
      <section style={{
        padding: '6rem 2rem 5rem 2rem',
        textAlign: 'center',
        maxWidth: '850px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <span style={{
          backgroundColor: 'var(--bg-hover)',
          color: 'var(--text-primary)',
          fontSize: '0.75rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          padding: '0.35rem 0.75rem',
          borderRadius: '20px',
          letterSpacing: '1px'
        }}>
          GitHub Profile Analytics & AI Reviews
        </span>
        <h1 style={{
          fontSize: '3.25rem',
          fontWeight: '800',
          color: 'var(--text-primary)',
          lineHeight: '1.15',
          letterSpacing: '-1.5px'
        }}>
          Understand Developer Impact, Quantified.
        </h1>
        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          maxWidth: '650px'
        }}>
          Query public repository parameters, calculate custom logarithmic developer rankings, and generate Gemini-powered candidate summaries instantly.
        </p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button onClick={handleCTA} className="btn btn-primary" style={{ padding: '0.75rem 1.75rem', width: 'auto', fontSize: '0.95rem', borderRadius: '8px' }}>
            Start Analyzing Profiles
          </button>
          <a href="#features" className="btn" style={{ padding: '0.75rem 1.75rem', width: 'auto', fontSize: '0.95rem', borderRadius: '8px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            Learn More
          </a>
        </div>
      </section>

      {/* Mock Dashboard Preview */}
      <section style={{
        maxWidth: '960px',
        width: '100%',
        margin: '0 auto 6rem auto',
        padding: '0 2rem'
      }}>
        <div style={{
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
          backgroundColor: '#ffffff'
        }}>
          <div style={{
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid var(--border-color)',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginLeft: '0.75rem' }}>http://localhost:5173/app/search?q=torvalds</span>
          </div>
          <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Mock Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.2rem', color: '#64748b' }}>LT</div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>Linus Torvalds</h3>
                <span style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: '500' }}>@torvalds</span>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <span className="badge badge-indigo" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>Developer Score: 98</span>
              </div>
            </div>
            {/* Mock Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Repositories</span>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>120</div>
              </div>
              <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Total Stars</span>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>184.2k</div>
              </div>
              <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Completeness</span>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>90%</div>
              </div>
            </div>
            {/* Mock AI summary */}
            <div style={{ backgroundColor: '#f5f3ff', border: '1px solid #c7d2fe', padding: '1rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#6d28d9', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Gemini AI Insight</span>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                Linus Torvalds is an exemplary Open Source Pioneer with a focus on system engineering. Possesses legendary influence, leading the Linux kernel and Git revision architectures. Dominates lower-level infrastructure, highlighting mastery in backend optimizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" style={{ backgroundColor: '#f8fafc', padding: '5rem 2rem', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.75px' }}>Features Built for Recruiters & Leads</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem' }}>Eschewing vanity metrics for real, balanced performance data.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ padding: '2rem', marginBottom: 0 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Logarithmic Rating System</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Calculates weighted rankings based on followers, forks, star outputs, and repository distributions. High follower counts scale logarithmically to prevent ranking skew.
              </p>
            </div>
            <div className="card" style={{ padding: '2rem', marginBottom: 0 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Gemini AI Insights Engine</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Generates a structured developer review profile, listing strengths, weaknesses, skill assessment radars, and predicted career path matches instantly.
              </p>
            </div>
            <div className="card" style={{ padding: '2rem', marginBottom: 0 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Side-by-Side Candidate Duel</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Select any two analyzed profiles in your workspace and compare their metrics side-by-side. Includes a custom Gemini narrative comparing their technical styles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Methodology Section */}
      <section id="methodology" style={{ padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.75px', marginBottom: '1.5rem' }}>
            Our Ranking Methodology
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '2.5rem' }}>
            Traditional scoring is broken. Popular developers with millions of stargazers dominate, while active contributors get buried. CodeMetrics normalizes rankings using logarithmic formulas:
          </p>
          <div style={{
            backgroundColor: '#f1f5f9',
            border: '1px solid var(--border-color)',
            padding: '1.5rem 2rem',
            borderRadius: '10px',
            fontFamily: 'monospace',
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--accent-primary)',
            display: 'inline-block',
            marginBottom: '2.5rem'
          }}>
            Score = Log10(Followers + 1) * 25 + Log10(Stars + 1) * 30 + Repos * 0.5
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            This ensures that a profile's rating reflects actual repository outputs alongside general developer community influence.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-color)',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          &copy; {new Date().getFullYear()} CodeMetrics Developer Analytics Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
