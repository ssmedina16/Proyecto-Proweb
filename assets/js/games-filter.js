// Games Filter and Sort Functionality

let currentGames = [];
let filteredGames = [];

// Initialize filters when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    loadGamesData();
});

async function loadGamesData() {
    try {
        const games = await IGDB_API.getGames(50, 0);
        if (games && games.length > 0) {
            currentGames = games;
            filteredGames = [...currentGames];
            displayGames(filteredGames);
        }
    } catch (error) {
        console.error('Error loading games:', error);
    }
}

function initializeFilters() {
    // Sort buttons
    const sortButtons = document.querySelectorAll('[data-sort]');
    sortButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sortType = e.target.dataset.sort;
            applySort(sortType);
        });
    });

    // Filter checkboxes
    const filterCheckboxes = document.querySelectorAll('[data-filter]');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            applyFilters();
        });
    });
}

function applySort(sortType) {
    switch (sortType) {
        case 'name-asc':
            filteredGames.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredGames.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'date-newest':
            filteredGames.sort((a, b) => (b.first_release_date || 0) - (a.first_release_date || 0));
            break;
        case 'date-oldest':
            filteredGames.sort((a, b) => (a.first_release_date || 0) - (b.first_release_date || 0));
            break;
        case 'rating-high':
            filteredGames.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
        case 'rating-low':
            filteredGames.sort((a, b) => (a.rating || 0) - (b.rating || 0));
            break;
        default:
            break;
    }

    displayGames(filteredGames);

    // Update UI to show active sort
    document.querySelectorAll('[data-sort]').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-sort="${sortType}"]`)?.classList.add('active');
}

function applyFilters() {
    const selectedGenres = Array.from(document.querySelectorAll('[data-filter="genre"]:checked'))
        .map(cb => cb.value);
    const selectedPlatforms = Array.from(document.querySelectorAll('[data-filter="platform"]:checked'))
        .map(cb => cb.value);

    filteredGames = currentGames.filter(game => {
        // Genre filter
        if (selectedGenres.length > 0) {
            if (!game.genres || !game.genres.some(g => selectedGenres.includes(g.name))) {
                return false;
            }
        }

        // Platform filter
        if (selectedPlatforms.length > 0) {
            if (!game.platforms || !game.platforms.some(p => selectedPlatforms.includes(p.name))) {
                return false;
            }
        }

        return true;
    });

    displayGames(filteredGames);
}

function displayGames(games) {
    const container = document.getElementById('games-container');
    if (!container) return;

    if (games.length === 0) {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #aaa;">No se encontraron juegos con los filtros seleccionados</div>';
        return;
    }

    container.innerHTML = '';

    games.forEach(game => {
        const card = createGameCard(game);
        container.appendChild(card);
    });
}

function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';

    const cover = game.cover ? IGDB_API.formatImageUrl(game.cover.url, 'cover_big') : 'https://via.placeholder.com/300x400?text=No+Image';
    const rating = game.rating ? game.rating.toFixed(1) : 'N/A';
    const releaseDate = game.first_release_date ? IGDB_API.formatDate(game.first_release_date) : 'TBA';

    card.innerHTML = `
        <div class="game-card-image" style="background-image: url('${cover}');"></div>
        <div class="game-card-body">
            <h3 class="game-name">${game.name}</h3>
            <div class="game-rating">⭐ ${rating}</div>
            <div class="game-release-date">${releaseDate}</div>
            ${game.genres ? `
                <div class="game-tags">
                    ${game.genres.slice(0, 3).map(g => `<span class="tag">${g.name}</span>`).join('')}
                </div>
            ` : ''}
        </div>
    `;

    card.addEventListener('click', () => {
        // Trigger game modal if exists
        if (typeof showGameModal === 'function') {
            showGameModal(game.id);
        }
    });

    return card;
}

// Export functions if needed
if (typeof window !== 'undefined') {
    window.applySort = applySort;
    window.applyFilters = applyFilters;
}
