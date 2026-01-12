// Gaming Particles Effect - Floating ambient particles

(function () {
    'use strict';

    // Create particles container
    function createParticlesContainer() {
        const container = document.createElement('div');
        container.className = 'particles';
        document.body.appendChild(container);
        return container;
    }

    // Create individual particle
    function createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random positioning
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';

        // Random animation delay and duration
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';

        // Random size variation
        const size = Math.random() * 3 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        container.appendChild(particle);
    }

    // Initialize particles
    function initParticles() {
        const container = createParticlesContainer();
        const particleCount = 30; // Adjust for performance

        for (let i = 0; i < particleCount; i++) {
            createParticle(container);
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initParticles);
    } else {
        initParticles();
    }
})();
