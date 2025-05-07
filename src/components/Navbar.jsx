import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  
  const isHomePage = location.pathname === '/';
  
  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="logo">HealthTrap</Link>
        
        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {isHomePage ? (
            <>
              <a href="#problem">Problem</a>
              <a href="#system">System Model</a>
              <a href="#analysis">Analysis</a>
              <a href="#solutions">Solutions</a>
              <a href="#daata">Data</a>
            </>
          ) : (
            <Link to="/">Home</Link>
          )}
          <Link to="/methodology" className="methodology-link">Methodology</Link>
        </div>
        
        <button className="mobile-toggle" onClick={toggleMobileMenu} aria-label="Toggle navigation menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
