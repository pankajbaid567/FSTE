import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import './SystemFlow3D.css';

// Machine parts
function Gear({ position, scale, color, speed = 0.01, reversed = false }) {
  const gear = useRef();
  
  useFrame(() => {
    if (gear.current) {
      gear.current.rotation.z += reversed ? -speed : speed;
    }
  });
  
  return (
    <mesh ref={gear} position={position} scale={scale}>
      <cylinderGeometry args={[1, 1, 0.3, 32, 1, false, 0, Math.PI * 2]} />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      
      {/* Gear teeth */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 0.8;
        const z = Math.sin(angle) * 0.8;
        
        return (
          <mesh key={i} position={[x, 0, z]} rotation={[Math.PI/2, 0, angle]}>
            <boxGeometry args={[0.4, 0.3, 0.3]} />
            <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
          </mesh>
        );
      })}
    </mesh>
  );
}

// Updated pipe component using the path
function Pipe({ path, radius = 0.1, color = '#999', active = true }) {
  if (!path) return null;
  
  return (
    <mesh visible={active}>
      <tubeGeometry args={[path, 64, radius, 8, false]} />
      <meshStandardMaterial 
        color={color} 
        metalness={0.4} 
        roughness={0.6} 
        transparent 
        opacity={active ? 0.6 : 0.2} 
      />
    </mesh>
  );
}

// Enhanced flow particle with initialOffset
function FlowParticle({ path, speed, color, initialOffset = 0 }) {
  const particle = useRef();
  const [t, setT] = useState(initialOffset);
  
  useFrame(() => {
    setT((prevT) => {
      const newT = prevT + speed;
      return newT > 1 ? 0 : newT;
    });
    
    if (particle.current && path) {
      const position = path.getPoint(t);
      particle.current.position.copy(position);
    }
  });
  
  if (!path) return null;
  
  return (
    <mesh ref={particle} scale={[0.15, 0.15, 0.15]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  );
}

// Variable node component for system factors
function VariableNode({ position, label, color, size = 1, isPrimary = true, onClick, isActive }) {
  const nodeRef = useRef();
  
  useEffect(() => {
    if (isActive && nodeRef.current) {
      gsap.to(nodeRef.current.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        duration: 0.3,
        ease: "back.out"
      });
    } else if (nodeRef.current) {
      gsap.to(nodeRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.3,
        ease: "back.out"
      });
    }
  }, [isActive]);
  
  return (
    <group position={position}>
      <mesh 
        ref={nodeRef} 
        onClick={onClick}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'default'}
      >
        {isPrimary ? (
          <boxGeometry args={[size, size * 0.5, size]} />
        ) : (
          <sphereGeometry args={[size * 0.4, 16, 16]} />
        )}
        <meshStandardMaterial 
          color={color} 
          metalness={0.4} 
          roughness={0.6} 
          transparent 
          opacity={0.9}
          emissive={color}
          emissiveIntensity={isActive ? 0.5 : 0.1}
        />
      </mesh>
      
      <Text
        position={[0, isPrimary ? size * 0.4 : size * 0.6, 0]}
        fontSize={isPrimary ? 0.25 : 0.2}
        color="white"
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {label}
      </Text>
    </group>
  );
}

// Updated system core
function SystemCore() {
  const coreRef = useRef();
  
  // Animate the core slightly pulsating
  useEffect(() => {
    if (coreRef.current) {
      gsap.to(coreRef.current.scale, {
        x: 1.05,
        y: 1.05,
        z: 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, []);
  
  return (
    <group ref={coreRef} position={[0, 0, 0]}>
      {/* Central processing unit */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#444" metalness={0.7} roughness={0.2} />
      </mesh>
      
      {/* Gears */}
      <Gear position={[-0.7, 0.7, -0.7]} scale={[0.3, 1, 0.3]} color="#777" speed={0.02} />
      <Gear position={[0.7, 0.7, 0.7]} scale={[0.4, 1, 0.4]} color="#666" speed={0.015} reversed={true} />
      <Gear position={[0.7, 0.7, -0.7]} scale={[0.25, 1, 0.25]} color="#888" speed={0.025} />
      <Gear position={[-0.7, 0.7, 0.7]} scale={[0.3, 1, 0.3]} color="#777" speed={0.02} reversed={true} />
    </group>
  );
}

// Enhanced machine component with more health variables
function Machine() {
  const [activeNode, setActiveNode] = useState(null);
  
  // Primary variables (major factors)
  const primaryVariables = [
    { id: "income", label: "Income Level", position: [-6, 1, -2], color: "#5E60CE" },
    { id: "sedentary", label: "Sedentary Jobs", position: [-6, 1, 2], color: "#64DFDF" },
    { id: "fast_food", label: "Fast Food Consumption", position: [-3, 1, 4], color: "#FF9E4F" },
    { id: "inactivity", label: "Physical Inactivity", position: [-3, 1, -4], color: "#4CB944" },
    { id: "obesity", label: "Obesity", position: [3, 1, 0], color: "#FF6B6B" },
    { id: "diseases", label: "Lifestyle Diseases", position: [6, 1, 0], color: "#EF476F" }
  ];
  
  // Secondary variables (influencing factors)
  const secondaryVariables = [
    { id: "pressure", label: "Work Pressure", position: [-5, 2, 0], color: "#118AB2" },
    { id: "stress", label: "Stress Level", position: [-2, 2, 2], color: "#FF9E4F" },
    { id: "sleep", label: "Sleep Quality", position: [0, 2, 3], color: "#6A4C93" },
    { id: "awareness", label: "Health Awareness", position: [-2, 2, -2], color: "#8AC926" },
    { id: "motivation", label: "Motivation", position: [0, 2, -3], color: "#06D6A0" },
    { id: "healthy_food", label: "Healthy Food Options", position: [2, 2, 2], color: "#FFBE0B" },
    { id: "healthcare", label: "Healthcare Costs", position: [4, 2, 3], color: "#073B4C" }
  ];
  
  // All variables for easier reference
  const allVariables = [...primaryVariables, ...secondaryVariables];
  
  // Define relationships between variables
  const relationships = [
    // Primary variable relationships
    { from: "income", to: "fast_food", type: "negative", strength: 0.6 },
    { from: "income", to: "healthcare", type: "positive", strength: 0.7 },
    { from: "sedentary", to: "inactivity", type: "positive", strength: 0.8 },
    { from: "sedentary", to: "pressure", type: "positive", strength: 0.7 },
    { from: "fast_food", to: "obesity", type: "positive", strength: 0.9 },
    { from: "inactivity", to: "obesity", type: "positive", strength: 0.8 },
    { from: "obesity", to: "diseases", type: "positive", strength: 0.9 },
    
    // Secondary variable effects
    { from: "pressure", to: "stress", type: "positive", strength: 0.8 },
    { from: "stress", to: "sleep", type: "negative", strength: 0.7 },
    { from: "stress", to: "fast_food", type: "positive", strength: 0.6 },
    { from: "sleep", to: "motivation", type: "positive", strength: 0.6 },
    { from: "awareness", to: "motivation", type: "positive", strength: 0.7 },
    { from: "motivation", to: "inactivity", type: "negative", strength: 0.7 },
    { from: "healthy_food", to: "fast_food", type: "negative", strength: 0.6 },
    { from: "diseases", to: "healthcare", type: "positive", strength: 0.8 }
  ];
  
  // Create flow paths for particles
  const flowPaths = useMemo(() => {
    const paths = [];
    
    relationships.forEach(rel => {
      const sourceNode = allVariables.find(v => v.id === rel.from);
      const targetNode = allVariables.find(v => v.id === rel.to);
      
      if (sourceNode && targetNode) {
        const controlPoint1 = new THREE.Vector3(
          (sourceNode.position[0] + targetNode.position[0]) * 0.33,
          (sourceNode.position[1] + targetNode.position[1]) * 0.33 + 0.5,
          (sourceNode.position[2] + targetNode.position[2]) * 0.33
        );
        
        const controlPoint2 = new THREE.Vector3(
          (sourceNode.position[0] + targetNode.position[0]) * 0.66,
          (sourceNode.position[1] + targetNode.position[1]) * 0.66 + 0.5,
          (sourceNode.position[2] + targetNode.position[2]) * 0.66
        );
        
        const path = new THREE.CatmullRomCurve3([
          new THREE.Vector3(...sourceNode.position),
          controlPoint1,
          controlPoint2,
          new THREE.Vector3(...targetNode.position)
        ]);
        
        // Determine color based on relationship type
        const color = rel.type === "positive" ? 
          (rel.from === "inactivity" || rel.from === "fast_food" || rel.from === "obesity" ? "#FF6B6B" : "#4CB944") : 
          (rel.from === "healthy_food" || rel.from === "awareness" ? "#4CB944" : "#FF6B6B");
        
        paths.push({
          path: path,
          color: color,
          speed: 0.004 + (rel.strength * 0.002),
          from: rel.from,
          to: rel.to,
          active: activeNode === null || activeNode === rel.from || activeNode === rel.to
        });
      }
    });
    
    return paths;
  }, [activeNode, allVariables]);
  
  // Handle node click
  const handleNodeClick = (nodeId) => {
    setActiveNode(activeNode === nodeId ? null : nodeId);
  };
  
  // Create particles for each flow path
  const particles = [];
  flowPaths.forEach((flowPath, i) => {
    if (flowPath.active) {
      const particleCount = Math.floor(flowPath.speed * 700); // Adjust particle count based on speed
      for (let j = 0; j < particleCount; j++) {
        particles.push(
          <FlowParticle 
            key={`${i}-${j}`}
            path={flowPath.path} 
            speed={flowPath.speed} 
            color={flowPath.color} 
            initialOffset={j * (1 / particleCount)}
          />
        );
      }
    }
  });
  
  return (
    <group>
      <SystemCore />
      
      {/* Primary variables */}
      {primaryVariables.map((variable) => (
        <VariableNode 
          key={variable.id}
          position={variable.position}
          label={variable.label}
          color={variable.color}
          size={1}
          isPrimary={true}
          onClick={() => handleNodeClick(variable.id)}
          isActive={activeNode === variable.id}
        />
      ))}
      
      {/* Secondary variables */}
      {secondaryVariables.map((variable) => (
        <VariableNode 
          key={variable.id}
          position={variable.position}
          label={variable.label}
          color={variable.color}
          size={0.8}
          isPrimary={false}
          onClick={() => handleNodeClick(variable.id)}
          isActive={activeNode === variable.id}
        />
      ))}
      
      {/* Connection pipes */}
      {flowPaths.map((flowPath, index) => (
        <Pipe 
          key={index}
          path={flowPath.path}
          color={flowPath.color}
          radius={0.05 + (flowPath.speed * 5)}
          active={flowPath.active}
        />
      ))}
      
      {/* Flow particles */}
      {particles}
    </group>
  );
}

// Updated explainer with more comprehensive information
function Explainer({ activeVariable }) {
  const variableInfo = {
    income: {
      title: "Income Level",
      description: "Higher income can provide better access to healthcare and healthy food options, but also correlates with sedentary jobs."
    },
    sedentary: {
      title: "Sedentary Jobs",
      description: "Office jobs with long sitting hours contribute to physical inactivity and increased work pressure."
    },
    fast_food: {
      title: "Fast Food Consumption",
      description: "Frequent consumption of processed, high-calorie foods is a major contributor to obesity."
    },
    inactivity: {
      title: "Physical Inactivity",
      description: "Lack of regular exercise is directly linked to obesity and metabolic disorders."
    },
    obesity: {
      title: "Obesity",
      description: "A primary risk factor for numerous lifestyle diseases including diabetes and hypertension."
    },
    diseases: {
      title: "Lifestyle Diseases",
      description: "Conditions like diabetes, hypertension, and heart disease that result from lifestyle choices."
    },
    pressure: {
      title: "Work Pressure",
      description: "High-stress work environments contribute to overall stress levels and poor health decisions."
    },
    stress: {
      title: "Stress Level",
      description: "Chronic stress affects sleep quality and often leads to comfort eating behaviors."
    },
    sleep: {
      title: "Sleep Quality",
      description: "Poor sleep directly impacts motivation for healthy behaviors and metabolic health."
    },
    awareness: {
      title: "Health Awareness",
      description: "Knowledge about health impacts motivation to make better lifestyle choices."
    },
    motivation: {
      title: "Motivation for Healthy Living",
      description: "The psychological drive to maintain healthy habits despite challenges."
    },
    healthy_food: {
      title: "Healthy Food Options",
      description: "Availability and accessibility of nutritious food alternatives."
    },
    healthcare: {
      title: "Healthcare Costs",
      description: "The financial burden of managing lifestyle diseases, which creates feedback loops in the system."
    }
  };
  
  const defaultContent = {
    title: "Health System Dynamics",
    description: "This model demonstrates how lifestyle factors interact to create health outcomes. Click on any variable to highlight its connections and learn more."
  };
  
  const content = activeVariable ? variableInfo[activeVariable] : defaultContent;
  
  return (
    <Html position={[-8, 4, 0]}>
      <div style={{
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: '15px',
        borderRadius: '8px',
        color: 'white',
        width: '300px',
        backdropFilter: 'blur(4px)'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>{content.title}</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.5' }}>
          {content.description}
        </p>
        
        {!activeVariable && (
          <ul style={{ fontSize: '14px', padding: '0 0 0 20px' }}>
            <li style={{ margin: '5px 0' }}>Primary variables are shown as rectangles</li>
            <li style={{ margin: '5px 0' }}>Secondary factors are shown as spheres</li>
            <li style={{ margin: '5px 0' }}>Green flows represent positive health impacts</li>
            <li style={{ margin: '5px 0' }}>Red flows represent negative health impacts</li>
          </ul>
        )}
        
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('reset-view'))}
          style={{
            background: '#3A86FF',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            padding: '8px 12px',
            marginTop: '15px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Reset View
        </button>
      </div>
    </Html>
  );
}

function SystemFlow3D() {
  const [activeVariable, setActiveVariable] = useState(null);
  
  // Listen for node selections from the Machine component
  useEffect(() => {
    const handleNodeSelection = (e) => {
      setActiveVariable(e.detail);
    };
    
    window.addEventListener('node-selected', handleNodeSelection);
    return () => window.removeEventListener('node-selected', handleNodeSelection);
  }, []);
  
  return (
    <section className="system-flow-section section">
      <div className="section-inner">
        <h2>Health System Dynamics</h2>
        <p className="section-intro">
          This interactive 3D visualization demonstrates how socioeconomic, behavioral, and environmental factors 
          interconnect to create health outcomes in urban India. Explore the complex relationships 
          between primary and secondary variables by interacting with the model.
        </p>
        
        <div className="system-flow-content">
          <div className="system-flow-model">
            <Canvas 
              camera={{ position: [-5, 10, 15], fov: 50 }}
              shadows
              dpr={[1, 2]}
            >
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} intensity={1} castShadow />
              <directionalLight position={[-10, 10, -5]} intensity={0.8} castShadow />
              
              <Machine />
              <Explainer activeVariable={activeVariable} />
              
              <OrbitControls 
                enablePan={true} 
                enableZoom={true} 
                enableRotate={true}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 2}
                enableDamping
                dampingFactor={0.05}
              />
              
              {/* Subtle fog for depth */}
              <fog attach="fog" args={['#121212', 15, 30]} />
            </Canvas>
            
            {/* Accessibility instructions */}
            <div className="system-flow-controls">
              <p>
                <strong>Controls:</strong> Click nodes to explore relationships. Drag to rotate. Scroll to zoom.
              </p>
            </div>
          </div>
          
          <div className="system-flow-info">
            <h3>Key System Variables</h3>
            <div className="system-variables">
              <div className="variable-category">
                <h4>Primary Factors</h4>
                <ul>
                  <li><span className="dot obesity"></span> Obesity</li>
                  <li><span className="dot fast-food"></span> Fast Food Consumption</li>
                  <li><span className="dot sedentary"></span> Sedentary Jobs</li>
                  <li><span className="dot diseases"></span> Lifestyle Diseases</li>
                </ul>
              </div>
              <div className="variable-category">
                <h4>Secondary Factors</h4>
                <ul>
                  <li><span className="dot stress"></span> Stress Level</li>
                  <li><span className="dot awareness"></span> Health Awareness</li>
                  <li><span className="dot sleep"></span> Sleep Quality</li>
                  <li><span className="dot motivation"></span> Motivation</li>
                </ul>
              </div>
            </div>
            
            <div className="system-interpretation">
              <h4>Understanding the Model</h4>
              <p>
                This model illustrates how urban lifestyle factors create reinforcing feedback loops 
                that contribute to obesity. Notice how sedentary jobs and stress increase fast food 
                consumption, leading to obesity and subsequent health issues.
              </p>
              <p>
                The color-coded connections show whether factors have positive or negative influences
                on health outcomes. Red flows represent harmful impacts, while green flows show
                beneficial effects.
              </p>
              <p>
                Click on specific nodes to focus on their relationships and see how interventions at 
                different points could impact the entire system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SystemFlow3D;
