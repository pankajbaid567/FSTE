import React, { useState, useEffect } from 'react';

function APIDashboard() {
  const [airQuality, setAirQuality] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);
  const [healthStats, setHealthStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API data loading
    setTimeout(() => {
      setAirQuality({
        aqi: 156,
        status: "Unhealthy",
        pm25: 48.7,
        city: "Delhi"
      });
      
      setNutritionData({
        averageCalories: 2850,
        sugarsPerDay: 72,
        processedFoodPercent: 62,
        recommendedSugar: 25
      });
      
      setHealthStats({
        diabetesPrevalence: 14.2,
        obesityRate: 24.8,
        hypertensionRate: 34.5,
        physicalActivityMinutes: 22
      });
      
      setLoading(false);
    }, 1500);
    
    // In a real implementation, you would fetch from actual APIs:
    // fetchAirQualityData();
    // fetchNutritionData();
    // fetchHealthStatistics();
  }, []);
  
  if (loading) {
    return (
      <section id="data" className="api-dashboard">
        <div className="section-inner">
          <h2>Health & Environment Data</h2>
          <p>Loading real-time data...</p>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(0,0,0,0.1)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section id="data" className="api-dashboard">
      <div className="section-inner">
        <h2>Health & Environment Data</h2>
        <p className="section-intro">
          Real-time data showing the interconnected factors affecting health outcomes in urban India.
        </p>
        
        <div className="dashboard-container">
          <div className="metric-card">
            <h3>Air Quality Index</h3>
            <div style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold',
              color: airQuality.aqi > 100 ? 'var(--secondary)' : 'green'
            }}>
              {airQuality.aqi}
            </div>
            <p>{airQuality.status} in {airQuality.city}</p>
            <p>PM2.5: {airQuality.pm25} μg/m³</p>
            <div style={{ 
              height: '8px', 
              backgroundColor: '#e9ecef', 
              borderRadius: '4px', 
              overflow: 'hidden',
              marginTop: '0.5rem'
            }}>
              <div style={{ 
                height: '100%', 
                width: `${Math.min(airQuality.aqi / 3, 100)}%`, 
                backgroundColor: airQuality.aqi > 100 ? 'var(--secondary)' : 'green',
                borderRadius: '4px'
              }}></div>
            </div>
          </div>
          
          <div className="metric-card">
            <h3>Nutrition Metrics</h3>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ margin: '0.25rem 0' }}>Average Daily Calories: <strong>{nutritionData.averageCalories}</strong></p>
              <p style={{ margin: '0.25rem 0' }}>Daily Sugar Intake: <strong>{nutritionData.sugarsPerDay}g</strong> <span style={{ color: 'var(--secondary)' }}>(+{nutritionData.sugarsPerDay - nutritionData.recommendedSugar}g)</span></p>
              <p style={{ margin: '0.25rem 0' }}>Processed Food: <strong>{nutritionData.processedFoodPercent}%</strong> of diet</p>
            </div>
            <div style={{ 
              height: '8px', 
              backgroundColor: '#e9ecef', 
              borderRadius: '4px', 
              overflow: 'hidden'
            }}>
              <div style={{ 
                height: '100%', 
                width: `${nutritionData.processedFoodPercent}%`, 
                backgroundColor: nutritionData.processedFoodPercent > 50 ? 'var(--secondary)' : 'green',
                borderRadius: '4px'
              }}></div>
            </div>
          </div>
          
          <div className="metric-card">
            <h3>Health Statistics</h3>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ margin: '0.25rem 0' }}>Diabetes Prevalence: <strong>{healthStats.diabetesPrevalence}%</strong></p>
              <p style={{ margin: '0.25rem 0' }}>Obesity Rate: <strong>{healthStats.obesityRate}%</strong></p>
              <p style={{ margin: '0.25rem 0' }}>Hypertension: <strong>{healthStats.hypertensionRate}%</strong></p>
              <p style={{ margin: '0.25rem 0' }}>Daily Physical Activity: <strong>{healthStats.physicalActivityMinutes} min</strong></p>
            </div>
            <div style={{ 
              height: '8px', 
              backgroundColor: '#e9ecef', 
              borderRadius: '4px', 
              overflow: 'hidden'
            }}>
              <div style={{ 
                height: '100%', 
                width: `${(healthStats.physicalActivityMinutes / 30) * 100}%`, 
                backgroundColor: healthStats.physicalActivityMinutes < 30 ? 'var(--secondary)' : 'green',
                borderRadius: '4px'
              }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default APIDashboard;
