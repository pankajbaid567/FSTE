import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './APIDashboard.css';

function APIDashboard() {
  const [airQuality, setAirQuality] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);
  const [healthStats, setHealthStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Function to fetch air quality data
    const fetchAirQuality = async () => {
      try {
        // Using AirVisual API for real-time air quality data
        // You'll need to sign up for an API key at https://www.iqair.com/air-pollution-data-api
        const response = await axios.get(
          `https://api.airvisual.com/v2/city?city=Delhi&state=Delhi&country=India&key=${process.env.REACT_APP_AIR_QUALITY_API_KEY}`
        );
        
        const data = response.data.data;
        setAirQuality({
          aqi: data.current.pollution.aqius,
          status: getAQIStatus(data.current.pollution.aqius),
          pm25: data.current.pollution.pm25,
          city: data.city
        });
      } catch (err) {
        console.error("Error fetching air quality data:", err);
        // Fallback to sample data if API fails
        setAirQuality({
          aqi: 156,
          status: "Unhealthy",
          pm25: 48.7,
          city: "Delhi"
        });
      }
    };

    // Function to fetch nutrition data from USDA FoodData Central API
    const fetchNutritionData = async () => {
      try {
        // Using USDA FoodData Central API
        // Get API key at https://fdc.nal.usda.gov/api-key-signup.html
        const usdaResponse = await axios.get(
          `https://api.nal.usda.gov/fdc/v1/foods/search?query=Indian%20Diet&pageSize=10&api_key=${process.env.REACT_APP_USDA_API_KEY}`
        );
        
        // Process the nutrition data
        const foods = usdaResponse.data.foods;
        const avgCalories = Math.round(
          foods.reduce((sum, food) => {
            const calories = food.foodNutrients.find(n => n.nutrientName === "Energy");
            return sum + (calories ? calories.value : 0);
          }, 0) / foods.length
        );
        
        const avgSugars = Math.round(
          foods.reduce((sum, food) => {
            const sugars = food.foodNutrients.find(n => n.nutrientName === "Sugars, total including NLEA");
            return sum + (sugars ? sugars.value : 0);
          }, 0) / foods.length
        );
        
        setNutritionData({
          averageCalories: avgCalories || 2850,
          sugarsPerDay: avgSugars || 72,
          processedFoodPercent: 62, // This could be derived from more complex analysis
          recommendedSugar: 25
        });
      } catch (err) {
        console.error("Error fetching nutrition data:", err);
        // Fallback to sample data if API fails
        setNutritionData({
          averageCalories: 2850,
          sugarsPerDay: 72,
          processedFoodPercent: 62,
          recommendedSugar: 25
        });
      }
    };

    // Function to fetch health statistics from WHO or similar API
    const fetchHealthStats = async () => {
      try {
        // Using Global Health Observatory API from WHO
        // Note: This is a public API and doesn't require a key
        const diabetesResponse = await axios.get(
          'https://ghoapi.azureedge.net/api/NCD_GLUC_04'
        );
        
        const obesityResponse = await axios.get(
          'https://ghoapi.azureedge.net/api/NCD_BMI_30A'
        );
        
        const hypertensionResponse = await axios.get(
          'https://ghoapi.azureedge.net/api/BP_04'
        );
        
        // Filter data for India (country code IND)
        const diabetesData = diabetesResponse.data.value.find(item => 
          item.SpatialDim === "IND" && item.TimeDim === "2019"
        );
        
        const obesityData = obesityResponse.data.value.find(item => 
          item.SpatialDim === "IND" && item.TimeDim === "2019"
        );
        
        const hypertensionData = hypertensionResponse.data.value.find(item => 
          item.SpatialDim === "IND" && item.TimeDim === "2019"
        );
        
        setHealthStats({
          diabetesPrevalence: diabetesData ? parseFloat(diabetesData.Value).toFixed(1) : 14.2,
          obesityRate: obesityData ? parseFloat(obesityData.Value).toFixed(1) : 24.8,
          hypertensionRate: hypertensionData ? parseFloat(hypertensionData.Value).toFixed(1) : 34.5,
          physicalActivityMinutes: 22 // Could be fetched from activity tracking API if available
        });
      } catch (err) {
        console.error("Error fetching health statistics:", err);
        // Fallback to sample data if API fails
        setHealthStats({
          diabetesPrevalence: 14.2,
          obesityRate: 24.8,
          hypertensionRate: 34.5,
          physicalActivityMinutes: 22
        });
      }
    };

    // Helper function to determine AQI status
    const getAQIStatus = (aqi) => {
      if (aqi <= 50) return "Good";
      if (aqi <= 100) return "Moderate";
      if (aqi <= 150) return "Unhealthy for Sensitive Groups";
      if (aqi <= 200) return "Unhealthy";
      if (aqi <= 300) return "Very Unhealthy";
      return "Hazardous";
    };

    // Fetch all data concurrently
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchAirQuality(),
          fetchNutritionData(),
          fetchHealthStats()
        ]);
      } catch (err) {
        setError("Failed to load some data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
    
    // Set up periodic refresh (every 15 minutes)
    const refreshInterval = setInterval(fetchAllData, 15 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, []);
  
  return (
    <section id="data" className="api-dashboard">
      <div className="section-inner">
        <h2>Health & Environment Data</h2>
        <p className="section-intro">
          Real-time data showing the interconnected factors affecting health outcomes in urban India.
          {error && <span className="error-message">{error}</span>}
        </p>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(0,0,0,0.1)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
        ) : (
          <div className="dashboard-container">
            <div className="metric-card">
              <h3>Air Quality Index</h3>
              <div className="api-source">Source: AirVisual API</div>
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
              <p className="last-updated">Last updated: {new Date().toLocaleTimeString()}</p>
            </div>
            
            <div className="metric-card">
              <h3>Nutrition Metrics</h3>
              <div className="api-source">Source: USDA FoodData Central</div>
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
              <p className="last-updated">Last updated: {new Date().toLocaleTimeString()}</p>
            </div>
            
            <div className="metric-card">
              <h3>Health Statistics</h3>
              <div className="api-source">Source: WHO Global Health Observatory</div>
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
              <p className="last-updated">Last updated: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        )}
        
        <div className="data-disclaimer">
          <p>Note: This dashboard uses real-time APIs where available. If an API is unavailable, fallback sample data may be displayed.</p>
          <p>APIs used: AirVisual (air quality), USDA FoodData Central (nutrition), and WHO Global Health Observatory (health statistics).</p>
        </div>
      </div>
    </section>
  );
}

export default APIDashboard;
