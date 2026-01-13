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

    // Countdown timer for unreleased games
    checkAndSetupCountdown(game.first_release_date);

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

    // Series/Collection
    if (game.collection && game.collection.name) {
        setText('modal-series', game.collection.name);
        showSection('modal-series-section');
    } else {
        hideSection('modal-series-section');
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

    // Websites/Links
    populateWebsites(game.websites);

    // Videos
    populateVideos(game.videos);

    // Screenshots
    populateScreenshots(game.screenshots);

    // Similar Games
    populateSimilarGames(game.similar_games);

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

// Show/hide section helpers
function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) section.style.display = 'block';
}

function hideSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) section.style.display = 'none';
}

// Countdown timer for unreleased games
let countdownInterval = null;

function checkAndSetupCountdown(releaseTimestamp) {
    const countdownContainer = document.getElementById('modal-countdown');
    const section = document.getElementById('countdown-section');

    if (!releaseTimestamp) {
        if (section) section.style.display = 'none';
        return;
    }

    const releaseDate = new Date(releaseTimestamp * 1000);
    const now = new Date();

    if (releaseDate > now) {
        // Game not released yet - show countdown
        if (section) section.style.display = 'block';
        startCountdown(releaseTimestamp);
    } else {
        if (section) section.style.display = 'none';
        stopCountdown();
    }
}

function startCountdown(releaseTimestamp) {
    const countdownElement = document.getElementById('modal-countdown');
    if (!countdownElement) return;

    // Clear any existing countdown
    stopCountdown();

    function updateCountdown() {
        const now = new Date().getTime();
        const releaseTime = releaseTimestamp * 1000;
        const distance = releaseTime - now;

        if (distance < 0) {
            countdownElement.innerHTML = '¡Ya disponible!';
            stopCountdown();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `
            <span class="countdown-number">${days}</span> días 
            <span class="countdown-number">${hours}</span> hrs 
            <span class="countdown-number">${minutes}</span> min 
            <span class="countdown-number">${seconds}</span> seg
        `;
    }

    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

function stopCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}

// Populate websites/links
function populateWebsites(websites) {
    const container = document.getElementById('modal-websites');
    const section = document.getElementById('websites-section');

    if (!websites || websites.length === 0) {
        if (section) section.style.display = 'none';
        return;
    }

    if (container && section) {
        container.innerHTML = '';

        const websiteCategories = {
            1: { name: 'Oficial', icon: '🌐' },
            2: { name: 'Wikia', icon: '📖' },
            3: { name: 'Wikipedia', icon: '📚' },
            4: { name: 'Facebook', icon: '👥' },
            5: { name: 'Twitter', icon: '🐦' },
            6: { name: 'Twitch', icon: '🎮' },
            8: { name: 'Instagram', icon: '📷' },
            9: { name: 'YouTube', icon: '▶️' },
            13: { name: 'Steam', icon: '🎯' },
            14: { name: 'Reddit', icon: '💬' },
            16: { name: 'Epic Games', icon: '🎮' },
            17: { name: 'GOG', icon: '🎮' },
            18: { name: 'Discord', icon: '💬' }
        };

        websites.forEach(website => {
            const category = websiteCategories[website.category] || { name: 'Link', icon: '🔗' };
            const link = document.createElement('a');
            link.href = website.url;
            link.target = '_blank';
            link.className = 'website-link';
            link.innerHTML = `${category.icon} ${category.name}`;
            container.appendChild(link);
        });

        section.style.display = 'block';
    }
}

// Populate videos
function populateVideos(videos) {
    const container = document.getElementById('modal-videos');
    const section = document.getElementById('videos-section');

    if (!videos || videos.length === 0) {
        if (section) section.style.display = 'none';
        return;
    }

    if (container && section) {
        container.innerHTML = '';

        videos.slice(0, 3).forEach(video => {
            const videoFrame = document.createElement('div');
            videoFrame.className = 'video-frame';
            videoFrame.innerHTML = `
                <iframe 
                    width="100%" 
                    height="200" 
                    src="https://www.youtube.com/embed/${video.video_id}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
                ${video.name ? `<p class="video-title">${video.name}</p>` : ''}
            `;
            container.appendChild(videoFrame);
        });

        section.style.display = 'block';
    }
}

// Populate screenshots
function populateScreenshots(screenshots) {
    const container = document.getElementById('modal-screenshots');
    const section = document.getElementById('screenshots-section');

    if (!screenshots || screenshots.length === 0) {
        if (section) section.style.display = 'none';
        return;
    }

    if (container && section) {
        container.innerHTML = '';

        screenshots.forEach(screenshot => {
            const img = document.createElement('img');
            img.src = IGDB_API.formatImageUrl(screenshot.url, 'screenshot_big');
            img.className = 'screenshot-image';
            img.alt = 'Game Screenshot';
            img.onclick = () => window.open(IGDB_API.formatImageUrl(screenshot.url, 'screenshot_huge'), '_blank');
            container.appendChild(img);
        });

        section.style.display = 'block';
    }
}

// Populate similar games
function populateSimilarGames(similarGames) {
    const container = document.getElementById('modal-similar-games');
    const section = document.getElementById('similar-games-section');

    if (!similarGames || similarGames.length === 0) {
        if (section) section.style.display = 'none';
        return;
    }

    if (container && section) {
        container.innerHTML = '';

        similarGames.slice(0, 6).forEach(game => {
            const card = document.createElement('div');
            card.className = 'similar-game-card';
            const coverUrl = game.cover && game.cover.url
                ? IGDB_API.formatImageUrl(game.cover.url, 'cover_small')
                : 'https://via.placeholder.com/90x120?text=No+Image';

            card.innerHTML = `
                <img src="${coverUrl}" alt="${game.name}">
                <div class="similar-game-name">${game.name}</div>
                ${game.rating ? `<div class="similar-game-rating">⭐ ${Math.round(game.rating)}</div>` : ''}
            `;
            card.onclick = () => showGameModal(game.id);
            container.appendChild(card);
        });

        section.style.display = 'block';
    }
}
 
 