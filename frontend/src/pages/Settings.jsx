import React from 'react';

export default function Settings({ user }) {
  if (!user) return null;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-description">Configure your developer account profile options and inspect credentials.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
        
        {/* User profile details card */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h3 className="card-title">
              Profile Details
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <img
              src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=48&h=48&q=80'}
              alt={user.name}
              style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid var(--border-color)', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=48&h=48&q=80';
              }}
            />
            <div>
              <h4 style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1.05rem' }}>{user.name || 'User'}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Registered Email: {user.email}</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>User Session ID</span>
              <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'monospace' }}>#{user.id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Primary Auth Provider</span>
              <span className="badge" style={{ textTransform: 'capitalize', fontWeight: '700' }}>{user.provider}</span>
            </div>
          </div>
        </div>

        {/* Auth Credentials settings card */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h3 className="card-title">
              Linked Provider Credentials
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>Google OAuth Account</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Linked via Google Cloud integrations</p>
              </div>
              <span className={`badge ${user.provider === 'google' ? 'badge-success' : ''}`}>
                {user.provider === 'google' ? 'Connected' : 'Not Linked'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>GitHub Credentials</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Linked via secure GitHub developer OAuth strategies</p>
              </div>
              <span className={`badge ${user.provider === 'github' ? 'badge-success' : ''}`}>
                {user.provider === 'github' ? 'Connected' : 'Not Linked'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>Local Email Session</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Standard password authentication logs</p>
              </div>
              <span className={`badge ${user.provider === 'local' ? 'badge-success' : ''}`}>
                {user.provider === 'local' ? 'Connected' : 'Not Linked'}
              </span>
            </div>
          </div>
        </div>

        {/* Security reminders */}
        <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem 1rem', border: '1px solid #bfdbfe', backgroundColor: '#eff6ff', borderRadius: '6px', fontSize: '0.8rem', color: '#1e3a8a' }}>
          <p>
            Your developer statistics and query histories are stored privately and tied to your user workspace credentials. No other users can access your reports.
          </p>
        </div>

      </div>
    </div>
  );
}
