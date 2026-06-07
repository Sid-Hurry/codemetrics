import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash } from 'lucide-react';
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
                    src={fav.avatar_url}
                    alt={fav.username}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid var(--border-color)', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=32&h=32&q=80';
                    }}
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
                  onClick={() => navigate(`/app/search?q=${fav.username}`)}
                  className="btn btn-primary"
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', flexGrow: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  <Eye size={14} /> View Details
                </button>
                <button
                  onClick={(e) => handleRemoveFavorite(e, fav.favorite_id)}
                  className="btn"
                  style={{ padding: '4px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-error)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                  title="Remove bookmark"
                >
                  <Trash size={14} style={{ color: 'var(--text-secondary)' }} />
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
