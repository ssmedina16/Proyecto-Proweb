// Featured Games Carousel Logic

document.addEventListener('DOMContentLoaded', () => {
    const featuredCarousel = {
        currentPair: 0, // Índice del par actual (muestra 2 juegos a la vez)
        totalGames: 6,
        gamesPerView: 2,

        init() {
            this.container = document.querySelector('.featured-carousel-container');
            this.dots = document.querySelectorAll('#featured-dots .dot');
            this.totalPairs = Math.ceil(this.totalGames / this.gamesPerView);

            if (!this.container || !this.dots.length) return;

            this.attachEvents();
            this.showPair(0);
        },

        attachEvents() {
            // Click en los dots
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    this.goToPair(index);
                });
            });
        },

        goToPair(pairIndex) {
            if (pairIndex < 0 || pairIndex >= this.totalPairs) return;

            this.currentPair = pairIndex;
            this.showPair(pairIndex);
        },

        showPair(pairIndex) {
            // Calcular el desplazamiento
            // Cada card es 50% del ancho + gap
            const translateValue = -(pairIndex * 100); // 100% por cada par
            this.container.style.transform = `translateX(${translateValue}%)`;

            // Actualizar dots activos
            this.dots.forEach((dot, index) => {
                if (index === pairIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        },

        nextPair() {
            const nextIndex = (this.currentPair + 1) % this.totalPairs;
            this.goToPair(nextIndex);
        },

        prevPair() {
            const prevIndex = (this.currentPair - 1 + this.totalPairs) % this.totalPairs;
            this.goToPair(prevIndex);
        }
    };

    // Inicializar el carrusel de juegos destacados
    if (document.querySelector('.featured-carousel-container')) {
        featuredCarousel.init();
    }
});
