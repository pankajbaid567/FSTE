import React, { useState, useEffect } from 'react';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);
  
  return (
    <nav style={{ 
      backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent', 
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      padding: scrolled ? '0.75rem 2rem' : '1.5rem 2rem',
      position: 'fixed',
      width: '100%',
      top: 0,
      left: 0,
      zIndex: 100,
      boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
      transition: 'all 0.3s ease-in-out',
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={scrolled ? 'var(--primary)' : 'white'} strokeWidth="2" style={{ transition: 'all 0.3s ease' }}>
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
          <h2 style={{ 
            margin: 0, 
            color: scrolled ? 'var(--primary)' : 'white',
            fontSize: '1.5rem',
            fontWeight: '800',
            letterSpacing: '-0.03em',
            transition: 'all 0.3s ease'
          }}>HealthTrap</h2>
        </div>
        
        {/* Desktop menu */}
        <div className="desktop-menu" style={{ 
          display: 'flex', 
          gap: '2rem',
          alignItems: 'center',
          '@media (max-width: 768px)': {
            display: 'none'
          }
        }}>
          <a href="#problem" style={{ color: scrolled ? 'var(--text)' : 'white', transition: 'color 0.3s ease' }}>Problem</a>
          <a href="#system" style={{ color: scrolled ? 'var(--text)' : 'white', transition: 'color 0.3s ease' }}>System</a>
          <a href="#analysis" style={{ color: scrolled ? 'var(--text)' : 'white', transition: 'color 0.3s ease' }}>Analysis</a>
          <a href="#solutions" style={{ color: scrolled ? 'var(--text)' : 'white', transition: 'color 0.3s ease' }}>Solutions</a>
          <a href="#data" style={{ color: scrolled ? 'var(--text)' : 'white', transition: 'color 0.3s ease' }}>Data</a>
          
          <button style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.5rem 1.25rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: 'var(--shadow-md)'
          }}>
            Download Report
          </button>
        </div>
        
        {/* Mobile menu toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: scrolled ? 'var(--text)' : 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            display: 'none',
            padding: '0.5rem',
            boxShadow: 'none',
            '@media (max-width: 768px)': {
              display: 'block'
            }
          }}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '70px',
          left: 0,
          right: 0,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          boxShadow: 'var(--shadow-lg)',
          animation: 'fadeInDown 0.3s ease-out'
        }}>
          <a href="#problem" onClick={() => setMobileMenuOpen(false)}>Problem</a>
          <a href="#system" onClick={() => setMobileMenuOpen(false)}>System</a>
          <a href="#analysis" onClick={() => setMobileMenuOpen(false)}>Analysis</a>
          <a href="#solutions" onClick={() => setMobileMenuOpen(false)}>Solutions</a>
          <a href="#data" onClick={() => setMobileMenuOpen(false)}>Data</a>
          
          <button style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 1.25rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
          }}>
            Download Report
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
