import React, { useState } from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { api } from '../utils/api';

export default function Profile({ profile, onUpdateProfile, addToast }) {
  const [regenerating, setRegenerating] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const {
    id,
    username,
    name,
    bio,
    location,
    followers = 0,
    following = 0,
    public_repos = 0,
    public_gists = 0,
    profile_url,
    avatar_url,
    total_stars = 0,
    total_forks = 0,
    most_starred_repo = '',
    most_starred_repo_stars = 0,
    most_forked_repo = '',
    most_forked_repo_forks = 0,
    average_stars_per_repo = 0,
    average_forks_per_repo = 0,
    profile_completeness_score = 0,
    top_languages = '',
    language_distribution = {},
    developer_score = 0,
    ai_summary = '',
    ai_strengths = [],
    ai_improvements = [],
    ai_skill_assessment = {},
    ai_career_path = ''
  } = profile;

  const handleToggleFavorite = async () => {
    setFavoriteLoading(true);
    try {
      const favoritesList = await api.getFavorites();
      const existingFav = favoritesList.data.find(fav => fav.username === username);

      if (existingFav) {
        await api.removeFavorite(existingFav.favorite_id);
        addToast('Removed from favorites.', 'success');
      } else {
        await api.addFavorite(id, username);
        addToast('Saved to favorites.', 'success');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleRegenerateAI = async () => {
    setRegenerating(true);
    addToast('Regenerating AI analytics and developer summary...', 'success');
    try {
      const response = await api.aiRegenerate(username);
      onUpdateProfile(response.data);
      addToast('AI Insights successfully updated!', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setRegenerating(false);
    }
  };

  const radarData = ai_skill_assessment ? [
    { subject: 'Frontend', value: ai_skill_assessment.frontend || 0 },
    { subject: 'Backend', value: ai_skill_assessment.backend || 0 },
    { subject: 'Mobile', value: ai_skill_assessment.mobile || 0 },
    { subject: 'DevOps', value: ai_skill_assessment.devops || 0 },
    { subject: 'Data Sci', value: ai_skill_assessment.dataScience || 0 },
    { subject: 'Open Src', value: ai_skill_assessment.openSource || 0 }
  ] : [];

  const pieData = language_distribution ? Object.entries(language_distribution).map(([name, value]) => ({
    name,
    value
  })).sort((a, b) => b.value - a.value) : [];

  const CHART_COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div>
      {/* 1. Header Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <img 
              src={avatar_url} 
              alt={username} 
              style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid var(--border-color)', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=32&h=32&q=80';
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                  {name || username}
                </h2>
                {ai_career_path && (
                  <span className="badge badge-indigo">
                    {ai_career_path}
                  </span>
                )}
              </div>
              <a 
                href={profile_url} 
                target="_blank" 
                rel="noreferrer" 
                style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '0.25rem' }}
              >
                @{username}
              </a>
              {bio && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: '600px' }}>{bio}</p>}
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {location && <span>{location}</span>}
                <span>{followers.toLocaleString()} Followers · {following.toLocaleString()} Following</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={handleToggleFavorite} 
              className="btn" 
              style={{ padding: '0.5rem 1rem', width: 'auto', fontSize: '0.85rem', fontWeight: '600' }}
              disabled={favoriteLoading}
            >
              Favorite
            </button>
            <button 
              onClick={handleRegenerateAI} 
              className="btn btn-primary" 
              style={{ padding: '0.5rem 1rem', width: 'auto', fontSize: '0.85rem', fontWeight: '600' }}
              disabled={regenerating}
            >
              {regenerating ? 'Regenerating...' : 'Refresh AI'}
            </button>
          </div>

        </div>
      </div>

      {/* 2. Grid for Core Metrics & Visualizations */}
      <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
        
        {/* Left Column: Gauge and Key Aggregates */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Gauge score card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.5px', marginBottom: '1rem' }}>
              Developer score
            </h4>
            <div className="score-widget">
              <div className="score-circle high-tier">
                <span className="score-number">{developer_score}</span>
                <span className="score-label">Rating</span>
              </div>
              <span className="badge" style={{ fontWeight: '700', letterSpacing: '0.5px' }}>
                Completeness: {profile_completeness_score}%
              </span>
            </div>
          </div>

          {/* Repo Highlights details */}
          <div className="card">
            <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
              Highlights
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Starred Repository</span>
                <span style={{ fontWeight: '600', color: 'var(--accent-primary)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={most_starred_repo}>
                  {most_starred_repo || 'None'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Starred Stars</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{most_starred_repo_stars} ★</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Forked Repository</span>
                <span style={{ fontWeight: '600', color: 'var(--text-secondary)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={most_forked_repo}>
                  {most_forked_repo || 'None'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Forked Forks</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{most_forked_repo_forks} ⑂</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Repository Insights & Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Key Stat Cards Grid (Cleaned and minimal) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
            <div className="card" style={{ padding: '1rem', marginBottom: 0, textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Repositories</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>{public_repos}</div>
            </div>

            <div className="card" style={{ padding: '1rem', marginBottom: 0, textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Total Stars</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>{total_stars.toLocaleString()}</div>
            </div>

            <div className="card" style={{ padding: '1rem', marginBottom: 0, textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Total Forks</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>{total_forks.toLocaleString()}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
            <div className="card" style={{ padding: '1rem', marginBottom: 0, textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Avg Stars/Repo</div>
              <div style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>{average_stars_per_repo}</div>
            </div>
            <div className="card" style={{ padding: '1rem', marginBottom: 0, textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Avg Forks/Repo</div>
              <div style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>{average_forks_per_repo}</div>
            </div>
            <div className="card" style={{ padding: '1rem', marginBottom: 0, textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Top Languages</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-primary)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={top_languages}>
                {top_languages || 'N/A'}
              </div>
            </div>
          </div>

          {/* Languages Distribution Pie Chart */}
          {pieData.length > 0 && (
            <div className="card" style={{ marginBottom: 0 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                Language Distribution
              </h4>
              <div style={{ height: '200px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} Repos`]} />
                    <Legend iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 3. Dedicated AI Insights Section */}
      <div className="card" style={{ border: '1px solid #c7d2fe', backgroundColor: '#f5f3ff', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #ddd6fe', paddingBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Gemini AI Insights Engine
          </h3>
        </div>

        {/* AI summary block */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
            Developer Summary
          </div>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.6', backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '6px', border: '1px solid #e0e7ff' }}>
            {ai_summary || 'AI Summary has not been generated for this developer. Click Refresh AI to generate insights.'}
          </p>
        </div>

        <div className="dashboard-grid">
          {/* Radar skill ratings */}
          <div>
            <div className="card" style={{ backgroundColor: '#ffffff', height: '100%', marginBottom: 0, padding: '1.25rem', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.5px', marginBottom: '1rem' }}>
                Skill Assessment
              </h4>
              {radarData.length > 0 ? (
                <div style={{ height: '220px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 500 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--text-muted)' }} />
                      <Radar 
                        name="Skills" 
                        dataKey="value" 
                        stroke="var(--accent-primary)" 
                        fill="var(--accent-primary)" 
                        fillOpacity={0.15} 
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Skill assessment scores not populated.
                </div>
              )}
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Strengths card */}
            <div className="card" style={{ backgroundColor: '#ffffff', marginBottom: 0, padding: '1.25rem', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-success)', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>
                Key Strengths
              </h4>
              {ai_strengths && ai_strengths.length > 0 ? (
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {ai_strengths.map((str, idx) => (
                    <li key={idx} style={{ listStyleType: 'disc' }}>{str}</li>
                  ))}
                </ul>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No strengths generated.</div>
              )}
            </div>

            {/* Improvements card */}
            <div className="card" style={{ backgroundColor: '#ffffff', marginBottom: 0, padding: '1.25rem', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-error)', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>
                Improvement Areas
              </h4>
              {ai_improvements && ai_improvements.length > 0 ? (
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {ai_improvements.map((imp, idx) => (
                    <li key={idx} style={{ listStyleType: 'disc' }}>{imp}</li>
                  ))}
                </ul>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No improvement items generated.</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
