import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { api } from '../utils/api';

export default function Dashboard({ addToast }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const response = await api.getDashboard();
      setData(response.data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteHistoryItem = async (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await api.deleteHistoryItem(id);
      addToast('Search log removed.', 'success');
      fetchDashboardData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear your entire search history?')) return;
    try {
      await api.clearHistory();
      addToast('Search history cleared successfully.', 'success');
      fetchDashboardData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <div className="skeleton" style={{ width: '200px', height: '32px', marginBottom: '8px' }}></div>
          <div className="skeleton" style={{ width: '300px', height: '18px' }}></div>
        </div>
        <div className="kpi-grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton" style={{ height: '94px', borderRadius: '8px' }}></div>
          ))}
        </div>
        <div className="skeleton" style={{ height: '300px', borderRadius: '8px' }}></div>
      </div>
    );
  }

  const { metrics = { totalProfiles: 0, totalFavorites: 0, totalComparisons: 0 }, recentSearches = [], recentAnalyses = [] } = data || {};

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Developer Analytics</h1>
        <p className="page-description">Welcome to your dashboard. Query and analyze GitHub metrics.</p>
      </div>

      {/* KPI Cards (Clean text-only counts) */}
      <div className="kpi-grid">
        <div className="kpi-card" onClick={() => navigate('/app/history')} style={{ cursor: 'pointer' }}>
          <div className="kpi-info">
            <span className="kpi-label">Profiles Analyzed</span>
            <span className="kpi-value">{metrics.totalProfiles}</span>
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigate('/app/compare')} style={{ cursor: 'pointer' }}>
          <div className="kpi-info">
            <span className="kpi-label">Total Comparisons</span>
            <span className="kpi-value">{metrics.totalComparisons}</span>
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigate('/app/favorites')} style={{ cursor: 'pointer' }}>
          <div className="kpi-info">
            <span className="kpi-label">Favorite Developers</span>
            <span className="kpi-value">{metrics.totalFavorites}</span>
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="dashboard-grid">
        {/* Left Column: Recent Searches */}
        <div>
          <div className="card" style={{ height: '100%' }}>
            <div className="card-header">
              <h3 className="card-title">Recent Searches</h3>
              {recentSearches.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-error)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  Clear all
                </button>
              )}
            </div>

            {recentSearches.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recentSearches.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/app?q=${item.username}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0.75rem',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                        @{item.username}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(item.searched_at).toLocaleDateString()}
                      </span>
                      <button
                        onClick={(e) => handleDeleteHistoryItem(e, item.id)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px 6px', borderRadius: '4px' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-error)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                        title="Delete log"
                      >
                        <Trash2 style={{ width: '12px', height: '12px' }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No recent searches. Search a developer profile to get started!
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recently Analyzed Developers */}
        <div>
          <div className="card" style={{ height: '100%' }}>
            <div className="card-header">
              <h3 className="card-title">Recently Analyzed Developers</h3>
              <Link to="/app/history" style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: '600' }}>
                View all
              </Link>
            </div>

            {recentAnalyses.length > 0 ? (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Developer</th>
                      <th>Dev Score</th>
                      <th>Analysis Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAnalyses.map((profile) => (
                      <tr
                        key={profile.id}
                        onClick={() => navigate(`/app?q=${profile.username}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img
                              src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='8' r='4'/><path d='M18 21a6 6 0 0 0-12 0'/></svg>"
                              alt={profile.username}
                              style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--border-color)' }}
                            />
                            <div>
                              <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                                {profile.name || `@${profile.username}`}
                              </div>
                              {profile.name && (
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  @{profile.username}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-indigo">
                            {profile.developer_score}
                          </span>
                        </td>
                        <td>
                          {new Date(profile.analysis_date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No developer analyses found. Enter a name in Search tab to create stats.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
