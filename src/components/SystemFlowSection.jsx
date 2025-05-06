import React from 'react';

function SystemFlowSection() {
  return (
    <section className="system-flow-section section">
      <div className="section-inner">
        <h2>Understanding System Flow</h2>
        <p>
          Visualizing the system as interconnected stocks and flows helps identify bottlenecks, delays, and feedback mechanisms. The diagram below illustrates how factors like diet, stress, and activity influence health outcomes over time.
        </p>

        <div className="system-flow-container">
          {/* Placeholder for the 3D System Flow Visualization if kept */}
          {/* <div className="visualization-container"> */}
            {/* <SystemFlow3D /> */}
          {/* </div> */}

          {/* Stock and Flow Diagram Section */}
          <div className="stock-flow-diagram">
            <h3>Stock and Flow Diagram (SFD)</h3>
            <div className="sfd-image-container">
              <img
                src="/images/sfd.png" // Path to your SFD image
                alt="Stock and Flow Diagram of Health System"
                className="sfd-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/600x400?text=SFD+Diagram+Not+Found'; // Fallback
                }}
              />
            </div>
            <p className="diagram-caption">
              This diagram shows 'stocks' (like Population Health) accumulating or depleting based on 'flows' (like Healthy Habits Adoption Rate or Disease Progression Rate), influenced by various system factors.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SystemFlowSection;
