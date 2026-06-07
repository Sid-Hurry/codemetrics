import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../utils/api';

export default function AuthCallback({ onLoginSuccess, addToast }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      localStorage.setItem('token', token);

      // Fetch authenticated session details
      api.getMe()
        .then((data) => {
          onLoginSuccess(data.user);
          addToast('Logged in successfully via OAuth.', 'success');
          navigate('/app');
        })
        .catch((err) => {
          localStorage.removeItem('token');
          addToast(`OAuth verification failed: ${err.message}`, 'error');
          navigate('/login');
        });
    } else {
      addToast('No session token received.', 'error');
      navigate('/login');
    }
  }, [searchParams, onLoginSuccess, addToast, navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-app)' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%', margin: '0 auto 1rem auto' }}></div>
        <p style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>Completing secure sign-in...</p>
      </div>
    </div>
  );
}
