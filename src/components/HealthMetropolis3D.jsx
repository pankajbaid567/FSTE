import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, extend, useThree } from 'react-three-fiber';
import { OrbitControls, Text, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { gsap } from 'gsap';

// Custom building component
function Building({ position, scale, color, type, onClick, isActive }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Build different shapes based on building type
  let geometry;
  let height = scale[1];
  
  switch(type) {
    case 'hospital':
      geometry = <boxGeometry args={[1, height, 1]} />;
      break;
    case 'park':
      geometry = <cylinderGeometry args={[0.7, 0.7, height, 8]} />;
      break;
    case 'food':
      geometry = <coneGeometry args={[0.6, height, 6]} />;
      break;
    case 'home':
      // House-like shape
      geometry = <boxGeometry args={[1, height, 1]} />;
      break;
    default:
      geometry = <boxGeometry args={[1, height, 1]} />;
  }
  
  // Animation effect
  useEffect(() => {
    if (isActive) {
      gsap.to(meshRef.current.position, {
        y: position[1] + 0.5,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
        yoyo: true,
        repeat: 1
      });
      
      gsap.to(meshRef.current.rotation, {
        y: meshRef.current.rotation.y + Math.PI * 2,
        duration: 1.5,
        ease: 'power1.inOut'
      });
    }
  }, [isActive]);
  
  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        {geometry}
        <meshStandardMaterial 
          color={hovered ? '#FFBE0B' : color} 
          metalness={0.3}
          roughness={0.7}
          emissive={isActive ? '#FFBE0B' : '#000'}
          emissiveIntensity={isActive ? 0.5 : 0}
        />
      </mesh>
    </group>
  );
}

// Roads component
function Roads() {
  return (
    <group rotation={[Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
      {/* Main roads */}
      <mesh receiveShadow>
        <planeGeometry args={[20, 0.5]} />
        <meshStandardMaterial color="#444" roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[0, 0, 5]}>
        <planeGeometry args={[20, 0.5]} />
        <meshStandardMaterial color="#444" roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[0, 0, -5]}>
        <planeGeometry args={[20, 0.5]} />
        <meshStandardMaterial color="#444" roughness={0.9} />
      </mesh>
      
      {/* Cross roads */}
      <mesh receiveShadow rotation={[0, 0, Math.PI / 2]} position={[5, 0, 0]}>
        <planeGeometry args={[20, 0.5]} />
        <meshStandardMaterial color="#444" roughness={0.9} />
      </mesh>
      <mesh receiveShadow rotation={[0, 0, Math.PI / 2]} position={[-5, 0, 0]}>
        <planeGeometry args={[20, 0.5]} />
        <meshStandardMaterial color="#444" roughness={0.9} />
      </mesh>
    </group>
  );
}

// Particles for animations
function Particles({ type, origin }) {
  const count = 50;
  const mesh = useRef();
  const [positions, setPositions] = useState([]);
  const [speeds, setSpeeds] = useState([]);
  
  // Set up initial particle positions
  useEffect(() => {
    const newPositions = [];
    const newSpeeds = [];
    
    for (let i = 0; i < count; i++) {
      newPositions.push(
        origin[0] + (Math.random() - 0.5) * 0.5,
        origin[1] + Math.random() * 0.2,
        origin[2] + (Math.random() - 0.5) * 0.5
      );
      
      newSpeeds.push(
        (Math.random() - 0.5) * 0.02,
        Math.random() * 0.02 + 0.01,
        (Math.random() - 0.5) * 0.02
      );
    }
    
    setPositions(newPositions);
    setSpeeds(newSpeeds);
  }, [origin]);
  
  useFrame(() => {
    if (!mesh.current) return;
    
    const positions = mesh.current.geometry.attributes.position.array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Update positions
      positions[i3] += speeds[i3];
      positions[i3 + 1] += speeds[i3 + 1];
      positions[i3 + 2] += speeds[i3 + 2];
      
      // Reset if particle goes too high
      if (positions[i3 + 1] > origin[1] + 3) {
        positions[i3] = origin[0] + (Math.random() - 0.5) * 0.5;
        positions[i3 + 1] = origin[1];
        positions[i3 + 2] = origin[2] + (Math.random() - 0.5) * 0.5;
      }
    }
    
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });
  
  if (positions.length === 0) return null;
  
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={count}
          array={new Float32Array(positions)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.1} 
        color={type === 'positive' ? '#00ff00' : '#ff0000'} 
        transparent 
        opacity={0.8} 
        sizeAttenuation 
      />
    </points>
  );
}

// Ground component
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#8a8a8a" roughness={0.8} />
    </mesh>
  );
}

// Scene camera controls with story transitions
function SceneManager() {
  const { camera } = useThree();
  const [activeScene, setActiveScene] = useState(0);
  
  const scenes = [
    { name: "Overview", position: [0, 10, 15], target: [0, 0, 0] },
    { name: "Hospital District", position: [5, 5, 5], target: [5, 0, 5] },
    { name: "Food District", position: [-5, 5, 5], target: [-5, 0, 5] },
    { name: "Residential Area", position: [-5, 5, -5], target: [-5, 0, -5] },
    { name: "Park District", position: [5, 5, -5], target: [5, 0, -5] }
  ];
  
  const transitionToScene = (index) => {
    const scene = scenes[index];
    
    gsap.to(camera.position, {
      x: scene.position[0],
      y: scene.position[1],
      z: scene.position[2],
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.lookAt(scene.target[0], scene.target[1], scene.target[2]);
      }
    });
    
    setActiveScene(index);
  };
  
  return (
    <Html position={[-14, 8, 0]}>
      <div style={{
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: '15px',
        borderRadius: '8px',
        color: 'white',
        width: '200px'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Health Metropolis</h3>
        <div style={{ marginBottom: '15px' }}>
          <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '5px' }}>Navigate To:</div>
          {scenes.map((scene, index) => (
            <button 
              key={index}
              onClick={() => transitionToScene(index)}
              style={{
                display: 'block',
                width: '100%',
                margin: '5px 0',
                padding: '8px',
                background: activeScene === index ? 'var(--primary)' : 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              {scene.name}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '12px', opacity: 0.8 }}>
          Click on buildings to reveal their health system role
        </div>
      </div>
    </Html>
  );
}

// City buildings and layout
function City() {
  const [activeBuilding, setActiveBuilding] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [infoPanel, setInfoPanel] = useState(null);
  
  useEffect(() => {
    // Define city layout
    const cityLayout = [
      // Hospitals (Medical Interventions)
      { position: [5, 0, 5], scale: [1, 3, 1], color: '#3A86FF', type: 'hospital', 
        info: { name: 'Central Hospital', description: 'Represents medical interventions - often treating symptoms rather than causes of lifestyle diseases.' } },
      { position: [7, 0, 5], scale: [1, 2, 1], color: '#3A86FF', type: 'hospital', 
        info: { name: 'Specialty Clinic', description: 'Focus on specific conditions like diabetes and heart disease.' } },
      { position: [5, 0, 7], scale: [1, 2, 1], color: '#3A86FF', type: 'hospital', 
        info: { name: 'Private Healthcare', description: 'Available to middle class but often expensive for ongoing treatment.' } },
      
      // Parks (Exercise)
      { position: [5, 0, -5], scale: [1, 0.5, 1], color: '#4CB944', type: 'park', 
        info: { name: 'Central Park', description: 'Public exercise spaces - increasingly rare in urban centers.' } },
      { position: [7, 0, -5], scale: [1, 0.5, 1], color: '#4CB944', type: 'park', 
        info: { name: 'Sports Complex', description: 'Accessible mainly to the affluent segments of society.' } },
      { position: [5, 0, -7], scale: [1, 0.5, 1], color: '#4CB944', type: 'park', 
        info: { name: 'Jogging Trail', description: 'Limited infrastructure for daily physical activity.' } },
      
      // Fast Food (Diet)
      { position: [-5, 0, 5], scale: [1, 2, 1], color: '#FF6B6B', type: 'food', 
        info: { name: 'Fast Food Chain', description: 'Convenient but unhealthy food options that contribute to obesity.' } },
      { position: [-7, 0, 5], scale: [1, 1.5, 1], color: '#FF6B6B', type: 'food', 
        info: { name: 'Processed Food Factory', description: 'Mass production making unhealthy options more affordable.' } },
      { position: [-5, 0, 7], scale: [1, 2.5, 1], color: '#FF6B6B', type: 'food', 
        info: { name: 'Convenience Store', description: 'Quick access to high-calorie, low-nutrition foods.' } },
      
      // Homes (Lifestyle)
      { position: [-5, 0, -5], scale: [1, 1.5, 1], color: '#FFBE0B', type: 'home', 
        info: { name: 'Middle-Class Residence', description: 'Home life increasingly sedentary with screen time replacing physical activity.' } },
      { position: [-7, 0, -5], scale: [1, 1.5, 1], color: '#FFBE0B', type: 'home', 
        info: { name: 'Apartment Building', description: 'Urban living with limited space for physical activities.' } },
      { position: [-5, 0, -7], scale: [1, 1.5, 1], color: '#FFBE0B', type: 'home', 
        info: { name: 'High-rise Complex', description: 'Modern living designed for convenience rather than activity.' } },
    ];
    
    setBuildings(cityLayout);
  }, []);
  
  const handleBuildingClick = (building) => {
    setActiveBuilding(building.position.join(','));
    setInfoPanel({
      position: building.position,
      info: building.info
    });
    
    // Close panel after 5 seconds
    setTimeout(() => {
      setInfoPanel(null);
      setActiveBuilding(null);
    }, 5000);
  };

  return (
    <group>
      <Ground />
      <Roads />
      
      {buildings.map((building, index) => (
        <Building 
          key={index}
          position={building.position}
          scale={building.scale}
          color={building.color}
          type={building.type}
          isActive={activeBuilding === building.position.join(',')}
          onClick={() => handleBuildingClick(building)}
        />
      ))}
      
      {/* Particles for visual effect */}
      {activeBuilding && (
        <Particles 
          type={buildings.find(b => b.position.join(',') === activeBuilding)?.type === 'hospital' || 
                buildings.find(b => b.position.join(',') === activeBuilding)?.type === 'park' ? 'positive' : 'negative'}
          origin={buildings.find(b => b.position.join(',') === activeBuilding)?.position}
        />
      )}
      
      {/* Info panel */}
      {infoPanel && (
        <Html position={[infoPanel.position[0], infoPanel.position[1] + 3, infoPanel.position[2]]}>
          <div style={{
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '5px',
            width: '250px',
            boxShadow: '0 0 15px rgba(0,0,0,0.2)',
            transform: 'translate3d(-50%, -100%, 0)'
          }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>{infoPanel.info.name}</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{infoPanel.info.description}</p>
          </div>
        </Html>
      )}
      
      <SceneManager />
    </group>
  );
}

// Main component
function HealthMetropolis3D() {
  return (
    <section className="health-metropolis-section section">
      <div className="section-inner">
        <h2>Health Metropolis</h2>
        <p>
          Explore this 3D city model representing India's health system. Each district 
          symbolizes a different aspect of the lifestyle disease ecosystem.
        </p>
        
        <div style={{ height: '600px', width: '100%', position: 'relative', marginTop: '2rem' }}>
          <Canvas camera={{ position: [0, 10, 15], fov: 60 }} shadows>
            <fog attach="fog" args={['#f0f0f0', 10, 40]} />
            <ambientLight intensity={0.5} />
            <directionalLight 
              position={[10, 10, 5]} 
              intensity={1} 
              castShadow 
              shadow-mapSize-width={2048} 
              shadow-mapSize-height={2048}
              shadow-camera-left={-20}
              shadow-camera-right={20}
              shadow-camera-top={20}
              shadow-camera-bottom={-20}
            />
            
            <City />
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            
            <EffectComposer>
              <Bloom luminanceThreshold={0.5} intensity={0.3} />
              <Vignette darkness={0.3} offset={0.1} />
            </EffectComposer>
          </Canvas>
        </div>
      </div>
    </section>
  );
}

export default HealthMetropolis3D;
