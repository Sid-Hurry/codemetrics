import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="glass-card" style={{ height: '100%', minHeight: '300px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="skeleton-circle" />
        <div style={{ flexGrow: 1 }}>
          <div className="skeleton-line" style={{ width: '60%', height: '20px' }} />
          <div className="skeleton-line" style={{ width: '40%' }} />
        </div>
      </div>
      
      <div className="skeleton-line" style={{ width: '90%', height: '40px' }} />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div className="skeleton-line" style={{ width: '80%' }} />
        <div className="skeleton-line" style={{ width: '70%' }} />
        <div className="skeleton-line" style={{ width: '75%' }} />
      </div>
    </div>
  );
}
