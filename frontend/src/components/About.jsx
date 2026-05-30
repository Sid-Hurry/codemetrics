import React from 'react';
import { Award, BookOpen } from 'lucide-react';

export default function About() {
  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      
      {/* Title Header */}
      <div style={{ marginBottom: '1.75rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', letterSpacing: '-0.3px', color: 'var(--text-primary)' }}>
          About the Analyzer
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          An advanced evaluation platform that queries the public GitHub API to compute custom developer performance metrics, stored locally inside a persistent MySQL database.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Left Column: Metric Formula */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
            <Award size={16} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Developer Score Formula</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Calculates developer rankings by weighing qualitative social presence and quantitative project outputs:
          </p>

          <div style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--border-radius-md)',
            padding: '1rem',
            textAlign: 'center',
            fontSize: '0.85rem',
            fontWeight: '600',
            color: 'var(--accent-primary)',
            fontFamily: 'monospace',
            marginBottom: '1rem'
          }}>
            score = followers + (repos * 5) + (stars * 2) + forks
          </div>

          <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <li><strong>Followers</strong> (Weight: 1): Evaluates developer community influence.</li>
            <li><strong>Public Repos</strong> (Weight: 5): Evaluates activity consistency and project creation.</li>
            <li><strong>Total Stars</strong> (Weight: 2): Measures open-source utility and codebase popularity.</li>
            <li><strong>Total Forks</strong> (Weight: 1): Measures codebase adoption and collaboration.</li>
          </ul>
        </div>

        {/* Right Column: Expertise Tiers */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
            <BookOpen size={16} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Expertise Tiers</h3>
          </div>
          
          <div className="table-responsive-wrapper" style={{ border: '1px solid var(--glass-border)', borderRadius: 'var(--border-radius-md)' }}>
            <table className="history-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Tier</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Score Threshold</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: '700', color: 'var(--accent-tertiary)', padding: '0.5rem 0.75rem' }}>Grandmaster</td>
                  <td style={{ padding: '0.5rem 0.75rem' }}>1,000+ points</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', color: '#ec4899', padding: '0.5rem 0.75rem' }}>Elite Developer</td>
                  <td style={{ padding: '0.5rem 0.75rem' }}>400 - 999 points</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', color: '#f59e0b', padding: '0.5rem 0.75rem' }}>Senior Expert</td>
                  <td style={{ padding: '0.5rem 0.75rem' }}>150 - 399 points</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', color: '#94a3b8', padding: '0.5rem 0.75rem' }}>Professional</td>
                  <td style={{ padding: '0.5rem 0.75rem' }}>50 - 149 points</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', color: '#d97706', padding: '0.5rem 0.75rem' }}>Rising Star</td>
                  <td style={{ padding: '0.5rem 0.75rem' }}>0 - 49 points</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
