// Home Page Data Loader - IGDB API Integration

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎮 Iniciando carga de datos desde IGDB API...');

    // Test API connection
    try {
        const token = await IGDB_API.getAccessToken();
        if (token) {
            console.log('✅ Autenticación exitosa con IGDB API');

            // Load data for all sections
            await loadMainCarousel();
            await loadFeaturedGames();
            await loadTopGames();
            await loadRecentReleases();
            await loadUpcomingReleases();

            console.log('✅ Datos cargados exitosamente');
        } else {
            console.error('❌ No se pudo obtener token de acceso');
            showFallbackMessage();
        }
    } catch (error) {
        console.error('❌ Error al cargar datos:', error);
        showFallbackMessage();
    }
});

// Load Main Banner Carousel
async function loadMainCarousel() {
    try {
        // Get high rated games for banner
        const games = await IGDB_API.getPopularGames(5);

        if (games && games.length > 0) {
            console.log(`📊 Iniciando carrusel con ${games.length} juegos`);

            // Initialize the Carousel module with data
            if (window.MainCarousel) {
                window.MainCarousel.init(games);
            } else {
                console.error('❌ MainCarousel module not loaded');
            }
        }
    } catch (error) {
        console.error('Error loading main carousel:', error);
    }
}

// Load Featured Games (Nintendo style carousel)
async function loadFeaturedGames() {
    try {
        // Get different set of popular games
        const games = await IGDB_API.getPopularGames(6);

        const featuredContainer = document.querySelector('.featured-carousel-container');
        if (featuredContainer && games && games.length > 0) {
            const featuredCards = featuredContainer.querySelectorAll('.featured-card');

            games.slice(0, Math.min(games.length, featuredCards.length)).forEach((game, index) => {
                const card = featuredCards[index];
                if (card) {
                    // Image
                    const circleImg = card.querySelector('.circle-img');
                    if (circleImg && game.cover) {
                        const url = IGDB_API.formatImageUrl(game.cover.url, 'cover_big');
                        circleImg.style.backgroundImage = `url('${url}')`;
                    }

                    // Title & Description
                    const title = card.querySelector('.game-title');
                    if (title) title.textContent = game.name;

                    const desc = card.querySelector('.descrip-game');
                    if (desc) desc.textContent = game.summary ? game.summary.substring(0, 80) + '...' : 'Sin descripción';

                    // Link
                    const link = card.querySelector('.plus-icon');
                    if (link) link.href = `../pages/games/index.html`; // Generic link since we don't have detail page parameters set up fully in URL yet
                }
            });
        }
    } catch (error) {
        console.error('Error loading featured games:', error);
    }
}

// Load Top 20 Games
async function loadTopGames() {
    try {
        const games = await IGDB_API.getPopularGames(20);

        if (!games || games.length === 0) return;

        const topGamesSection = document.querySelector('.top-20-games');
        const grid = topGamesSection ? topGamesSection.querySelector('.games-grid') : null;

        if (grid) {
            // Get template
            const template = grid.querySelector('.game-card');
            if (template) {
                // Remove existing content/loading state
                grid.innerHTML = '';

                games.forEach((game) => {
                    const card = template.cloneNode(true);
                    updateTopGameCard(card, game);
                    grid.appendChild(card);
                });
            }
        }
    } catch (error) {
        console.error('Error loading top games:', error);
    }
}

// Update a top game card
function updateTopGameCard(card, game) {
    const circleImg = card.querySelector('.circle-img');
    const title = card.querySelector('.game-title');
    const description = card.querySelector('.descrip-game');
    const link = card.querySelector('.plus-icon');

    if (circleImg && game.cover && game.cover.url) {
        const imageUrl = IGDB_API.formatImageUrl(game.cover.url, 'cover_big');
        circleImg.style.backgroundImage = `url('${imageUrl}')`;
    }

    if (title) {
        title.textContent = game.name || 'Juego Desconocido';
    }

    if (description) {
        // Limit description length
        const summary = game.summary || 'Sin descripción disponible.';
        description.textContent = summary.length > 100 ? summary.substring(0, 100) + '...' : summary;
    }

    if (link) {
        link.href = `../pages/games/index.html`;
    }

    // Whole card clickable as well
    card.onclick = (e) => {
        // Don't trigger if clicked on link (prevent double nav)
        if (!e.target.closest('.plus-icon')) {
            window.location.href = '../pages/games/index.html';
        }
    };
}

// ... existing helper functions (loadRecentReleases, etc.) ...
async function loadRecentReleases() {
    const games = await IGDB_API.getRecentReleases(8);
    updateReleaseGrid('new-releases', games);
}

async function loadUpcomingReleases() {
    const games = await IGDB_API.getUpcomingReleases(8);
    updateReleaseGrid('upcoming-releases', games);
}

function updateReleaseGrid(id, games) {
    if (!games || games.length === 0) return;

    const grid = document.getElementById(id);
    if (!grid) return;

    const cards = grid.querySelectorAll('.release-card');

    games.slice(0, Math.min(games.length, cards.length)).forEach((game, index) => {
        const card = cards[index];
        const img = card.querySelector('.card-image');
        const footer = card.querySelector('.card-footer');

        if (img && game.cover) {
            const url = IGDB_API.formatImageUrl(game.cover.url, 'cover_small');
            img.style.backgroundImage = `url('${url}')`;
        }

        if (footer) footer.textContent = game.name;

        card.onclick = () => window.location.href = '../pages/games/index.html';
    });
}

function showFallbackMessage() {
    console.log('Using fallback/cached data');
}
