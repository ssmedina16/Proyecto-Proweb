// Releases Toggle Functionality

document.addEventListener('DOMContentLoaded', () => {
    const releasesToggle = {
        init() {
            this.toggleBtns = document.querySelectorAll('.toggle-btn');
            this.newReleasesGrid = document.getElementById('new-releases');
            this.upcomingReleasesGrid = document.getElementById('upcoming-releases');
            this.releasesLink = document.getElementById('releases-link');

            if (!this.toggleBtns.length || !this.newReleasesGrid || !this.upcomingReleasesGrid) return;

            this.attachEvents();
        },

        attachEvents() {
            this.toggleBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const type = btn.dataset.type;
                    this.switchReleases(type);
                });
            });
        },

        switchReleases(type) {
            // Update active toggle button
            this.toggleBtns.forEach(btn => {
                if (btn.dataset.type === type) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            // Show/hide corresponding grids
            if (type === 'new') {
                this.newReleasesGrid.classList.remove('hidden');
                this.upcomingReleasesGrid.classList.add('hidden');
                // Update link to recent releases page
                this.releasesLink.href = '../pages/games/index.html?filter=recent';
            } else {
                this.newReleasesGrid.classList.add('hidden');
                this.upcomingReleasesGrid.classList.remove('hidden');
                // Update link to upcoming releases page
                this.releasesLink.href = '../pages/games/index.html?filter=upcoming';
            }
        }
    };

    // Initialize releases toggle
    if (document.getElementById('releases')) {
        releasesToggle.init();
    }
});
