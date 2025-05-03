import React from 'react';

function Archetypes() {
  const archetypes = [
    {
      name: "Fixes That Fail",
      description: "Short-term solutions that worsen the problem over time",
      example: "Crash diets provide quick weight loss but damage metabolism, leading to greater weight gain later",
      icon: "↩️"
    },
    {
      name: "Shifting the Burden",
      description: "Addressing symptoms rather than root causes",
      example: "Taking medication for lifestyle diseases without changing the lifestyle factors that cause them",
      icon: "⚖️"
    },
    {
      name: "Success to the Successful",
      description: "Resources flow to already-successful areas, starving others",
      example: "Wealthy neighborhoods get more parks and recreation facilities, while underserved areas lack basic fitness infrastructure",
      icon: "🏆"
    },
    {
      name: "Tragedy of the Commons",
      description: "Individual rational behavior depletes shared resources",
      example: "Businesses externalize health costs of processed foods while society bears the burden of increased healthcare costs",
      icon: "🌍"
    }
  ];

  return (
    <section className="archetypes section">
      <div className="section-inner">
        <h2>System Archetypes in Health</h2>
        <p>
          These common system patterns help us understand why many health interventions
          fail and how we can design more effective solutions.
        </p>
        
        <div className="cards-container">
          {archetypes.map((archetype, index) => (
            <div key={index} className="card">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {archetype.icon}
              </div>
              <h3>{archetype.name}</h3>
              <p><strong>{archetype.description}</strong></p>
              <p>{archetype.example}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Archetypes;
