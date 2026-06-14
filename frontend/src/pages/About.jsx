import React from 'react';

export default function About() {
  return (
    <div className="editorial-container">
      <div className="editorial-header">
        <h1 className="editorial-title">About CodeMetrics</h1>
        <p className="editorial-subtitle">
          Empowering developers around the globe by decoding their public repositories, identifying technical gaps, and outlining personalized trajectories for career growth.
        </p>
      </div>

      <div className="editorial-body">
        <section className="editorial-section">
          <h2 className="editorial-h2">Our Mission</h2>
          <p className="editorial-p">
            At CodeMetrics, we believe that your public portfolio is the ultimate indicator of your software engineering capabilities. Traditional resumes are static, subjective, and fail to capture the true depth of a developer's daily problem-solving skills.
          </p>
          <p className="editorial-p">
            By analyzing commit patterns, repository quality, technology stack distribution, and overall engagement, we transform raw GitHub data into an objective developer profile blueprint. We aim to remove the guesswork from developer skill progression.
          </p>
        </section>

        {/* Bauhaus Pillars Grid */}
        <section className="editorial-section" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
          <h2 className="editorial-h2" style={{ marginBottom: '2rem' }}>Our Core Pillars</h2>
          <div className="bauhaus-card-table" style={{ borderTop: '1px solid var(--b-color)', borderBottom: '1px solid var(--b-color)', borderLeft: '1px solid var(--b-color)', borderRight: '1px solid var(--b-color)' }}>
            
            <div className="bauhaus-cell" style={{ borderRight: '1px solid var(--b-color)' }}>
              <h3 className="bauhaus-cell-title">Precision Auditing</h3>
              <p className="bauhaus-cell-desc">
                We pull commit logs, repository metadata, and language metrics to compile an index of your developer tier and profile completeness.
              </p>
            </div>

            <div className="bauhaus-cell" style={{ borderRight: '1px solid var(--b-color)' }}>
              <h3 className="bauhaus-cell-title">AI Skill Matching</h3>
              <p className="bauhaus-cell-desc">
                Using advanced language model intelligence, we cross-reference your profile stack with industry career paths to highlight critical gaps.
              </p>
            </div>

            <div className="bauhaus-cell">
              <h3 className="bauhaus-cell-title">Growth Stacks</h3>
              <p className="bauhaus-cell-desc">
                We generate customized capstone project blueprints that directly target and resolve your technology gaps with concrete implementations.
              </p>
            </div>

          </div>
        </section>

        <section className="editorial-section">
          <h2 className="editorial-h2">Why CodeMetrics?</h2>
          <p className="editorial-p">
            Most analytical platforms focus on developer productivity metrics for enterprise teams. CodeMetrics is built specifically for individual developer growth. Whether you are a self-taught engineer looking to break into the industry or a senior architect looking to switch specializations, CodeMetrics provides the roadmap you need.
          </p>
        </section>
      </div>
    </div>
  );
}
