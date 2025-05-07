import React, { useState } from 'react';

function CLDSection() {
  const [activeLoop, setActiveLoop] = useState(null);
  // New state to track which insights are expanded
  const [expandedInsights, setExpandedInsights] = useState({});
  
  const loops = [
    {
      id: 'R1',
      name: 'Stress–Comfort Food–Obesity',
      type: 'Reinforcing',
      description: 'Work pressure increases stress, leading to comfort eating, resulting in weight gain, which further increases stress and anxiety, creating a vicious cycle.',
      x: 25,
      y: 30
    },
    {
      id: 'B1',
      name: 'Medical Treatment–Recovery–Neglect',
      type: 'Balancing',
      description: 'As symptoms appear, medical treatment provides temporary relief, which reduces perceived urgency, leading to neglect of lifestyle changes, until symptoms reappear more severely.',
      x: 65,
      y: 50
    },
    {
      id: 'R2',
      name: 'Urban Design–Car Dependency–Inactivity',
      type: 'Reinforcing',
      description: 'Poor walkability in urban areas increases car dependency, reducing physical activity, which leads to poorer health outcomes and less community demand for pedestrian infrastructure.',
      x: 45,
      y: 70
    }
  ];

  // Toggle expanded state for a specific insight
  const toggleInsight = (id) => {
    setExpandedInsights(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Insight data with short and full versions
  const insights = [
    {
      id: "reinforcing",
      title: "1. Reinforcing Loops (R) Worsen the Obesity Epidemic",
      short: "Fast food consumption, emotional eating, and stress form self-reinforcing loops that continuously elevate obesity rates.",
      full: "The more obesity increases, the higher the incidence of diabetes and hypertension, which further escalates healthcare costs—feeding into more stress and worsening the cycle."
    },
    {
      id: "balancing",
      title: "2. Balancing Loops (B) Offer Leverage Points",
      short: "Physical activity and traditional diets act as balancing forces to reduce obesity—but are under pressure from lifestyle changes.",
      full: "Increasing these balancing factors could help stabilize or reverse obesity trends."
    },
    {
      id: "stress",
      title: "3. Stress and Work Hours Are Core Drivers",
      short: "High work hours and sedentary jobs lead to emotional triggers and stress, fueling the obesity loop.",
      full: "Reducing workplace stress and promoting work-life balance are critical to addressing root causes."
    },
    {
      id: "economic",
      title: "4. Economic Mobility Has a Dual Role",
      short: "Economic mobility improves healthcare access but can also lead to lifestyle shifts favoring unhealthy options.",
      full: "As economic mobility rises, preventive healthcare and health awareness improve, which can support traditional diets and healthier choices. However, it can also lead to lifestyle shifts that favor fast food and screen-based entertainment."
    },
    {
      id: "awareness",
      title: "5. Health Awareness and Preventive Measures Are Crucial",
      short: "Preventive healthcare and awareness campaigns can break negative feedback loops.",
      full: "These are vital investment areas for public health policy and digital health tools to promote early interventions and healthier habits."
    }
  ];

  return (
    <section id="system" className="cld-section section">
      <div className="section-inner">
        <h2>Causal Loop Diagram</h2>
        <p className="section-intro">
          Below is a Causal Loop Diagram (CLD) showing how different factors 
          interact to create and maintain lifestyle disease patterns in India's middle class.
        </p>
        
        <div className="cld-container">
          <div className="cld-image-container">
            <img 
              src="/images/cld.jpeg" 
              alt="Causal Loop Diagram of Obesity System" 
              className="cld-image"
            />
            
            {loops.map(loop => (
              <div 
                key={loop.id}
                style={{
                  position: 'absolute',
                  left: `${loop.x}%`,
                  top: `${loop.y}%`,
                  backgroundColor: loop.type === 'Reinforcing' ? 'var(--secondary)' : 'var(--primary)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                onMouseEnter={() => setActiveLoop(loop.id)}
                onMouseLeave={() => setActiveLoop(null)}
              >
                {loop.id}
              </div>
            ))}
            
            {activeLoop && (
              <div style={{
                position: 'absolute',
                backgroundColor: 'white',
                padding: '1rem',
                borderRadius: '8px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                maxWidth: '300px',
                zIndex: 10,
                left: '50%',
                bottom: '10%',
                transform: 'translateX(-50%)',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 0.5rem' }}>
                  {loops.find(l => l.id === activeLoop).name}
                </h4>
                <p style={{ margin: '0', fontSize: '0.9rem' }}>
                  {loops.find(l => l.id === activeLoop).description}
                </p>
                <div style={{
                  marginTop: '0.5rem',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: loops.find(l => l.id === activeLoop).type === 'Reinforcing' ? 'var(--secondary)' : 'var(--primary)',
                  color: 'white',
                  borderRadius: '4px',
                  display: 'inline-block',
                  fontSize: '0.8rem'
                }}>
                  {loops.find(l => l.id === activeLoop).type} Loop
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Condensed Key Insights Section */}
        <div className="cld-insights">
          <h3>🔍 Key Insights from the Obesity & Lifestyle Diseases CLD</h3>
          
          <div className="insight-cards-container">
            {insights.map(insight => (
              <div className="insight-card" key={insight.id}>
                <h4>{insight.title}</h4>
                <p>{insight.short}</p>
                
                {expandedInsights[insight.id] && (
                  <div className="expanded-content">
                    <p>{insight.full}</p>
                  </div>
                )}
                
                <button 
                  className="know-more-btn"
                  onClick={() => toggleInsight(insight.id)}
                >
                  {expandedInsights[insight.id] ? 'Show Less' : 'Know More'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CLDSection;
