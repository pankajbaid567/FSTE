import React from 'react';

function LeveragePoints() {
  const interventions = [
    {
      title: "15-Minute Neighborhood Policy",
      description: "Urban design policy ensuring essential services within 15 minutes by foot or bicycle",
      level: "Structure",
      impact: "High",
      timeframe: "Long-term"
    },
    {
      title: "Corporate Wellbeing Index",
      description: "Mandatory reporting of employee health metrics and work-life balance indicators for companies",
      level: "Pattern",
      impact: "Medium",
      timeframe: "Medium-term"
    },
    {
      title: "True Cost Food Labeling",
      description: "Food labels that include health impact scores and environmental costs",
      level: "Pattern",
      impact: "Medium",
      timeframe: "Short-term"
    },
    {
      title: "Community Time Banking",
      description: "System where community members exchange time for helping with healthy meal prep, childcare, and fitness",
      level: "Structure",
      impact: "High",
      timeframe: "Medium-term"
    }
  ];

  return (
    <section id="solutions" className="leverage-points section">
      <div className="section-inner">
        <h2>Leverage Points for Change</h2>
        <p className="section-intro">
          Rather than focusing only on individual behavior, these interventions target 
          the structural drivers of lifestyle diseases. The most effective changes address 
          underlying systems rather than symptoms.
        </p>
        
        <div className="cards-container">
          {interventions.map((item, index) => (
            <div key={index} className="card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                marginTop: '1rem',
                flexWrap: 'wrap'
              }}>
                <span style={{ 
                  padding: '0.25rem 0.5rem', 
                  backgroundColor: item.level === 'Structure' ? 'var(--accent)' : 'var(--primary)',
                  color: item.level === 'Structure' ? 'var(--text)' : 'white',
                  borderRadius: '4px',
                  fontSize: '0.8rem'
                }}>
                  {item.level} Level
                </span>
                <span style={{ 
                  padding: '0.25rem 0.5rem', 
                  backgroundColor: item.impact === 'High' ? 'var(--secondary)' : '#6c757d',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '0.8rem'
                }}>
                  {item.impact} Impact
                </span>
                <span style={{ 
                  padding: '0.25rem 0.5rem', 
                  backgroundColor: '#f8f9fa',
                  color: 'var(--text)',
                  borderRadius: '4px',
                  fontSize: '0.8rem'
                }}>
                  {item.timeframe}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LeveragePoints;
