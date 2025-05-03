import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemStatement from './components/ProblemStatement';
import CLDSection from './components/CLDSection';
import CLDInteractive3D from './components/CLDInteractive3D';
import CLDVisualization3D from './components/CLDVisualization3D';
import EPSAnalysis from './components/EPSAnalysis';
import HealthMetropolis3D from './components/HealthMetropolis3D';
import SystemFlow3D from './components/SystemFlow3D';
import TimelineAnimation3D from './components/TimelineAnimation3D';
import InterventionSimulator3D from './components/InterventionSimulator3D';
import LeveragePoints from './components/LeveragePoints';
import Archetypes from './components/Archetypes';
import APIDashboard from './components/APIDashboard';
import HealthDataSection from './components/HealthDataSection';
import Methodology from './components/Methodology';
import Footer from './components/Footer';

function MainPage() {
  // Add scroll animation
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once the animation has played, we can stop observing
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Observe all elements with the 'animate-in' class
    document.querySelectorAll('.animate-in').forEach(el => {
      observer.observe(el);
    });
    
    // Cleanup
    return () => {
      document.querySelectorAll('.animate-in').forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);
  
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProblemStatement />
        <CLDSection />
        <CLDInteractive3D />
        <CLDVisualization3D />
        <EPSAnalysis />
        <HealthMetropolis3D />
        <SystemFlow3D />
        <TimelineAnimation3D />
        <LeveragePoints />
        <InterventionSimulator3D />
        <Archetypes />
        <HealthDataSection />
        <APIDashboard />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/methodology" element={<Methodology />} />
      </Routes>
    </Router>
  );
}

export default App;
