import React, { useState } from 'react';
import { Search, Github, Loader2 } from 'lucide-react';

export default function SearchBar({ onSearch, isLoading }) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    onSearch(username.trim());
  };

  return (
    <div className="glass-card">
      <h2 className="search-widget-title">
        Analyze Profile
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="search-input-group">
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Enter GitHub username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              required
            />
            <Search className="search-icon-input" size={18} />
          </div>
          <button 
            type="submit" 
            className="search-btn"
            disabled={isLoading || !username.trim()}
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" style={{ animation: 'shimmer 1s infinite linear' }} />
            ) : (
              'Analyze'
            )}
          </button>
        </div>
      </form>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0.25rem' }}>
        e.g., torvalds, gaearon, yyx990803, defunkt
      </p>
    </div>
  );
}
