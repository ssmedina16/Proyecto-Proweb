//********************* Funcionalidad de alternador de lanzamientos nuevos y proximos *********************//

    document.addEventListener('DOMContentLoaded', () => {
        const releasesToggle = {
        //********************* Inicializa elementos del DOM *********************//
            init() {
            this.toggleBtns = document.querySelectorAll('.toggle-btn');
            this.newReleasesGrid = document.getElementById('new-releases');
            this.upcomingReleasesGrid = document.getElementById('upcoming-releases');
            this.releasesLink = document.getElementById('releases-link');

            if (!this.toggleBtns.length || !this.newReleasesGrid || !this.upcomingReleasesGrid) return;

            this.attachEvents();
        },

        //********************* Adjunta eventos a botones de alternancia *********************//
            attachEvents() {
            this.toggleBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const type = btn.dataset.type;
                    this.switchReleases(type);
                });
            });
        },

        //********************* Cambia entre vista de nuevos y proximos lanzamientos *********************//
            switchReleases(type) {
            this.toggleBtns.forEach(btn => {
                if (btn.dataset.type === type) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            if (type === 'new') {
                this.newReleasesGrid.classList.remove('hidden');
                this.upcomingReleasesGrid.classList.add('hidden');
                this.releasesLink.href = '../pages/games/index.html?filter=recent';
            } else {
                this.newReleasesGrid.classList.add('hidden');
                this.upcomingReleasesGrid.classList.remove('hidden');
                this.releasesLink.href = '../pages/games/index.html?filter=upcoming';
            }
        }
    };

if (document.getElementById('releases')) {
    releasesToggle.init();
}
});
