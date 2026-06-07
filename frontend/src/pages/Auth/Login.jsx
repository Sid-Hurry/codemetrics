import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Github } from 'lucide-react';
import { api } from '../../utils/api';

export default function Login({ onLoginSuccess, addToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      if (errorParam === 'GoogleNotConfigured') {
        addToast('Google OAuth is not configured on the backend .env file yet.', 'error');
      } else if (errorParam === 'GitHubNotConfigured') {
        addToast('GitHub OAuth is not configured on the backend .env file yet.', 'error');
      } else if (errorParam === 'GoogleOAuthFailed') {
        addToast('Google authentication failed.', 'error');
      } else if (errorParam === 'GitHubOAuthFailed') {
        addToast('GitHub authentication failed. Ensure you have a public email address on your GitHub profile.', 'error');
      } else {
        addToast(`Authentication failed: ${errorParam}`, 'error');
      }
    }
  }, [searchParams, addToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password.', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await api.login(email, password);
      localStorage.setItem('token', data.token);
      onLoginSuccess(data.user);
      addToast('Logged in successfully.', 'success');
      navigate('/app');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleOAuth = () => {
    window.location.href = `${api.baseURL || '/api'}/auth/google`;
  };

  const handleGitHubOAuth = () => {
    window.location.href = `${api.baseURL || '/api'}/auth/github`;
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Log in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="auth-divider">or continue with</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <button onClick={handleGoogleOAuth} className="btn btn-oauth" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem 1rem' }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M20.64 12.2c0-.63-.06-1.25-.16-1.84H12v3.49h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z" />
              <path d="M12 21c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.83.86-3.06.86-2.35 0-4.34-1.58-5.05-3.73H3.95v2.33C5.43 19.56 8.5 21 12 21z" />
              <path d="M6.95 13.73A6 6 0 0 1 6.6 12c0-.6.1-1.2.25-1.77V7.9H3.95A9.92 9.92 0 0 0 3 12c0 1.48.32 2.89.95 4.16l3-2.43z" />
              <path d="M12 6.38c1.32 0 2.5.45 3.44 1.35l2.58-2.59C16.47 3.6 14.43 3 12 3c-3.5 0-6.57 1.44-8.05 4.9l3.05 2.37C7.66 8.12 9.65 6.38 12 6.38z" />
            </svg>
            Google
          </button>

          <button onClick={handleGitHubOAuth} className="btn btn-oauth" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem 1rem' }}>
            <Github style={{ width: '16px', height: '16px' }} />
            GitHub
          </button>
        </div>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: '600', textDecoration: 'none' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
