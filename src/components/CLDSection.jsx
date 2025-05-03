import React, { useState } from 'react';

function CLDSection() {
  const [activeLoop, setActiveLoop] = useState(null);
  
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

  return (
    <section id="system" className="cld-section section">
      <div className="section-inner">
        <h2>System Dynamics</h2>
        <p>
          Below is a Causal Loop Diagram (CLD) showing how different factors 
          interact to create and maintain lifestyle disease patterns in India's middle class.
        </p>
        
        <div className="cld-container">
          {/* This would be replaced with an actual image from Vensim */}
          <div style={{ 
            backgroundColor: '#f0f4f8', 
            height: '500px', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <p style={{ color: '#666' }}>CLD Image would be displayed here</p>
            
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
                transform: 'translateX(-50%)'
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
      </div>
    </section>
  );
}

export default CLDSection;
