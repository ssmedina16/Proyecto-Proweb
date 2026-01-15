//********************* Carrusel estilo Nintendo para pagina principal acepta datos dinamicos *********************//

const MainCarousel = {
    currentIndex: 0,
    autoPlayInterval: null,
    progressAnimation: null,
    duration: 5000,
    slides: [],

    //********************* Inicializa carrusel con datos de juegos de la API *********************//
    init(gamesData) {
    if (!gamesData || gamesData.length === 0) return;

    this.slides = gamesData.map(game => ({
        mainImage: IGDB_API ? IGDB_API.formatImageUrl(game.cover.url, 'screenshot_big') : game.cover.url,
        thumbImage: IGDB_API ? IGDB_API.formatImageUrl(game.cover.url, 'cover_small') : game.cover.url,
        title: game.name,
        id: game.id
    }));

    this.cacheElements();

    if (this.mainImg) {
        this.setupUI();
        this.attachEvents();
        this.startAutoPlay();
        this.goToSlide(0);
    }
},

    //********************* Almacena referencias a elementos DOM del carrusel *********************//
    cacheElements() {
    this.mainImg = document.getElementById('carousel-main-img');
    this.progressBar = document.getElementById('carousel-progress');
    this.thumbs = document.querySelectorAll('.carousel-thumb');

    if (this.thumbs.length === 0) {
        this.thumbs = document.querySelectorAll('.carousel-thumbnail');
    }
},

    //********************* Configura miniaturas con imagenes y titulos de juegos *********************//
    setupUI() {
    this.thumbs.forEach((thumb, index) => {
        if (index < this.slides.length) {
            const img = thumb.querySelector('img');
            const label = thumb.querySelector('.thumb-title') || thumb.querySelector('.carousel-label');

            if (img) img.src = this.slides[index].thumbImage;
            if (label) label.textContent = this.slides[index].title;
        }
    });
},

    //********************* Adjunta eventos de click y hover a miniaturas *********************//
    attachEvents() {
    this.thumbs.forEach((thumb, index) => {
        thumb.onclick = () => {
            this.goToSlide(index);
            this.resetProgressBar();
        };
    });

    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.onmouseenter = () => this.pauseAutoPlay();
        carouselContainer.onmouseleave = () => this.startAutoPlay();
    }
},

    //********************* Navega a slide especifica con animacion de fade *********************//
    goToSlide(index) {
    if (index < 0 || index >= this.slides.length) return;

    this.currentIndex = index;

    if (this.mainImg) {
        this.mainImg.style.opacity = '0';
        setTimeout(() => {
            this.mainImg.src = this.slides[index].mainImage;
            this.mainImg.onload = () => {
                this.mainImg.style.opacity = '1';
            };
        }, 200);
    }

    this.thumbs.forEach((t, i) => {
        if (i === index) t.classList.add('active');
        else t.classList.remove('active');
    });

    this.resetProgressBar();
},

    //********************* Avanza al siguiente slide en orden circular *********************//
    nextSlide() {
    const nextIndex = (this.currentIndex + 1) % this.slides.length;
    this.goToSlide(nextIndex);
},

    //********************* Inicia reproduccion automatica cada 5 segundos *********************//
    startAutoPlay() {
    this.stopAutoPlay();
    this.resetProgressBar();

    this.autoPlayInterval = setInterval(() => {
        this.nextSlide();
    }, this.duration);
},

    //********************* Detiene reproduccion automatica y limpia interval *********************//
    stopAutoPlay() {
    if (this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = null;
    }
},

    //********************* Pausa carrusel y barra de progreso al hacer hover *********************//
    pauseAutoPlay() {
    this.stopAutoPlay();
    if (this.progressBar) {
        this.progressBar.style.animation = 'none';
    }
},

    //********************* Reinicia animacion de barra de progreso *********************//
    resetProgressBar() {
    if (!this.progressBar) return;

    this.progressBar.style.animation = 'none';
    this.progressBar.offsetHeight;
    this.progressBar.style.animation = `progress ${this.duration}ms linear`;
}
};

window.MainCarousel = MainCarousel;
