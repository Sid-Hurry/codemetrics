import React, { useEffect, useState } from 'react';
import { Award } from 'lucide-react';

const ScoreGauge = React.memo(({ score }) => {
  const [offset, setOffset] = useState(440); // 440 represents full empty circle
  
  // Custom developer tiers
  const getTierInfo = (value) => {
    if (value >= 1000) {
      return { label: 'Grandmaster', badgeClass: 'diamond', color: 'var(--accent-tertiary)' };
    } else if (value >= 400) {
      return { label: 'Elite Developer', badgeClass: 'diamond', color: 'hsl(320, 100%, 60%)' };
    } else if (value >= 150) {
      return { label: 'Senior Expert', badgeClass: 'gold', color: 'hsl(45, 100%, 50%)' };
    } else if (value >= 50) {
      return { label: 'Professional', badgeClass: 'silver', color: 'hsl(200, 15%, 70%)' };
    } else {
      return { label: 'Rising Star', badgeClass: 'bronze', color: 'hsl(25, 60%, 50%)' };
    }
  };

  const tier = getTierInfo(score);

  useEffect(() => {
    // Dynamically calculate circular percentage indicator based on 1000 point scale max
    const maxScoreLimit = 1000;
    const percentage = Math.min(1, score / maxScoreLimit);
    const progressOffset = 440 - (440 * percentage);
    
    // Slight timeout to trigger smooth CSS animations
    const timer = setTimeout(() => {
      setOffset(progressOffset);
    }, 200);

    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h3 className="search-widget-title" style={{ width: '100%', justifyContent: 'center' }}>
        Developer Rating
      </h3>
      
      <div className="gauge-container">
        <div className="gauge-svg-wrapper">
          <svg width="100%" height="100%" viewBox="0 0 160 160" style={{ display: 'block' }}>
            {/* Background Circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              className="gauge-circle-bg"
            />
            {/* Animated Front Circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              className="gauge-circle-fill"
              style={{
                stroke: tier.color,
                strokeDasharray: 440,
                strokeDashoffset: offset
              }}
            />
          </svg>
          <div className="gauge-content">
            <div className="gauge-score-value">{score.toLocaleString()}</div>
            <div className="gauge-score-label">Score</div>
          </div>
        </div>

        <span className={`gauge-badge ${tier.badgeClass}`}>
          {tier.label}
        </span>
      </div>
    </div>
  );
});

export default ScoreGauge;
