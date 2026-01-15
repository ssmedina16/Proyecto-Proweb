//********************* Efecto de particulas flotantes ambiente gaming *********************//

    (function () {
        'use strict';

    //********************* Crea contenedor de particulas y lo agrega al DOM *********************//
            function createParticlesContainer() {
                const container = document.createElement('div');
                container.className = 'particles';
                document.body.appendChild(container);
                return container;
            }

            //********************* Crea particula individual con posicion y animacion aleatoria *********************//
                function createParticle(container) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';

                    particle.style.left = Math.random() * 100 + '%';
                    particle.style.top = Math.random() * 100 + '%';

                    particle.style.animationDelay = Math.random() * 6 + 's';
                    particle.style.animationDuration = (Math.random() * 4 + 4) + 's';

                    const size = Math.random() * 3 + 2;
                    particle.style.width = size + 'px';
                    particle.style.height = size + 'px';

                    container.appendChild(particle);
                }

                //********************* Inicializa sistema de particulas con 30 particulas *********************//
                    function initParticles() {
                        const container = createParticlesContainer();
                        const particleCount = 30;

                        for (let i = 0; i < particleCount; i++) {
                            createParticle(container);
                        }
                    }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initParticles);
        } else {
            initParticles();
        }
    })();
