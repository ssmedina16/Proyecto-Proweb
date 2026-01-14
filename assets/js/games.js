// Games Page - IGDB API Integration

let currentPage = 0;
const gamesPerPage = 9;
let allGames = [];
let currentWhereClause = null;
let isTop100Mode = false;

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎮 Loading games from IGDB API...');

    // Clear placeholders immediately
    const gamesGrid = document.querySelector('.games-grid');
    if (gamesGrid) {
        gamesGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;">Cargando juegos...</div>';
    }

    try {
        setupFilterHandlers();
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
        console.log(`Fetching games: Limit ${gamesPerPage}, Offset ${currentPage * gamesPerPage}`);
        const games = await IGDB_API.getGames(gamesPerPage, currentPage * gamesPerPage, currentWhereClause);

        if (!games || games.length === 0) {
            console.warn('No games found');
            // If it's a filter search and no results, maybe clear the grid and show message
            if (currentPage === 0) {
                 const gamesGrid = document.getElementById('games-container');
                 if (gamesGrid) gamesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No se encontraron juegos con estos filtros.</p>';
            }
            return 0;
        }

        console.log(`📊 Loaded ${games.length} games`);
        
        if (currentPage === 0) {
            allGames = games;
        } else {
            allGames = [...allGames, ...games];
        }

        displayGames(games);
        return games.length;
    } catch (error) {
        console.error('Error loading games:', error);
        return 0;
    }
}

// Display games in grid
function displayGames(games) {
    const gamesGrid = document.getElementById('games-container');
    if (!gamesGrid) return;

    // Reset container class depending on mode
    if (isTop100Mode) {
        gamesGrid.className = 'games-list-top100';
    } else {
        gamesGrid.className = 'games-grid';
    }

    // Clear existing content only if it's the first page
    if (currentPage === 0) {
        gamesGrid.innerHTML = '';
    }

    games.forEach((game, index) => {
        // Special rendering for Top 100
        if (isTop100Mode) {
             const baseRank = index + 1 + (currentPage * gamesPerPage);
             const releaseDate = game.first_release_date
                ? new Date(game.first_release_date * 1000).toLocaleDateString('es-ES')
                : 'Fecha desconocida';
             const rating = game.rating ? `⭐ ${game.rating.toFixed(1)}` : '';
             const coverUrl = game.cover && game.cover.url
                ? IGDB_API.formatImageUrl(game.cover.url, 'cover_big')
                : 'https://via.placeholder.com/200x300?text=No+Image';

             const card = document.createElement('div');
             card.className = 'top100-card';
             card.dataset.gameId = game.id;
             card.style.position = 'relative';
             card.style.cursor = 'pointer';
             card.onclick = () => showGameModal(game.id);

             card.innerHTML = `
                    <div class="top100-info">
                        <div class="top100-rank" style="display: inline-block; background: rgba(255, 107, 129, 0.95); color: white; font-weight: bold; padding: 5px 10px; border-radius: 5px; font-size: 0.9rem; margin-right: 10px;">
                            #${baseRank}
                        </div>
                        <span class="top100-date">${releaseDate}</span>
                        <span class="top100-name">${game.name}</span>
                        ${rating ? `<span class="top100-rating" style="color: #fbbf24; margin-left: 10px;">${rating}</span>` : ''}
                    </div>
                    <div class="top100-img-box" style="background-image: url('${coverUrl}'); background-size: cover; background-position: center;"></div>
                    <div class="top100-arrow">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </div>
            `;
            gamesGrid.appendChild(card);
            return;
        }

        // Standard Grid rendering
        const card = document.createElement('div');
        card.className = 'game-card';
        card.dataset.gameId = game.id;

        // Image
        let imageStyle = 'background-color: #eee;'; // Fallback
        if (game.cover && game.cover.url) {
            const imageUrl = IGDB_API.formatImageUrl(game.cover.url, 'cover_big');
            imageStyle = `background-image: url('${imageUrl}');`;
        }

        card.innerHTML = `
            <div class="game-card-image" style="${imageStyle}"></div>
            <div class="game-card-content">
                <h3 class="game-name">${game.name || 'Unknown Game'}</h3>
            </div>
        `;

        // Add click handler
        card.onclick = () => showGameModal(game.id);
        
        gamesGrid.appendChild(card);
    });
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
            console.log('Load More clicked. Next page:', currentPage + 1);
            currentPage++;
            loadMoreBtn.disabled = true;
            loadMoreBtn.textContent = 'Cargando...';

            const count = await loadGames();

            loadMoreBtn.disabled = false;
            loadMoreBtn.textContent = 'Cargar más';
            
            if (count === 0) {
                loadMoreBtn.style.display = 'none'; // Hide if no more games
            }
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

/* Filter Logic */
function setupFilterHandlers() {
    const applyBtn = document.getElementById('apply-filters-btn');
    const modal = document.getElementById('filter-modal');
    
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            applyFilters();
            if (modal) modal.style.display = 'none';
        });
    }
}

// Expose to window for external access (e.g. from main.js tags)
window.applyGameFilters = applyFilters;

function applyFilters() {
    const filters = {
        release: [],
        genre: [],
        mode: [],
        platform: [],
        top100: false 
    };

    const modal = document.getElementById('filter-modal');
    if (!modal) return;
    
    // Always remove the 'top100-active' class on refresh, allow checkTop100Status to add it back if needed
    // or we handle title/class reset here directly to be safe.
    const pageTitle = document.querySelector('.section-header h2') || document.querySelector('h1') || document.querySelector('.page-title');
    if (pageTitle) {
        // Assume default
        pageTitle.innerText = 'Juegos'; 
        pageTitle.classList.remove('top100-active');
    }

    modal.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        if (!cb.checked) return;

        // Check for Top 100
        if (cb.dataset.filterType === undefined && 
            cb.parentElement.classList.contains('filter-header-simple') && 
            cb.parentElement.innerText.includes('Top 100')) {
            filters.top100 = true;
            return;
        }

        if (cb.dataset.filterType) {
            filters[cb.dataset.filterType].push(cb.dataset.value);
        }
    });

    const conditions = [];
    const now = Math.floor(Date.now() / 1000);

    // Reset Top 100 Flag
    isTop100Mode = false;

    // Top 100 Logic
    if (filters.top100) {
        conditions.push('rating_count > 50 & rating > 75');
        isTop100Mode = true; 
        
        // Update title manually if active
        if (pageTitle) {
            pageTitle.innerText = 'Top 100';
            pageTitle.classList.add('top100-active');
        }
    } else {
        // Reset specific class if not active
        const gamesGrid = document.querySelector('.games-list-top100');
        if (gamesGrid) gamesGrid.className = 'games-grid';
    }

    // Release
    if (filters.release.includes('recent')) {
        const fifteenDaysAgo = now - (15 * 24 * 60 * 60);
        conditions.push(`first_release_date >= ${fifteenDaysAgo}`);
    }
    if (filters.release.includes('old')) {
        const fifteenDaysAgo = now - (15 * 24 * 60 * 60);
        conditions.push(`first_release_date < ${fifteenDaysAgo}`);
    }

    // Genre
    if (filters.genre.length > 0) {
        const genreNames = filters.genre.map(g => `"${g}"`).join(',');
        conditions.push(`genres.name = (${genreNames})`);
    }

    // Mode
    if (filters.mode.length > 0) {
        const modeNames = filters.mode.map(m => `"${m}"`).join(',');
        conditions.push(`game_modes.name = (${modeNames})`);
    }

    // Platform
    if (filters.platform.length > 0) {
        const platformNames = filters.platform.map(p => `"${p}"`).join(',');
        conditions.push(`platforms.name = (${platformNames})`);
    }

    currentWhereClause = conditions.length > 0 ? conditions.join(' & ') : null;
    
    console.log('Applying filters:', currentWhereClause);

    // Reset page and reload
    currentPage = 0;
    loadGames();
}
