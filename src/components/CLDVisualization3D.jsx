import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force-3d';

// Health system nodes
const nodes = [
  { id: 'stress', name: 'Stress Level', group: 1, description: 'Mental and physical tension experienced by individuals' },
  { id: 'comfort_food', name: 'Comfort Food Consumption', group: 1, description: 'Intake of high-calorie, low-nutrition foods as stress relief' },
  { id: 'obesity', name: 'Obesity Rate', group: 1, description: 'Percentage of population with BMI over 30' },
  { id: 'physical_activity', name: 'Physical Activity', group: 2, description: 'Regular exercise and movement throughout the day' },
  { id: 'urban_design', name: 'Urban Design', group: 3, description: 'How cities are planned, including walkability and green spaces' },
  { id: 'car_dependency', name: 'Car Dependency', group: 3, description: 'Reliance on personal vehicles for transportation' },
  { id: 'medical_treatment', name: 'Medical Treatment', group: 4, description: 'Healthcare interventions for lifestyle diseases' },
  { id: 'symptom_relief', name: 'Symptom Relief', group: 4, description: 'Temporary alleviation of health issues' },
  { id: 'lifestyle_change', name: 'Lifestyle Change', group: 4, description: 'Long-term modifications to daily habits and behaviors' }
];

// Links between nodes
const links = [
  { source: 'stress', target: 'comfort_food', value: 1, polarity: 'positive', loop: 'R1' },
  { source: 'comfort_food', target: 'obesity', value: 1, polarity: 'positive', loop: 'R1' },
  { source: 'obesity', target: 'stress', value: 1, polarity: 'positive', loop: 'R1' },
  { source: 'urban_design', target: 'car_dependency', value: 1, polarity: 'positive', loop: 'R2' },
  { source: 'car_dependency', target: 'physical_activity', value: 1, polarity: 'negative', loop: 'R2' },
  { source: 'physical_activity', target: 'obesity', value: 1, polarity: 'negative', loop: 'R2' },
  { source: 'obesity', target: 'urban_design', value: 1, polarity: 'negative', loop: 'R2' },
  { source: 'obesity', target: 'medical_treatment', value: 1, polarity: 'positive', loop: 'B1' },
  { source: 'medical_treatment', target: 'symptom_relief', value: 1, polarity: 'positive', loop: 'B1' },
  { source: 'symptom_relief', target: 'lifestyle_change', value: 1, polarity: 'negative', loop: 'B1' },
  { source: 'lifestyle_change', target: 'obesity', value: 1, polarity: 'negative', loop: 'B1' }
];

// Feedback loops
const loops = {
  'R1': { name: 'Stress-Comfort Food-Obesity', type: 'reinforcing', color: '#3A86FF' },
  'R2': { name: 'Urban Design-Activity-Obesity', type: 'reinforcing', color: '#3A86FF' },
  'B1': { name: 'Medical Treatment-Recovery-Neglect', type: 'balancing', color: '#FF6B6B' }
};

// Node component
function Node({ position, name, description, isHovered, onClick, onPointerOver, onPointerOut, isActive, color }) {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group position={position}>
      <mesh 
        ref={meshRef}
        onClick={onClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        <sphereGeometry args={[isHovered ? 0.7 : 0.5, 32, 32]} />
        <meshStandardMaterial 
          color={color || (isActive ? '#FFBE0B' : '#3A86FF')} 
          emissive={isHovered ? '#FFBE0B' : '#000000'}
          emissiveIntensity={isHovered ? 0.5 : 0}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <Text
        position={[0, -0.8, 0]}
        color="white"
        fontSize={0.3}
        maxWidth={2}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
      {isHovered && (
        <Html position={[0, 1, 0]} distanceFactor={15}>
          <div style={{
            width: '200px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            transform: 'translate3d(-50%, -50%, 0)'
          }}>
            <h3 style={{ margin: '0 0 5px 0' }}>{name}</h3>
            <p style={{ margin: 0, fontSize: '12px' }}>{description}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

// Link component
function Link({ start, end, polarity, loop, highlight }) {
  const [curve, setCurve] = useState(null);
  
  useEffect(() => {
    // Create a curved line between nodes
    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      new THREE.Vector3(
        (start[0] + end[0]) / 2,
        (start[1] + end[1]) / 2 + 0.5,
        (start[2] + end[2]) / 2 + 0.5
      ),
      new THREE.Vector3(...end)
    ]);
    
    const points = path.getPoints(50);
    setCurve(points);
  }, [start, end]);
  
  if (!curve) return null;
  
  // Color based on loop type
  const loopData = loops[loop];
  const color = highlight ? '#FFBE0B' : (loopData ? loopData.color : '#999999');
  
  return (
    <>
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attachObject={['attributes', 'position']}
            count={curve.length}
            array={new Float32Array(curve.flatMap(v => [v.x, v.y, v.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial 
          attach="material" 
          color={color} 
          linewidth={2} 
          opacity={highlight ? 1 : 0.7}
          transparent
          linecap="round"
          linejoin="round"
        />
      </line>
      
      {/* Polarity marker at the end of the line */}
      <mesh position={curve[curve.length - 5].toArray()}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      <Html position={curve[Math.floor(curve.length / 2)].toArray()}>
        <div style={{ 
          color: 'white', 
          background: color, 
          borderRadius: '50%', 
          width: '20px', 
          height: '20px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          {polarity === 'positive' ? '+' : '-'}
        </div>
      </Html>
    </>
  );
}

// Legend component
function Legend() {
  return (
    <Html position={[0, 0, 0]} prepend center>
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '15px',
        borderRadius: '5px',
        width: '200px'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Feedback Loops</h3>
        {Object.entries(loops).map(([id, loop]) => (
          <div key={id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ 
              width: '15px', 
              height: '15px', 
              backgroundColor: loop.color, 
              marginRight: '8px',
              borderRadius: '50%'
            }}></div>
            <div>
              <strong>{id}:</strong> {loop.name} ({loop.type})
            </div>
          </div>
        ))}
        <div style={{ marginTop: '15px', fontSize: '12px' }}>
          <p>Click a node to highlight its loops</p>
          <p>Hover to see details</p>
          <p>Scroll to zoom, drag to rotate</p>
        </div>
      </div>
    </Html>
  );
}

// Main 3D network visualization
function Network() {
  const [nodePositions, setNodePositions] = useState({});
  const [hoveredNode, setHoveredNode] = useState(null);
  const [activeLoop, setActiveLoop] = useState(null);
  
  useEffect(() => {
    // Use D3 force simulation to layout nodes
    const simulation = forceSimulation(nodes)
      .force("link", forceLink(links).id(d => d.id).distance(5))
      .force("charge", forceManyBody().strength(-8))
      .force("center", forceCenter(0, 0, 0))
      .stop();
    
    // Run simulation a few times to stabilize
    for (let i = 0; i < 300; i++) {
      simulation.tick();
    }
    
    // Get positions
    const positions = {};
    nodes.forEach(node => {
      positions[node.id] = [node.x, node.y, node.z || 0];
    });
    
    setNodePositions(positions);
  }, []);
  
  const handleNodeClick = (nodeId) => {
    // Find all loops this node participates in
    const nodeLoops = links
      .filter(link => link.source === nodeId || link.target === nodeId)
      .map(link => link.loop);
    
    // If already active, deactivate; otherwise activate
    setActiveLoop(activeLoop === nodeId ? null : nodeId);
  };
  
  // Return if positions not calculated yet
  if (Object.keys(nodePositions).length === 0) {
    return <Text>Calculating positions...</Text>;
  }
  
  // Check which links should be highlighted
  const isLinkHighlighted = (link) => {
    if (!activeLoop) return false;
    
    // Check if link is part of a loop that includes activeLoop
    const linkedNodeIds = links
      .filter(l => l.loop === link.loop)
      .flatMap(l => [l.source, l.target]);
      
    return linkedNodeIds.includes(activeLoop);
  };

  return (
    <group>
      {/* Draw links first so they appear behind nodes */}
      {links.map((link, index) => (
        <Link 
          key={index}
          start={nodePositions[typeof link.source === 'string' ? link.source : link.source.id]}
          end={nodePositions[typeof link.target === 'string' ? link.target : link.target.id]}
          polarity={link.polarity}
          loop={link.loop}
          highlight={isLinkHighlighted(link)}
        />
      ))}
      
      {/* Draw nodes */}
      {nodes.map((node) => (
        <Node 
          key={node.id}
          position={nodePositions[node.id]}
          name={node.name}
          description={node.description}
          isHovered={hoveredNode === node.id}
          isActive={activeLoop === node.id}
          onClick={() => handleNodeClick(node.id)}
          onPointerOver={() => setHoveredNode(node.id)}
          onPointerOut={() => setHoveredNode(null)}
          color={activeLoop && activeLoop !== node.id ? '#999999' : null}
        />
      ))}
      
      {/* Legend */}
      <Legend />
    </group>
  );
}

// Main component
function CLDVisualization3D() {
  return (
    <section className="cld-3d-section section">
      <div className="section-inner">
        <h2>3D System Dynamics</h2>
        <p>
          Explore the causal relationships in a 3D space. Click on nodes to highlight feedback loops,
          hover for details, and drag to rotate the view.
        </p>
        
        <div style={{ height: '600px', width: '100%', position: 'relative', marginTop: '2rem' }}>
          <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} />
            <Network />
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          </Canvas>
        </div>
      </div>
    </section>
  );
}

export default CLDVisualization3D;
