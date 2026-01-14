// Show company modal with complete details
async function showCompanyModal(company) {
    const modal = document.getElementById('company-modal');

    // Fill basic data
    document.getElementById('modal-company-logo').src = company.logo;
    document.getElementById('modal-company-name').textContent = company.name;
    document.getElementById('modal-founded').textContent = company.founded;
    document.getElementById('modal-country').textContent = company.country;
    document.getElementById('modal-type').textContent = company.type;
    document.getElementById('modal-description').textContent = company.description;

    // Show loading state
    const gamesContainer = document.getElementById('modal-games-list');
    gamesContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #aaa;">⏳ Cargando datos completos...</div>';

    // Fetch COMPLETE company details from API
    try {
        const companyDetails = await IGDB_API.getCompanyDetails(company.id);

        if (!companyDetails) {
            gamesContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #f66;">Error al cargar datos</div>';
            modal.style.display = 'block';
            return;
        }

        // 1. Calculate and display average rating
        const games = companyDetails.developed || [];
        if (games.length > 0) {
            const gamesWithRating = games.filter(g => g.rating);
            if (gamesWithRating.length > 0) {
                const avgRating = gamesWithRating.reduce((sum, g) => sum + g.rating, 0) / gamesWithRating.length;
                document.getElementById('modal-rating').textContent = `⭐ ${avgRating.toFixed(1)}/100`;
            } else {
                document.getElementById('modal-rating').textContent = 'N/A';
            }
        } else {
            document.getElementById('modal-rating').textContent = 'N/A';
        }

        // 2. Display websites/links
        if (companyDetails.websites && companyDetails.websites.length > 0) {
            const websitesSection = document.getElementById('modal-websites');
            const websitesList = document.getElementById('modal-websites-list');
            websitesSection.style.display = 'block';

            websitesList.innerHTML = companyDetails.websites.map(site => {
                const category = getWebsiteCategory(site.category);
                return `<a href="${site.url}" target="_blank" class="website-link">${category}</a>`;
            }).join('');
        }

        // 3. Generate platform stats
        const platformStats = {};
        games.forEach(game => {
            if (game.platforms) {
                game.platforms.forEach(platform => {
                    const name = platform.name || platform.abbreviation || 'Unknown';
                    platformStats[name] = (platformStats[name] || 0) + 1;
                });
            }
        });

        const platformStatsEl = document.getElementById('modal-platform-stats');
        if (Object.keys(platformStats).length > 0) {
            document.getElementById('modal-stats').style.display = 'block';
            const sortedPlatforms = Object.entries(platformStats)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10);

            platformStatsEl.innerHTML = sortedPlatforms.map(([platform, count]) =>
                `<div class="stat-item"><span>${platform}</span> <span>${count} juegos</span></div>`
            ).join('');
        }

        // 4. Generate genre stats
        const genreStats = {};
        games.forEach(game => {
            if (game.genres) {
                game.genres.forEach(genre => {
                    const name = genre.name || 'Unknown';
                    genreStats[name] = (genreStats[name] || 0) + 1;
                });
            }
        });

        const genreStatsEl = document.getElementById('modal-genre-stats');
        if (Object.keys(genreStats).length > 0) {
            document.getElementById('modal-stats').style.display = 'block';
            const sortedGenres = Object.entries(genreStats)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10);

            genreStatsEl.innerHTML = sortedGenres.map(([genre, count]) =>
                `<div class="stat-item"><span>${genre}</span> <span>${count} juegos</span></div>`
            ).join('');
        }

        // 5. Display DLCs
        const dlcs = games.filter(game => {
            return game.category && [8, 9, 10, 13, 14].includes(game.category);
        });

        if (dlcs.length > 0) {
            document.getElementById('modal-dlcs').style.display = 'block';
            const dlcsList = document.getElementById('modal-dlcs-list');
            dlcsList.innerHTML = dlcs.slice(0, 10).map(dlc => {
                const cover = dlc.cover ? IGDB_API.formatImageUrl(dlc.cover.url, 'cover_small') : 'https://via.placeholder.com/90x120?text=DLC';
                return `
                    <div class="dlc-item">
                        <img src="${cover}" alt="${dlc.name}">
                        <p>${dlc.name}</p>
                    </div>
                `;
            }).join('');
        }

        // 6. Display top 10 games by rating
        const gamesWithRatings = games.filter(g => g.rating && g.category !== 8 && g.category !== 9 && g.category !== 10);
        if (gamesWithRatings.length > 0) {
            document.getElementById('modal-top-games').style.display = 'block';
            const topGames = gamesWithRatings
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 10);

            const topGamesList = document.getElementById('modal-top-games-list');
            topGamesList.innerHTML = topGames.map((game, index) => {
                const cover = game.cover ? IGDB_API.formatImageUrl(game.cover.url, 'cover_small') : 'https://via.placeholder.com/90x120?text=No+Cover';
                return `
                    <div class="top-game-item">
                        <span class="rank">#${index + 1}</span>
                        <img src="${cover}" alt="${game.name}">
                        <div class="game-info">
                            <p class="game-name">${game.name}</p>
                            <p class="game-rating">⭐ ${game.rating.toFixed(1)}</p>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // 7. Fill featured games (first 10 games)
        if (games.length > 0) {
            gamesContainer.innerHTML = games.slice(0, 10).map(game => {
                const cover = game.cover ? IGDB_API.formatImageUrl(game.cover.url, 'cover_big') : 'https://via.placeholder.com/150x200?text=Game';
                return `
                    <div class="game-card-small">
                        <img src="${cover}" alt="${game.name}">
                        <p>${game.name}</p>
                    </div>
                `;
            }).join('');
        } else {
            gamesContainer.innerHTML = '<p style="text-align: center; color: #aaa;">No hay juegos disponibles</p>';
        }

    } catch (error) {
        console.error('Error loading company details:', error);
        gamesContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #f66;">Error al cargar datos</div>';
    }

    // Show modal
    modal.style.display = 'block';
}

// Helper: Get website category name
function getWebsiteCategory(category) {
    const categories = {
        1: '🌐 Sitio Web Oficial',
        2: '📰 Wikia',
        3: '📰 Wikipedia',
        4: '🐦 Twitter',
        5: '📘 Facebook',
        6: '📺 YouTube',
        8: '📱 iPhone',
        9: '📱 iPad',
        10: '📱 Android',
        13: '🎮 Steam',
        14: '🎮 Reddit',
        15: '🎮 Itch.io',
        16: '🎮 Epic Games',
        17: '🎮 GOG',
        18: '🔗 Discord'
    };
    return categories[category] || '🔗 Enlace';
}
