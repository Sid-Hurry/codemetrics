import React, { useState } from 'react';
import { Users, BookOpen, Star, GitFork, Award, ArrowLeftRight, Check } from 'lucide-react';

export default function VersusMode({ profiles = [] }) {
  const [userA, setUserA] = useState('');
  const [userB, setUserB] = useState('');

  // Find the full profile objects based on selected usernames
  const profileA = profiles.find((p) => p.username === userA);
  const profileB = profiles.find((p) => p.username === userB);

  // Helper to determine the winner of a metric row
  const getWinner = (valA, valB) => {
    if (valA > valB) return 'A';
    if (valB > valA) return 'B';
    return 'tie';
  };

  // Helper to format values
  const formatVal = (val) => {
    return (val || 0).toLocaleString();
  };

  // Determine overall winner
  const overallWinner = () => {
    if (!profileA || !profileB) return null;
    const scoreA = profileA.developer_score || 0;
    const scoreB = profileB.developer_score || 0;
    if (scoreA > scoreB) return profileA;
    if (scoreB > scoreA) return profileB;
    return 'tie';
  };

  const winner = overallWinner();

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.3px' }}>Developer Duel</h2>
      </div>

      {/* Selectors */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
            Developer A
          </label>
          <select
            value={userA}
            onChange={(e) => setUserA(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid var(--glass-border)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              cursor: 'pointer'
            }}
          >
            <option value="">Select a developer...</option>
            {profiles
              .filter((p) => p.username !== userB)
              .map((p) => (
                <option key={p.id} value={p.username}>
                  @{p.username} ({p.name || p.username})
                </option>
              ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
            Developer B
          </label>
          <select
            value={userB}
            onChange={(e) => setUserB(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid var(--glass-border)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              cursor: 'pointer'
            }}
          >
            <option value="">Select a developer...</option>
            {profiles
              .filter((p) => p.username !== userA)
              .map((p) => (
                <option key={p.id} value={p.username}>
                  @{p.username} ({p.name || p.username})
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Comparison results */}
      {profileA && profileB ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Profiles Cards Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Developer A Card */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--border-radius-md)' }}>
              <img
                src={profileA.avatar_url}
                alt={profileA.username}
                style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--accent-primary)' }}
              />
              <div style={{ minWidth: 0 }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {profileA.name || profileA.username}
                </h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>@{profileA.username}</div>
              </div>
            </div>

            {/* Developer B Card */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--border-radius-md)' }}>
              <img
                src={profileB.avatar_url}
                alt={profileB.username}
                style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--accent-primary)' }}
              />
              <div style={{ minWidth: 0 }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {profileB.name || profileB.username}
                </h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>@{profileB.username}</div>
              </div>
            </div>
          </div>

          {/* Detailed Matrix Table */}
          <div className="table-responsive-wrapper" style={{ border: '1px solid var(--glass-border)', borderRadius: 'var(--border-radius-md)' }}>
            <table className="history-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>@{profileA.username}</th>
                  <th style={{ width: '20%', textAlign: 'center' }}>Metric</th>
                  <th style={{ width: '40%', textAlign: 'right' }}>@{profileB.username}</th>
                </tr>
              </thead>
              <tbody>
                {/* Followers Row */}
                <tr>
                  <td style={{ fontWeight: getWinner(profileA.followers, profileB.followers) === 'A' ? '700' : '400', color: getWinner(profileA.followers, profileB.followers) === 'A' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {getWinner(profileA.followers, profileB.followers) === 'A' && <Check size={14} style={{ color: 'var(--accent-success)' }} />}
                      {formatVal(profileA.followers)}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                    <Users size={14} /> Followers
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: getWinner(profileA.followers, profileB.followers) === 'B' ? '700' : '400', color: getWinner(profileA.followers, profileB.followers) === 'B' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      {formatVal(profileB.followers)}
                      {getWinner(profileA.followers, profileB.followers) === 'B' && <Check size={14} style={{ color: 'var(--accent-success)' }} />}
                    </div>
                  </td>
                </tr>

                {/* Repos Row */}
                <tr>
                  <td style={{ fontWeight: getWinner(profileA.public_repos, profileB.public_repos) === 'A' ? '700' : '400', color: getWinner(profileA.public_repos, profileB.public_repos) === 'A' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {getWinner(profileA.public_repos, profileB.public_repos) === 'A' && <Check size={14} style={{ color: 'var(--accent-success)' }} />}
                      {formatVal(profileA.public_repos)}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                    <BookOpen size={14} /> Repositories
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: getWinner(profileA.public_repos, profileB.public_repos) === 'B' ? '700' : '400', color: getWinner(profileA.public_repos, profileB.public_repos) === 'B' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      {formatVal(profileB.public_repos)}
                      {getWinner(profileA.public_repos, profileB.public_repos) === 'B' && <Check size={14} style={{ color: 'var(--accent-success)' }} />}
                    </div>
                  </td>
                </tr>

                {/* Stars Row */}
                <tr>
                  <td style={{ fontWeight: getWinner(profileA.total_stars, profileB.total_stars) === 'A' ? '700' : '400', color: getWinner(profileA.total_stars, profileB.total_stars) === 'A' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {getWinner(profileA.total_stars, profileB.total_stars) === 'A' && <Check size={14} style={{ color: 'var(--accent-success)' }} />}
                      {formatVal(profileA.total_stars)}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                    <Star size={14} /> Total Stars
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: getWinner(profileA.total_stars, profileB.total_stars) === 'B' ? '700' : '400', color: getWinner(profileA.total_stars, profileB.total_stars) === 'B' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      {formatVal(profileB.total_stars)}
                      {getWinner(profileA.total_stars, profileB.total_stars) === 'B' && <Check size={14} style={{ color: 'var(--accent-success)' }} />}
                    </div>
                  </td>
                </tr>

                {/* Forks Row */}
                <tr>
                  <td style={{ fontWeight: getWinner(profileA.total_forks, profileB.total_forks) === 'A' ? '700' : '400', color: getWinner(profileA.total_forks, profileB.total_forks) === 'A' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {getWinner(profileA.total_forks, profileB.total_forks) === 'A' && <Check size={14} style={{ color: 'var(--accent-success)' }} />}
                      {formatVal(profileA.total_forks)}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                    <GitFork size={14} /> Total Forks
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: getWinner(profileA.total_forks, profileB.total_forks) === 'B' ? '700' : '400', color: getWinner(profileA.total_forks, profileB.total_forks) === 'B' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      {formatVal(profileB.total_forks)}
                      {getWinner(profileA.total_forks, profileB.total_forks) === 'B' && <Check size={14} style={{ color: 'var(--accent-success)' }} />}
                    </div>
                  </td>
                </tr>

                {/* Developer Score Row */}
                <tr style={{ background: 'rgba(99, 102, 241, 0.03)' }}>
                  <td style={{ fontWeight: '700', color: getWinner(profileA.developer_score, profileB.developer_score) === 'A' ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {getWinner(profileA.developer_score, profileB.developer_score) === 'A' && <Check size={14} style={{ color: 'var(--accent-primary)' }} />}
                      {formatVal(profileA.developer_score)}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                    <Award size={14} /> Developer Score
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: '700', color: getWinner(profileA.developer_score, profileB.developer_score) === 'B' ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      {formatVal(profileB.developer_score)}
                      {getWinner(profileA.developer_score, profileB.developer_score) === 'B' && <Check size={14} style={{ color: 'var(--accent-primary)' }} />}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Outcome Announcement */}
          <div style={{
            padding: '1.25rem',
            background: 'var(--bg-primary)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--border-radius-md)',
            textAlign: 'center',
            fontSize: '0.95rem',
            color: 'var(--text-secondary)'
          }}>
            {winner === 'tie' ? (
              <span>It is a perfect tie! Both developers share the same legendary ranking score.</span>
            ) : (
              <span>
                <strong>@{winner.username}</strong> wins the developer duel with a superior rating score of <strong>{formatVal(winner.developer_score)}</strong>!
              </span>
            )}
          </div>

        </div>
      ) : (
        /* Empty State */
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '260px', textAlign: 'center', padding: '2rem' }}>
          <ArrowLeftRight size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Select Developers to Compare</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', fontSize: '0.9rem' }}>
            Choose two developers from the dropdown menus above to perform a side-by-side comparative analysis of their profiles, repositories, and custom developer scores.
          </p>
        </div>
      )}
    </div>
  );
}
