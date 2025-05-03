import React, { useRef, useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import { OrbitControls, Text, Html, useProgress, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// India map outline
const INDIA_OUTLINE = [
  // Northern border
  [-0.5, 0, 0.9], [0, 0, 1], [0.5, 0, 0.9], [0.8, 0, 0.7],
  // Eastern border  
  [0.9, 0, 0.5], [0.8, 0, 0], [0.7, 0, -0.5],
  // Southern point
  [0.5, 0, -0.9], [0, 0, -1],
  // Western border
  [-0.5, 0, -0.8], [-0.7, 0, -0.5], [-0.8, 0, 0], [-0.7, 0, 0.5]
];

// Timeline data for health metrics by year
const timelineData = {
  2000: {
    cities: [
      { name: "Delhi", position: [0, 0, 0.7], obesity: 12, diabetes: 8, activity: 45 },
      { name: "Mumbai", position: [-0.5, 0, -0.3], obesity: 10, diabetes: 7, activity: 50 },
      { name: "Bangalore", position: [0, 0, -0.6], obesity: 8, diabetes: 6, activity: 55 },
      { name: "Chennai", position: [0.3, 0, -0.7], obesity: 9, diabetes: 7, activity: 52 },
      { name: "Kolkata", position: [0.6, 0, 0.3], obesity: 10, diabetes: 8, activity: 48 }
    ]
  },
  2005: {
    cities: [
      { name: "Delhi", position: [0, 0, 0.7], obesity: 16, diabetes: 11, activity: 40 },
      { name: "Mumbai", position: [-0.5, 0, -0.3], obesity: 14, diabetes: 10, activity: 45 },
      { name: "Bangalore", position: [0, 0, -0.6], obesity: 12, diabetes: 9, activity: 48 },
      { name: "Chennai", position: [0.3, 0, -0.7], obesity: 13, diabetes: 10, activity: 46 },
      { name: "Kolkata", position: [0.6, 0, 0.3], obesity: 14, diabetes: 11, activity: 43 }
    ]
  },
  2010: {
    cities: [
      { name: "Delhi", position: [0, 0, 0.7], obesity: 20, diabetes: 15, activity: 35 },
      { name: "Mumbai", position: [-0.5, 0, -0.3], obesity: 18, diabetes: 14, activity: 38 },
      { name: "Bangalore", position: [0, 0, -0.6], obesity: 16, diabetes: 12, activity: 42 },
      { name: "Chennai", position: [0.3, 0, -0.7], obesity: 17, diabetes: 14, activity: 40 },
      { name: "Kolkata", position: [0.6, 0, 0.3], obesity: 18, diabetes: 15, activity: 37 }
    ]
  },
  2015: {
    cities: [
      { name: "Delhi", position: [0, 0, 0.7], obesity: 25, diabetes: 19, activity: 30 },
      { name: "Mumbai", position: [-0.5, 0, -0.3], obesity: 22, diabetes: 17, activity: 32 },
      { name: "Bangalore", position: [0, 0, -0.6], obesity: 20, diabetes: 15, activity: 35 },
      { name: "Chennai", position: [0.3, 0, -0.7], obesity: 21, diabetes: 16, activity: 33 },
      { name: "Kolkata", position: [0.6, 0, 0.3], obesity: 22, diabetes: 18, activity: 31 }
    ]
  },
  2020: {
    cities: [
      { name: "Delhi", position: [0, 0, 0.7], obesity: 31, diabetes: 24, activity: 25 },
      { name: "Mumbai", position: [-0.5, 0, -0.3], obesity: 28, diabetes: 22, activity: 27 },
      { name: "Bangalore", position: [0, 0, -0.6], obesity: 26, diabetes: 20, activity: 30 },
      { name: "Chennai", position: [0.3, 0, -0.7], obesity: 27, diabetes: 21, activity: 28 },
      { name: "Kolkata", position: [0.6, 0, 0.3], obesity: 29, diabetes: 23, activity: 26 }
    ]
  },
  2023: {
    cities: [
      { name: "Delhi", position: [0, 0, 0.7], obesity: 35, diabetes: 28, activity: 22 },
      { name: "Mumbai", position: [-0.5, 0, -0.3], obesity: 32, diabetes: 25, activity: 24 },
      { name: "Bangalore", position: [0, 0, -0.6], obesity: 30, diabetes: 23, activity: 26 },
      { name: "Chennai", position: [0.3, 0, -0.7], obesity: 31, diabetes: 24, activity: 25 },
      { name: "Kolkata", position: [0.6, 0, 0.3], obesity: 33, diabetes: 27, activity: 23 }
    ]
  }
};

const YEARS = Object.keys(timelineData);

// Loading screen
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{
        color: 'white',
        background: 'rgba(0,0,0,0.8)',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h3>Loading... {progress.toFixed(0)}%</h3>
      </div>
    </Html>
  );
}

// Educational insight panel that explains data significance
function InsightPanel({ year, metric, setShowInsights, showInsights }) {
  const insights = {
    obesity: {
      title: "Obesity Trends in India",
      early: "In 2000, obesity rates were relatively low across major Indian cities (8-12%).",
      middle: "By 2010, rates increased significantly (16-20%), showing early warning signs.",
      recent: "By 2023, obesity has nearly tripled in some cities, reaching alarming levels (30-35%).",
      causes: "Causes include: urbanization, sedentary jobs, increased processed food consumption, and reduced physical activity.",
      impact: "This trend directly correlates with increased diabetes and heart disease rates.",
    },
    diabetes: {
      title: "Diabetes Epidemic",
      early: "In 2000, diabetes affected only 6-8% of urban populations.",
      middle: "By 2010, cases increased by nearly 50% as dietary patterns changed.",
      recent: "By 2023, diabetes rates have more than tripled in most cities (23-28%).",
      causes: "Key factors include: genetic predisposition activated by lifestyle changes, poor diet, and reduced physical activity.",
      impact: "This rapid increase strains healthcare systems and reduces quality of life and productivity.",
    },
    activity: {
      title: "Physical Activity Decline",
      early: "In 2000, urban Indians averaged 45-55 minutes of daily physical activity.",
      middle: "By 2010, activity levels dropped by ~20% as car ownership and screen time increased.",
      recent: "By 2023, daily activity has dropped to nearly half of 2000 levels (22-26 minutes).",
      causes: "Contributing factors: longer commutes, desk jobs, digital entertainment, and unsafe pedestrian infrastructure.",
      impact: "This decrease directly contributes to rising obesity and diabetes rates shown in other metrics.",
    }
  };

  const timePeriod = useMemo(() => {
    const yearNum = parseInt(year);
    if (yearNum <= 2005) return "early";
    if (yearNum <= 2015) return "middle";
    return "recent";
  }, [year]);

  const currentInsight = insights[metric];

  return (
    <div style={{
      position: 'absolute',
      top: '70px',
      right: '20px',
      width: '300px',
      backgroundColor: 'rgba(0,0,0,0.85)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      textAlign: 'left',
      transition: 'all 0.3s ease',
      transform: showInsights ? 'translateX(0)' : 'translateX(320px)',
      zIndex: 10
    }}>
      <button
        onClick={() => setShowInsights(!showInsights)}
        style={{
          position: 'absolute',
          left: '-30px',
          top: '10px',
          width: '30px',
          height: '30px',
          background: 'rgba(0,0,0,0.85)',
          border: 'none',
          borderRadius: '4px 0 0 4px',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {showInsights ? "›" : "‹"}
      </button>

      <h3 style={{ 
        margin: '0 0 10px 0', 
        color: metric === 'activity' ? '#4CB944' : (metric === 'obesity' ? '#FF6B6B' : '#FF9E4F')
      }}>
        {currentInsight.title}
      </h3>
      
      <p style={{ 
        margin: '5px 0', 
        fontWeight: timePeriod === 'early' ? 'bold' : 'normal',
        opacity: timePeriod === 'early' ? 1 : 0.7
      }}>
        {currentInsight.early}
      </p>
      
      <p style={{ 
        margin: '5px 0', 
        fontWeight: timePeriod === 'middle' ? 'bold' : 'normal',
        opacity: timePeriod === 'middle' ? 1 : 0.7
      }}>
        {currentInsight.middle}
      </p>
      
      <p style={{ 
        margin: '5px 0', 
        fontWeight: timePeriod === 'recent' ? 'bold' : 'normal',
        opacity: timePeriod === 'recent' ? 1 : 0.7
      }}>
        {currentInsight.recent}
      </p>
      
      <h4 style={{ margin: '15px 0 5px 0' }}>Causes:</h4>
      <p style={{ margin: '0 0 10px 0' }}>{currentInsight.causes}</p>
      
      <h4 style={{ margin: '15px 0 5px 0' }}>Health Impact:</h4>
      <p style={{ margin: '0' }}>{currentInsight.impact}</p>
    </div>
  );
}

// Guided tour overlay
function GuidedTour({ step, nextStep, prevStep, endTour }) {
  const steps = [
    {
      title: "Welcome to the Health Trends Explorer",
      content: "This visualization shows how health indicators have changed across major Indian cities over time. Follow this quick tour to learn how to use it."
    },
    {
      title: "The 3D Map",
      content: "The blue outline shows India's shape. The colored columns represent health data for each city - taller columns mean higher values."
    },
    {
      title: "Changing Metrics",
      content: "Use the buttons on the left to switch between different health metrics: obesity rates, diabetes rates, and physical activity levels."
    },
    {
      title: "Timeline Navigation",
      content: "Use the slider at the bottom to see how health metrics changed from 2000 to 2023. Notice the dramatic changes over time!"
    },
    {
      title: "City Details",
      content: "Click on any city column to see detailed information about its health metrics for the selected year."
    },
    {
      title: "Educational Insights",
      content: "Use the insights panel on the right to learn about the causes and impacts of these health trends."
    }
  ];

  const currentStep = steps[step];

  if (!currentStep) return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%',
      maxWidth: '500px',
      backgroundColor: 'rgba(0,0,0,0.85)',
      color: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      textAlign: 'center',
      zIndex: 100
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>
        Step {step + 1}: {currentStep.title}
      </h3>
      <p style={{ margin: '0 0 15px 0' }}>{currentStep.content}</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        {step > 0 && (
          <button 
            onClick={prevStep}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              padding: '8px 15px',
              cursor: 'pointer'
            }}
          >
            Previous
          </button>
        )}
        {step < steps.length - 1 ? (
          <button 
            onClick={nextStep}
            style={{
              background: '#3A86FF',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              padding: '8px 15px',
              cursor: 'pointer'
            }}
          >
            Next
          </button>
        ) : (
          <button 
            onClick={endTour}
            style={{
              background: '#4CB944',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              padding: '8px 15px',
              cursor: 'pointer'
            }}
          >
            Finish Tour
          </button>
        )}
      </div>
    </div>
  );
}

// Helper function to calculate year-over-year change
function getYearOverYearChange(city, currentYear, metric) {
  const currentYearIndex = YEARS.indexOf(currentYear);
  if (currentYearIndex <= 0) return 0;
  
  const previousYear = YEARS[currentYearIndex - 1];
  const currentValue = timelineData[currentYear].cities.find(c => c.name === city.name)[metric];
  const previousValue = timelineData[previousYear].cities.find(c => c.name === city.name)[metric];
  
  return currentValue - previousValue;
}

// Enhanced India map with teaching elements
function IndiaMap() {
  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    
    if (INDIA_OUTLINE.length > 0) {
      shape.moveTo(INDIA_OUTLINE[0][0] * 2, INDIA_OUTLINE[0][2] * 2);
      
      for (let i = 1; i < INDIA_OUTLINE.length; i++) {
        shape.lineTo(INDIA_OUTLINE[i][0] * 2, INDIA_OUTLINE[i][2] * 2);
      }
      
      shape.lineTo(INDIA_OUTLINE[0][0] * 2, INDIA_OUTLINE[0][2] * 2);
    }
    
    return shape;
  }, []);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh position={[0, 0, 0]} receiveShadow>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial 
          color="#1e4a7e" 
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      
      <Text
        position={[0, 0.01, 0.8]}
        rotation={[-Math.PI / 2, 0, 0]}
        color="white"
        fontSize={0.1}
        anchorX="center"
        outlineWidth={0.003}
        outlineColor="#000"
      >
        North India
      </Text>
      
      <Text
        position={[0, 0.01, -0.7]}
        rotation={[-Math.PI / 2, 0, 0]}
        color="white"
        fontSize={0.1}
        anchorX="center"
        outlineWidth={0.003}
        outlineColor="#000"
      >
        South India
      </Text>
      
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={INDIA_OUTLINE.length}
            array={new Float32Array(INDIA_OUTLINE.flatMap(p => [p[0] * 2, 0, p[2] * 2]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#3A86FF" />
      </line>
      
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={6}
            array={new Float32Array([
              -0.2, 0, 0.8, 0.3, 0, 0.5,
              -0.5, 0, 0.2, 0.2, 0, 0,
              -0.3, 0, -0.5, 0.4, 0, -0.3
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#3A86FF" opacity={0.4} transparent />
      </line>
    </group>
  );
}

// Simpler city indicator component with better educational elements
function CityIndicator({ city, year, metric, selected, onClick }) {
  if (!city || typeof city !== 'object') {
    console.error('Invalid city data provided to CityIndicator');
    return null;
  }
  
  const value = city[metric] || 0;
  const height = value / (metric === 'activity' ? 5 : 10);
  const meshRef = useRef();
  const targetScale = useRef([1, height, 1]);
  
  // Add a tooltip with explanation
  const tooltipText = useMemo(() => {
    switch(metric) {
      case 'obesity':
        return `${city.name}: ${value}% obesity rate`;
      case 'diabetes':
        return `${city.name}: ${value}% diabetes rate`;
      case 'activity':
        return `${city.name}: ${value} min/day of physical activity`;
    }
  }, [city, metric, value]);
  
  // Color determination
  const color = useMemo(() => {
    switch(metric) {
      case 'obesity':
        return '#FF6B6B'; // Red for negative health metric
      case 'diabetes':
        return '#FF9E4F'; // Orange for negative health metric
      case 'activity':
        return '#4CB944'; // Green for positive health metric
      default:
        return '#3A86FF'; // Default blue
    }
  }, [metric]);
  
  // Animation for height changes
  useFrame(() => {
    if (meshRef.current) {
      // Optimize animations with faster converging lerp factor
      meshRef.current.scale.y = THREE.MathUtils.lerp(
        meshRef.current.scale.y,
        targetScale.current[1],
        0.15
      );
      
      meshRef.current.position.y = meshRef.current.scale.y / 2;
      
      // Pulse effect when selected with better performance
      if (selected) {
        const time = performance.now() * 0.003;
        const pulseFactor = 0.05 * Math.sin(time);
        meshRef.current.scale.x = 1 + pulseFactor;
        meshRef.current.scale.z = 1 + pulseFactor;
      } else {
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 1, 0.15);
        meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, 1, 0.15);
      }
    }
  });
  
  useEffect(() => {
    targetScale.current = [1, height, 1];
  }, [height]);
  
  // Event handlers
  const handlePointerOver = useCallback((e) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
  }, []);
  
  const handlePointerOut = useCallback(() => {
    document.body.style.cursor = 'auto';
  }, []);
  
  return (
    <group position={city.position}>
      {/* City column */}
      <mesh
        ref={meshRef}
        position={[0, height / 2, 0]}
        scale={[1, height, 1]}
        onClick={onClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[0.1, 1, 0.1]} />
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={selected ? 1 : 0.7}
          emissive={selected ? color : undefined}
          emissiveIntensity={selected ? 0.5 : 0}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>
      
      {/* City name with tooltip */}
      <group position={[0, -0.1, 0]}>
        <Text
          color="white"
          fontSize={0.1}
          anchorX="center"
          anchorY="top"
          outlineWidth={0.005}
          outlineColor="#000000"
        >
          {city.name}
        </Text>
        
        {/* Floating value display to make data more readable */}
        <Text
          position={[0, height + 0.1, 0]}
          color={color}
          fontSize={0.12}
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.005}
          outlineColor="#000000"
        >
          {value}{metric === 'activity' ? 'm' : '%'}
        </Text>
      </group>
      
      {/* Glow effect for selected city */}
      {selected && (
        <>
          <mesh position={[0, height / 2, 0]} scale={[1.1, height * 1.1, 1.1]}>
            <boxGeometry args={[0.1, 1, 0.1]} />
            <meshBasicMaterial color={color} transparent opacity={0.2} />
          </mesh>
          
          {/* Educational indicator showing trend */}
          <group position={[0.2, 0.3, 0]}>
            {year !== "2000" && (
              <Text
                color={getYearOverYearChange(city, year, metric) > 0 ? 
                  (metric === 'activity' ? '#4CB944' : '#FF6B6B') : 
                  (metric === 'activity' ? '#FF6B6B' : '#4CB944')}
                fontSize={0.1}
                anchorX="left"
                outlineWidth={0.003}
                outlineColor="#000000"
              >
                {getYearOverYearChange(city, year, metric) > 0 ? '↑' : '↓'} 
                {Math.abs(getYearOverYearChange(city, year, metric)).toFixed(1)}
                {metric === 'activity' ? 'm' : '%'}
              </Text>
            )}
          </group>
        </>
      )}
    </group>
  );
}

// Main component
function TimelineAnimation3D() {
  const [isMounted, setIsMounted] = useState(false);
  const [year, setYear] = useState("2000");
  const [metric, setMetric] = useState("obesity");
  const [selectedCity, setSelectedCity] = useState(null);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [showInsights, setShowInsights] = useState(true);
  const cameraRef = useRef();
  
  const startTour = useCallback(() => {
    setShowTour(true);
    setTourStep(0);
  }, []);
  
  const nextStep = useCallback(() => {
    setTourStep(prev => prev + 1);
  }, []);
  
  const prevStep = useCallback(() => {
    setTourStep(prev => Math.max(0, prev - 1));
  }, []);
  
  const endTour = useCallback(() => {
    setShowTour(false);
  }, []);
  
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        const currentIndex = YEARS.indexOf(year);
        if (currentIndex < YEARS.length - 1) {
          setYear(YEARS[currentIndex + 1]);
        } else {
          setIsPlaying(false);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, year]);
  
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (year === YEARS[YEARS.length - 1]) {
        setYear(YEARS[0]);
      }
      setIsPlaying(true);
    }
  }, [isPlaying, year]);
  
  const yearData = useMemo(() => {
    return timelineData[year] || timelineData[YEARS[0]];
  }, [year]);
  
  const handleCityClick = useCallback((city) => {
    setSelectedCity(selectedCity === city ? null : city);
  }, [selectedCity]);

  const setObesity = useCallback(() => setMetric('obesity'), []);
  const setDiabetes = useCallback(() => setMetric('diabetes'), []);
  const setActivity = useCallback(() => setMetric('activity'), []);
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const cameraPosition = isMobile ? [0, 2, 3] : [0, 1.5, 2];
  const canvasHeight = isMobile ? '400px' : '600px';
  
  if (!isMounted) return null;

  return (
    <section className="timeline-animation-section section">
      <div className="section-inner">
        <div className="animate-in" id="timeline-header" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem' 
        }}>
          <div>
            <h2>Health Trends Over Time</h2>
            <p style={{ textAlign: 'left', opacity: 0.9 }}>
              Explore how lifestyle disease indicators have evolved across major 
              Indian cities from 2000 to 2023. See the dramatic changes in obesity, 
              diabetes, and physical activity levels.
            </p>
          </div>
          <button
            onClick={startTour}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 9.5V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 8L16 12L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Take Tour</span>
          </button>
        </div>
        
        <div className="visualization-container animate-in" style={{ 
          height: canvasHeight, 
          width: '100%', 
          position: 'relative', 
          marginTop: '1rem',
          backgroundColor: '#060d18',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <div style={{
            position: 'absolute',
            bottom: '60px',
            left: '20px',
            background: 'rgba(255,0,0,0.8)',
            color: 'white',
            padding: '8px 12px',
            zIndex: 1000,
            borderRadius: '4px',
            fontSize: '12px',
            display: 'none'
          }}>
            WebGL Support: <span id="webgl-support"></span><br/>
            Canvas Size: <span id="canvas-size"></span>
          </div>
          
          <Canvas 
            shadows
            dpr={[1, 2]} 
            gl={{ 
              antialias: true,
              alpha: false,
              powerPreference: "high-performance",
              failIfMajorPerformanceCaveat: false
            }}
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%',
              zIndex: 1
            }}
            onCreated={({ gl, size }) => {
              console.log("WebGL context created", gl);
              console.log("Canvas size", size);
              
              const supportEl = document.getElementById('webgl-support');
              const sizeEl = document.getElementById('canvas-size');
              if (supportEl) supportEl.textContent = gl ? 'Available' : 'Not Available';
              if (sizeEl) sizeEl.textContent = `${size.width} x ${size.height}`;
            }}
          >
            <Suspense fallback={<Loader />}>
              <PerspectiveCamera
                ref={cameraRef}
                makeDefault
                position={[0, 2, 2.5]}
                fov={50}
                near={0.1}
                far={100}
              />
              
              <axesHelper args={[5]} />
              <gridHelper args={[10, 10, '#444', '#222']} />
              
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
              <directionalLight position={[-5, 5, -5]} intensity={0.8} />
              
              <group>
                <IndiaMap />
                
                {yearData.cities.map((city, index) => (
                  <CityIndicator
                    key={index}
                    city={city}
                    year={year}
                    metric={metric}
                    selected={selectedCity === city}
                    onClick={() => handleCityClick(city)}
                  />
                ))}
                
                <Html position={[-1.2, 0.8, 0]} className="control-panel">
                  <div style={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    padding: '15px',
                    borderRadius: '8px',
                    color: 'white',
                    width: '200px'
                  }}>
                    <h3 style={{ margin: '0 0 10px 0' }}>Select Health Metric</h3>
                    <div>
                      <button 
                        onClick={setObesity}
                        style={{
                          padding: '8px 12px',
                          margin: '5px 0',
                          width: '100%',
                          background: metric === 'obesity' ? '#FF6B6B' : 'rgba(255,107,107,0.3)',
                          border: 'none',
                          borderRadius: '4px',
                          color: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        Obesity Rate (%)
                      </button>
                      
                      <button 
                        onClick={setDiabetes}
                        style={{
                          padding: '8px 12px',
                          margin: '5px 0',
                          width: '100%',
                          background: metric === 'diabetes' ? '#FF9E4F' : 'rgba(255,158,79,0.3)',
                          border: 'none',
                          borderRadius: '4px',
                          color: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        Diabetes Rate (%)
                      </button>
                      
                      <button 
                        onClick={setActivity}
                        style={{
                          padding: '8px 12px',
                          margin: '5px 0',
                          width: '100%',
                          background: metric === 'activity' ? '#4CB944' : 'rgba(76,185,68,0.3)',
                          border: 'none',
                          borderRadius: '4px',
                          color: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        Physical Activity (min/day)
                      </button>
                    </div>
                  </div>
                </Html>
                
                <Html position={[0, -0.8, 0]} style={{ width: '80%', textAlign: 'center' }}>
                  <div style={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    padding: '15px',
                    borderRadius: '8px',
                    color: 'white'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: '0' }}>Year: {year}</h3>
                      <button
                        onClick={togglePlay}
                        style={{
                          background: 'transparent',
                          border: '2px solid white',
                          borderRadius: '50%',
                          width: '30px',
                          height: '30px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        {isPlaying ? "⏸" : "▶"}
                      </button>
                    </div>
                    
                    <input
                      type="range"
                      min="0"
                      max={YEARS.length - 1}
                      value={YEARS.indexOf(year.toString())}
                      onChange={(e) => {
                        setYear(YEARS[e.target.value]);
                        setIsPlaying(false);
                      }}
                      style={{
                        width: '80%',
                        height: '10px',
                        margin: '15px auto'
                      }}
                    />
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      width: '80%', 
                      margin: '10px auto 0',
                      fontSize: '12px'
                    }}>
                      {YEARS.map(year => (
                        <span key={year}>{year}</span>
                      ))}
                    </div>
                  </div>
                </Html>
                
                {selectedCity && (
                  <Html position={[0.8, 0.8, 0]} style={{ width: '250px' }}>
                    <div style={{
                      backgroundColor: 'white',
                      padding: '15px',
                      borderRadius: '8px',
                      color: '#333',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                    }}>
                      <h3 style={{ 
                        margin: '0 0 10px 0', 
                        color: metric === 'activity' ? '#4CB944' : (metric === 'obesity' ? '#FF6B6B' : '#FF9E4F')
                      }}>
                        {selectedCity.name} - {year}
                      </h3>
                      
                      <div style={{ marginBottom: '10px' }}>
                        <div style={{ fontSize: '14px', opacity: 0.7 }}>
                          {metric === 'obesity' ? 'Obesity Rate' : metric === 'diabetes' ? 'Diabetes Rate' : 'Physical Activity'}
                        </div>
                        <div style={{ 
                          fontSize: '28px', 
                          fontWeight: 'bold',
                          color: metric === 'activity' ? '#4CB944' : (metric === 'obesity' ? '#FF6B6B' : '#FF9E4F')
                        }}>
                          {selectedCity[metric]}{metric === 'activity' ? ' min/day' : '%'}
                        </div>
                      </div>
                      
                      <table style={{ width: '100%', fontSize: '14px' }}>
                        <tbody>
                          <tr>
                            <td>Obesity Rate:</td>
                            <td style={{ color: '#FF6B6B', fontWeight: 'bold' }}>{selectedCity.obesity}%</td>
                          </tr>
                          <tr>
                            <td>Diabetes Rate:</td>
                            <td style={{ color: '#FF9E4F', fontWeight: 'bold' }}>{selectedCity.diabetes}%</td>
                          </tr>
                          <tr>
                            <td>Physical Activity:</td>
                            <td style={{ color: '#4CB944', fontWeight: 'bold' }}>{selectedCity.activity} min/day</td>
                          </tr>
                        </tbody>
                      </table>
                      
                      <div style={{
                        marginTop: '10px',
                        padding: '8px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        <strong>Trend Analysis:</strong> {selectedCity.name} has seen a 
                        {metric === 'activity' ? ' decrease' : 'n increase'} in {metric} from 
                        {metric === 'activity' ? 
                          ` ${timelineData["2000"].cities.find(c => c.name === selectedCity.name).activity} to ${selectedCity.activity} minutes/day` :
                          ` ${timelineData["2000"].cities.find(c => c.name === selectedCity.name)[metric]}% to ${selectedCity[metric]}%`} 
                        since 2000, which is {getHealthImpactText(metric, selectedCity)}.
                      </div>
                    </div>
                  </Html>
                )}
                
                <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
                <directionalLight position={[-5, 5, -5]} intensity={0.5} />
                <ambientLight intensity={0.3} />
                
                <spotLight position={[0, 5, 0]} intensity={0.7} angle={0.5} penumbra={0.8} color="#6495ED" />
              </group>
              
              <OrbitControls 
                enablePan={true} 
                enableZoom={true} 
                enableRotate={true}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 2}
                enableDamping
                dampingFactor={0.05}
                rotateSpeed={0.7}
                zoomSpeed={0.8}
              />
              
              <ambientLight intensity={0.2} />
            </Suspense>
          </Canvas>
          
          <InsightPanel 
            year={year} 
            metric={metric} 
            showInsights={showInsights}
            setShowInsights={setShowInsights}
          />
          
          {showTour && (
            <GuidedTour 
              step={tourStep} 
              nextStep={nextStep} 
              prevStep={prevStep} 
              endTour={endTour}
            />
          )}
          
          <div style={{ 
            position: 'absolute', 
            bottom: '20px', 
            right: '20px', 
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
            padding: '12px 15px',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            maxWidth: '300px',
            lineHeight: '1.5'
          }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>
                  <strong>Interact:</strong> Click cities for details. Drag to rotate map. Scroll to zoom.
                </p>
                <p style={{ margin: '0' }}>
                  <strong>Keyboard:</strong> 1-2-3 keys to switch metrics, arrow keys to change years
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          backgroundColor: 'rgba(255, 169, 64, 0.1)', 
          borderRadius: '4px',
          borderLeft: '4px solid #FFA940',
          color: '#333'
        }}>
          <strong>Note:</strong> This visualization requires WebGL support in your browser. If you can't see the 3D visualization, please try a modern browser like Chrome, Firefox, or Edge.
        </div>
      </div>
    </section>
  );
}

function getHealthImpactText(metric, city) {
  if (metric === 'activity') {
    return 'concerning as it indicates more sedentary lifestyles';
  } else if (metric === 'obesity') {
    return city.obesity > 25 ? 'alarming and significantly increases health risks' : 'concerning but can be addressed with lifestyle changes';
  } else {
    return city.diabetes > 20 ? 'a major public health concern requiring intervention' : 'above healthy levels and needs attention';
  }
}

export default TimelineAnimation3D;
