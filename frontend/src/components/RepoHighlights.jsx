import React from 'react';
import { Star, GitFork, ExternalLink, BookOpen, Code } from 'lucide-react';

const RepoHighlights = React.memo(({ totalStars, totalForks, mostStarredRepo, mostStarredRepoStars, username, publicRepos, publicGists }) => {
  const repoUrl = mostStarredRepo ? `https://github.com/${username}/${mostStarredRepo}` : null;

  return (
    <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <h3 className="search-widget-title" style={{ marginBottom: '1.25rem' }}>
          Repository Insights
        </h3>
        
        <div className="stats-badge-grid">
          {/* Stars */}
          <div className="stat-badge-card stars">
            <Star fill="hsl(45, 100%, 55%)" />
            <div>
              <div className="stat-badge-title">Total Stars</div>
              <div className="stat-badge-value">{totalStars.toLocaleString()}</div>
            </div>
          </div>
          
          {/* Forks */}
          <div className="stat-badge-card forks">
            <GitFork />
            <div>
              <div className="stat-badge-title">Total Forks</div>
              <div className="stat-badge-value">{totalForks.toLocaleString()}</div>
            </div>
          </div>

          {/* Repositories count */}
          <div className="stat-badge-card">
            <BookOpen />
            <div>
              <div className="stat-badge-title">Repositories</div>
              <div className="stat-badge-value">{(publicRepos || 0).toLocaleString()}</div>
            </div>
          </div>

          {/* Gists count */}
          <div className="stat-badge-card">
            <Code />
            <div>
              <div className="stat-badge-title">Public Gists</div>
              <div className="stat-badge-value">{(publicGists || 0).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="most-starred-widget">
        <div className="most-starred-label">
          Most Starred Repository
        </div>
        {mostStarredRepo ? (
          <>
            <a 
              href={repoUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="most-starred-name"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {mostStarredRepo}
              <ExternalLink size={12} />
            </a>
            <div className="most-starred-stars">
              <Star size={14} fill="currentColor" />
              <span>{mostStarredRepoStars.toLocaleString()} stars</span>
            </div>
          </>
        ) : (
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No public repositories found</span>
        )}
      </div>
    </div>
  );
});

export default RepoHighlights;
