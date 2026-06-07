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
      navigate('/app/search');
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

        <button onClick={handleGoogleOAuth} className="btn btn-oauth" style={{ gap: '0.5rem' }}>
          <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.187 4.114-3.41 0-6.19-2.78-6.19-6.19s2.78-6.19 6.19-6.19c1.7 0 3.2.69 4.3 1.8l3.1-3.1C18.94 1.89 15.84 1 12.24 1 6.13 1 1.2 5.93 1.2 12s4.93 11 11.04 11c6.73 0 11.53-4.73 11.53-11.73 0-.7-.06-1.39-.19-1.985H12.24z" />
          </svg>
          Google
        </button>

        <button onClick={handleGitHubOAuth} className="btn btn-oauth" style={{ gap: '0.5rem' }}>
          <Github size={16} />
          GitHub
        </button>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: '600', textDecoration: 'none' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
