document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const companyId = urlParams.get('id');
    
    if (companyId) {
        const company = getCompanyById(companyId);
        
        if (company) {
            // Basic Info
            document.title = `${company.name} - Detalle`;
            document.getElementById('company-name').textContent = company.name;
            document.getElementById('company-description').textContent = company.description;
            document.getElementById('company-status').textContent = company.status;
            document.getElementById('company-country').textContent = company.country;
            document.getElementById('company-rating').textContent = company.rating;
            
            // Logo
            const logoContainer = document.querySelector('.company-logo-container');
            logoContainer.innerHTML = `<img src="${company.logo}" alt="${company.name}" class="company-logo" style="max-width: 100%; height: auto;">`;
            
            // Links
            const linksContainer = document.getElementById('company-links');
            linksContainer.innerHTML = '';
            if (company.links.website) linksContainer.innerHTML += `<a href="${company.links.website}" target="_blank" class="company-link">Sitio Web</a>`;
            if (company.links.twitter) linksContainer.innerHTML += `<a href="${company.links.twitter}" target="_blank" class="company-link">Twitter</a>`;
            if (company.links.facebook) linksContainer.innerHTML += `<a href="${company.links.facebook}" target="_blank" class="company-link">Facebook</a>`;
            
            // Stats - Platforms
            const platformList = document.getElementById('stats-platform-list');
            platformList.innerHTML = '';
            company.stats.platforms.forEach(stat => {
                platformList.innerHTML += `<div class="stat-item"><span>${stat.name}</span> <span>${stat.count} juegos</span></div>`;
            });
            
            // Stats - Genres
            const genreList = document.getElementById('stats-genre-list');
            genreList.innerHTML = '';
            company.stats.genres.forEach(stat => {
                genreList.innerHTML += `<div class="stat-item"><span>${stat.name}</span> <span>${stat.count} juegos</span></div>`;
            });
            
            // Top Games
            const topGamesContainer = document.getElementById('top-games-list');
            topGamesContainer.innerHTML = '';
            company.topGames.forEach(game => {
                topGamesContainer.innerHTML += `
                    <div class="game-card-small">
                        <div class="game-card-img-placeholder">
                            <span style="font-size: 2rem; color: #ccc;">🎮</span>
                        </div>
                        <div class="game-card-title">${game}</div>
                    </div>
                `;
            });
        } else {
            document.querySelector('.company-detail-main').innerHTML = '<h1>Compañía no encontrada</h1>';
        }
    } else {
        // If no ID, maybe show the first one or a message
            document.querySelector('.company-detail-main').innerHTML = '<h1>Seleccione una compañía</h1>';
    }
});
