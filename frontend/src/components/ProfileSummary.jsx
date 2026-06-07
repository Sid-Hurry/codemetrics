import React from 'react';
import { MapPin, Users, BookOpen, Calendar, ExternalLink, Download, Share2 } from 'lucide-react';

const ProfileSummary = React.memo(({ profile, addToast }) => {
  if (!profile) return null;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${profile.username}_github_analysis.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    if (addToast) addToast('Successfully exported analysis report as JSON.', 'success');
  };

  const handleCopyBadge = () => {
    const badgeMarkdown = `[![Developer Rating](https://img.shields.io/badge/Developer%20Rating-${profile.developer_score}-6366f1?style=flat-square)](https://github.com/${profile.username})`;
    navigator.clipboard.writeText(badgeMarkdown);
    if (addToast) addToast('Copied GitHub README badge markdown to clipboard!', 'success');
  };

  return (
    <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div className="profile-card-header">
          <div className="profile-avatar-wrapper">
            <img 
              src={profile.avatar_url || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='8' r='4'/><path d='M18 21a6 6 0 0 0-12 0'/></svg>"} 
              alt={profile.name || profile.username} 
              className="profile-avatar"
            />
          </div>
          <div className="profile-names">
            <h3 className="profile-realname">{profile.name || profile.username}</h3>
            <a 
              href={profile.profile_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="profile-username-link"
            >
              @{profile.username}
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <div className="profile-bio">
          {profile.bio || "This developer hasn't published a biography yet."}
        </div>

        <div className="profile-details-grid">
          {profile.location && (
            <div className="profile-detail-item">
              <MapPin />
              <span>{profile.location}</span>
            </div>
          )}
          
          <div className="profile-detail-item">
            <Users />
            <span>
              <strong>{profile.followers.toLocaleString()}</strong> followers &middot; <strong>{profile.following.toLocaleString()}</strong> following
            </span>
          </div>

          <div className="profile-detail-item">
            <BookOpen />
            <span>
              <strong>{profile.public_repos.toLocaleString()}</strong> public repos &middot; <strong>{profile.public_gists.toLocaleString()}</strong> gists
            </span>
          </div>

          <div className="profile-detail-item">
            <Calendar />
            <span>Member since {formatDate(profile.account_created_at)}</span>
          </div>
        </div>
      </div>

      {/* Export & Sharing Subsection */}
      <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={handleExportJSON}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            padding: '0.5rem 0.75rem',
            fontSize: '0.8rem',
            fontWeight: '600',
            fontFamily: 'var(--font-sans)',
            background: 'var(--bg-primary)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-secondary)',
            borderRadius: 'var(--border-radius-md)',
            cursor: 'pointer'
          }}
          className="action-icon-btn-text"
        >
          <Download size={14} /> Export Report
        </button>

        <button
          onClick={handleCopyBadge}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            padding: '0.5rem 0.75rem',
            fontSize: '0.8rem',
            fontWeight: '600',
            fontFamily: 'var(--font-sans)',
            background: 'var(--bg-primary)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-secondary)',
            borderRadius: 'var(--border-radius-md)',
            cursor: 'pointer'
          }}
          className="action-icon-btn-text"
        >
          <Share2 size={14} /> Copy Badge
        </button>
      </div>
    </div>
  );
});

export default ProfileSummary;
