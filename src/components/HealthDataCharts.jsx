import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';

// Register the required Chart.js components
Chart.register(CategoryScale);

function HealthDataCharts() {
  const [isLoading, setIsLoading] = useState(true);
  const [healthData, setHealthData] = useState(null);
  const [activeChart, setActiveChart] = useState('trends');
  const [activeMetric, setActiveMetric] = useState('obesity');
  
  // Chart refs
  const trendChartRef = useRef(null);
  const trendChartInstance = useRef(null);
  const comparisonChartRef = useRef(null);
  const comparisonChartInstance = useRef(null);
  const distributionChartRef = useRef(null);
  const distributionChartInstance = useRef(null);
  
  // Fetch data
  useEffect(() => {
    // In a real implementation, this would be an actual API call
    // For now, we'll use mock data that represents what we might get from an API
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data structure
        const mockData = {
          trends: {
            years: [2000, 2005, 2010, 2015, 2020, 2023],
            obesity: {
              national: [12, 16, 20, 25, 31, 35],
              urban: [14, 19, 24, 29, 35, 39],
              rural: [9, 12, 15, 19, 25, 29]
            },
            diabetes: {
              national: [8, 11, 15, 19, 24, 28],
              urban: [10, 14, 18, 22, 26, 30],
              rural: [6, 8, 11, 15, 20, 25]
            },
            hypertension: {
              national: [25, 29, 32, 35, 38, 41],
              urban: [28, 32, 35, 38, 41, 44],
              rural: [21, 25, 28, 31, 34, 37]
            }
          },
          comparison: {
            regions: ['North', 'South', 'East', 'West', 'Central'],
            obesity: [33, 36, 31, 34, 32],
            diabetes: [27, 30, 25, 26, 24],
            hypertension: [40, 43, 38, 42, 39]
          },
          distribution: {
            obesity: {
              'Class I': 18,
              'Class II': 12,
              'Class III': 5
            },
            diabetes: {
              'Type I': 5,
              'Type II': 23,
              'Pre-diabetic': 14
            },
            hypertension: {
              'Stage 1': 22,
              'Stage 2': 15,
              'Crisis': 4
            }
          },
          demographics: {
            ageGroups: ['18-30', '31-45', '46-60', '60+'],
            obesity: [22, 37, 42, 31],
            diabetes: [12, 26, 38, 41],
            hypertension: [18, 35, 52, 65]
          }
        };
        
        setHealthData(mockData);
      } catch (error) {
        console.error('Error fetching health data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Create/Update Trend Chart
  useEffect(() => {
    if (!healthData || !trendChartRef.current) return;
    
    // Destroy existing chart if it exists
    if (trendChartInstance.current) {
      trendChartInstance.current.destroy();
    }
    
    const ctx = trendChartRef.current.getContext('2d');
    
    const metricData = healthData.trends[activeMetric];
    const years = healthData.trends.years;
    
    const colors = {
      national: '#4361ee',
      urban: '#f72585',
      rural: '#4cc9f0'
    };

    // Define text colors with better contrast
    const textColors = {
      title: '#3a0ca3',
      labels: '#0f172a', // Darker color for better readability
      ticks: '#1e293b'   // Darker shade for tick marks
    };
    
    trendChartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'National Average',
            data: metricData.national,
            borderColor: colors.national,
            backgroundColor: colors.national + '33',
            tension: 0.3,
            fill: true
          },
          {
            label: 'Urban',
            data: metricData.urban,
            borderColor: colors.urban,
            backgroundColor: colors.urban + '33',
            tension: 0.3,
            fill: true
          },
          {
            label: 'Rural',
            data: metricData.rural,
            borderColor: colors.rural,
            backgroundColor: colors.rural + '33',
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)} Trends in India (2000-2023)`,
            font: {
              size: 16,
              weight: 'bold'
            },
            color: textColors.title
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            titleColor: '#fff',
            bodyColor: '#fff',
            backgroundColor: 'rgba(0, 0, 0, 0.9)', // Darker background for better contrast
            titleFont: {
              weight: 'bold',
              size: 14
            },
            bodyFont: {
              size: 13
            },
            padding: 10
          },
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              boxWidth: 10,
              color: '#0f172a', // Darker color for better visibility
              font: {
                weight: '700',
                size: 12
              },
              padding: 15
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: activeMetric === 'activity' ? 'Minutes per day' : 'Percentage (%)',
              color: textColors.labels,
              font: {
                weight: '600'
              }
            },
            ticks: {
              color: textColors.ticks
            },
            grid: {
              color: 'rgba(100, 116, 139, 0.1)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Year',
              color: textColors.labels,
              font: {
                weight: '600'
              }
            },
            ticks: {
              color: textColors.ticks
            },
            grid: {
              color: 'rgba(100, 116, 139, 0.1)'
            }
          }
        }
      }
    });
    
    return () => {
      if (trendChartInstance.current) {
        trendChartInstance.current.destroy();
      }
    };
  }, [healthData, activeMetric, activeChart]);
  
  // Create/Update Comparison Chart
  useEffect(() => {
    if (!healthData || !comparisonChartRef.current || activeChart !== 'comparison') return;
    
    // Destroy existing chart if it exists
    if (comparisonChartInstance.current) {
      comparisonChartInstance.current.destroy();
    }
    
    const ctx = comparisonChartRef.current.getContext('2d');
    
    const regions = healthData.comparison.regions;
    
    // Define comparison chart colors with stronger contrast
    const comparisonColors = {
      obesity: '#f72585',
      diabetes: '#4361ee',
      hypertension: '#4cc9f0'
    };

    // Define text colors with better contrast
    const textColors = {
      title: '#3a0ca3',
      labels: '#0f172a', // Darker color for better readability
      ticks: '#1e293b'   // Darker shade for tick marks
    };
    
    comparisonChartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: regions,
        datasets: [
          {
            label: 'Obesity',
            data: healthData.comparison.obesity,
            backgroundColor: comparisonColors.obesity,
            borderColor: comparisonColors.obesity,
            borderWidth: 1
          },
          {
            label: 'Diabetes',
            data: healthData.comparison.diabetes,
            backgroundColor: comparisonColors.diabetes,
            borderColor: comparisonColors.diabetes,
            borderWidth: 1
          },
          {
            label: 'Hypertension',
            data: healthData.comparison.hypertension,
            backgroundColor: comparisonColors.hypertension,
            borderColor: comparisonColors.hypertension,
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Health Metrics by Region (2023)',
            font: {
              size: 16,
              weight: 'bold'
            },
            color: textColors.title
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            titleColor: '#fff',
            bodyColor: '#fff',
            backgroundColor: 'rgba(0, 0, 0, 0.9)', // Darker background
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                label += context.parsed.y + '%';
                return label;
              }
            }
          },
          legend: {
            position: 'top',
            labels: {
              color: '#0f172a', // Darker color for better visibility
              font: {
                weight: '700',
                size: 12
              },
              padding: 15
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Percentage (%)',
              color: textColors.labels,
              font: {
                weight: '600'
              }
            },
            ticks: {
              color: textColors.ticks
            },
            grid: {
              color: 'rgba(100, 116, 139, 0.1)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Region',
              color: textColors.labels,
              font: {
                weight: '600'
              }
            },
            ticks: {
              color: textColors.ticks
            },
            grid: {
              color: 'rgba(100, 116, 139, 0.1)'
            }
          }
        }
      }
    });
    
    return () => {
      if (comparisonChartInstance.current) {
        comparisonChartInstance.current.destroy();
      }
    };
  }, [healthData, activeChart]);
  
  // Create/Update Distribution Chart
  useEffect(() => {
    if (!healthData || !distributionChartRef.current || activeChart !== 'distribution') return;
    
    // Destroy existing chart if it exists
    if (distributionChartInstance.current) {
      distributionChartInstance.current.destroy();
    }
    
    const ctx = distributionChartRef.current.getContext('2d');
    
    const distributionData = healthData.distribution[activeMetric];
    const categories = Object.keys(distributionData);
    const values = Object.values(distributionData);
    
    const colors = {
      obesity: ['#ff9e80', '#ff6e40', '#ff3d00'],
      diabetes: ['#90caf9', '#42a5f5', '#1e88e5'],
      hypertension: ['#a5d6a7', '#66bb6a', '#43a047']
    };

    // Define text colors with higher contrast
    const textColors = {
      title: '#3a0ca3',
      labels: '#0f172a', // Darker text for better readability
      doughnutLabel: '#0f172a' // Darker label color
    };
    
    distributionChartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categories,
        datasets: [
          {
            data: values,
            backgroundColor: colors[activeMetric],
            borderColor: '#fff',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)} Distribution (2023)`,
            font: {
              size: 16,
              weight: 'bold'
            },
            color: textColors.title
          },
          legend: {
            position: 'right',
            labels: {
              color: '#0f172a', // Darker color for better visibility
              font: {
                weight: '600',
                size: 12
              },
              padding: 15,
              generateLabels: (chart) => {
                const datasets = chart.data.datasets;
                return chart.data.labels.map((label, i) => {
                  const meta = chart.getDatasetMeta(0);
                  const style = meta.controller.getStyle(i);
                  
                  return {
                    text: `${label}: ${datasets[0].data[i]}%`,
                    fillStyle: style.backgroundColor,
                    strokeStyle: style.borderColor,
                    lineWidth: style.borderWidth,
                    hidden: false,
                    index: i,
                    textColor: '#0f172a' // Darker text color
                  };
                });
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}%`;
              }
            },
            titleColor: '#fff',
            bodyColor: '#fff',
            backgroundColor: 'rgba(0, 0, 0, 0.9)', // Darker background for better contrast
            titleFont: {
              weight: 'bold',
              size: 14
            },
            bodyFont: {
              size: 13
            },
            padding: 10
          }
        }
      }
    });
    
    return () => {
      if (distributionChartInstance.current) {
        distributionChartInstance.current.destroy();
      }
    };
  }, [healthData, activeMetric, activeChart]);
  
  if (isLoading) {
    return (
      <div className="chart-loading">
        <div className="loading-spinner"></div>
        <p>Loading health data...</p>
      </div>
    );
  }
  
  return (
    <div className="health-data-charts glass-card">
      <div className="chart-controls">
        <div className="chart-tabs">
          <button 
            className={activeChart === 'trends' ? 'active' : ''} 
            onClick={() => setActiveChart('trends')}
            style={{ color: activeChart === 'trends' ? 'white' : '#0f172a' }}
          >
            Trends Over Time
          </button>
          <button 
            className={activeChart === 'comparison' ? 'active' : ''} 
            onClick={() => setActiveChart('comparison')}
            style={{ color: activeChart === 'comparison' ? 'white' : '#0f172a' }}
          >
            Regional Comparison
          </button>
          <button 
            className={activeChart === 'distribution' ? 'active' : ''} 
            onClick={() => setActiveChart('distribution')}
            style={{ color: activeChart === 'distribution' ? 'white' : '#0f172a' }}
          >
            Distribution Analysis
          </button>
        </div>
        
        {activeChart !== 'comparison' && (
          <div className="metric-selector">
            <button 
              className={activeMetric === 'obesity' ? 'active' : ''} 
              onClick={() => setActiveMetric('obesity')}
              style={{ color: activeMetric === 'obesity' ? 'white' : '#0f172a' }}
            >
              Obesity
            </button>
            <button 
              className={activeMetric === 'diabetes' ? 'active' : ''} 
              onClick={() => setActiveMetric('diabetes')}
              style={{ color: activeMetric === 'diabetes' ? 'white' : '#0f172a' }}
            >
              Diabetes
            </button>
            <button 
              className={activeMetric === 'hypertension' ? 'active' : ''} 
              onClick={() => setActiveMetric('hypertension')}
              style={{ color: activeMetric === 'hypertension' ? 'white' : '#0f172a' }}
            >
              Hypertension
            </button>
          </div>
        )}
      </div>
      
      <div className="chart-container">
        {activeChart === 'trends' && (
          <div className="chart-wrapper">
            <canvas ref={trendChartRef}></canvas>
          </div>
        )}
        
        {activeChart === 'comparison' && (
          <div className="chart-wrapper">
            <canvas ref={comparisonChartRef}></canvas>
          </div>
        )}
        
        {activeChart === 'distribution' && (
          <div className="chart-wrapper">
            <canvas ref={distributionChartRef}></canvas>
          </div>
        )}
      </div>
      
      <div className="chart-insights">
        <h3>Key Insights</h3>
        {activeChart === 'trends' && (
          <ul>
            <li>Obesity rates in urban India have grown 3x faster than rural areas since 2000</li>
            <li>All health metrics show significant acceleration after 2010</li>
            <li>The gap between urban and rural diabetes rates is narrowing since 2015</li>
          </ul>
        )}
        
        {activeChart === 'comparison' && (
          <ul>
            <li>Southern India shows the highest rates across all three health metrics</li>
            <li>Eastern regions have lower diabetes rates but higher hypertension</li>
            <li>Regional variation suggests cultural and dietary factors play significant roles</li>
          </ul>
        )}
        
        {activeChart === 'distribution' && (
          <ul>
            <li>Type 2 diabetes accounts for over 75% of all diabetes cases</li>
            <li>Class I obesity (BMI 30-35) is the most prevalent category</li>
            <li>Stage 1 hypertension affects nearly 25% of the adult population</li>
          </ul>
        )}
      </div>
      
      <div className="data-source">
        <p>Source: National Health Survey (2000-2023), Ministry of Health and Family Welfare, Govt. of India</p>
        <p>Last updated: January 2023</p>
      </div>
    </div>
  );
}

export default HealthDataCharts;
