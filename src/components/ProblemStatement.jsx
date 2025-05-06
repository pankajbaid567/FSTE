import React from 'react';

function ProblemStatement() {
  return (
    <section id="problem" className="problem-statement section">
      <div className="section-inner">
        <h2>The Problem</h2>
        <p className="section-intro">
          Despite an explosion of health information, fitness trends, and nutritional awareness,
          India's middle class is experiencing alarming rates of obesity, diabetes, and heart disease.
          The paradox demands a deeper understanding beyond individual choices.
        </p>
        
        <div className="cards-container">
          <div className="card event">
            <h3>The Events (Visible Symptoms)</h3>
            <ul>
              <li>Rising obesity rates in urban India</li>
              <li>Increasing cases of early-onset diabetes</li>
              <li>Hypertension affecting younger demographics</li>
              <li>Mental health issues correlated with lifestyle diseases</li>
            </ul>
          </div>
          
          <div className="card pattern">
            <h3>The Patterns</h3>
            <ul>
              <li>Sedentary work culture and long commutes</li>
              <li>Stress-induced comfort eating</li>
              <li>Declining physical activity despite fitness awareness</li>
              <li>Reliance on processed foods and food delivery services</li>
            </ul>
          </div>
          
          <div className="card structure">
            <h3>The Structures</h3>
            <ul>
              <li>Urban design lacking pedestrian infrastructure</li>
              <li>Corporate incentives prioritizing work hours over wellbeing</li>
              <li>Food economics making processed foods more accessible</li>
              <li>Social status linked to certain consumption patterns</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProblemStatement;
