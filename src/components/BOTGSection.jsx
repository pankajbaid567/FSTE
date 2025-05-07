import React from 'react';
import './BOTGSection.css';

function BOTGSection() {
  return (
    <section id="botg-section" className="section animate-in">
      <div className="container">
        <h2 className="section-title">Behavior Over Time Graphs</h2>
        <p className="section-description">
          Behavior Over Time Graphs (BOTGs) help visualize how key variables in the obesity system 
          change over time, revealing patterns, trends, and potential intervention points.
        </p>
        
        <div className="botg-container">
          <div className="botg-card">
            <div className="botg-image">
              <img src="/images/bot1.jpeg" alt="Behavior Over Time Graph 1" />
            </div>
            <div className="botg-description">
              <h3>Obesity Trends</h3>
              <p>
                This graph shows the exponential rise in obesity over time (measured in months), 
                based on a simulation model. The curve demonstrates how compounding factors in the
                system create accelerating growth patterns typical of reinforcing feedback loops.
              </p>
            </div>
          </div>
          
          <div className="botg-card">
            <div className="botg-image">
              <img src="/images/bot2.jpeg" alt="Behavior Over Time Graph 2" />
            </div>
            <div className="botg-description">
              <h3>Multi-Variable System Analysis</h3>
              <div className="insight-points">
                <div className="insight-point">
                  <h4>Obesity (Top Graph)</h4>
                  <p>Explosive exponential growth shows how the obesity stock skyrockets toward the end of the time horizon, suggesting strong reinforcing loops from sedentary jobs, fast food, and emotional eating.</p>
                </div>
                
                <div className="insight-point">
                  <h4>Sedentary Jobs</h4>
                  <p>Shows exponential growth, indicating rising work environments with less physical movement, directly compounding obesity rates.</p>
                </div>
                
                <div className="insight-point">
                  <h4>Fast Food Consumption</h4>
                  <p>Grows steadily in a linear fashion, contributing to weight gain but not as explosively as sedentary behavior.</p>
                </div>
                
                <div className="insight-point">
                  <h4>Traditional Diets</h4>
                  <p>Shows a sharp decline, especially after the midpoint, indicating traditional diets are rapidly being abandoned.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BOTGSection;
