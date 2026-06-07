import React, { useState, useEffect } from 'react';
import { Trash } from 'lucide-react';
import { api } from '../utils/api';

export default function Compare({ addToast }) {
  const [profiles, setProfiles] = useState([]);
  const [selectedUserA, setSelectedUserA] = useState('');
  const [selectedUserB, setSelectedUserB] = useState('');
  
  const [comparisonSummary, setComparisonSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Load analyzed profiles to populate selectors
  const loadSelectorProfiles = async () => {
    try {
      const response = await api.getProfiles({ page: 1, limit: 100, sortBy: 'username', order: 'ASC' });
      setProfiles(response.data);
    } catch (err) {
      console.error('Failed to load selector list: ', err);
    }
  };

  // Load past comparisons
  const loadComparisonsHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await api.getComparisons();
      setHistory(response.data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadSelectorProfiles();
    loadComparisonsHistory();
  }, []);

  const profileA = profiles.find(p => p.username === selectedUserA);
  const profileB = profiles.find(p => p.username === selectedUserB);

  // Reset comparison summary when selections change
  useEffect(() => {
    setComparisonSummary('');
  }, [selectedUserA, selectedUserB]);

  // Generate comparison summary via Gemini API
  const handleGenerateAISummary = async () => {
    if (!profileA || !profileB) return;
    setAiLoading(true);
    addToast('Generating Gemini AI comparative summary...', 'success');
    try {
      const response = await api.aiCompare(profileA.username, profileB.username);
      setComparisonSummary(response.data.summary);
      addToast('AI comparison generated and logged!', 'success');
      loadComparisonsHistory(); // Refresh history log list
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setAiLoading(false);
    }
  };

  // Helper to determine the winner of a metric row
  const getWinnerClass = (valA, valB, side) => {
    if (valA === valB) return '';
    if (valA > valB && side === 'A') return 'winner-highlight';
    if (valB > valA && side === 'B') return 'winner-highlight';
    return '';
  };

  // Delete comparison log
  const handleDeleteLog = async (e, id) => {
    e.stopPropagation();
    try {
      await api.deleteComparison(id);
      addToast('Comparison log removed.', 'success');
      loadComparisonsHistory();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Load comparison from history
  const handleSelectHistoryLog = (log) => {
    setSelectedUserA(log.username1);
    setSelectedUserB(log.username2);
    setComparisonSummary(log.ai_summary);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Developer Comparison</h1>
        <p className="page-description">Run side-by-side metric evaluations and generate AI comparative summaries.</p>
      </div>

      {/* Selectors card */}
      <div className="card">
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label className="form-label">Developer A</label>
            <select
              className="form-input"
              value={selectedUserA}
              onChange={(e) => setSelectedUserA(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="">Select a developer...</option>
              {profiles
                .filter(p => p.username !== selectedUserB)
                .map(p => (
                  <option key={p.id} value={p.username}>
                    @{p.username} ({p.name || p.username})
                  </option>
                ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <label className="form-label">Developer B</label>
            <select
              className="form-input"
              value={selectedUserB}
              onChange={(e) => setSelectedUserB(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="">Select a developer...</option>
              {profiles
                .filter(p => p.username !== selectedUserA)
                .map(p => (
                  <option key={p.id} value={p.username}>
                    @{p.username} ({p.name || p.username})
                  </option>
                ))}
            </select>
          </div>

        </div>
      </div>

      {/* Comparison Duel View */}
      {profileA && profileB ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* Header Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: 0 }}>
              <img 
                src={profileA.avatar_url} 
                alt={profileA.username} 
                style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid var(--border-color)' }}
              />
              <div>
                <h4 style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{profileA.name || profileA.username}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>@{profileA.username}</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: 0 }}>
              <img 
                src={profileB.avatar_url} 
                alt={profileB.username} 
                style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid var(--border-color)' }}
              />
              <div>
                <h4 style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{profileB.name || profileB.username}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>@{profileB.username}</div>
              </div>
            </div>
          </div>

          {/* Metrics comparison table */}
          <div className="table-wrapper">
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>@{profileA.username}</th>
                  <th style={{ width: '20%', textAlign: 'center' }}>Metric</th>
                  <th style={{ width: '40%', textAlign: 'right' }}>@{profileB.username}</th>
                </tr>
              </thead>
              <tbody>
                {/* Developer Score */}
                <tr>
                  <td className={getWinnerClass(profileA.developer_score, profileB.developer_score, 'A')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {profileA.developer_score}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: '600', color: 'var(--text-primary)' }}>
                    Developer Score
                  </td>
                  <td className={getWinnerClass(profileA.developer_score, profileB.developer_score, 'B')} style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                      {profileB.developer_score}
                    </div>
                  </td>
                </tr>

                {/* Followers */}
                <tr>
                  <td className={getWinnerClass(profileA.followers, profileB.followers, 'A')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {profileA.followers.toLocaleString()}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: '500' }}>
                    Followers
                  </td>
                  <td className={getWinnerClass(profileA.followers, profileB.followers, 'B')} style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                      {profileB.followers.toLocaleString()}
                    </div>
                  </td>
                </tr>

                {/* Repos */}
                <tr>
                  <td className={getWinnerClass(profileA.public_repos, profileB.public_repos, 'A')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {profileA.public_repos.toLocaleString()}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: '500' }}>
                    Repositories
                  </td>
                  <td className={getWinnerClass(profileA.public_repos, profileB.public_repos, 'B')} style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                      {profileB.public_repos.toLocaleString()}
                    </div>
                  </td>
                </tr>

                {/* Stars */}
                <tr>
                  <td className={getWinnerClass(profileA.total_stars, profileB.total_stars, 'A')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {profileA.total_stars.toLocaleString()}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: '500' }}>
                    Total Stars
                  </td>
                  <td className={getWinnerClass(profileA.total_stars, profileB.total_stars, 'B')} style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                      {profileB.total_stars.toLocaleString()}
                    </div>
                  </td>
                </tr>

                {/* Forks */}
                <tr>
                  <td className={getWinnerClass(profileA.total_forks, profileB.total_forks, 'A')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {profileA.total_forks.toLocaleString()}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: '500' }}>
                    Total Forks
                  </td>
                  <td className={getWinnerClass(profileA.total_forks, profileB.total_forks, 'B')} style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                      {profileB.total_forks.toLocaleString()}
                    </div>
                  </td>
                </tr>

                {/* Top Stack */}
                <tr>
                  <td>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{profileA.top_languages || 'N/A'}</span>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: '500' }}>
                    Top Stack
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{profileB.top_languages || 'N/A'}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* AI Narration Comparison summary */}
          <div className="card" style={{ border: '1px solid #c7d2fe', backgroundColor: '#f5f3ff', padding: '1.5rem', marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-primary)' }}>AI Duel Analysis Summary</h4>
              {!comparisonSummary && (
                <button 
                  onClick={handleGenerateAISummary} 
                  className="btn btn-primary"
                  style={{ width: 'auto', padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                  disabled={aiLoading}
                >
                  {aiLoading ? 'Analyzing...' : 'Generate AI Review'}
                </button>
              )}
            </div>
            
            {comparisonSummary ? (
              <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-primary)', backgroundColor: '#ffffff', padding: '1rem', borderRadius: '6px', border: '1px solid #e0e7ff' }}>
                {comparisonSummary}
              </p>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Click the button to prompt Gemini to draft a professional side-by-side candidate comparison summary.
              </p>
            )}
          </div>

        </div>
      ) : (
        /* Empty Duel Selection state */
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }} className="card">
          <h4 style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Select Developers to Compare</h4>
          <p style={{ fontSize: '0.85rem', maxWidth: '340px', margin: '0.25rem auto 0 auto' }}>
            Choose two candidate developer records from your workspace list in the selectors above to inspect comparative metrics.
          </p>
        </div>
      )}

      {/* Comparison History Log list */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Comparison Logs History</h3>
        </div>

        {historyLoading ? (
          <div className="skeleton" style={{ height: '120px', borderRadius: '8px' }}></div>
        ) : history.length > 0 ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Developer A</th>
                  <th>Developer B</th>
                  <th>Outcome Summary Preview</th>
                  <th>Logged Date</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map((log) => (
                  <tr 
                    key={log.comparison_id} 
                    onClick={() => handleSelectHistoryLog(log)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <img 
                          src={log.avatar_url1} 
                          alt={log.username1} 
                          style={{ width: '20px', height: '20px', borderRadius: '50%' }}
                        />
                        <span style={{ fontWeight: '600' }}>@{log.username1}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <img 
                          src={log.avatar_url2} 
                          alt={log.username2} 
                          style={{ width: '20px', height: '20px', borderRadius: '50%' }}
                        />
                        <span style={{ fontWeight: '600' }}>@{log.username2}</span>
                      </div>
                    </td>
                    <td>
                      <div 
                        style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem', color: 'var(--text-muted)' }}
                        title={log.ai_summary}
                      >
                        {log.ai_summary || 'No AI summary logged.'}
                      </div>
                    </td>
                    <td>{new Date(log.compared_at).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteLog(e, log.comparison_id); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                          title="Delete log"
                        >
                          <Trash size={14} style={{ color: 'var(--text-muted)' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No comparison logs found. Run a candidate comparison with AI narration to save reviews.
          </div>
        )}
      </div>
    </div>
  );
}
