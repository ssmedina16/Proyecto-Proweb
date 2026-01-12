// Nintendo-Style Carousel for Home Page
// Refactored to accept dynamic data

const MainCarousel = {
    currentIndex: 0,
    autoPlayInterval: null,
    progressAnimation: null,
    duration: 5000,
    slides: [],

    // Initialize with data
    init(gamesData) {
        if (!gamesData || gamesData.length === 0) return;

        // Transform game data to slide format
        this.slides = gamesData.map(game => ({
            mainImage: IGDB_API ? IGDB_API.formatImageUrl(game.cover.url, 'screenshot_big') : game.cover.url,
            thumbImage: IGDB_API ? IGDB_API.formatImageUrl(game.cover.url, 'cover_small') : game.cover.url,
            title: game.name,
            id: game.id
        }));

        this.cacheElements();

        if (this.mainImg && this.thumbs.length > 0) {
            this.setupUI();
            this.attachEvents();
            this.startAutoPlay();

            // Show first slide immediately
            this.goToSlide(0);
        }
    },

    cacheElements() {
        this.mainImg = document.getElementById('carousel-main-img');
        this.progressBar = document.getElementById('carousel-progress');
        this.thumbs = document.querySelectorAll('.carousel-thumb'); // Changed from thumbnail to thumb to match CSS usually

        // Fallback selector check
        if (this.thumbs.length === 0) {
            this.thumbs = document.querySelectorAll('.carousel-thumbnail');
        }
    },

    setupUI() {
        // Populate thumbnails
        this.thumbs.forEach((thumb, index) => {
            if (index < this.slides.length) {
                const img = thumb.querySelector('img');
                // Fix: selector matching HTML in index.html (.thumb-title)
                const label = thumb.querySelector('.thumb-title') || thumb.querySelector('.carousel-label');

                if (img) img.src = this.slides[index].thumbImage;
                if (label) label.textContent = this.slides[index].title;
            }
        });
    },

    attachEvents() {
        this.thumbs.forEach((thumb, index) => {
            // Remove old listeners by cloning (simple trick) or just assume clean slate if run once
            // For safety, we'll just add listeners, assuming init is called once
            thumb.onclick = () => {
                this.goToSlide(index);
                this.resetProgressBar(); // Manual click resets timer
            };
        });

        // Pause on hover
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.onmouseenter = () => this.pauseAutoPlay();
            carouselContainer.onmouseleave = () => this.startAutoPlay();
        }
    },

    goToSlide(index) {
        if (index < 0 || index >= this.slides.length) return;

        this.currentIndex = index;

        // Update main image
        if (this.mainImg) {
            this.mainImg.style.opacity = '0';
            setTimeout(() => {
                this.mainImg.src = this.slides[index].mainImage;
                this.mainImg.onload = () => {
                    this.mainImg.style.opacity = '1';
                };
            }, 200);
        }

        // Update thumbnails
        this.thumbs.forEach((t, i) => {
            if (i === index) t.classList.add('active');
            else t.classList.remove('active');
        });

        this.resetProgressBar();
    },

    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    },

    startAutoPlay() {
        this.stopAutoPlay();
        this.resetProgressBar();

        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.duration);
    },

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    },

    pauseAutoPlay() {
        this.stopAutoPlay();
        // Visual pause of bar could go here
        if (this.progressBar) {
            // Reset animation to look "paused" or just hide it
            this.progressBar.style.animation = 'none';
        }
    },

    resetProgressBar() {
        if (!this.progressBar) return;

        // Trigger reflow to restart css animation
        this.progressBar.style.animation = 'none';
        this.progressBar.offsetHeight; /* trigger reflow */
        this.progressBar.style.animation = `progress ${this.duration}ms linear`;
    }
};

// Expose to window
window.MainCarousel = MainCarousel;
