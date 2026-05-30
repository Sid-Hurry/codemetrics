import React from 'react';
import { Trash2, ArrowUpDown, ChevronLeft, ChevronRight, Search, Eye, Database } from 'lucide-react';

export default function HistoryTable({
  profiles = [],
  pagination = {},
  onPageChange,
  onSort,
  onDelete,
  onSelect,
  sortBy,
  order,
  searchTerm,
  onSearchChange,
  isTableLoading
}) {
  const { currentPage = 1, totalPages = 1, totalCount = 0 } = pagination;

  const handleSortClick = (field) => {
    onSort(field);
  };

  const getSortIcon = (field) => {
    if (sortBy === field) {
      return (
        <span style={{ fontSize: '0.75rem', marginLeft: '4px', color: 'var(--accent-primary)' }}>
          {order === 'ASC' ? '▲' : '▼'}
        </span>
      );
    }
    return <ArrowUpDown size={12} style={{ marginLeft: '4px', opacity: 0.4 }} />;
  };

  const getScoreColor = (score) => {
    if (score >= 1000) return { bg: 'rgba(255, 0, 128, 0.12)', color: 'var(--accent-tertiary)' };
    if (score >= 400) return { bg: 'rgba(150, 50, 255, 0.12)', color: 'var(--accent-primary)' };
    if (score >= 150) return { bg: 'rgba(255, 170, 0, 0.12)', color: 'hsl(45, 100%, 50%)' };
    if (score >= 50) return { bg: 'rgba(0, 180, 255, 0.12)', color: 'var(--accent-secondary)' };
    return { bg: 'rgba(200, 200, 200, 0.12)', color: 'var(--text-secondary)' };
  };

  return (
    <div className="glass-card">
      <div className="history-section-header">
        <h3 className="history-section-title">
          Stored Profiles Analysis History
          <span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>
            ({totalCount} records)
          </span>
        </h3>
        
        {/* Responsive search filter */}
        <div className="search-input-wrapper history-search-filter">
          <input
            type="text"
            className="search-input"
            style={{ padding: '0.6rem 1rem 0.6rem 2.2rem', fontSize: '0.9rem' }}
            placeholder="Filter profiles..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Search className="search-icon-input" size={15} />
        </div>
      </div>

      <div className="table-responsive-wrapper">
        <table className="history-table">
          <thead>
            <tr>
              <th onClick={() => handleSortClick('username')}>
                Username {getSortIcon('username')}
              </th>
              <th onClick={() => handleSortClick('followers')}>
                Followers {getSortIcon('followers')}
              </th>
              <th onClick={() => handleSortClick('public_repos')}>
                Repos {getSortIcon('public_repos')}
              </th>
              <th onClick={() => handleSortClick('total_stars')}>
                Stars {getSortIcon('total_stars')}
              </th>
              <th onClick={() => handleSortClick('total_forks')}>
                Forks {getSortIcon('total_forks')}
              </th>
              <th onClick={() => handleSortClick('developer_score')}>
                Dev Score {getSortIcon('developer_score')}
              </th>
              <th style={{ textAlign: 'center', cursor: 'default' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.length > 0 ? (
              profiles.map((profile) => {
                const scoreStyle = getScoreColor(profile.developer_score);
                return (
                  <tr key={profile.id}>
                    <td>
                      <div className="user-cell-meta">
                        <img 
                          src={profile.avatar_url} 
                          alt={profile.username} 
                          className="table-user-avatar"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=32&h=32&q=80';
                          }}
                        />
                        <div>
                          <div className="table-username">@{profile.username}</div>
                          {profile.location && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {profile.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{profile.followers.toLocaleString()}</td>
                    <td>{profile.public_repos.toLocaleString()}</td>
                    <td>{profile.total_stars.toLocaleString()}</td>
                    <td>{profile.total_forks.toLocaleString()}</td>
                    <td>
                      <span 
                        className="table-score-badge"
                        style={{ backgroundColor: scoreStyle.bg, color: scoreStyle.color }}
                      >
                        {profile.developer_score.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button
                          className="action-icon-btn view"
                          title="View Analysis Details"
                          onClick={() => onSelect(profile)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="action-icon-btn delete"
                          title="Delete Analyzed Profile"
                          onClick={() => onDelete(profile.username)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                  {isTableLoading ? 'Refreshing profiles...' : 'No analyzed profiles found. Try analyzing one above!'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <span style={{ color: 'var(--text-muted)' }}>
            Page <strong>{currentPage}</strong> of {totalPages}
          </span>
          <div className="pagination-buttons">
            <button
              className="pagination-btn"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronLeft size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> Previous
            </button>
            <button
              className="pagination-btn"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next <ChevronRight size={16} style={{ display: 'inline', verticalAlign: 'middle' }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
