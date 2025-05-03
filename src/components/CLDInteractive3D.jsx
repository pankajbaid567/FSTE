import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

// Node categories with colors
const CATEGORIES = {
  HEALTH: { color: '#FF9E4F', name: 'Health Outcomes' },
  LIFESTYLE: { color: '#3A86FF', name: 'Lifestyle Factors' },
  ECONOMIC: { color: '#4CB944', name: 'Economic & Social Factors' },
  HEALTHCARE: { color: '#8A2BE2', name: 'Healthcare & Awareness' },
  PSYCHOLOGICAL: { color: '#FF6B6B', name: 'Psychological Factors' }
};

// Nodes definition
const initialNodes = [
  { id: 'obesity', name: 'Obesity Rate', category: CATEGORIES.HEALTH, position: [0, 0, 0] },
  { id: 'diabetes', name: 'Diabetes Incidence', category: CATEGORIES.HEALTH, position: [3, 1, 0] },
  { id: 'hypertension', name: 'Hypertension Cases', category: CATEGORIES.HEALTH, position: [4, -1, 0] },
  { id: 'healthcare_cost', name: 'Healthcare Cost', category: CATEGORIES.HEALTH, position: [5, 0, 0] },
  
  { id: 'physical_activity', name: 'Physical Activity', category: CATEGORIES.LIFESTYLE, position: [-2, 2, 0] },
  { id: 'screen_time', name: 'Screen Time', category: CATEGORIES.LIFESTYLE, position: [-3, 0, 0] },
  { id: 'fast_food', name: 'Fast Food Consumption', category: CATEGORIES.LIFESTYLE, position: [-1, -2, 0] },
  { id: 'traditional_diet', name: 'Traditional Diet Loss', category: CATEGORIES.LIFESTYLE, position: [-4, -2, 0] },
  
  { id: 'work_hours', name: 'Work Hours', category: CATEGORIES.ECONOMIC, position: [-5, 1, 0] },
  { id: 'sedentary_jobs', name: 'Sedentary Jobs', category: CATEGORIES.ECONOMIC, position: [-2, -3, 0] },
  { id: 'economic_mobility', name: 'Economic Mobility', category: CATEGORIES.ECONOMIC, position: [0, -4, 0] },
  
  { id: 'health_awareness', name: 'Health Awareness', category: CATEGORIES.HEALTHCARE, position: [2, -4, 0] },
  { id: 'preventive_healthcare', name: 'Preventive Healthcare', category: CATEGORIES.HEALTHCARE, position: [4, -3, 0] },
  
  { id: 'stress', name: 'Stress Levels', category: CATEGORIES.PSYCHOLOGICAL, position: [-3, 3, 0] }
];

// Edges definition
const edges = [
  // Health outcome relationships
  { source: 'obesity', target: 'diabetes', type: 'positive' },
  { source: 'obesity', target: 'hypertension', type: 'positive' },
  { source: 'diabetes', target: 'healthcare_cost', type: 'positive' },
  { source: 'hypertension', target: 'healthcare_cost', type: 'positive' },
  
  // Lifestyle influences on health
  { source: 'physical_activity', target: 'obesity', type: 'negative' },
  { source: 'screen_time', target: 'physical_activity', type: 'negative' },
  { source: 'fast_food', target: 'obesity', type: 'positive' },
  { source: 'traditional_diet', target: 'fast_food', type: 'positive' },
  
  // Economic influences
  { source: 'work_hours', target: 'stress', type: 'positive' },
  { source: 'work_hours', target: 'physical_activity', type: 'negative' },
  { source: 'sedentary_jobs', target: 'physical_activity', type: 'negative' },
  { source: 'economic_mobility', target: 'fast_food', type: 'positive' },
  { source: 'economic_mobility', target: 'sedentary_jobs', type: 'positive' },
  
  // Healthcare influences
  { source: 'health_awareness', target: 'preventive_healthcare', type: 'positive' },
  { source: 'preventive_healthcare', target: 'healthcare_cost', type: 'negative' },
  { source: 'health_awareness', target: 'physical_activity', type: 'positive' },
  { source: 'health_awareness', target: 'fast_food', type: 'negative' },
  
  // Psychological influences
  { source: 'stress', target: 'fast_food', type: 'positive' },
  { source: 'stress', target: 'physical_activity', type: 'negative' },
  { source: 'obesity', target: 'stress', type: 'positive' }
];

// Define feedback loops
const feedbackLoops = [
  {
    id: 'R1',
    name: 'Stress-Eating Loop',
    type: 'reinforcing',
    nodes: ['stress', 'fast_food', 'obesity'],
    position: [-1.5, 0, 0]
  },
  {
    id: 'R2',
    name: 'Sedentary Lifestyle Loop',
    type: 'reinforcing',
    nodes: ['sedentary_jobs', 'physical_activity', 'obesity'],
    position: [-1, -1.5, 0]
  },
  {
    id: 'B1',
    name: 'Awareness-Prevention Loop',
    type: 'balancing',
    nodes: ['health_awareness', 'preventive_healthcare', 'healthcare_cost'],
    position: [3, -2.5, 0]
  }
];

// Node component with draggable functionality
function Node({ id, name, position, color, onDrag, selected, onClick, onDragStart, onDragEnd }) {
  const mesh = useRef();
  const { camera, gl } = useThree();
  const [hovered, setHovered] = useState(false);
  
  // Set up drag controls
  useEffect(() => {
    if (!mesh.current) return;
    
    const controls = new DragControls([mesh.current], camera, gl.domElement);
    
    controls.addEventListener('drag', (event) => {
      onDrag(id, [event.object.position.x, event.object.position.y, event.object.position.z]);
    });
    
    controls.addEventListener('dragstart', () => {
      onDragStart(id);
    });
    
    controls.addEventListener('dragend', () => {
      onDragEnd();
    });
    
    return () => {
      controls.dispose();
    };
  }, [camera, gl, id, onDrag, onDragStart, onDragEnd]);
  
  return (
    <group position={position}>
      {/* Node sphere */}
      <mesh 
        ref={mesh}
        onClick={(e) => { 
          e.stopPropagation();
          onClick(id);
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          transparent
          opacity={0.8}
          emissive={color}
          emissiveIntensity={hovered || selected ? 0.5 : 0.2}
        />
      </mesh>
      
      {/* Node label */}
      <Text
        position={[0, -0.6, 0]}
        color="white"
        fontSize={0.2}
        maxWidth={2}
        textAlign="center"
        anchorX="center"
        anchorY="top"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {name}
      </Text>
    </group>
  );
}

// Edge component for connecting nodes
function Edge({ sourcePosition, targetPosition, type, isHighlighted, controlPoint }) {
  // Create a curved path for the edge
  const curve = useMemo(() => {
    // Add curve to the path if a control point is provided
    if (controlPoint) {
      return new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(...sourcePosition),
        new THREE.Vector3(...controlPoint),
        new THREE.Vector3(...targetPosition)
      );
    } else {
      // Calculate default control point (slight curve)
      const midPoint = [
        (sourcePosition[0] + targetPosition[0]) / 2,
        (sourcePosition[1] + targetPosition[1]) / 2 + 0.5,
        (sourcePosition[2] + targetPosition[2]) / 2
      ];
      
      return new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(...sourcePosition),
        new THREE.Vector3(...midPoint),
        new THREE.Vector3(...targetPosition)
      );
    }
  }, [sourcePosition, targetPosition, controlPoint]);
  
  // Generate points along the curve
  const points = useMemo(() => curve.getPoints(50), [curve]);
  
  // Calculate the position for the arrowhead
  const arrowPosition = useMemo(() => {
    const pointsArray = points;
    const lastPoint = pointsArray[pointsArray.length - 1];
    const secondLastPoint = pointsArray[pointsArray.length - 2];
    
    // Direction vector for the arrow
    const direction = new THREE.Vector3()
      .subVectors(lastPoint, secondLastPoint)
      .normalize();
    
    return {
      position: [lastPoint.x, lastPoint.y, lastPoint.z],
      direction: [direction.x, direction.y, direction.z]
    };
  }, [points]);
  
  // Color based on relationship type
  const color = type === 'positive' ? '#3A86FF' : '#FF6B6B';
  
  return (
    <group>
      {/* Curved line for the edge */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attachObject={['attributes', 'position']}
            count={points.length}
            array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial 
          color={color} 
          linewidth={2} 
          opacity={isHighlighted ? 1 : 0.7}
          transparent={true}
        />
      </line>
      
      {/* Arrowhead */}
      <mesh 
        position={arrowPosition.position}
        scale={[0.1, 0.1, 0.1]}
        rotation={[0, 0, Math.atan2(arrowPosition.direction[1], arrowPosition.direction[0])]}
      >
        <coneGeometry args={[1, 2, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      {/* Relationship indicator (+ or -) */}
      <Html position={[
        (sourcePosition[0] + targetPosition[0]) / 2,
        (sourcePosition[1] + targetPosition[1]) / 2 + 0.3,
        (sourcePosition[2] + targetPosition[2]) / 2
      ]}>
        <div style={{
          backgroundColor: color,
          color: 'white',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold'
        }}>
          {type === 'positive' ? '+' : '−'}
        </div>
      </Html>
    </group>
  );
}

// Loop indicator component
function LoopIndicator({ loop, nodesPositions }) {
  // Calculate the center of the loop based on node positions
  const center = useMemo(() => {
    if (!nodesPositions || loop.nodes.length === 0) return loop.position;
    
    const positions = loop.nodes
      .map(nodeId => nodesPositions[nodeId])
      .filter(Boolean);
    
    if (positions.length === 0) return loop.position;
    
    const centerX = positions.reduce((sum, pos) => sum + pos[0], 0) / positions.length;
    const centerY = positions.reduce((sum, pos) => sum + pos[1], 0) / positions.length;
    const centerZ = positions.reduce((sum, pos) => sum + pos[2], 0) / positions.length;
    
    return [centerX, centerY, centerZ];
  }, [loop.nodes, loop.position, nodesPositions]);
  
  // Color based on loop type
  const color = loop.type === 'reinforcing' ? '#3A86FF' : '#FF6B6B';
  
  return (
    <group position={center}>
      <mesh>
        <circleGeometry args={[0.3, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <Text
        position={[0, 0, 0.01]}
        color="white"
        fontSize={0.25}
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {loop.id}
      </Text>
      <Html position={[0.5, 0.5, 0]}>
        <div style={{ 
          color: 'white', 
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '5px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          transform: 'translate3d(0, -50%, 0)',
          whiteSpace: 'nowrap'
        }}>
          {loop.name}
        </div>
      </Html>
    </group>
  );
}

// Legend component
function Legend() {
  return (
    <Html position={[0, 0, 0]} style={{ position: 'absolute', top: '20px', right: '20px' }}>
      <div style={{
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        width: '250px'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Causal Loop Diagram</h3>
        
        <h4 style={{ margin: '10px 0 5px 0' }}>Node Categories</h4>
        {Object.entries(CATEGORIES).map(([key, category]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div style={{ 
              width: '15px', 
              height: '15px', 
              backgroundColor: category.color, 
              borderRadius: '50%',
              marginRight: '8px' 
            }}></div>
            <span>{category.name}</span>
          </div>
        ))}
        
        <h4 style={{ margin: '15px 0 5px 0' }}>Relationships</h4>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <div style={{ 
            width: '15px', 
            height: '15px', 
            backgroundColor: '#3A86FF', 
            marginRight: '8px' 
          }}></div>
          <span>Positive (+): Increases/Reinforces</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: '15px', 
            height: '15px', 
            backgroundColor: '#FF6B6B', 
            marginRight: '8px' 
          }}></div>
          <span>Negative (−): Decreases/Balances</span>
        </div>
        
        <h4 style={{ margin: '15px 0 5px 0' }}>Feedback Loops</h4>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <div style={{ 
            width: '20px', 
            height: '20px', 
            backgroundColor: '#3A86FF', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '12px',
            marginRight: '8px'
          }}>R</div>
          <span>Reinforcing Loops: Amplify change</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: '20px', 
            height: '20px', 
            backgroundColor: '#FF6B6B', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '12px',
            marginRight: '8px'
          }}>B</div>
          <span>Balancing Loops: Counteract change</span>
        </div>
        
        <div style={{ marginTop: '15px', fontSize: '12px' }}>
          <p>Click nodes to select. Drag to reposition.</p>
        </div>
      </div>
    </Html>
  );
}

// Main scene component
function CausalLoopScene() {
  const [nodes, setNodes] = useState(initialNodes);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Create a positions lookup for quick reference
  const nodesPositions = useMemo(() => {
    const positions = {};
    nodes.forEach(node => {
      positions[node.id] = node.position;
    });
    return positions;
  }, [nodes]);
  
  // Handle node drag
  const handleNodeDrag = (id, newPosition) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === id ? { ...node, position: newPosition } : node
      )
    );
  };
  
  // Calculate control points for curved edges to avoid overlaps
  const edgesWithControlPoints = useMemo(() => {
    return edges.map((edge, index) => {
      const sourcePosition = nodesPositions[edge.source];
      const targetPosition = nodesPositions[edge.target];
      
      if (!sourcePosition || !targetPosition) return edge;
      
      // Check for bidirectional edges or potential overlaps
      const reversedEdgeExists = edges.some(e => 
        e.source === edge.target && e.target === edge.source
      );
      
      const hasOverlap = edges.some((otherEdge, otherIndex) => {
        if (index === otherIndex) return false;
        
        const otherSource = nodesPositions[otherEdge.source];
        const otherTarget = nodesPositions[otherEdge.target];
        
        if (!otherSource || !otherTarget) return false;
        
        // Simplified overlap detection
        const midpoint1 = [
          (sourcePosition[0] + targetPosition[0]) / 2,
          (sourcePosition[1] + targetPosition[1]) / 2
        ];
        
        const midpoint2 = [
          (otherSource[0] + otherTarget[0]) / 2,
          (otherSource[1] + otherTarget[1]) / 2
        ];
        
        const distance = Math.sqrt(
          Math.pow(midpoint1[0] - midpoint2[0], 2) + 
          Math.pow(midpoint1[1] - midpoint2[1], 2)
        );
        
        return distance < 0.5;
      });
      
      if (reversedEdgeExists || hasOverlap) {
        // Calculate perpendicular vector for control point
        const dx = targetPosition[0] - sourcePosition[0];
        const dy = targetPosition[1] - sourcePosition[1];
        const length = Math.sqrt(dx * dx + dy * dy);
        
        // Perpendicular vector
        const perpX = -dy / length;
        const perpY = dx / length;
        
        // Offset is higher for bidirectional edges
        const offset = reversedEdgeExists ? 0.7 : 0.4;
        
        // Midpoint with perpendicular offset
        const controlPoint = [
          (sourcePosition[0] + targetPosition[0]) / 2 + perpX * offset,
          (sourcePosition[1] + targetPosition[1]) / 2 + perpY * offset,
          (sourcePosition[2] + targetPosition[2]) / 2
        ];
        
        return { ...edge, controlPoint };
      }
      
      return edge;
    });
  }, [edges, nodesPositions]);
  
  // Handle node selection
  const handleNodeClick = (id) => {
    if (isDragging) return;
    setSelectedNode(selectedNode === id ? null : id);
  };
  
  return (
    <group>
      {/* Render nodes */}
      {nodes.map(node => (
        <Node
          key={node.id}
          id={node.id}
          name={node.name}
          position={node.position}
          color={node.category.color}
          onDrag={handleNodeDrag}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => {
            setTimeout(() => setIsDragging(false), 100);
          }}
          selected={selectedNode === node.id}
          onClick={handleNodeClick}
        />
      ))}
      
      {/* Render edges */}
      {edgesWithControlPoints.map((edge, index) => {
        const sourcePosition = nodesPositions[edge.source];
        const targetPosition = nodesPositions[edge.target];
        
        if (!sourcePosition || !targetPosition) return null;
        
        const isHighlighted = selectedNode === edge.source || selectedNode === edge.target;
        
        return (
          <Edge
            key={`${edge.source}-${edge.target}`}
            sourcePosition={sourcePosition}
            targetPosition={targetPosition}
            type={edge.type}
            isHighlighted={isHighlighted}
            controlPoint={edge.controlPoint}
          />
        );
      })}
      
      {/* Render loop indicators */}
      {feedbackLoops.map(loop => (
        <LoopIndicator
          key={loop.id}
          loop={loop}
          nodesPositions={nodesPositions}
        />
      ))}
      
      {/* Legend */}
      <Legend />
    </group>
  );
}

// Main exported component
function CLDInteractive3D() {
  return (
    <section className="cld-3d-section section">
      <div className="section-inner">
        <h2>Interactive Causal Loop Diagram</h2>
        <p>
          Explore the interconnected factors contributing to India's health crisis by interacting 
          with this dynamic diagram. Drag nodes to reorganize the system view, and click on elements 
          to highlight their relationships.
        </p>
        
        <div style={{ 
          height: '700px', 
          width: '100%', 
          position: 'relative', 
          marginTop: '2rem',
          backgroundColor: '#060d18',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} />
            
            <CausalLoopScene />
            
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              autoRotate={false}
              minDistance={5}
              maxDistance={20}
            />
          </Canvas>
        </div>
        
        <div style={{ 
          marginTop: '1.5rem', 
          fontSize: '0.9rem', 
          color: 'rgba(255,255,255,0.7)',
          background: 'rgba(58, 134, 255, 0.1)',
          padding: '1rem',
          borderRadius: '0.5rem',
          borderLeft: '4px solid #3A86FF'
        }}>
          <strong>Understanding Causal Loops:</strong> This diagram shows how different factors interact 
          to create systemic health issues. Reinforcing loops (R) amplify changes, creating vicious or 
          virtuous cycles. Balancing loops (B) stabilize the system by counteracting changes.
        </div>
      </div>
    </section>
  );
}

export default CLDInteractive3D;
