import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash2 } from 'lucide-react';
import { api } from '../utils/api';

export default function Favorites({ addToast }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await api.getFavorites();
      setFavorites(response.data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (e, id) => {
    e.stopPropagation();
    try {
      await api.removeFavorite(id);
      addToast('Removed from favorites.', 'success');
      fetchFavorites();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Bookmarked Developers</h1>
        <p className="page-description">Quickly reference and monitor your saved developer analytics profiles.</p>
      </div>

      {loading ? (
        <div className="kpi-grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton" style={{ height: '180px', borderRadius: '8px' }}></div>
          ))}
        </div>
      ) : favorites.length > 0 ? (
        <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {favorites.map((fav) => (
            <div
              key={fav.favorite_id}
              className="card"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: 0, height: '100%', border: '1px solid var(--border-color)', transition: 'var(--transition)' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <img
                    src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='8' r='4'/><path d='M18 21a6 6 0 0 0-12 0'/></svg>"
                    alt={fav.username}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid var(--border-color)', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                      {fav.name || fav.username}
                    </h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>@{fav.username}</div>
                  </div>
                </div>

                {fav.bio && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.4rem', lineHeight: '1.2rem' }}>
                    {fav.bio}
                  </p>
                )}

                {/* Micro stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginBottom: '1rem' }}>
                  <div>Score: <strong>{fav.developer_score}</strong></div>
                  <div>Followers: <strong>{fav.followers}</strong></div>
                  <div>Repos: <strong>{fav.public_repos}</strong></div>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={fav.top_languages}>Lang: <strong>{fav.top_languages.split(',')[0] || 'N/A'}</strong></div>
                </div>
              </div>

              {/* Actions row */}
              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                <button
                  onClick={() => navigate(`/app?q=${fav.username}`)}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '0.4rem 0.75rem', fontSize: '0.8rem', flexGrow: 1 }}
                >
                  <Eye style={{ width: '14px', height: '14px' }} />
                  View Details
                </button>
                <button
                  onClick={(e) => handleRemoveFavorite(e, fav.favorite_id)}
                  className="btn"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '0.4rem 0.75rem', fontSize: '0.8rem', width: 'auto' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-error)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                  title="Remove bookmark"
                >
                  <Trash2 style={{ width: '14px', height: '14px' }} />
                  Remove
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Empty Bookmark state */
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }} className="card">
          <h4 style={{ fontWeight: '600', color: 'var(--text-primary)' }}>No Bookmarks Saved</h4>
          <p style={{ fontSize: '0.85rem', maxWidth: '300px', margin: '0.25rem auto 0 auto' }}>
            Bookmarked developer profiles will appear here for fast, direct access to detailed metrics.
          </p>
        </div>
      )}
    </div>
  );
}
