import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash2 } from 'lucide-react';
import { api } from '../utils/api';

export default function HistoryPage({ addToast }) {
  const [profiles, setProfiles] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('analysis_date');
  const [order, setOrder] = useState('DESC');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.getProfiles({
        page,
        limit: 10,
        sortBy,
        order,
        search: debouncedSearch
      });
      setProfiles(response.data);
      setPagination(response.pagination);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, order, debouncedSearch, addToast]);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(prev => prev === 'DESC' ? 'ASC' : 'DESC');
    } else {
      setSortBy(field);
      setOrder('DESC');
    }
    setPage(1);
  };

  const getSortIcon = (field) => {
    if (sortBy === field) {
      return order === 'ASC' ? ' ▲' : ' ▼';
    }
    return ' ⇅';
  };

  const handleDeleteProfile = async (username) => {
    if (!window.confirm(`Are you sure you want to delete profile @${username} from your workspace?`)) return;
    try {
      await api.deleteProfile(username);
      addToast('Profile deleted successfully.', 'success');
      fetchHistory();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const { currentPage = 1, totalPages = 1, totalCount = 0 } = pagination;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Analysis History</h1>
          <p className="page-description">Browse and manage all GitHub profiles previously analyzed in your workspace.</p>
        </div>

        {/* Search filter */}
        <div style={{ position: 'relative', width: '250px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search profiles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="skeleton" style={{ height: '200px', borderRadius: '8px' }}></div>
        ) : profiles.length > 0 ? (
          <div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('username')}>
                      Developer {getSortIcon('username')}
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('developer_score')}>
                      Developer Score {getSortIcon('developer_score')}
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('followers')}>
                      Followers {getSortIcon('followers')}
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('public_repos')}>
                      Repos {getSortIcon('public_repos')}
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('total_stars')}>
                      Stars {getSortIcon('total_stars')}
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('analysis_date')}>
                      Analyzed Date {getSortIcon('analysis_date')}
                    </th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((profile) => (
                    <tr key={profile.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img
                            src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='8' r='4'/><path d='M18 21a6 6 0 0 0-12 0'/></svg>"
                            alt={profile.username}
                            style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--border-color)' }}
                          />
                          <div>
                            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{profile.name || `@${profile.username}`}</div>
                            {profile.name && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{profile.username}</div>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-indigo">{profile.developer_score}</span>
                      </td>
                      <td>{profile.followers.toLocaleString()}</td>
                      <td>{profile.public_repos.toLocaleString()}</td>
                      <td>{profile.total_stars.toLocaleString()}</td>
                      <td>{new Date(profile.analysis_date).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button
                            onClick={() => navigate(`/app?q=${profile.username}`)}
                            className="btn"
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', fontSize: '0.75rem', fontWeight: '500' }}
                            title="View Profile Stats"
                          >
                            <Eye style={{ width: '12px', height: '12px' }} />
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteProfile(profile.username)}
                            className="btn"
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', fontSize: '0.75rem', fontWeight: '500' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-error)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                            title="Delete stats"
                          >
                            <Trash2 style={{ width: '12px', height: '12px' }} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  Page <strong>{currentPage}</strong> of {totalPages} ({totalCount} records)
                </span>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    className="btn"
                    style={{ width: 'auto', padding: '0.4rem 0.75rem' }}
                    disabled={currentPage <= 1}
                    onClick={() => setPage(currentPage - 1)}
                  >
                    Prev
                  </button>
                  <button
                    className="btn"
                    style={{ width: 'auto', padding: '0.4rem 0.75rem' }}
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
            <h4 style={{ fontWeight: '600', color: 'var(--text-primary)' }}>No Analysis History</h4>
            <p style={{ fontSize: '0.85rem', maxWidth: '300px', margin: '0.25rem auto 0 auto' }}>
              Your workspace is currently empty. Run developer searches to populate your history dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
