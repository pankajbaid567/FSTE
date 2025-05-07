import React from 'react';
import HealthDataCharts from './HealthDataCharts';

function HealthDataSection() {
  return (
    <section id="daata" className="health-data-section section">
      <div className="section-inner">
        <h2>Indian Health Metrics Dashboard</h2>
        <p>
          Explore comprehensive data on lifestyle diseases in India through interactive charts.
          This dashboard visualizes trends, regional comparisons, and distribution patterns of obesity,
          diabetes, and hypertension across the country.
        </p>
        
        <HealthDataCharts />
        
        <div style={{ 
          marginTop: '2rem', 
          padding: '1.5rem', 
          backgroundColor: 'rgba(58, 134, 255, 0.1)', 
          borderRadius: '0.5rem',
          borderLeft: '4px solid #3A86FF'
        }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Understanding the Data Context</h3>
          <p>
            These visualizations demonstrate the complex interconnections between lifestyle factors
            in our systems model. Note how urban-rural divides, regional variations, and demographic 
            patterns reveal the structural drivers of India's health crisis beyond individual choices.
          </p>
        </div>
      </div>
    </section>
  );
}

export default HealthDataSection;
