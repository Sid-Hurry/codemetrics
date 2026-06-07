import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Github, AlertTriangle } from 'lucide-react';
import { api } from '../utils/api';
import Profile from './Profile';

export default function SearchPage({ addToast }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (targetUsername) => {
    if (!targetUsername || !targetUsername.trim()) return;
    setLoading(true);
    setError('');
    setProfile(null);

    const queryName = targetUsername.trim();
    setUsername(queryName);

    try {
      const response = await api.analyzeProfile(queryName);
      setProfile(response.data);
    } catch (err) {
      setError(err.message || 'Failed to analyze GitHub profile.');
      addToast(err.message || 'Error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setSearchParams({ q: username.trim() });
  };

  // Sync search input with URL search parameters
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      handleSearch(query);
    }
  }, [searchParams]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Profile Lookup</h1>
        <p className="page-description">Search for GitHub users to fetch repository statistics, rankings, and AI reviews.</p>
      </div>

      {/* Large search experience */}
      <div className="search-container-large">
        <form onSubmit={handleSubmit} style={{ position: 'relative', display: 'flex', gap: '0.5rem' }}>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <input
              type="text"
              className="search-input-large"
              placeholder="Enter GitHub username (e.g. torvalds)..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
            <SearchIcon 
              size={20} 
              style={{ 
                position: 'absolute', 
                left: '1rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'var(--text-muted)' 
              }} 
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: 'auto', padding: '0 1.5rem', borderRadius: '8px' }}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>
      </div>

      {/* Loading states */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
          <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="skeleton" style={{ width: '80px', height: '80px', borderRadius: '50%' }}></div>
            <div style={{ flexGrow: 1 }}>
              <div className="skeleton" style={{ width: '150px', height: '24px', marginBottom: '8px' }}></div>
              <div className="skeleton" style={{ width: '100px', height: '16px' }}></div>
            </div>
          </div>
          <div className="dashboard-grid">
            <div className="skeleton" style={{ height: '200px', borderRadius: '8px' }}></div>
            <div className="skeleton" style={{ height: '200px', borderRadius: '8px' }}></div>
          </div>
          <div className="skeleton" style={{ height: '300px', borderRadius: '8px' }}></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div 
          className="card" 
          style={{ 
            marginTop: '2rem', 
            border: '1px solid #fca5a5', 
            backgroundColor: '#fef2f2', 
            color: '#991b1b', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem' 
          }}
        >
          <AlertTriangle size={24} style={{ color: '#ef4444' }} />
          <div>
            <h4 style={{ fontWeight: '700', fontSize: '0.95rem' }}>Lookup failed</h4>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>{error}</p>
          </div>
        </div>
      )}

      {/* Render detailed profile once loaded */}
      {!loading && profile && (
        <div style={{ marginTop: '2rem' }}>
          <Profile 
            profile={profile} 
            onUpdateProfile={setProfile} 
            addToast={addToast} 
          />
        </div>
      )}

      {/* Initial Empty State */}
      {!loading && !profile && !error && (
        <div 
          style={{ 
            textAlign: 'center', 
            padding: '5rem 2rem', 
            color: 'var(--text-muted)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Github size={48} style={{ color: 'var(--text-muted)', opacity: 0.3, marginBottom: '1.25rem' }} />
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: '600' }}>
            No profile currently viewed
          </h3>
          <p style={{ fontSize: '0.88rem', maxWidth: '360px', marginTop: '0.25rem' }}>
            Enter a valid developer name above to compile repositories, calculate metrics, and generate AI insights.
          </p>
        </div>
      )}
    </div>
  );
}
