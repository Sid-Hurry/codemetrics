import React from 'react';

export default function Privacy() {
  return (
    <div className="editorial-container">
      <div className="editorial-header">
        <h1 className="editorial-title">Privacy Policy</h1>
        <p className="editorial-subtitle">
          Last updated: June 14, 2026. This policy outlines how CodeMetrics handles your public GitHub metadata and authentication data.
        </p>
      </div>

      <div className="editorial-body">
        <section className="editorial-section">
          <h2 className="editorial-h2">1. Information We Collect</h2>
          <p className="editorial-p">
            CodeMetrics is a developer analytics platform. We fetch public metadata directly from the GitHub API based on your username or OAuth authorization. This includes:
          </p>
          <ul className="editorial-list">
            <li className="editorial-list-item">Public profile details (name, bio, company, followers, public email).</li>
            <li className="editorial-list-item">Repository statistics (star counts, fork counts, main languages, creation dates).</li>
            <li className="editorial-list-item">Commit metadata (contribution patterns, commit counts, issue discussions).</li>
          </ul>
        </section>

        <section className="editorial-section">
          <h2 className="editorial-h2">2. How We Use Information</h2>
          <p className="editorial-p">
            We process your public repository metadata to:
          </p>
          <ul className="editorial-list">
            <li className="editorial-list-item">Calculate profile completeness scores and developer ranking indices.</li>
            <li className="editorial-list-item">Identify technology distribution ratios and language weights.</li>
            <li className="editorial-list-item">Generate AI-driven career path readiness indexes and construct capstone projects.</li>
          </ul>
        </section>

        <section className="editorial-section">
          <h2 className="editorial-h2">3. Token & Data Protection</h2>
          <p className="editorial-p">
            When you sign in via GitHub, we receive a temporary OAuth access token. We use this token exclusively to perform reads against the GitHub API. We do not permanently store your OAuth tokens. All API calls are executed securely using HTTPS encryption.
          </p>
        </section>

        <section className="editorial-section">
          <h2 className="editorial-h2">4. Third-Party Services</h2>
          <p className="editorial-p">
            To generate personalized recommendations, skill gap analyses, and capstone projects, we send structured, non-identifiable repository profile metrics to LLM providers (specifically Gemini API). We do not send your source code, authentication tokens, or personal database passwords.
          </p>
        </section>

        <section className="editorial-section">
          <h2 className="editorial-h2">5. Data Deletion</h2>
          <p className="editorial-p">
            You maintain full ownership of your data. You can disconnect your GitHub profile or request complete account deletion at any time directly through the Settings view in your workspace panel.
          </p>
        </section>
      </div>
    </div>
  );
}
