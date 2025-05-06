import React, { useState } from 'react';

function SFDSection() {
  // State to track which insights are expanded
  const [expandedInsights, setExpandedInsights] = useState({});
  
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
      id: "central-stock",
      title: "1. Obesity Is a Central Stock Influenced by Multiple Flows",
      short: "Obesity accumulates through multiple inflows like fast food consumption and decreases through activity-based outflows.",
      full: "The obesity level increases through: weight gain due to inactivity, weight gain from fast food, and emotional eating. It decreases via obesity reduction rate, which is impacted by physical activity, traditional diets, and preventive healthcare."
    },
    {
      id: "inactivity",
      title: "2. Inactivity and Emotional Eating Drive Obesity Up",
      short: "Sedentary jobs and high screen time reduce physical activity, while stress triggers emotional eating patterns.",
      full: "Sedentary jobs and high screen time lower physical activity, reducing the obesity reduction rate. Emotional triggers increase emotional eating, directly raising the obesity stock."
    },
    {
      id: "chronic",
      title: "3. Obesity Fuels Chronic Conditions",
      short: "Rising obesity directly increases diabetes and hypertension development rates, creating long-term health burdens.",
      full: "As obesity rises, so do the diabetes development rate and hypertension development rate. These add to the stock of diabetes incidence, creating long-term health burdens."
    },
    {
      id: "healthcare",
      title: "4. Healthcare Costs Are a Consequence and Constraint",
      short: "Increased lifestyle diseases drive up healthcare costs, potentially limiting preventive care investment.",
      full: "Increased incidence of lifestyle diseases drives up healthcare costs, possibly limiting preventive healthcare investment in low-income settings—forming a dangerous reinforcing feedback."
    },
    {
      id: "prevention",
      title: "5. Preventive Healthcare, Diet, and Awareness Can Stabilize the System",
      short: "Investing in preventive healthcare, traditional diets, and health awareness improves overall system stability.",
      full: "Flows into preventive healthcare (boosted by economic mobility and health awareness) improve adoption of healthy diets and engagement in physical activity. This enhances the obesity reduction rate, helping to stabilize the system."
    }
  ];

  return (
    <section id="sfd" className="sfd-section section">
      <div className="section-inner">
        <h2>Stock Flow Diagram</h2>
        <p className="section-intro">
          This diagram illustrates the interconnected flows and feedback mechanisms
          driving India's lifestyle disease patterns. By visualizing how different factors
          influence each other over time, we can identify critical intervention points.
        </p>
        
        <div className="sfd-container">
          <div className="sfd-image-wrapper">
            <img 
              src="/images/sfd-diagram.png" 
              alt="System Flow Diagram of Health Factors" 
              className="sfd-main-image"
            />
            <div className="image-caption">
              Stock Flow Diagram showing stocks, flows, and feedback loops in the health system
            </div>
          </div>
          
          {/* <div className="sfd-legend">
            <h3>Diagram Legend</h3>
            <ul>
              <li><span className="legend-item stock"></span> Stocks: Accumulations in the system (e.g., Obesity Levels)</li>
              <li><span className="legend-item flow"></span> Flows: Rates that change stocks (e.g., Calorie Intake)</li>
            </ul>
          </div> */}
        </div>
        
        {/* Updated Key System Insights with expandable cards */}
        <div className="sfd-insights">
          <h3>Key System Insights</h3>
          
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

export default SFDSection;
