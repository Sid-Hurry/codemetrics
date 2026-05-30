import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    // Automatically close toast after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast-message ${type}`}>
      {type === 'success' ? (
        <CheckCircle2 size={18} style={{ color: 'var(--accent-success)', flexShrink: 0 }} />
      ) : (
        <AlertCircle size={18} style={{ color: 'var(--accent-error)', flexShrink: 0 }} />
      )}
      <span style={{ fontSize: '0.9rem', flexGrow: 1 }}>{message}</span>
      <button 
        onClick={onClose} 
        style={{ 
          background: 'transparent', 
          border: 'none', 
          color: '#fff', 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          opacity: 0.7
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
