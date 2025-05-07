import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
);

function GuidedTour({ activeSection, scrollToSection, closeGuidedTour }) {
  const sections = [
    {
      id: 'intro',
      title: 'Introduction',
      description: 'Learn about the obesity crisis in India and its systemic nature'
    },
    {
      id: 'process',
      title: 'Process',
      description: 'Explore our systems thinking methodology steps'
    },
    {
      id: 'variables',
      title: 'Variables',
      description: 'Understand the key factors in our Causal Loop Diagram'
    },
    {
      id: 'leverage',
      title: 'Leverage Points',
      description: 'Discover high-impact intervention opportunities'
    },
    {
      id: 'archetypes',
      title: 'System Archetypes',
      description: 'Learn about recurring patterns in the system'
    },
    {
      id: 'events',
      title: 'EPS Analysis',
      description: 'See how events, patterns, and structures relate'
    }
  ];

  return (
    <div className="guided-tour">
      <div className="guided-tour-header">
        <h3>Methodology Guide</h3>
        <button className="close-tour" onClick={closeGuidedTour}>×</button>
      </div>
      <div className="guided-tour-body">
        <p>Explore our systematic approach to understanding obesity in India:</p>
        <div className="guided-tour-sections">
          {sections.map(section => (
            <div 
              key={section.id}
              className={`guided-tour-section ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => scrollToSection(section.id)}
            >
              <div className="section-indicator"></div>
              <div className="section-content">
                <h4>{section.title}</h4>
                <p>{section.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Methodology() {
  const [activeSection, setActiveSection] = useState('intro');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [expandedPanel, setExpandedPanel] = useState(null);
  const [activeTab, setActiveTab] = useState('primary');
  const [showGuidedTour, setShowGuidedTour] = useState(false);

  // Refs for chart animations
  const chartsRefs = {
    obesity: useRef(null),
    diabetes: useRef(null),
    activity: useRef(null)
  };

  // Variables content for tabs, organized by category
  const variablesContent = {
    behavioral: [
      { variable: 'Emotional Eating', definition: 'Eating due to stress/emotions' },
      { variable: 'Fast Food Consumption', definition: 'Frequency of fast food intake' },
      { variable: 'Screen Time', definition: 'Hours spent on digital screens' }
    ],
    health: [
      { variable: 'Obesity Rate', definition: '% of population obese' },
      { variable: 'Hypertension Cases', definition: 'Incidence of high blood pressure' },
      { variable: 'Diabetes Incidence', definition: 'Cases linked to obesity' }
    ],
    socioeconomic: [
      { variable: 'Work Hours', definition: 'Long job hours, sedentary patterns' },
      { variable: 'Sedentary Jobs', definition: 'Office work, minimal physical effort' },
      { variable: 'Health Awareness', definition: 'Knowledge about lifestyle risks' },
      { variable: 'Economic Mobility', definition: 'Ability to access upward economic opportunity' }
    ],
    structural: [
      { variable: 'Traditional Diets', definition: 'Home-cooked, culturally rooted meals' },
      { variable: 'Preventive Healthcare', definition: 'Early screening and intervention' },
      { variable: 'Stress Levels', definition: 'Emotional/mental stress influencing behavior' },
      { variable: 'Emotional Triggers', definition: 'Situations that provoke emotional eating' }
    ]
  };

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress for progress bar
      const scrollTop = window.scrollY;
      const docHeight = document.body.offsetHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      setScrollProgress(scrollPercent);

      // Update active section based on scroll position
      const sections = document.querySelectorAll('.methodology-section');
      let currentSection = 'intro';

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollTop >= sectionTop - 200 && scrollTop < sectionTop + sectionHeight - 200) {
          currentSection = section.id;
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  // Toggle expanded panel
  const togglePanel = (panelId) => {
    if (expandedPanel === panelId) {
      setExpandedPanel(null);
    } else {
      setExpandedPanel(panelId);
    }
  };

  // Function to toggle guided tour
  const toggleGuidedTour = () => {
    setShowGuidedTour(prev => !prev);
  };

  // Data for interactive charts
  const obesityTrendsData = {
    labels: ['2000', '2005', '2010', '2015', '2020', '2023'],
    datasets: [
      {
        label: 'Urban India',
        data: [12, 16, 20, 25, 31, 35],
        borderColor: 'rgba(255, 107, 107, 1)',
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Rural India',
        data: [9, 12, 15, 19, 25, 29],
        borderColor: 'rgba(76, 201, 240, 1)',
        backgroundColor: 'rgba(76, 201, 240, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const factorImpactData = {
    labels: [
      'Work Hours', 
      'Screen Time', 
      'Fast Food', 
      'Physical Activity',
      'Stress Levels',
      'Economic Factors'
    ],
    datasets: [
      {
        label: 'Impact on Obesity',
        data: [70, 65, 85, 90, 75, 60],
        backgroundColor: 'rgba(255, 107, 107, 0.7)',
      }
    ]
  };

  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      }
    }
  };

  // Animation for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  // Parallax background effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <Navbar />
      
      {/* Progress bar */}
      <div className="scroll-progress-bar" style={{ width: `${scrollProgress * 100}%` }}></div>
      
      {/* Floating quick nav */}
      <div className="quick-nav">
        <button 
          className={activeSection === 'team' ? 'active' : ''} 
          onClick={() => scrollToSection('team')}
          aria-label="Navigate to Team Details section"
        >
          <span className="quick-nav-dot"></span>
          <span className="quick-nav-label">Team</span>
        </button>
        <button 
          className={activeSection === 'intro' ? 'active' : ''} 
          onClick={() => scrollToSection('intro')}
          aria-label="Navigate to Introduction section"
        >
          <span className="quick-nav-dot"></span>
          <span className="quick-nav-label">Intro</span>
        </button>
        <button 
          className={activeSection === 'process' ? 'active' : ''} 
          onClick={() => scrollToSection('process')}
          aria-label="Navigate to Process section"
        >
          <span className="quick-nav-dot"></span>
          <span className="quick-nav-label">Process</span>
        </button>
        <button 
          className={activeSection === 'variables' ? 'active' : ''} 
          onClick={() => scrollToSection('variables')}
          aria-label="Navigate to Variables section"
        >
          <span className="quick-nav-dot"></span>
          <span className="quick-nav-label">Variables</span>
        </button>
        <button 
          className={activeSection === 'leverage' ? 'active' : ''} 
          onClick={() => scrollToSection('leverage')}
          aria-label="Navigate to Leverage Points section"
        >
          <span className="quick-nav-dot"></span>
          <span className="quick-nav-label">Leverage</span>
        </button>
        <button 
          className={activeSection === 'archetypes' ? 'active' : ''} 
          onClick={() => scrollToSection('archetypes')}
          aria-label="Navigate to Archetypes section"
        >
          <span className="quick-nav-dot"></span>
          <span className="quick-nav-label">Archetypes</span>
        </button>
        <button 
          className={activeSection === 'events' ? 'active' : ''} 
          onClick={() => scrollToSection('events')}
          aria-label="Navigate to EPS Analysis section"
        >
          <span className="quick-nav-dot"></span>
          <span className="quick-nav-label">EPS</span>
        </button>
      </div>
      
      {/* Hero section with animated particles */}
      <div className="methodology-hero">
        <div className="particles-container">
          {Array.from({ length: 50 }).map((_, i) => (
            <div 
              key={i} 
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 7}s`
              }}
            ></div>
          ))}
        </div>
        <motion.div 
          className="section-inner" 
          style={{
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Systems Thinking Methodology</h1>
          <p className="methodology-subtitle">
            A comprehensive approach to understanding the complex factors contributing to obesity and lifestyle diseases in India
          </p>
          <div className="methodology-decorative-element"></div>
          
          <motion.div 
            className="methodology-cta"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <button onClick={() => scrollToSection('intro')} className="scroll-indicator">
              <span>Explore</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </motion.div>
          
          <motion.div
            className="tour-button"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <button onClick={toggleGuidedTour} className="guided-tour-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{showGuidedTour ? 'Close Guide' : 'Guided Tour'}</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
      
      {showGuidedTour && (
        <GuidedTour 
          activeSection={activeSection}
          scrollToSection={scrollToSection}
          closeGuidedTour={() => setShowGuidedTour(false)}
        />
      )}
      
      <div className="methodology-page">
        {/* Side navigation */}
        <div className="methodology-nav">
          <div className="methodology-nav-inner">
            <h3>Contents</h3>
            <ul>
              <li className={activeSection === 'team' ? 'active' : ''}>
                <button onClick={() => scrollToSection('team')}>
                  <span className="section-number">00</span>
                  <span>Team Details</span>
                </button>
              </li>
              <li className={activeSection === 'intro' ? 'active' : ''}>
                <button onClick={() => scrollToSection('intro')}>
                  <span className="section-number">01</span>
                  <span>Introduction</span>
                </button>
              </li>
              <li className={activeSection === 'process' ? 'active' : ''}>
                <button onClick={() => scrollToSection('process')}>
                  <span className="section-number">02</span>
                  <span>Process</span>
                </button>
              </li>
              <li className={activeSection === 'variables' ? 'active' : ''}>
                <button onClick={() => scrollToSection('variables')}>
                  <span className="section-number">03</span>
                  <span>CLD Variables</span>
                </button>
              </li>
              <li className={activeSection === 'leverage' ? 'active' : ''}>
                <button onClick={() => scrollToSection('leverage')}>
                  <span className="section-number">04</span>
                  <span>Leverage Points</span>
                </button>
              </li>
              <li className={activeSection === 'archetypes' ? 'active' : ''}>
                <button onClick={() => scrollToSection('archetypes')}>
                  <span className="section-number">05</span>
                  <span>System Archetypes</span>
                </button>
              </li>
              <li className={activeSection === 'events' ? 'active' : ''}>
                <button onClick={() => scrollToSection('events')}>
                  <span className="section-number">06</span>
                  <span>EPS Analysis</span>
                </button>
              </li>
              <li className={activeSection === 'insights' ? 'active' : ''}>
                <button onClick={() => scrollToSection('insights')}>
                  <span className="section-number">07</span>
                  <span>Additional Insights</span>
                </button>
              </li>
              <li className={activeSection === 'references' ? 'active' : ''}>
                <button onClick={() => scrollToSection('references')}>
                  <span className="section-number">08</span>
                  <span>References</span>
                </button>
              </li>
            </ul>
            
            <div className="methodology-download-section">
              <h4>Download Resources</h4>
              <div className="download-buttons">
                <a href="https://docs.google.com/document/d/1-1wIfydG9nHekFwgEH90k6nMp1nTg5elPmDZiN0PXU4/edit?usp=sharing" target="_blank" rel="noopener noreferrer" className="download-btn pdf">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16V4M12 16L6 10M12 16L18 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 20H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>PDF Report</span>
                </a>
                <button className="download-btn data">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6V4C4 3.44772 4.44772 3 5 3H19C19.5523 3 20 3.44772 20 4V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M15 12H3M3 12L7 8M3 12L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Data Set</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="methodology-content">
          {/* Team members section */}
          <motion.section 
            id="team" 
            className="methodology-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
            <div className="section-header">
              <div className="section-number-badge">00</div>
              <h2>Team Details</h2>
            </div>
            
            <div className="methodology-card">
              <div className="team-info">
                <h3>Systems Thinking Hackathon 2025 – Group-20 Report</h3>
                <div className="team-name">
                  <strong>Team Name:</strong> Group20
                </div>
              </div>
              
              <h3 className="team-members-heading">Team Members</h3>
              
              <div className="team-members-list">
                <div className="team-member">
                  <div className="member-photo">
                    <img src="/images/team/dhanvin.jpeg" />
                  </div>
                  <div className="member-details">
                    <h4>Dhanvin Vadlamudi</h4>
                    <div className="enrollment-number">2401010150</div>
                  </div>
                </div>
                
                <div className="team-member">
                  <div className="member-photo">
                  <img src="/images/team/guru.jpeg" />
                  </div>
                  <div className="member-details">
                    <h4>Guru Manohar Gupta</h4>
                    <div className="enrollment-number">2401010125</div>
                  </div>
                </div>
                
                <div className="team-member">
                  <div className="member-photo">
                  <img src="/images/team/pankaj.jpeg" />
                  </div>
                  <div className="member-details">
                    <h4>Pankaj Baid</h4>
                    <div className="enrollment-number">2401010316</div>
                  </div>
                </div>
                
                <div className="team-member">
                  <div className="member-photo">
                  <img src="/images/team/shrestha.jpeg" />
                  </div>
                  <div className="member-details">
                    <h4>Shrestha Gupta</h4>
                    <div className="enrollment-number">2401010446</div>
                  </div>
                </div>
                
                <div className="team-member">
                  <div className="member-photo">
                  <img src="/images/team/yatin.jpeg" />
                  </div>
                  <div className="member-details">
                    <h4>Yatin Singh</h4>
                    <div className="enrollment-number">2401010243</div>
                  </div>
                </div>
              </div>
              
              <div className="team-summary">
                <h3>Project Overview</h3>
                <p>
                  Our team has applied systems thinking methodology to analyze the complex problem of obesity and 
                  lifestyle diseases in middle-class India. We've identified key variables, feedback loops, and 
                  leverage points for intervention through rigorous analysis and visualization techniques.
                </p>
              </div>
            </div>
          </motion.section>
          
          {/* Introduction section with interactive chart */}
          <motion.section 
            id="intro" 
            className="methodology-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
            <div className="section-header">
              <div className="section-number-badge">01</div>
              <h2>Introduction to the Problem</h2>
            </div>
            
            <div className="methodology-card">
              <div className="team-info">
                <h3>Systems Thinking Hackathon 2025 – Team Report</h3>
                <div className="team-details">
                  <div className="detail-row">
                    <span className="detail-label">Problem Domain:</span>
                    <span className="detail-value">Health & Wellness</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Specific Problem Statement:</span>
                    <span className="detail-value">High Obesity and Lifestyle Diseases in Middle-Class India</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Key Question:</span>
                    <span className="detail-value">Despite fitness trends, why are rates of obesity, hypertension, and diabetes rising among India's middle-income population?</span>
                  </div>
                </div>
              </div>
              
              <div className="two-column-layout">
                <div className="column text-column">
                  <p>
                    Obesity is increasingly becoming a major public health challenge in India, affecting people across age 
                    groups and socioeconomic strata. Contributing factors include changing dietary patterns, sedentary 
                    lifestyles, and emotional stress—all deeply interconnected in complex feedback loops.
                  </p>
                  <p>
                    This issue is systematic because it impacts not only individual health but also the healthcare system, 
                    workforce productivity, and national well-being. In the Indian context, cultural dietary shifts, 
                    work-related stress, limited awareness, and economic disparities amplify the crisis.
                  </p>
                  
                  <div className="key-insight-box">
                    <div className="insight-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <h4>Key Insight</h4>
                      <p>Obesity in India is not merely an individual health issue but a complex systemic problem requiring a multifaceted approach addressing cultural, economic, and environmental factors.</p>
                    </div>
                  </div>
                </div>
                
                <div className="column chart-column">
                  <div className="chart-wrapper">
                    <h3>Obesity Trends in Urban vs Rural India</h3>
                    <div className="chart-container" style={{ height: '250px' }}>
                      <Line 
                        data={obesityTrendsData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom',
                            },
                            tooltip: {
                              mode: 'index',
                              intersect: false,
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: {
                                display: true,
                                text: 'Obesity Rate (%)'
                              }
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="chart-source">Source: National Family Health Survey (NFHS-5)</div>
                  </div>
                </div>
              </div>
              
              <div className="stat-highlights">
                <motion.div 
                  className="stat-card"
                  variants={cardVariants}
                  custom={0}
                >
                  <div className="stat-number">3x</div>
                  <div className="stat-description">Increase in obesity rates since 2000</div>
                </motion.div>
                <motion.div 
                  className="stat-card"
                  variants={cardVariants}
                  custom={1}
                >
                  <div className="stat-number">25%</div>
                  <div className="stat-description">Of urban adults have diabetes or pre-diabetes</div>
                </motion.div>
                <motion.div 
                  className="stat-card"
                  variants={cardVariants}
                  custom={2}
                >
                  <div className="stat-number">50%</div>
                  <div className="stat-description">Reduction in physical activity over two decades</div>
                </motion.div>
              </div>
            </div>
          </motion.section>
          
          {/* Process section with interactive timeline */}
          <motion.section 
            id="process" 
            className="methodology-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
            <div className="section-header">
              <div className="section-number-badge">02</div>
              <h2>Process Followed</h2>
            </div>
            
            <div className="methodology-card">
              <div className="methodology-intro-text">
                <p>We employed a rigorous systems thinking approach to understand the complex dynamics of the obesity crisis in India, following these steps:</p>
              </div>
              
              <div className="timeline-process">
                <div className="timeline-item">
                  <div className="timeline-indicator">
                    <div className="timeline-icon">🔍</div>
                  </div>
                  <div className="timeline-content">
                    <h3>Problem Identification</h3>
                    <p>Identified obesity as a critical issue impacting Indian public health.</p>
                    <button className="timeline-expand-btn" onClick={() => togglePanel('problem')}>
                      {expandedPanel === 'problem' ? 'Show Less' : 'Learn More'}
                    </button>
                    <AnimatePresence>
                      {expandedPanel === 'problem' && (
                        <motion.div 
                          className="timeline-expanded-content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p>Our problem identification phase involved analyzing national health surveys, medical literature reviews, and expert consultations to understand the scope and scale of obesity in India.</p>
                          <p>Key findings from this phase showed that obesity rates have tripled in the past two decades, with urban areas experiencing more accelerated growth compared to rural regions.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-indicator">
                    <div className="timeline-icon">📊</div>
                  </div>
                  <div className="timeline-content">
                    <h3>Background Research</h3>
                    <p>Conducted background research on factors contributing to obesity.</p>
                    <button className="timeline-expand-btn" onClick={() => togglePanel('research')}>
                      {expandedPanel === 'research' ? 'Show Less' : 'Learn More'}
                    </button>
                    <AnimatePresence>
                      {expandedPanel === 'research' && (
                        <motion.div 
                          className="timeline-expanded-content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p>We reviewed peer-reviewed literature, government health surveys, and international obesity research to identify key contributing factors in the Indian context.</p>
                          <p>Our research revealed strong correlations between industrialization, urbanization, changing food environments, and the rising obesity epidemic in middle-class India.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-indicator">
                    <div className="timeline-icon">🧠</div>
                  </div>
                  <div className="timeline-content">
                    <h3>Variable Identification</h3>
                    <p>Brainstormed systemic variables (e.g., emotional eating, physical activity, economic mobility).</p>
                    <button className="timeline-expand-btn" onClick={() => togglePanel('variables')}>
                      {expandedPanel === 'variables' ? 'Show Less' : 'Learn More'}
                    </button>
                    <AnimatePresence>
                      {expandedPanel === 'variables' && (
                        <motion.div 
                          className="timeline-expanded-content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p>Our team identified 16 critical variables spanning psychological, environmental, economic, and cultural dimensions that interact in the obesity system.</p>
                          <p>We categorized these variables into input variables (like work hours), process variables (like fast food consumption), and output variables (like diabetes incidence) to understand system flow.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-indicator">
                    <div className="timeline-icon">🔄</div>
                  </div>
                  <div className="timeline-content">
                    <h3>System Mapping</h3>
                    <p>Mapped relationships and feedback loops in a Causal Loop Diagram (CLD).</p>
                    <button className="timeline-expand-btn" onClick={() => togglePanel('mapping')}>
                      {expandedPanel === 'mapping' ? 'Show Less' : 'Learn More'}
                    </button>
                    <AnimatePresence>
                      {expandedPanel === 'mapping' && (
                        <motion.div 
                          className="timeline-expanded-content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p>Using systems modeling software, we created a comprehensive causal loop diagram mapping the complex relationships between all identified variables.</p>
                          <p>This visual modeling allowed us to identify previously hidden connections and understand how variables interact across different domains of health, behavior, and environment.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-indicator">
                    <div className="timeline-icon">⚖️</div>
                  </div>
                  <div className="timeline-content">
                    <h3>Loop Analysis</h3>
                    <p>Identified reinforcing and balancing loops.</p>
                    <button className="timeline-expand-btn" onClick={() => togglePanel('loops')}>
                      {expandedPanel === 'loops' ? 'Show Less' : 'Learn More'}
                    </button>
                    <AnimatePresence>
                      {expandedPanel === 'loops' && (
                        <motion.div 
                          className="timeline-expanded-content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p>We analyzed the CLD to identify key reinforcing loops (that accelerate change) and balancing loops (that stabilize the system).</p>
                          <p>This analysis revealed major reinforcing loops around emotional eating and socioeconomic factors, and important balancing loops related to physical activity and health awareness.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-indicator">
                    <div className="timeline-icon">🎯</div>
                  </div>
                  <div className="timeline-content">
                    <h3>Leverage Point Analysis</h3>
                    <p>Analyzed leverage points using Meadows' framework.</p>
                    <button className="timeline-expand-btn" onClick={() => togglePanel('leverage')}>
                      {expandedPanel === 'leverage' ? 'Show Less' : 'Learn More'}
                    </button>
                    <AnimatePresence>
                      {expandedPanel === 'leverage' && (
                        <motion.div 
                          className="timeline-expanded-content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p>Using Donella Meadows' framework of 12 leverage points, we identified areas where small changes could produce large shifts in the system.</p>
                          <p>We prioritized five key leverage points, assessing each for feasibility, impact potential, and integration with existing health systems.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-indicator">
                    <div className="timeline-icon">🧩</div>
                  </div>
                  <div className="timeline-content">
                    <h3>Archetype Identification</h3>
                    <p>Interpreted system archetypes and structural root causes.</p>
                    <button className="timeline-expand-btn" onClick={() => togglePanel('archetypes')}>
                      {expandedPanel === 'archetypes' ? 'Show Less' : 'Learn More'}
                    </button>
                    <AnimatePresence>
                      {expandedPanel === 'archetypes' && (
                        <motion.div 
                          className="timeline-expanded-content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p>We identified classic system archetypes present in the obesity problem, including "Fixes That Fail" and "Shifting the Burden" patterns.</p>
                          <p>These archetypal patterns helped us understand why some current interventions fail to produce lasting results and pointed to more effective approaches.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-indicator">
                    <div className="timeline-icon">💡</div>
                  </div>
                  <div className="timeline-content">
                    <h3>Intervention Design</h3>
                    <p>Proposed intervention strategies.</p>
                    <button className="timeline-expand-btn" onClick={() => togglePanel('intervention')}>
                      {expandedPanel === 'intervention' ? 'Show Less' : 'Learn More'}
                    </button>
                    <AnimatePresence>
                      {expandedPanel === 'intervention' && (
                        <motion.div 
                          className="timeline-expanded-content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p>Based on our analysis of leverage points and system archetypes, we developed multiple intervention strategies addressing structural factors in the obesity system.</p>
                          <p>Our proposals focus on transforming work environments, urban infrastructure, food systems, healthcare integration, and educational approaches to create sustainable change.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              
              <div className="process-overview">
                <h3>Process Impact</h3>
                <div className="process-impact-grid">
                  <div className="impact-card">
                    <div className="impact-icon">📊</div>
                    <h4>Data-Driven</h4>
                    <p>Our approach leveraged extensive health data from multiple sources to identify patterns and correlations.</p>
                  </div>
                  <div className="impact-card">
                    <div className="impact-icon">🔄</div>
                    <h4>Iterative</h4>
                    <p>We refined our models through multiple iterations based on stakeholder feedback and new data.</p>
                  </div>
                  <div className="impact-card">
                    <div className="impact-icon">🧩</div>
                    <h4>Holistic</h4>
                    <p>Our methodology considers cultural, economic, environmental, and psychological factors.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
          
          {/* Variables section with interactive tabbed interface */}
          <motion.section 
            id="variables" 
            className="methodology-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
            <div className="section-header">
              <div className="section-number-badge">03</div>
              <h2>Causal Loop Diagram (CLD) Variables</h2>
            </div>
            
            <div className="methodology-card">
              {/* Add a comprehensive table displaying all variables by category */}
              <div className="variables-comprehensive-view">
                <h3>Complete Variable List by Category</h3>
                <table className="variables-table comprehensive">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Variable</th>
                      <th>Definition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Behavioral Variables */}
                    {variablesContent.behavioral.map((item, index) => (
                      <tr key={`behavioral-${index}`}>
                        {index === 0 && (
                          <td rowSpan={variablesContent.behavioral.length} className="category-cell">
                            Behavioral
                          </td>
                        )}
                        <td>{item.variable}</td>
                        <td>{item.definition}</td>
                      </tr>
                    ))}
                    
                    {/* Health Outcomes Variables */}
                    {variablesContent.health.map((item, index) => (
                      <tr key={`health-${index}`}>
                        {index === 0 && (
                          <td rowSpan={variablesContent.health.length} className="category-cell">
                            Health Outcomes
                          </td>
                        )}
                        <td>{item.variable}</td>
                        <td>{item.definition}</td>
                      </tr>
                    ))}
                    
                    {/* Socioeconomic Variables */}
                    {variablesContent.socioeconomic.map((item, index) => (
                      <tr key={`socioeconomic-${index}`}>
                        {index === 0 && (
                          <td rowSpan={variablesContent.socioeconomic.length} className="category-cell">
                            Socioeconomic
                          </td>
                        )}
                        <td>{item.variable}</td>
                        <td>{item.definition}</td>
                      </tr>
                    ))}
                    
                    {/* Structural Variables */}
                    {variablesContent.structural.map((item, index) => (
                      <tr key={`structural-${index}`}>
                        {index === 0 && (
                          <td rowSpan={variablesContent.structural.length} className="category-cell">
                            Structural
                          </td>
                        )}
                        <td>{item.variable}</td>
                        <td>{item.definition}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="variables-tabs">
                <div className="tabs-header">
                  <button className={`tab-btn ${activeTab === 'behavioral' ? 'active' : ''}`} onClick={() => setActiveTab('behavioral')}>Behavioral Factors</button>
                  <button className={`tab-btn ${activeTab === 'health' ? 'active' : ''}`} onClick={() => setActiveTab('health')}>Health Outcomes</button>
                  <button className={`tab-btn ${activeTab === 'socioeconomic' ? 'active' : ''}`} onClick={() => setActiveTab('socioeconomic')}>Socioeconomic Factors</button>
                  <button className={`tab-btn ${activeTab === 'structural' ? 'active' : ''}`} onClick={() => setActiveTab('structural')}>Structural Factors</button>
                </div>
                
                <div className="tab-content">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {activeTab === 'behavioral' && (
                        <div className="variables-table">
                          <table>
                            <thead>
                              <tr>
                                <th>Variable</th>
                                <th>Definition</th>
                              </tr>
                            </thead>
                            <tbody>
                              {variablesContent.behavioral.map((item, index) => (
                                <tr key={index}>
                                  <td>{item.variable}</td>
                                  <td>{item.definition}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      
                      {activeTab === 'health' && (
                        <div className="variables-table">
                          <table>
                            <thead>
                              <tr>
                                <th>Variable</th>
                                <th>Definition</th>
                              </tr>
                            </thead>
                            <tbody>
                              {variablesContent.health.map((item, index) => (
                                <tr key={index}>
                                  <td>{item.variable}</td>
                                  <td>{item.definition}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      
                      {activeTab === 'socioeconomic' && (
                        <div className="variables-table">
                          <table>
                            <thead>
                              <tr>
                                <th>Variable</th>
                                <th>Definition</th>
                              </tr>
                            </thead>
                            <tbody>
                              {variablesContent.socioeconomic.map((item, index) => (
                                <tr key={index}>
                                  <td>{item.variable}</td>
                                  <td>{item.definition}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      
                      {activeTab === 'structural' && (
                        <div className="variables-table">
                          <table>
                            <thead>
                              <tr>
                                <th>Variable</th>
                                <th>Definition</th>
                              </tr>
                            </thead>
                            <tbody>
                              {variablesContent.structural.map((item, index) => (
                                <tr key={index}>
                                  <td>{item.variable}</td>
                                  <td>{item.definition}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              
              <h3 className="section-subheading">Key Variable Relationships</h3>
              <div className="factor-impact-chart">
                <div style={{ height: '300px' }}>
                  <Bar
                    data={factorImpactData}
                    options={{
                      indexAxis: 'y',
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `Impact Strength: ${context.raw}%`;
                            }
                          }
                        }
                      },
                      scales: {
                        x: {
                          max: 100,
                          title: {
                            display: true,
                            text: 'Impact Strength (%)'
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
              
              <div className="variable-clusters">
                <div className="cluster">
                  <h4>Input Variables</h4>
                  <div className="chip">Work Hours</div>
                  <div className="chip">Screen Time</div>
                  <div className="chip">Emotional Triggers</div>
                  <div className="chip">Stress Levels</div>
                </div>
                
                <div className="cluster">
                  <h4>Process Variables</h4>
                  <div className="chip">Fast Food Consumption</div>
                  <div className="chip">Physical Activity</div>
                  <div className="chip">Traditional Diets</div>
                  <div className="chip">Emotional Eating</div>
                </div>
                
                <div className="cluster">
                  <h4>Output Variables</h4>
                  <div className="chip">Obesity Rate</div>
                  <div className="chip">Diabetes Incidence</div>
                  <div className="chip">Hypertension Cases</div>
                  <div className="chip">HealthCare Cost</div>
                </div>
              </div>
            </div>
          </motion.section>
          
          {/* Leverage Points section */}
          <motion.section 
            id="leverage" 
            className="methodology-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
            <div className="section-header">
              <div className="section-number-badge">04</div>
              <h2>Leverage Points Analysis</h2>
            </div>
            
            <div className="methodology-card">
              <div className="card-intro">
                <p>Leverage points are places in a system where small changes can lead to large shifts in behavior. We identified five key leverage points in the obesity system using Meadows' framework:</p>
              </div>
              
              <div className="leverage-grid">
                <div className="leverage-item">
                  <div className="leverage-header">
                    <div className="leverage-icon">📣</div>
                    <h3>Health Awareness Campaign</h3>
                  </div>
                  <div className="leverage-details">
                    <div className="leverage-category">Information Flows (#6)</div>
                    <div className="leverage-importance">Changes perception and behavior</div>
                    <div className="leverage-impact">Reduces fast food consumption, boosts exercise</div>
                  </div>
                </div>
                
                <div className="leverage-item">
                  <div className="leverage-header">
                    <div className="leverage-icon">🍽️</div>
                    <h3>Promotion of Traditional Diets</h3>
                  </div>
                  <div className="leverage-details">
                    <div className="leverage-category">Rules of the System (#5)</div>
                    <div className="leverage-importance">Encourages healthier food culture</div>
                    <div className="leverage-impact">Lowers obesity rate over time</div>
                  </div>
                </div>
                
                <div className="leverage-item">
                  <div className="leverage-header">
                    <div className="leverage-icon">⏰</div>
                    <h3>Reduced Work Hours/Breaks</h3>
                  </div>
                  <div className="leverage-details">
                    <div className="leverage-category">System Structure (#4)</div>
                    <div className="leverage-importance">Allows time for physical activity</div>
                    <div className="leverage-impact">Reduces sedentary behavior</div>
                  </div>
                </div>
                
                <div className="leverage-item">
                  <div className="leverage-header">
                    <div className="leverage-icon">🧘</div>
                    <h3>Stress Management Programs</h3>
                  </div>
                  <div className="leverage-details">
                    <div className="leverage-category">Feedback Loop Gain (#8)</div>
                    <div className="leverage-importance">Breaks emotional eating loops</div>
                    <div className="leverage-impact">Lowers emotional triggers</div>
                  </div>
                </div>
                
                <div className="leverage-item">
                  <div className="leverage-header">
                    <div className="leverage-icon">🩺</div>
                    <h3>Preventive Health Checkups</h3>
                  </div>
                  <div className="leverage-details">
                    <div className="leverage-category">Changing Delays (#9)</div>
                    <div className="leverage-importance">Encourages early detection</div>
                    <div className="leverage-impact">Reduces long-term complications and costs</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
          
          {/* System Archetypes section */}
          <motion.section 
            id="archetypes" 
            className="methodology-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
            <div className="section-header">
              <div className="section-number-badge">05</div>
              <h2>System Archetypes Identified</h2>
            </div>
            
            <div className="methodology-card">
              <div className="archetypes-wrapper">
                <div className="archetype-panel">
                  <div className="archetype-icon">
                    <div className="icon-circle r-loop">R1</div>
                  </div>
                  <div className="archetype-content">
                    <h3>Reinforcing Loop (R1)</h3>
                    <div className="archetype-diagram">
                      <div className="node">Obesity</div>
                      <div className="arrow">→</div>
                      <div className="node">Emotional Eating</div>
                      <div className="arrow">→</div>
                      <div className="node">Obesity Rate</div>
                      <div className="arrow">→</div>
                      <div className="node">Obesity</div>
                    </div>
                    <p className="archetype-description">Positive feedback loop that accelerates obesity trends</p>
                  </div>
                </div>
                
                <div className="archetype-panel">
                  <div className="archetype-icon">
                    <div className="icon-circle r-loop">R2</div>
                  </div>
                  <div className="archetype-content">
                    <h3>Reinforcing Loop (R2)</h3>
                    <div className="archetype-diagram">
                      <div className="node">Obesity</div>
                      <div className="arrow">→</div>
                      <div className="node">HealthCare Cost</div>
                      <div className="arrow">→</div>
                      <div className="node">Less Economic Mobility</div>
                      <div className="arrow">→</div>
                      <div className="node">Less Health Awareness</div>
                      <div className="arrow">→</div>
                      <div className="node">Higher Obesity</div>
                    </div>
                    <p className="archetype-description">Socioeconomic reinforcing loop that creates persistent inequalities</p>
                  </div>
                </div>
                
                <div className="archetype-panel">
                  <div className="archetype-icon">
                    <div className="icon-circle b-loop">B1</div>
                  </div>
                  <div className="archetype-content">
                    <h3>Balancing Loop (B1)</h3>
                    <div className="archetype-diagram">
                      <div className="node">Physical Activity</div>
                      <div className="arrow down">↘</div>
                      <div className="node">Obesity</div>
                      <div className="arrow down">↘</div>
                    </div>
                    <p className="archetype-description">Stabilizing force when physical activity is increased</p>
                  </div>
                </div>
                
                <div className="archetype-panel">
                  <div className="archetype-icon">
                    <div className="icon-circle archetype">FTF</div>
                  </div>
                  <div className="archetype-content">
                    <h3>Archetype: "Fixes that Fail"</h3>
                    <p className="archetype-description">Relying on treatment (healthcare costs) without addressing root causes increases obesity.</p>
                  </div>
                </div>
                
                <div className="archetype-panel">
                  <div className="archetype-icon">
                    <div className="icon-circle archetype">STB</div>
                  </div>
                  <div className="archetype-content">
                    <h3>Archetype: "Shifting the Burden"</h3>
                    <p className="archetype-description">Emotional eating as a coping mechanism replaces healthier emotional regulation strategies.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
          
          {/* EPS Analysis section */}
          <motion.section 
            id="events" 
            className="methodology-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
            <div className="section-header">
              <div className="section-number-badge">06</div>
              <h2>Event → Pattern → Structure Analysis</h2>
            </div>
            
            <div className="methodology-card">
              <div className="eps-table">
                <table>
                  <thead>
                    <tr>
                      <th>Layer</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Event</td>
                      <td>Rising obesity rates, increase in diabetes, hypertension, and stress</td>
                    </tr>
                    <tr>
                      <td>Pattern</td>
                      <td>Increased screen time, reduced physical activity, high fast food consumption</td>
                    </tr>
                    <tr>
                      <td>Structure</td>
                      <td>Long work hours, low awareness, sedentary jobs, weak traditional dietary habits</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h3>Existing Interventions:</h3>
              <p>
                Primarily address events (e.g., medical treatment), occasionally patterns 
                (e.g., fitness ads), but rarely structure (e.g., work culture, urban design, food policies).
              </p>
              
              <h3>Proposed Structural Redesigns:</h3>
              <ul>
                <li>Mandate physical activity breaks in workplaces.</li>
                <li>Urban infrastructure for walkability.</li>
                <li>Subsidize traditional/healthy foods.</li>
                <li>Mental health integration in primary care.</li>
                <li>Education reforms to include health habits.</li>
              </ul>
            </div>
          </motion.section>
          
          {/* Additional Insights section */}
          <motion.section 
            id="insights" 
            className="methodology-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
            <div className="section-header">
              <div className="section-number-badge">07</div>
              <h2>Additional Insights</h2>
            </div>
            
            <div className="methodology-card">
              <ul>
                <li>
                  Emotional triggers and work hours form a subtle but powerful feedback loop 
                  feeding stress, emotional eating, and obesity.
                </li>
                <li>
                  Traditional diets can act as a powerful balancing force but require cultural revalorization.
                </li>
                <li>
                  Economic mobility impacts health awareness, indicating the need for targeted 
                  outreach to underprivileged populations.
                </li>
              </ul>
            </div>
          </motion.section>
          
          {/* References section */}
          <motion.section 
            id="references" 
            className="methodology-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
            <div className="section-header">
              <div className="section-number-badge">08</div>
              <h2>References</h2>
            </div>
            
            <div className="methodology-card">
              <ul className="references-list">
                <li>WHO India Obesity Statistics (2023)</li>
                <li>Indian Council of Medical Research (ICMR) Reports</li>
                <li>Donella Meadows – Thinking in Systems</li>
                <li>Peer-reviewed journals on public health and lifestyle diseases</li>
                <li>National Family Health Survey (NFHS-5)</li>
                <li>Government of India – Eat Right India Initiative</li>
              </ul>
            </div>
          </motion.section>
        </div>
      </div>
      
      <Footer />
    </>
  );
}

export default Methodology;
