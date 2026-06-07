import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Github } from 'lucide-react';
import { api } from '../../utils/api';

export default function Register({ onRegisterSuccess, addToast }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      addToast('All fields are required.', 'error');
      return;
    }

    if (password.length < 6) {
      addToast('Password must be at least 6 characters.', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await api.register(name, email, password);
      localStorage.setItem('token', data.token);
      onRegisterSuccess(data.user);
      addToast('Account registered successfully.', 'success');
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
          <h2 className="auth-title">Create an account</h2>
          <p className="auth-subtitle">Get started today</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              placeholder="•••••••• (Min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-divider">or signup with</div>

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
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: '600', textDecoration: 'none' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
