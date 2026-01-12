// Games Page - IGDB API Integration

let currentPage = 0;
const gamesPerPage = 20;
let allGames = [];

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎮 Loading games from IGDB API...');

    try {
        await loadGames();
        setupModalHandlers();
        setupLoadMoreButton();
    } catch (error) {
        console.error('Error initializing games page:', error);
        showError('Error al cargar juegos. Por favor, intenta de nuevo.');
    }
});

// Load games from API
async function loadGames() {
    try {
        const games = await IGDB_API.getGames(gamesPerPage, currentPage * gamesPerPage);

        if (!games || games.length === 0) {
            console.warn('No games found');
            return;
        }

        console.log(`📊 Loaded ${games.length} games`);
        allGames = games;

        displayGames(games);
    } catch (error) {
        console.error('Error loading games:', error);
    }
}

// Display games in grid
function displayGames(games) {
    const gamesGrid = document.querySelector('.games-grid');
    if (!gamesGrid) return;

    // Keep existing cards and update them
    const gameCards = gamesGrid.querySelectorAll('.game-card');

    games.forEach((game, index) => {
        if (gameCards[index]) {
            updateGameCard(gameCards[index], game);
        }
    });
}

// Update a single game card
function updateGameCard(card, game) {
    // Update image if exists
    const cardImg = card.querySelector('.game-card-img');
    if (cardImg && game.cover && game.cover.url) {
        const imageUrl = IGDB_API.formatImageUrl(game.cover.url, 'cover_big');
        cardImg.style.backgroundImage = `url('${imageUrl}')`;
    }

    // Update name
    const cardName = card.querySelector('.game-name, h3');
    if (cardName) {
        cardName.textContent = game.name || 'Unknown Game';
    }

    // Set game ID for modal
    card.dataset.gameId = game.id;

    // Add click handler
    card.style.cursor = 'pointer';
    card.onclick = () => showGameModal(game.id);
}

// Show game modal
async function showGameModal(gameId) {
    const modal = document.getElementById('game-detail-modal');
    if (!modal) return;

    // Show modal with loading state
    modal.style.display = 'block';
    setModalLoading(true);

    try {
        const game = await IGDB_API.getGameDetails(gameId);

        if (!game) {
            showError('No se pudo cargar la información del juego');
            modal.style.display = 'none';
            return;
        }

        populateModal(game);
        setModalLoading(false);
    } catch (error) {
        console.error('Error loading game details:', error);
        showError('Error al cargar detalles del juego');
        modal.style.display = 'none';
    }
}

// Populate modal with game data
function populateModal(game) {
    // Cover
    const cover = document.getElementById('modal-game-cover');
    if (cover) {
        cover.src = game.cover && game.cover.url
            ? IGDB_API.formatImageUrl(game.cover.url, 'cover_big')
            : 'https://via.placeholder.com/300x400?text=No+Image';
    }

    // Basic info
    setText('modal-game-title', game.name || 'Unknown Game');
    setText('modal-game-rating', game.rating ? `${Math.round(game.rating)}/100` : 'N/A');
    setText('modal-release-date', IGDB_API.formatDate(game.first_release_date));
    setText('modal-description', game.summary || 'No description available.');
    setText('modal-story', game.storyline || game.summary || 'No story available.');

    // Company
    if (game.involved_companies && game.involved_companies.length > 0) {
        const developer = game.involved_companies.find(ic => ic.developer);
        const companyName = developer && developer.company && developer.company.name
            ? developer.company.name
            : (game.involved_companies[0].company && game.involved_companies[0].company.name) || 'Unknown';
        setText('modal-company', companyName);
    } else {
        setText('modal-company', 'Unknown');
    }

    // Arrays
    fillTags('modal-genres', game.genres ? game.genres.map(g => g.name) : []);
    fillTags('modal-platforms', game.platforms ? game.platforms.map(p => p.name) : []);
    fillTags('modal-game-modes', game.game_modes ? game.game_modes.map(m => m.name) : []);
    fillTags('modal-themes', game.themes ? game.themes.map(t => t.name) : []);
    fillTags('modal-franchises', game.franchises ? game.franchises.map(f => f.name) : []);

    // Age ratings
    if (game.age_ratings && game.age_ratings.length > 0) {
        const ratings = game.age_ratings.map(ar => {
            const category = ar.category === 1 ? 'ESRB' : ar.category === 2 ? 'PEGI' : 'Other';
            return `${category} ${ar.rating}`;
        });
        fillTags('modal-age-ratings', ratings);
    } else {
        fillTags('modal-age-ratings', []);
    }

    // Languages
    if (game.language_supports && game.language_supports.length > 0) {
        const languages = game.language_supports.map(ls => ls.language && ls.language.name).filter(Boolean);
        fillTags('modal-languages', languages);
    } else {
        fillTags('modal-languages', []);
    }

    // Platform releases
    if (game.release_dates && game.release_dates.length > 0) {
        const platformReleasesContainer = document.getElementById('modal-platform-releases');
        const section = document.getElementById('platform-releases-section');

        if (platformReleasesContainer && section) {
            platformReleasesContainer.innerHTML = '';


            game.release_dates.forEach(rd => {
                if (rd.platform && rd.platform.name && rd.date) {
                    const item = document.createElement('div');
                    item.className = 'platform-release-item';
                    item.innerHTML = `<strong>${rd.platform.name}:</strong> <span>${IGDB_API.formatDate(rd.date)}</span>`;
                    platformReleasesContainer.appendChild(item);
                }
            });

            section.style.display = 'block';
        }
    } else {
        const section = document.getElementById('platform-releases-section');
        if (section) section.style.display = 'none';
    }
}

// Helper: Set text content
function setText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text || '';
    }
}

// Helper: Fill tags
function fillTags(elementId, data) {
    const container = document.getElementById(elementId);
    if (!container) return;

    container.innerHTML = '';

    if (data && data.length > 0) {
        data.forEach(item => {
            const tag = document.createElement('span');
            tag.className = 'game-tag';
            tag.textContent = item;
            container.appendChild(tag);
        });
    } else {
        container.innerHTML = '<span style="color: #999;">No disponible</span>';
    }
}

// Setup modal handlers
function setupModalHandlers() {
    const modal = document.getElementById('game-detail-modal');
    const closeBtn = document.querySelector('.game-modal-close');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
}

// Setup load more button
function setupLoadMoreButton() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', async () => {
            currentPage++;
            loadMoreBtn.disabled = true;
            loadMoreBtn.textContent = 'Cargando...';

            await loadGames();

            loadMoreBtn.disabled = false;
            loadMoreBtn.textContent = 'Cargar más';
        });
    }
}

// Set modal loading state
function setModalLoading(isLoading) {
    const modal = document.getElementById('game-detail-modal');
    if (!modal) return;

    if (isLoading) {
        modal.classList.add('loading');
    } else {
        modal.classList.remove('loading');
    }
}

// Show error message
function showError(message) {
    console.error(message);
    // Could add a toast notification here
}
