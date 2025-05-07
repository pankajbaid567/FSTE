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
            <p>Created as part of the FSTE Course</p>
            <ul>
              <li><a href="https://www.linkedin.com/in/yatin-singh-b37817323/" target="_blank" rel="noreferrer">Yatin Singh</a></li>
              <li><a href="https://www.linkedin.com/in/dhanvin-vadlamudi-365614318/" target="_blank" rel="noreferrer">Dhanvin Vadlamudi</a></li>  
              <li><a href="https://www.linkedin.com/in/pankaj-baid-0109b1226/" target="_blank" rel="noreferrer">Pankaj Baid</a></li>
              <li><a href="https://www.linkedin.com/in/guru-manohar-gupta/" target="_blank" rel="noreferrer">Guru Manohar Gupta</a></li>
              <li><a href="https://www.linkedin.com/in/shreshtha-gupta-7125aa324/" target="_blank" rel="noreferrer">Shrestha Gupta</a></li>
            </ul>
            <p>© 2025 Group 20 Team</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
