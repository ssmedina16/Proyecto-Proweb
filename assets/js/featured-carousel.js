//********************* Carrusel de juegos destacados muestra 2 juegos a la vez *********************//

    document.addEventListener('DOMContentLoaded', () => {
        const featuredCarousel = {
            currentPair: 0,
            totalGames: 6,
            gamesPerView: 2,

        //********************* Inicializa carrusel y adjunta eventos *********************//
            init() {
            this.container = document.querySelector('.featured-carousel-container');
            this.dots = document.querySelectorAll('#featured-dots .dot');
            this.totalPairs = Math.ceil(this.totalGames / this.gamesPerView);

            if (!this.container || !this.dots.length) return;

            this.attachEvents();
            this.showPair(0);
        },

        //********************* Adjunta eventos de click a los indicadores *********************//
            attachEvents() {
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    this.goToPair(index);
                });
            });
        },

        //********************* Navega a par de juegos especifico *********************//
            goToPair(pairIndex) {
            if (pairIndex < 0 || pairIndex >= this.totalPairs) return;

            this.currentPair = pairIndex;
            this.showPair(pairIndex);
        },

        //********************* Muestra par de juegos con transformacion CSS *********************//
            showPair(pairIndex) {
            const translateValue = -(pairIndex * 100);
            this.container.style.transform = `translateX(${translateValue}%)`;

            this.dots.forEach((dot, index) => {
                if (index === pairIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        },

        //********************* Avanza al siguiente par *********************//
            nextPair() {
            const nextIndex = (this.currentPair + 1) % this.totalPairs;
            this.goToPair(next Index);
        },

        //********************* Retrocede al par anterior *********************//
            prevPair() {
            const prevIndex = (this.currentPair - 1 + this.totalPairs) % this.totalPairs;
            this.goToPair(prevIndex);
        }
    };

if (document.querySelector('.featured-carousel-container')) {
    featuredCarousel.init();
}
});
