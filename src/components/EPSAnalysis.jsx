import React from 'react';

function EPSAnalysis() {
  return (
    <section id="analysis" className="eps-analysis section">
      <div className="section-inner">
        <h2>Event-Pattern-Structure Analysis</h2>
        <p>
          Systems thinking allows us to see beyond symptoms to identify the underlying 
          structures that drive behaviors. Here's how different levels connect in India's health crisis.
        </p>
        
        <div className="cards-container">
          <div className="card">
            <h3>Urban Mobility & Health</h3>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Event:</strong> Low physical activity despite gym memberships
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Pattern:</strong> Most urbanites spend 10+ hours sitting, only 20% use gym regularly
            </div>
            <div>
              <strong>Structure:</strong> Car-centric urban design, sedentary office work culture, lack of active commuting infrastructure
            </div>
          </div>
          
          <div className="card">
            <h3>Food Systems & Nutrition</h3>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Event:</strong> Rising processed food consumption
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Pattern:</strong> Home cooking declining by 30% in urban households since 2010
            </div>
            <div>
              <strong>Structure:</strong> Economic incentives for processed food, time scarcity, cultural shift in food perceptions
            </div>
          </div>
          
          <div className="card">
            <h3>Stress & Mental Health</h3>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Event:</strong> Stress-related health issues
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Pattern:</strong> Chronic cortisol elevation correlating with abdominal obesity
            </div>
            <div>
              <strong>Structure:</strong> Work performance metrics, 24/7 connectivity expectations, status competition
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EPSAnalysis;
