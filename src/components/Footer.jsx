import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="section-inner">
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h3>HealthTrap</h3>
            <p>A systemic analysis of obesity and lifestyle diseases in India's middle class.</p>
          </div>
          
          <div>
            <h4>Resources</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><a href="#system">System Dynamics Model</a></li>
              <li><a href="#analysis">EPS Analysis</a></li>
              <li><a href="#solutions">Intervention Strategies</a></li>
              <li><a href="https://github.com/your-username/healthtrap-project" target="_blank" rel="noreferrer">GitHub Repository</a></li>
            </ul>
          </div>
          
          <div>
            <h4>Team</h4>
            <p>Created as part of the Full Stack Thinking & Engineering Course</p>
            <p>© 2023 HealthTrap Team</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
