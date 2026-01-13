// Global Search Functionality

let searchDebounceTimer = null;
let searchResultsModal = null;

// Initialize search on all pages
document.addEventListener('DOMContentLoaded', () => {
    setupGlobalSearch();
});

function setupGlobalSearch() {
    const searchInput = document.querySelector('.search-bar input');

    if (!searchInput) return;

    // Create results modal
    createSearchModal();

    // Input event with debounce
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();

        clearTimeout(searchDebounceTimer);

        if (query.length < 3) {
            hideSearchResults();
            return;
        }

        // Debounce: wait 300ms after user stops typing
        searchDebounceTimer = setTimeout(() => {
            performSearch(query);
        }, 300);
    });

    // Enter key to search immediately
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = e.target.value.trim();
            if (query.length >= 3) {
                clearTimeout(searchDebounceTimer);
                performSearch(query);
            }
        } else if (e.key === 'Escape') {
            hideSearchResults();
            searchInput.blur();
        }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-bar') && !e.target.closest('#search-results-modal')) {
            hideSearchResults();
        }
    });
}

function createSearchModal() {
    // Check if modal already exists
    if (document.getElementById('search-results-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'search-results-modal';
    modal.className = 'search-results-modal';
    modal.style.display = 'none';
    document.body.appendChild(modal);
    searchResultsModal = modal;
}

async function performSearch(query) {
    const modal = document.getElementById('search-results-modal');
    if (!modal) return;

    // Show loading state
    modal.innerHTML = '<div class="search-loading">🔍 Buscando...</div>';
    modal.style.display = 'block';
    positionSearchModal();

    try {
        const results = await IGDB_API.globalSearch(query);
        displaySearchResults(results, query);
    } catch (error) {
        console.error('Search error:', error);
        modal.innerHTML = '<div class="search-error">❌ Error en la búsqueda</div>';
    }
}

function displaySearchResults(results, query) {
    const modal = document.getElementById('search-results-modal');
    if (!modal) return;

    const totalResults =
        results.games.length +
        results.companies.length +
        results.platforms.length +
        results.events.length;

    if (totalResults === 0) {
        modal.innerHTML = `
            <div class="search-no-results">
                <p>😕 No se encontraron resultados para "${query}"</p>
            </div>
        `;
        return;
    }

    let html = `<div class="search-results-header">Resultados para "${query}"</div>`;

    // Games section
    if (results.games.length > 0) {
        html += `<div class="search-category">
            <h3 class="search-category-title">🎮 Juegos (${results.games.length})</h3>
            <div class="search-category-items">`;

        results.games.forEach(game => {
            const coverUrl = game.cover && game.cover.url
                ? IGDB_API.formatImageUrl(game.cover.url, 'thumb')
                : 'https://via.placeholder.com/40x50?text=?';

            html += `
                <div class="search-result-item" data-type="game" data-id="${game.id}">
                    <img src="${coverUrl}" alt="${game.name}">
                    <div class="search-result-info">
                        <div class="search-result-name">${game.name}</div>
                        ${game.rating ? `<div class="search-result-meta">⭐ ${Math.round(game.rating)}</div>` : ''}
                    </div>
                </div>
            `;
        });

        html += `</div></div>`;
    }

    // Companies section
    if (results.companies.length > 0) {
        html += `<div class="search-category">
            <h3 class="search-category-title">🏢 Compañías (${results.companies.length})</h3>
            <div class="search-category-items">`;

        results.companies.forEach(company => {
            const logoUrl = company.logo && company.logo.url
                ? IGDB_API.formatImageUrl(company.logo.url, 'thumb')
                : '';

            html += `
                <div class="search-result-item" data-type="company" data-id="${company.id}">
                    ${logoUrl ? `<img src="${logoUrl}" alt="${company.name}">` : '<div class="search-icon">🏢</div>'}
                    <div class="search-result-info">
                        <div class="search-result-name">${company.name}</div>
                    </div>
                </div>
            `;
        });

        html += `</div></div>`;
    }

    // Platforms section
    if (results.platforms.length > 0) {
        html += `<div class="search-category">
            <h3 class="search-category-title">🎯 Plataformas (${results.platforms.length})</h3>
            <div class="search-category-items">`;

        results.platforms.forEach(platform => {
            html += `
                <div class="search-result-item" data-type="platform" data-id="${platform.id}">
                    <div class="search-icon">🎯</div>
                    <div class="search-result-info">
                        <div class="search-result-name">${platform.name}</div>
                    </div>
                </div>
            `;
        });

        html += `</div></div>`;
    }

    // Events section
    if (results.events.length > 0) {
        html += `<div class="search-category">
            <h3 class="search-category-title">📅 Eventos (${results.events.length})</h3>
            <div class="search-category-items">`;

        results.events.forEach(event => {
            const startDate = event.start_time
                ? new Date(event.start_time * 1000).toLocaleDateString('es-ES')
                : '';

            html += `
                <div class="search-result-item" data-type="event" data-id="${event.id}">
                    <div class="search-icon">📅</div>
                    <div class="search-result-info">
                        <div class="search-result-name">${event.name}</div>
                        ${startDate ? `<div class="search-result-meta">${startDate}</div>` : ''}
                    </div>
                </div>
            `;
        });

        html += `</div></div>`;
    }

    modal.innerHTML = html;

    // Add click handlers
    modal.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => handleResultClick(item));
    });

    modal.style.display = 'block';
    positionSearchModal();
}

function handleResultClick(item) {
    const type = item.dataset.type;
    const id = item.dataset.id;

    hideSearchResults();

    // Get the base path (going back to project root)
    const currentPath = window.location.pathname;
    let basePath = '';

    // Determine how many levels deep we are
    if (currentPath.includes('/pages/')) {
        basePath = '../../';
    } else if (currentPath.includes('/main/')) {
        basePath = '../';
    } else {
        basePath = './';
    }

    switch (type) {
        case 'game':
            // Try to open game modal if function exists, otherwise go to games page
            if (typeof showGameModal === 'function') {
                showGameModal(parseInt(id));
            } else {
                window.location.href = basePath + 'pages/games/index.html';
            }
            break;
        case 'company':
            window.location.href = basePath + 'pages/companies/detail.html?id=' + id;
            break;
        case 'platform':
            window.location.href = basePath + 'pages/platforms/index.html#platform-' + id;
            break;
        case 'event':
            window.location.href = basePath + 'pages/events/detail.html?id=' + id;
            break;
    }
}

function positionSearchModal() {
    const searchBar = document.querySelector('.search-bar');
    const modal = document.getElementById('search-results-modal');

    if (!searchBar || !modal) return;

    const rect = searchBar.getBoundingClientRect();
    modal.style.top = `${rect.bottom + window.scrollY + 5}px`;
    modal.style.left = `${rect.left + window.scrollX}px`;
    modal.style.width = `${Math.min(rect.width, 500)}px`;
}

function hideSearchResults() {
    const modal = document.getElementById('search-results-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Reposition on window resize
window.addEventListener('resize', () => {
    const modal = document.getElementById('search-results-modal');
    if (modal && modal.style.display === 'block') {
        positionSearchModal();
    }
});
