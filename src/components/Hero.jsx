import React, { useEffect, useRef } from 'react';

function Hero() {
  const heroRef = useRef(null);
  
  useEffect(() => {
    // Create animated background particles
    if (heroRef.current && typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.zIndex = '1';
      canvas.style.pointerEvents = 'none';
      
      heroRef.current.appendChild(canvas);
      
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();
      
      const ctx = canvas.getContext('2d');
      
      // Particle properties
      const particlesArray = [];
      const numberOfParticles = 100;
      
      class Particle {
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.size = Math.random() * 3 + 1;
          this.speedX = Math.random() * 1 - 0.5;
          this.speedY = Math.random() * 1 - 0.5;
          this.opacity = Math.random() * 0.5 + 0.1;
        }
        
        update() {
          this.x += this.speedX;
          this.y += this.speedY;
          
          if (this.x > canvas.width) this.x = 0;
          else if (this.x < 0) this.x = canvas.width;
          if (this.y > canvas.height) this.y = 0;
          else if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
          ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
        }
      }
      
      function createParticles() {
        for (let i = 0; i < numberOfParticles; i++) {
          particlesArray.push(new Particle());
        }
      }
      
      function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
          particlesArray[i].update();
          particlesArray[i].draw();
        }
        
        // Connect particles with lines
        connectParticles();
        requestAnimationFrame(animateParticles);
      }
      
      function connectParticles() {
        for (let i = 0; i < particlesArray.length; i++) {
          for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
              // Draw line between particles
              ctx.beginPath();
              ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 - (distance / 750)})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
              ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
              ctx.stroke();
            }
          }
        }
      }
      
      createParticles();
      animateParticles();
      
      return () => {
        window.removeEventListener('resize', resizeCanvas);
        if (heroRef.current) {
          heroRef.current.removeChild(canvas);
        }
      };
    }
  }, []);
  
  return (
    <section id="home" className="hero" ref={heroRef}>
      <div className="section-inner" style={{ textAlign: 'center' }}>
        <h1>Why Are We <span className="text-gradient">Still</span> Getting Sicker?</h1>
        <p>
          Exploring the Systemic Roots of India's Lifestyle Disease Crisis and obesity.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={() => document.getElementById('system').scrollIntoView({ behavior: 'smooth' })}>
            Explore the System
          </button>
          <button className="outlined" style={{ background: 'transparent', borderColor: 'white', color: 'white' }}>
            View Research
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
