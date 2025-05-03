# HealthTrap: A Systemic Lens on Obesity and Lifestyle Diseases

## Project Overview

HealthTrap is an interactive web application that uses systems thinking to analyze and visualize the complex factors contributing to India's obesity and diabetes crisis. By moving beyond individual-focused approaches, we reveal how urban design, food systems, stress, and economic incentives create reinforcing feedback loops that drive health outcomes.

## 3D Interactive Visualizations

This project leverages cutting-edge 3D visualization technologies to bring systems thinking concepts to life:

### 1. 3D Causal Loop Diagram (CLD)

![CLD Visualization](./public/cld-screenshot.png)

An interactive force-directed graph where:
- Nodes represent system variables (e.g., 'Stress', 'Diet', 'Exercise')
- Links show causal relationships with + or – polarity
- Color-coding distinguishes Reinforcing (blue) from Balancing (orange) loops
- Hover on nodes to view detailed definitions
- Click nodes to highlight related feedback loops

**Implementation:** Uses Three.js with force-directed graph algorithms from D3 to position nodes in 3D space.

### 2. Health Metropolis: 3D City Metaphor

![Health Metropolis](./public/metropolis-screenshot.png)

A navigable 3D city where:
- Buildings metaphorically represent health system variables
- Hospitals symbolize medical interventions
- Parks represent exercise and physical activity
- Fast-food establishments represent diet patterns
- Residential buildings symbolize lifestyle factors
- Animated particles show effects (red for negative, green for positive)
- Camera transitions allow story-driven exploration of health systems

**Implementation:** Custom Three.js models with GSAP for smooth animations and camera transitions.

### 3. Timeline-Based Health Data Animation

![Timeline Animation](./public/timeline-screenshot.png)

An interactive visualization showing:
- 3D map of India with rising columns for health metrics by city
- Time slider control for animating changes from 2000-2023
- Toggle between obesity rates, diabetes prevalence, and physical activity
- Click on cities for detailed information cards

**Implementation:** Geographic visualization with time-series data and interactive controls.

### 4. System Flow Visualization

![System Flow](./public/flow-screenshot.png)

A mechanical system visualization showing:
- Input variables (food, stress, exercise) flowing into the health system
- Internal processing represented by gears and mechanisms
- Output variables (obesity, energy levels) emitted from the system
- Animated particles showing how factors flow through the system
- Feedback loops demonstrating how outputs can reinforce inputs

**Implementation:** Animated 3D particles following spline paths with physics simulations.

### 5. Interactive Intervention Simulator

![Intervention Simulator](./public/simulator-screenshot.png)

A drag-and-drop simulator where:
- Policy intervention "cubes" can be dragged onto system nodes
- Real-time statistics show projected health outcomes
- Visual effects demonstrate system-wide impacts
- Multiple interventions demonstrate how combined approaches affect outcomes

**Implementation:** Uses Three.js raycasting for drag-and-drop functionality with real-time health metrics updates.

## Technology Stack

- **React + Vite**: For component-based UI development
- **Three.js**: 3D rendering engine
- **React Three Fiber**: React bindings for Three.js
- **@react-three/drei**: Useful helpers for React Three Fiber
- **@react-three/postprocessing**: Advanced visual effects
- **D3-Force-3D**: For force-directed graph layouts
- **GSAP**: For smooth animations and transitions

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser to the local development URL (typically http://localhost:5173)

## Exploring the Visualizations

- Each visualization is interactive - try clicking, dragging, and hovering on different elements
- Use the timeline slider to see changes over time
- Drag policy interventions onto system nodes to see their impacts
- Use camera controls to navigate 3D spaces (orbit, pan, zoom)

## License

MIT

## Credits

Developed as part of the Full Stack Thinking & Engineering course
# FSTE
