import React, { useState } from 'react';
import { Mail, Linkedin, Github, Send } from 'lucide-react';

export default function Contact({ addToast }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      if (addToast) addToast('All fields are required.', 'error');
      return;
    }

    setLoading(true);
    // Simulate API request submission
    setTimeout(() => {
      setLoading(false);
      if (addToast) {
        addToast('Your message has been sent successfully. We will get back to you shortly.', 'success');
      } else {
        alert('Your message has been sent successfully!');
      }
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1000);
  };

  return (
    <div className="contact-container">
      {/* Form Card */}
      <div className="contact-card">
        <h2 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-0.5px', marginBottom: '0.5rem', textAlign: 'left' }}>
          Get in Touch
        </h2>
        <p style={{ fontFamily: 'Inter', color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2.5rem', textAlign: 'left' }}>
          Have a question about CodeMetrics? Send us a message and we'll respond within 24 hours.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="contact-form-group">
            <label className="contact-label">Your Name</label>
            <input
              type="text"
              className="contact-input"
              placeholder="Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="contact-form-group">
            <label className="contact-label">Email Address</label>
            <input
              type="email"
              className="contact-input"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="contact-form-group">
            <label className="contact-label">Subject</label>
            <input
              type="text"
              className="contact-input"
              placeholder="Feedback / Feature Request / Support"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="contact-form-group">
            <label className="contact-label">Message</label>
            <textarea
              className="contact-textarea"
              placeholder="How can we help you..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="zenity-btn-black"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            <Send style={{ width: '16px', height: '16px' }} />
            <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
          </button>
        </form>
      </div>

      {/* Info Panel */}
      <div className="contact-info-panel">
        <h3 style={{ fontSize: '1.25rem', fontWeight: '900', letterSpacing: '-0.5px', marginBottom: '1rem' }}>
          Connect Info
        </h3>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ border: '1px solid var(--b-color)', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
            <Mail style={{ width: '18px', height: '18px', color: 'var(--text-color)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="info-item-title">Email</div>
            <div className="info-item-value">
              <a href="mailto:siddharthhooda0013@gmail.com">siddharthhooda0013@gmail.com</a>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ border: '1px solid var(--b-color)', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
            <Linkedin style={{ width: '18px', height: '18px', color: 'var(--text-color)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="info-item-title">LinkedIn</div>
            <div className="info-item-value">
              <a href="https://www.linkedin.com/in/siddharth-hooda-188606324/" target="_blank" rel="noopener noreferrer">
                siddharth-hooda-188606324
              </a>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ border: '1px solid var(--b-color)', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
            <Github style={{ width: '18px', height: '18px', color: 'var(--text-color)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="info-item-title">GitHub</div>
            <div className="info-item-value">
              <a href="https://github.com/Sid-Hurry" target="_blank" rel="noopener noreferrer">
                github.com/Sid-Hurry
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
