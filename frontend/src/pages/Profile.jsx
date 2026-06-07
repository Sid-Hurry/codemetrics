import React, { useState, useEffect } from 'react';
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
import { 
  Compass, 
  Layers, 
  BookOpen, 
  Briefcase, 
  Award, 
  RefreshCw 
} from 'lucide-react';
import { api } from '../utils/api';

export default function Profile({ profile, onUpdateProfile, addToast }) {
  const [regenerating, setRegenerating] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [careerInsights, setCareerInsights] = useState(null);
  const [careerLoading, setCareerLoading] = useState(false);
  const [careerRegenerating, setCareerRegenerating] = useState(false);


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

  const fetchCareerInsights = async (force = false) => {
    if (force) {
      setCareerRegenerating(true);
    } else {
      setCareerLoading(true);
    }
    try {
      let res;
      if (force) {
        res = await api.regenerateCareerInsights(username);
      } else {
        res = await api.getCareerInsights(username);
      }
      if (res && res.data) {
        setCareerInsights(res.data);
        if (force) {
          addToast('Career Insights successfully regenerated!', 'success');
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to load career insights.', 'error');
    } finally {
      setCareerLoading(false);
      setCareerRegenerating(false);
    }
  };

  useEffect(() => {
    // Reset cached career insights and set tab to overview on profile changes
    setCareerInsights(null);
    setActiveTab('overview');
  }, [username]);

  useEffect(() => {
    if (activeTab === 'career' && !careerInsights) {
      fetchCareerInsights(false);
    }
  }, [activeTab, username, careerInsights]);

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
              src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='8' r='4'/><path d='M18 21a6 6 0 0 0-12 0'/></svg>" 
              alt={username} 
              style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid var(--border-color)', objectFit: 'cover' }}
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

      {/* Tab Navigation */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', gap: '1.5rem' }}>
        <button 
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '0.75rem 0.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'overview' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'overview' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          style={{
            padding: '0.75rem 0.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'analytics' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'analytics' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
        >
          Analytics
        </button>
        <button 
          onClick={() => setActiveTab('ai_insights')}
          style={{
            padding: '0.75rem 0.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'ai_insights' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'ai_insights' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
        >
          AI Insights
        </button>
        <button 
          onClick={() => setActiveTab('career')}
          style={{
            padding: '0.75rem 0.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'career' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'career' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
        >
          Career Intelligence
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="dashboard-grid">
          {/* Left Column: Gauge and Key Aggregates */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Gauge score card */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center', marginBottom: 0 }}>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.5px', marginBottom: '1rem' }}>
                Developer score
              </h4>
              <div className="score-widget" style={{ padding: '0.5rem 0' }}>
                <div className="score-circle high-tier" style={{ marginBottom: '1rem' }}>
                  <span className="score-number">{developer_score}</span>
                  <span className="score-label">Rating</span>
                </div>
                <span className="badge" style={{ fontWeight: '700', letterSpacing: '0.5px' }}>
                  Completeness: {profile_completeness_score}%
                </span>
              </div>
            </div>

            {/* Repo Highlights details */}
            <div className="card" style={{ marginBottom: 0 }}>
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

          {/* Right Column: Repository Insights & Stat Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
              <div className="card" style={{ padding: '1.25rem', marginBottom: 0, textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Repositories</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>{public_repos}</div>
              </div>

              <div className="card" style={{ padding: '1.25rem', marginBottom: 0, textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Total Stars</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>{total_stars.toLocaleString()}</div>
              </div>

              <div className="card" style={{ padding: '1.25rem', marginBottom: 0, textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Total Forks</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>{total_forks.toLocaleString()}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
              <div className="card" style={{ padding: '1.25rem', marginBottom: 0, textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Avg Stars/Repo</div>
                <div style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>{average_stars_per_repo}</div>
              </div>
              <div className="card" style={{ padding: '1.25rem', marginBottom: 0, textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Avg Forks/Repo</div>
                <div style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>{average_forks_per_repo}</div>
              </div>
              <div className="card" style={{ padding: '1.25rem', marginBottom: 0, textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Top Languages</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--accent-primary)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={top_languages}>
                  {top_languages || 'N/A'}
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', marginBottom: 0 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                Developer Details
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>GitHub Gists:</span> <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{public_gists}</span></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Location:</span> <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{location || 'Not Specified'}</span></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Followers Ratio:</span> <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{following > 0 ? (followers / following).toFixed(2) : followers}x</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {pieData.length > 0 ? (
            <div className="card" style={{ marginBottom: 0 }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                Language Distribution
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem', alignItems: 'center' }}>
                <div style={{ height: '260px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h5 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>
                    Breakdown by Repository Count
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {pieData.map((item, idx) => {
                      const totalRepos = pieData.reduce((acc, curr) => acc + curr.value, 0);
                      const percent = totalRepos > 0 ? ((item.value / totalRepos) * 100).toFixed(1) : 0;
                      const color = CHART_COLORS[idx % CHART_COLORS.length];
                      return (
                        <div key={item.name}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                            <span style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }}></span>
                              {item.name}
                            </span>
                            <span style={{ color: 'var(--text-muted)' }}>{item.value} repos ({percent}%)</span>
                          </div>
                          <div className="lang-percentage-bar" style={{ height: '8px', marginTop: 0 }}>
                            <div className="lang-percentage-fill" style={{ width: `${percent}%`, backgroundColor: color }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No language distribution data available.
            </div>
          )}
        </div>
      )}

      {activeTab === 'ai_insights' && (
        <div className="card" style={{ border: '1px solid #e2e8f0', padding: '2rem', marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Gemini Profile Insights
            </h3>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
              Developer Summary
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.6', backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '6px', border: '1px solid #e2e8f0', filter: 'grayscale(1)' }}>
              {ai_summary || 'AI Summary has not been generated for this developer. Click Refresh AI to generate insights.'}
            </p>
          </div>

          <div className="dashboard-grid">
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="card" style={{ backgroundColor: '#ffffff', marginBottom: 0, padding: '1.25rem', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-success)', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>
                  Key Strengths
                </h4>
                {ai_strengths && ai_strengths.length > 0 ? (
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {ai_strengths.map((str, idx) => (
                      <li key={idx} style={{ listStyleType: 'disc', filter: 'grayscale(1)' }}>{str}</li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No strengths generated.</div>
                )}
              </div>

              <div className="card" style={{ backgroundColor: '#ffffff', marginBottom: 0, padding: '1.25rem', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-error)', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>
                  Improvement Areas
                </h4>
                {ai_improvements && ai_improvements.length > 0 ? (
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {ai_improvements.map((imp, idx) => (
                      <li key={idx} style={{ listStyleType: 'disc', filter: 'grayscale(1)' }}>{imp}</li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No improvement items generated.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'career' && (
        <div>
          {careerLoading ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ display: 'inline-block', animation: 'spin 1.5s linear infinite', width: '2rem', height: '2rem', border: '3px solid var(--border-color)', borderTopColor: 'var(--text-primary)', borderRadius: '50%', marginBottom: '1rem' }}></div>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Analyzing profile and generating career intelligence recommendations...</p>
            </div>
          ) : !careerInsights ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <Compass style={{ width: '3rem', height: '3rem', color: 'var(--text-muted)', margin: '0 auto 1rem', display: 'block' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Career Intelligence Generated</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem', maxWidth: '460px', margin: '0 auto 1.5rem' }}>
                Analyze this developer's profile to map their career trajectory, identify skill gaps, build a personalized learning roadmap, and get 5 custom project recommendations.
              </p>
              <button className="btn btn-primary" onClick={() => fetchCareerInsights(false)} style={{ width: 'auto', padding: '0.5rem 1.5rem' }}>
                Generate Career Insights
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Career Path & Level Card */}
              <div className="card" style={{ border: '1px solid var(--border-color)', margin: 0, padding: '1.75rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '1.75rem', right: '1.75rem' }}>
                  <button 
                    onClick={() => fetchCareerInsights(true)}
                    className="btn" 
                    style={{ width: 'auto', padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    disabled={careerRegenerating}
                  >
                    <RefreshCw className={careerRegenerating ? "spin-icon" : ""} style={{ width: '14px', height: '14px' }} />
                    {careerRegenerating ? 'Regenerating...' : 'Refresh Career Plan'}
                  </button>
                </div>
                <style>{`
                  .spin-icon {
                    animation: spin 1.5s linear infinite;
                  }
                `}</style>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <Compass style={{ width: '20px', height: '20px', color: 'var(--text-primary)' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Career Trajectory & Assessment</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Recommended Path</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>
                      {careerInsights.career_path}
                    </div>
                    <div style={{ marginTop: '0.5rem' }}>
                      <span className="badge badge-indigo" style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}>
                        {careerInsights.current_level}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Readiness Confidence</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '8px' }}>
                      <div style={{ flexGrow: 1, height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${careerInsights.career_recommendations?.confidence || 50}%`, height: '100%', backgroundColor: 'var(--text-primary)' }}></div>
                      </div>
                      <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', minWidth: '40px' }}>
                        {careerInsights.career_recommendations?.confidence || 50}%
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>Based on calculated Developer Score and language competencies.</p>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '0.5rem' }}>Path Rationale & Explanation</div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0, filter: 'grayscale(1)' }}>
                    {careerInsights.career_recommendations?.explanation}
                  </p>
                </div>
              </div>

              {/* Skill Gap Analysis */}
              <div className="card" style={{ border: '1px solid var(--border-color)', margin: 0, padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <Layers style={{ width: '20px', height: '20px', color: 'var(--text-primary)' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Skill Gap Analysis</h3>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Key areas and methodologies the developer should prioritize to align with the target career track.
                </p>

                <div className="table-wrapper" style={{ border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th style={{ width: '25%' }}>Skill Name</th>
                        <th style={{ width: '15%' }}>Category</th>
                        <th style={{ width: '15%' }}>Importance</th>
                        <th style={{ width: '45%' }}>Relevance / Rationale</th>
                      </tr>
                    </thead>
                    <tbody>
                      {careerInsights.skill_gaps && careerInsights.skill_gaps.length > 0 ? (
                        careerInsights.skill_gaps.map((gap, idx) => (
                          <tr key={idx}>
                            <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{gap.skill}</td>
                            <td>
                              <span className="badge" style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>
                                {gap.category}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${gap.importance === 'High' ? 'badge-error' : 'badge-indigo'}`} style={{ fontSize: '0.7rem' }}>
                                {gap.importance}
                              </span>
                            </td>
                            <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.4', filter: 'grayscale(1)' }}>{gap.reason}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No skill gaps identified.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Learning Roadmap Timeline */}
              <div className="card" style={{ border: '1px solid var(--border-color)', margin: 0, padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <BookOpen style={{ width: '20px', height: '20px', color: 'var(--text-primary)' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Learning Roadmap</h3>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                  Step-by-step roadmap to acquire target skills and build production confidence.
                </p>

                <div style={{ position: 'relative', paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {/* Vertical timeline line */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    bottom: '8px',
                    left: '7px',
                    width: '2px',
                    backgroundColor: 'var(--border-color)'
                  }}></div>

                  {careerInsights.learning_roadmap && careerInsights.learning_roadmap.map((step, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      {/* Timeline node */}
                      <div style={{
                        position: 'absolute',
                        left: 'calc(-2rem - 5px)',
                        top: '4px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: '#ffffff',
                        border: '3px solid var(--text-primary)',
                        zIndex: 2
                      }}></div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem', filter: 'grayscale(1)' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                          Milestone {idx + 1}: {step.milestone}
                        </h4>
                        <span className="badge" style={{ fontSize: '0.75rem', fontWeight: '600' }}>
                          {step.estimated_time}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', fontSize: '0.85rem', marginTop: '0.5rem', filter: 'grayscale(1)' }}>
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Key Topics</div>
                          <ul style={{ paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--text-muted)' }}>
                            {step.topics && step.topics.map((t, i) => (
                              <li key={i} style={{ listStyleType: 'disc' }}>{t}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Recommended Resources</div>
                          <ul style={{ paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--text-muted)' }}>
                            {step.resources && step.resources.map((r, i) => (
                              <li key={i} style={{ listStyleType: 'disc' }}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Projects */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Briefcase style={{ width: '20px', height: '20px', color: 'var(--text-primary)' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Recommended Capstone Projects</h3>
                  </div>
                  <span className="badge badge-indigo" style={{ fontSize: '0.75rem', marginLeft: 'auto' }}>
                    Exactly 5 Projects
                  </span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Specially tailored engineering projects to practice new architectures and enrich your GitHub profile.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {careerInsights.recommended_projects && careerInsights.recommended_projects.map((proj, idx) => (
                    <div key={idx} className="card" style={{ border: '1px solid var(--border-color)', margin: 0, padding: '1.5rem', backgroundColor: '#ffffff', transition: 'var(--transition)', filter: 'grayscale(1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>0{idx + 1}.</span> {proj.name}
                          </h4>
                        </div>
                        <span className={`badge ${proj.difficulty === 'Advanced' ? 'badge-error' : 'badge-indigo'}`} style={{ fontSize: '0.75rem' }}>
                          {proj.difficulty}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>
                        {proj.description}
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Tech Stack</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {proj.tech_stack && proj.tech_stack.map(tech => (
                              <span key={tech} className="badge" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', backgroundColor: '#f1f5f9', border: '1px solid var(--border-color)' }}>
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Learning Outcome</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4' }}>{proj.learning_outcome}</div>
                        </div>

                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Growth Relevance</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4' }}>{proj.relevance}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Suggestions */}
              <div className="card" style={{ border: '1px solid var(--border-color)', margin: 0, padding: '1.75rem', backgroundColor: '#fafafa', filter: 'grayscale(1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <Award style={{ width: '20px', height: '20px', color: 'var(--text-primary)' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Actionable Growth Recommendations</h3>
                </div>
                <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  {careerInsights.career_recommendations?.suggestions && careerInsights.career_recommendations.suggestions.map((sug, idx) => (
                    <li key={idx} style={{ listStyleType: 'decimal', lineHeight: '1.5' }}>{sug}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

