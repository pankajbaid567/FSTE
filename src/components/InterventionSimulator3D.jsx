import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

// Intervention definitions
const interventions = [
  {
    id: 'sugar_tax',
    name: 'Sugar Tax',
    description: 'Implement a tax on sugary beverages and processed foods',
    color: '#FF6B6B',
    target: 'processed_food',
    effects: {
      obesity: -12,
      diabetes: -8,
      activity: 0
    }
  },
  {
    id: 'walkable_cities',
    name: 'Walkable Cities',
    description: 'Redesign urban infrastructure for pedestrian-friendly environments',
    color: '#4CB944',
    target: 'physical_activity',
    effects: {
      obesity: -10,
      diabetes: -7,
      activity: 15
    }
  },
  {
    id: 'workplace_wellness',
    name: 'Workplace Wellness',
    description: 'Corporate programs for health promotion during work hours',
    color: '#3A86FF',
    target: 'stress',
    effects: {
      obesity: -8,
      diabetes: -5,
      activity: 10
    }
  },
  {
    id: 'food_labeling',
    name: 'Food Labeling Reform',
    description: 'Clear nutritional information with health impact warnings',
    color: '#FFBE0B',
    target: 'awareness',
    effects: {
      obesity: -7,
      diabetes: -6,
      activity: 5
    }
  }
];

// System nodes
const systemNodes = [
  { id: 'processed_food', name: 'Processed Food', position: [-2, 0, 1] },
  { id: 'physical_activity', name: 'Physical Activity', position: [2, 0, 1] },
  { id: 'stress', name: 'Stress', position: [-2, 0, -1] },
  { id: 'awareness', name: 'Health Awareness', position: [2, 0, -1] },
  { id: 'obesity', name: 'Obesity Rate', position: [0, 0, 0] }
];

// Draggable intervention cube
function InterventionCube({ intervention, position, onDragEnd }) {
  const meshRef = useRef();
  const { camera, gl } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState([0, 0, 0]);
  const initialPosition = useRef([...position]);
  
  // Maintain position when dragging
  useFrame(() => {
    if (isDragging && meshRef.current) {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      
      // Get mouse position
      mouse.x = (gl.domElement.mouseX / gl.domElement.clientWidth) * 2 - 1;
      mouse.y = -(gl.domElement.mouseY / gl.domElement.clientHeight) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      
      // Calculate intersection with a horizontal plane
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const targetPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, targetPoint);
      
      // Update position
      meshRef.current.position.x = targetPoint.x - dragOffset[0];
      meshRef.current.position.z = targetPoint.z - dragOffset[2];
    }
  });
  
  // Handle pointer events
  const handlePointerDown = (e) => {
    e.stopPropagation();
    gl.domElement.mouseX = e.clientX;
    gl.domElement.mouseY = e.clientY;
    
    setIsDragging(true);
    setDragOffset([
      e.point.x - meshRef.current.position.x,
      0,
      e.point.z - meshRef.current.position.z
    ]);
    
    // Setup document-level handlers
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleMouseMove = (e) => {
    gl.domElement.mouseX = e.clientX;
    gl.domElement.mouseY = e.clientY;
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    // Check if cube is dropped on a node
    const targetNode = systemNodes.find(node => {
      const dx = Math.abs(node.position[0] - meshRef.current.position.x);
      const dz = Math.abs(node.position[2] - meshRef.current.position.z);
      return dx < 0.7 && dz < 0.7;
    });
    
    if (targetNode && targetNode.id === intervention.target) {
      // Success - dropped on the correct node
      onDragEnd(intervention, true);
      
      // Animate to exact position
      gsap.to(meshRef.current.position, {
        x: targetNode.position[0],
        y: 0.5,
        z: targetNode.position[2],
        duration: 0.3,
        ease: 'back.out'
      });
    } else {
      // Return to initial position
      onDragEnd(intervention, false);
      
      gsap.to(meshRef.current.position, {
        x: initialPosition.current[0],
        y: initialPosition.current[1],
        z: initialPosition.current[2],
        duration: 0.5,
        ease: 'back.out'
      });
    }
  };
  
  // Hover animations
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    if (hovered && !isDragging) {
      gsap.to(meshRef.current.position, {
        y: position[1] + 0.2,
        duration: 0.3,
        ease: 'power2.out'
      });
    } else if (!isDragging) {
      gsap.to(meshRef.current.position, {
        y: position[1],
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [hovered, position, isDragging]);
  
  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial 
          color={intervention.color} 
          metalness={0.5}
          roughness={0.2}
          emissive={intervention.color}
          emissiveIntensity={hovered || isDragging ? 0.5 : 0.2}
        />
      </mesh>
      
      <Text
        position={[0, -0.4, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="top"
      >
        {intervention.name}
      </Text>
    </group>
  );
}

// System node component
function SystemNode({ node, isHighlighted, isTarget }) {
  const meshRef = useRef();
  
  // Animation for when highlighted
  useEffect(() => {
    if (isHighlighted && meshRef.current) {
      gsap.to(meshRef.current.position, {
        y: 0.2,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
        yoyo: true,
        repeat: 1
      });
    }
  }, [isHighlighted]);
  
  // Different appearance for target nodes
  const size = isTarget ? 0.7 : 0.5;
  const color = isTarget ? '#FFBE0B' : '#3A86FF';
  const opacity = isTarget ? 0.8 : 0.6;
  
  return (
    <group position={node.position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={opacity}
          emissive={isHighlighted ? '#FFBE0B' : color}
          emissiveIntensity={isHighlighted ? 0.5 : 0.2}
        />
      </mesh>
      
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="top"
      >
        {node.name}
      </Text>
      
      {isTarget && (
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#FFBE0B" />
        </mesh>
      )}
    </group>
  );
}

// Link between nodes
function NodeLink({ start, end, opacity = 0.4 }) {
  return (
    <line>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={2}
          array={new Float32Array([...start, ...end])}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial 
        attach="material" 
        color="#ffffff" 
        linewidth={1} 
        opacity={opacity}
        transparent
      />
    </line>
  );
}

// Impact particles animation
function ImpactParticles({ position, color }) {
  const count = 30;
  const particlesRef = useRef();
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    // Create particles
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.5 + 0.2;
      
      newParticles.push({
        position: [
          position[0],
          position[1],
          position[2]
        ],
        velocity: [
          Math.cos(angle) * radius * 0.05,
          Math.random() * 0.1,
          Math.sin(angle) * radius * 0.05
        ],
        size: Math.random() * 0.1 + 0.05
      });
    }
    
    setParticles(newParticles);
  }, [position]);
  
  useFrame(() => {
    if (!particlesRef.current) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array;
    
    let i = 0;
    for (let p = 0; p < particles.length; p++) {
      const particle = particles[p];
      
      // Update positions based on velocity
      particle.position[0] += particle.velocity[0];
      particle.position[1] += particle.velocity[1];
      particle.position[2] += particle.velocity[2];
      
      // Apply gravity
      particle.velocity[1] -= 0.005;
      
      // Copy to buffer
      positions[i++] = particle.position[0];
      positions[i++] = particle.position[1];
      positions[i++] = particle.position[2];
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={particles.length}
          array={new Float32Array(particles.length * 3)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.1} 
        color={color} 
        transparent 
        opacity={0.8} 
        sizeAttenuation 
      />
    </points>
  );
}

// Stats panel
function StatsPanel({ healthStats, activeIntervention }) {
  if (!healthStats) return null;
  
  // Calculate how intervention affects stats
  let modifiedStats = { ...healthStats };
  if (activeIntervention) {
    modifiedStats = {
      obesity: healthStats.obesity + activeIntervention.effects.obesity,
      diabetes: healthStats.diabetes + activeIntervention.effects.diabetes,
      activity: healthStats.activity + activeIntervention.effects.activity
    };
  }
  
  return (
    <Html position={[5, 2, 0]}>
      <div style={{
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: '15px',
        borderRadius: '8px',
        color: 'white',
        width: '250px'
      }}>
        <h3 style={{ margin: '0 0 15px 0' }}>Health Metrics</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#FF6B6B' }}>Obesity Rate</h4>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div style={{ width: '80px' }}>Current:</div>
            <div style={{ flex: 1 }}>
              <div style={{ 
                height: '12px', 
                backgroundColor: '#444', 
                borderRadius: '6px', 
                overflow: 'hidden' 
              }}>
                <div style={{ 
                  height: '100%', 
                  width: `${healthStats.obesity / 0.4}%`, 
                  backgroundColor: '#FF6B6B', 
                  borderRadius: '6px' 
                }}></div>
              </div>
            </div>
            <div style={{ width: '40px', textAlign: 'right' }}>{healthStats.obesity}%</div>
          </div>
          
          {activeIntervention && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '80px' }}>After:</div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  height: '12px', 
                  backgroundColor: '#444', 
                  borderRadius: '6px', 
                  overflow: 'hidden' 
                }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${modifiedStats.obesity / 0.4}%`, 
                    backgroundColor: '#FF6B6B', 
                    borderRadius: '6px' 
                  }}></div>
                </div>
              </div>
              <div style={{ width: '40px', textAlign: 'right' }}>
                {modifiedStats.obesity}%
                <span style={{ 
                  fontSize: '11px', 
                  color: activeIntervention.effects.obesity < 0 ? '#4CB944' : '#FF6B6B',
                  marginLeft: '3px'
                }}>
                  {activeIntervention.effects.obesity > 0 ? '+' : ''}{activeIntervention.effects.obesity}
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#FF9E4F' }}>Diabetes Rate</h4>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div style={{ width: '80px' }}>Current:</div>
            <div style={{ flex: 1 }}>
              <div style={{ 
                height: '12px', 
                backgroundColor: '#444', 
                borderRadius: '6px', 
                overflow: 'hidden' 
              }}>
                <div style={{ 
                  height: '100%', 
                  width: `${healthStats.diabetes / 0.3}%`, 
                  backgroundColor: '#FF9E4F', 
                  borderRadius: '6px' 
                }}></div>
              </div>
            </div>
            <div style={{ width: '40px', textAlign: 'right' }}>{healthStats.diabetes}%</div>
          </div>
          
          {activeIntervention && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '80px' }}>After:</div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  height: '12px', 
                  backgroundColor: '#444', 
                  borderRadius: '6px', 
                  overflow: 'hidden' 
                }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${modifiedStats.diabetes / 0.3}%`, 
                    backgroundColor: '#FF9E4F', 
                    borderRadius: '6px' 
                  }}></div>
                </div>
              </div>
              <div style={{ width: '40px', textAlign: 'right' }}>
                {modifiedStats.diabetes}%
                <span style={{ 
                  fontSize: '11px', 
                  color: activeIntervention.effects.diabetes < 0 ? '#4CB944' : '#FF6B6B',
                  marginLeft: '3px'
                }}>
                  {activeIntervention.effects.diabetes > 0 ? '+' : ''}{activeIntervention.effects.diabetes}
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div>
          <h4 style={{ margin: '0 0 10px 0', color: '#4CB944' }}>Physical Activity</h4>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div style={{ width: '80px' }}>Current:</div>
            <div style={{ flex: 1 }}>
              <div style={{ 
                height: '12px', 
                backgroundColor: '#444', 
                borderRadius: '6px', 
                overflow: 'hidden' 
              }}>
                <div style={{ 
                  height: '100%', 
                  width: `${healthStats.activity / 0.6}%`, 
                  backgroundColor: '#4CB944', 
                  borderRadius: '6px' 
                }}></div>
              </div>
            </div>
            <div style={{ width: '40px', textAlign: 'right' }}>{healthStats.activity} min</div>
          </div>
          
          {activeIntervention && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '80px' }}>After:</div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  height: '12px', 
                  backgroundColor: '#444', 
                  borderRadius: '6px', 
                  overflow: 'hidden' 
                }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${modifiedStats.activity / 0.6}%`, 
                    backgroundColor: '#4CB944', 
                    borderRadius: '6px' 
                  }}></div>
                </div>
              </div>
              <div style={{ width: '40px', textAlign: 'right' }}>
                {modifiedStats.activity} min
                <span style={{ 
                  fontSize: '11px', 
                  color: activeIntervention.effects.activity > 0 ? '#4CB944' : '#FF6B6B',
                  marginLeft: '3px'
                }}>
                  {activeIntervention.effects.activity > 0 ? '+' : ''}{activeIntervention.effects.activity}
                </span>
              </div>
            </div>
          )}
        </div>
        
        {activeIntervention && (
          <div style={{ 
            marginTop: '20px', 
            padding: '10px', 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            borderRadius: '5px',
            fontSize: '13px'
          }}>
            <strong>{activeIntervention.name}</strong>: {activeIntervention.description}
          </div>
        )}
      </div>
    </Html>
  );
}

// Instructions panel
function InstructionsPanel() {
  return (
    <Html position={[-5, 3, 0]}>
      <div style={{
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: '15px',
        borderRadius: '8px',
        color: 'white',
        width: '250px'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Intervention Simulator</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.5' }}>
          Drag and drop policy interventions onto their target nodes to see their impact on health metrics.
        </p>
        <ul style={{ fontSize: '14px', padding: '0 0 0 20px' }}>
          <li style={{ margin: '5px 0' }}>Sugar Tax → Processed Food</li>
          <li style={{ margin: '5px 0' }}>Walkable Cities → Physical Activity</li>
          <li style={{ margin: '5px 0' }}>Workplace Wellness → Stress</li>
          <li style={{ margin: '5px 0' }}>Food Labeling → Health Awareness</li>
        </ul>
      </div>
    </Html>
  );
}

// Main simulation scene
function SimulationScene() {
  const [activeIntervention, setActiveIntervention] = useState(null);
  const [showParticles, setShowParticles] = useState(false);
  const [particlesPosition, setParticlesPosition] = useState([0, 0, 0]);
  const [particlesColor, setParticlesColor] = useState('#ffffff');
  const [highlightedNode, setHighlightedNode] = useState(null);
  
  const healthStats = {
    obesity: 28,
    diabetes: 18,
    activity: 25
  };
  
  const handleInterventionDrop = (intervention, success) => {
    if (success) {
      setActiveIntervention(intervention);
      setShowParticles(true);
      setParticlesPosition(systemNodes.find(node => node.id === intervention.target).position);
      setParticlesColor(intervention.color);
      
      // Highlight the central obesity node
      setHighlightedNode('obesity');
      
      // Reset after animation completes
      setTimeout(() => {
        setShowParticles(false);
        setHighlightedNode(null);
      }, 2000);
    } else {
      setActiveIntervention(null);
    }
  };
  
  // Intervention placement positions
  const interventionPositions = [
    [-4, 0.3, 2],  // Sugar Tax
    [-4, 0.3, 0],  // Walkable Cities
    [-4, 0.3, -2], // Workplace Wellness
    [-4, 0.3, -4]  // Food Labeling
  ];
  
  return (
    <group>
      {/* System nodes */}
      {systemNodes.map((node) => (
        <SystemNode 
          key={node.id} 
          node={node} 
          isHighlighted={highlightedNode === node.id}
          isTarget={activeIntervention && activeIntervention.target === node.id}
        />
      ))}
      
      {/* Links between nodes */}
      <NodeLink start={[-2, 0, 1]} end={[0, 0, 0]} />
      <NodeLink start={[2, 0, 1]} end={[0, 0, 0]} />
      <NodeLink start={[-2, 0, -1]} end={[0, 0, 0]} />
      <NodeLink start={[2, 0, -1]} end={[0, 0, 0]} />
      
      {/* Interventions */}
      {interventions.map((intervention, index) => (
        <InterventionCube 
          key={intervention.id}
          intervention={intervention}
          position={interventionPositions[index]}
          onDragEnd={handleInterventionDrop}
        />
      ))}
      
      {/* Impact particles animation */}
      {showParticles && (
        <ImpactParticles 
          position={particlesPosition} 
          color={particlesColor} 
        />
      )}
      
      {/* Stats and instructions */}
      <StatsPanel 
        healthStats={healthStats}
        activeIntervention={activeIntervention}
      />
      <InstructionsPanel />
      
      {/* Ground plane for visual reference */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#333" roughness={0.8} metalness={0.2} />
      </mesh>
    </group>
  );
}

// Main component
function InterventionSimulator3D() {
  return (
    <section className="intervention-simulator-section section">
      <div className="section-inner">
        <h2>Policy Intervention Simulator</h2>
        <p>
          Drag and drop different policy interventions onto the appropriate targets in the system
          to see their potential impact on health metrics. This interactive model demonstrates
          how structural changes can lead to improved health outcomes.
        </p>
        
        <div style={{ height: '600px', width: '100%', position: 'relative', marginTop: '2rem' }}>
          <Canvas camera={{ position: [0, 5, 10], fov: 50 }} shadows>
            <ambientLight intensity={0.4} />
            <directionalLight 
              position={[5, 10, 5]} 
              intensity={0.8} 
              castShadow
              shadow-mapSize-width={1024} 
              shadow-mapSize-height={1024}
            />
            
            <SimulationScene />
            
            <OrbitControls 
              enablePan={true} 
              enableZoom={true} 
              enableRotate={true}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2.5}
            />
          </Canvas>
        </div>
      </div>
    </section>
  );
}

export default InterventionSimulator3D;
