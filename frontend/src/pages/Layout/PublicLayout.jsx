import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../../styles/public.css';

export default function PublicLayout({ user }) {
  const handleFeaturesClick = (e) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById('features');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="zenity-light-wrapper">
      {/* Navbar Grid */}
      <header className="navbar-grid">
        <div className="nav-cell nav-cell-logo">
          <Link to="/" className="nav-logo">
            <span>CodeMetrics</span>
          </Link>
        </div>

        <div className="nav-cell nav-cell-links">
          <Link to="/#features" onClick={handleFeaturesClick} className="nav-link-tag">Features</Link>
          <Link to="/about" className="nav-link-tag">About</Link>
          <Link to="/contact" className="nav-link-tag">Contact</Link>
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

      {/* Main page content layout slot */}
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>

      {/* Improved Minimalist Footer */}
      <footer className="zenity-light-footer">
        <div className="footer-content">
          <div className="footer-left">
            &copy; 2026 CodeMetrics Growth Platform. All rights reserved.
          </div>
          <div className="footer-right">
            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
            <Link to="/terms" className="footer-link">Terms & Conditions</Link>
            <Link to="/contact" className="footer-link">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
