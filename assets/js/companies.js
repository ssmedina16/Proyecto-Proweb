// Companies Page - IGDB API Integration

let companiesData = [];
let isLoadingFromAPI = false;

// Fallback mock data (used if API fails)
const fallbackCompaniesData = [
    {
        id: 1,
        name: "Nintendo",
        logo: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=200&h=200&fit=crop",
        type: "Desarrolladora y Publisher",
        founded: "23 de septiembre de 1889",
        country: "Japón",
        description: "Nintendo Co., Ltd. es una empresa japonesa de videojuegos y juguetes. Es una de las compañías de videojuegos más importantes y reconocidas del mundo.",
        website: "https://www.nintendo.com",
        games: [
            { name: "The Legend of Zelda", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&h=200&fit=crop" },
            { name: "Super Mario Odyssey", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&h=200&fit=crop" }
        ]
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    showLoadingState();
    await loadCompaniesFromAPI();
    setupModalHandlers();
    setupSortingAndFiltering();
});

// Setup sorting and filtering
function setupSortingAndFiltering() {
    const sortSelect = document.getElementById('companies-sort');
    const filterSelect = document.getElementById('companies-filter');

    if (!sortSelect || !filterSelect) return;

    // Populate country filter options
    populateCountryFilter();

    // Add event listeners
    sortSelect.addEventListener('change', () => {
        applyFiltersAndSort();
    });

    filterSelect.addEventListener('change', () => {
        applyFiltersAndSort();
    });

    // Initial display with current settings
    applyFiltersAndSort();
}

// Populate country filter dynamically
function populateCountryFilter() {
    const filterSelect = document.getElementById('companies-filter');
    if (!filterSelect || companiesData.length === 0) return;

    // Get unique countries
    const countries = [...new Set(companiesData.map(c => c.country).filter(Boolean))];
    countries.sort();

    // Clear except "Todos"
    filterSelect.innerHTML = '<option value="all">Todos los países</option>';

    // Add country options
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        filterSelect.appendChild(option);
    });
}

// Apply filters and sorting
function applyFiltersAndSort() {
    const sortSelect = document.getElementById('companies-sort');
    const filterSelect = document.getElementById('companies-filter');

    if (!sortSelect || !filterSelect) return;

    let filteredData = [...companiesData];

    // Apply country filter
    const selectedCountry = filterSelect.value;
    if (selectedCountry !== 'all') {
        filteredData = filteredData.filter(c => c.country === selectedCountry);
        filterSelect.classList.add('has-filter');
    } else {
        filterSelect.classList.remove('has-filter');
    }

    // Apply sorting
    const sortBy = sortSelect.value;
    if (sortBy === 'az') {
        filteredData.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'za') {
        filteredData.sort((a, b) => b.name.localeCompare(a.name));
    }

    // Update results count
    const countElement = document.getElementById('companies-count');
    if (countElement) {
        countElement.textContent = `${filteredData.length} compañía${filteredData.length !== 1 ? 's' : ''}`;
    }

    // Display results
    displayCompanies(filteredData);
}

// Display companies (replaces loadCompanyCards)
function displayCompanies(companies) {
    const grid = document.getElementById('companies-grid');
    if (!grid) return;

    grid.innerHTML = '';

    if (companies.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #aaa;">No se encontraron compañías con estos filtros</div>';
        return;
    }

    companies.forEach(company => {
        const card = createCompanyCard(company);
        grid.appendChild(card);
    });
}


// Show loading state
function showLoadingState() {
    const grid = document.getElementById('companies-grid');
    if (!grid) return;

    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #aaa;"><div style="font-size: 2rem; margin-bottom: 10px;"></div>Cargando compañías...</div>';
}

// Load companies from IGDB API
async function loadCompaniesFromAPI() {
    isLoadingFromAPI = true;

    try {
        console.log('Loading companies from IGDB API...');
        const apiCompanies = await IGDB_API.getCompanies(12);

        if (apiCompanies && apiCompanies.length > 0) {
            console.log(`Loaded ${apiCompanies.length} companies from API`);

            // Convert API format to our format
            companiesData = apiCompanies.map(company => ({
                id: company.id,
                name: company.name,
                logo: company.logo && company.logo.url
                    ? IGDB_API.formatImageUrl(company.logo.url, 'logo_med')
                    : 'https://via.placeholder.com/200?text=Company',
                type: "Desarrolladora",
                founded: company.start_date ? new Date(company.start_date * 1000).getFullYear().toString() : 'N/A',
                country: company.country || 'N/A',
                description: company.description || 'No description available.',
                website: company.websites && company.websites.length > 0 ? company.websites[0].url : null,
                games: [] // Will be loaded on demand
            }));

            loadCompanyCards();
        } else {
            console.warn('No companies from API, using fallback data');
            companiesData = fallbackCompaniesData;
            loadCompanyCards();
        }
    } catch (error) {
        console.error('Error loading companies from API:', error);
        console.log('Using fallback data...');
        companiesData = fallbackCompaniesData;
        loadCompanyCards();
    } finally {
        isLoadingFromAPI = false;
    }
}

// Load company cards (now calls displayCompanies through filters)
function loadCompanyCards() {
    // Now handled by applyFiltersAndSort which includes country filter population
    if (typeof setupSortingAndFiltering === 'function') {
        setupSortingAndFiltering();
    } else {
        // Fallback if setup hasn't run yet
        displayCompanies(companiesData);
    }
}

// Create company card
function createCompanyCard(company) {
    const card = document.createElement('div');
    card.className = 'company-card';

    card.innerHTML = `
        <img src="${company.logo}" alt="${company.name}" class="company-logo">
        <h3 class="company-name">${company.name}</h3>
        <p class="company-type">${company.type}</p>
    `;

    card.addEventListener('click', () => showCompanyModal(company));

    return card;
}

// Show company modal with complete details
async function showCompanyModal(company) {
    const modal = document.getElementById('company-modal');
    if (!modal) return;

    // Fill basic data
    const logoEl = document.getElementById('modal-company-logo');
    const nameEl = document.getElementById('modal-company-name');
    const foundedEl = document.getElementById('modal-founded');
    const countryEl = document.getElementById('modal-country');
    const typeEl = document.getElementById('modal-type');
    const descEl = document.getElementById('modal-description');

    if (logoEl) logoEl.src = company.logo;
    if (nameEl) nameEl.textContent = company.name;
    if (foundedEl) foundedEl.textContent = company.founded;
    if (countryEl) countryEl.textContent = company.country;
    if (typeEl) typeEl.textContent = company.type;
    if (descEl) descEl.textContent = company.description;

    // Show loading state
    const gamesContainer = document.getElementById('modal-games-list');
    if (gamesContainer) {
        gamesContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #aaa;">Cargando datos completos...</div>';
    }

    // Show modal immediately
    modal.style.display = 'block';

    // Fetch COMPLETE company details from API
    try {
        const companyDetails = await IGDB_API.getCompanyDetails(company.id);

        if (!companyDetails) {
            if (gamesContainer) gamesContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #f66;">Error al cargar datos</div>';
            return;
        }

        const games = companyDetails.developed || [];

        // 1. Calculate and display average rating
        if (games.length > 0) {
            const gamesWithRating = games.filter(g => g.rating);
            const ratingEl = document.getElementById('modal-rating');
            if (ratingEl) {
                if (gamesWithRating.length > 0) {
                    const avgRating = gamesWithRating.reduce((sum, g) => sum + g.rating, 0) / gamesWithRating.length;
                    ratingEl.textContent = `${avgRating.toFixed(1)}/100`;
                } else {
                    ratingEl.textContent = 'N/A';
                }
            }
        }

        // 2. Display websites/links
        if (companyDetails.websites && companyDetails.websites.length > 0) {
            const websitesSection = document.getElementById('modal-websites');
            const websitesList = document.getElementById('modal-websites-list');
            if (websitesSection && websitesList) {
                websitesSection.style.display = 'block';
                websitesList.innerHTML = companyDetails.websites.map(site => {
                    const category = getWebsiteCategory(site.category);
                    return `<a href="${site.url}" target="_blank" class="website-link" style="display: inline-block; margin: 5px; padding: 8px 12px; background: var(--accent-color); color: white; border-radius: 8px; text-decoration: none; font-size: 0.9rem;">${category}</a>`;
                }).join('');
            }
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
        const statsSection = document.getElementById('modal-stats');
        if (platformStatsEl && Object.keys(platformStats).length > 0) {
            if (statsSection) statsSection.style.display = 'block';
            const sortedPlatforms = Object.entries(platformStats).sort((a, b) => b[1] - a[1]).slice(0, 10);
            platformStatsEl.innerHTML = sortedPlatforms.map(([platform, count]) =>
                `<div class="stat-item" style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;"><span>${platform}</span> <span style="font-weight: 600; color: var(--accent-color);">${count} juegos</span></div>`
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
        if (genreStatsEl && Object.keys(genreStats).length > 0) {
            if (statsSection) statsSection.style.display = 'block';
            const sortedGenres = Object.entries(genreStats).sort((a, b) => b[1] - a[1]).slice(0, 10);
            genreStatsEl.innerHTML = sortedGenres.map(([genre, count]) =>
                `<div class="stat-item" style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;"><span>${genre}</span> <span style="font-weight: 600; color: var(--accent-color);">${count} juegos</span></div>`
            ).join('');
        }

        // 5. Display DLCs
        const dlcs = games.filter(game => game.category && [8, 9, 10, 13, 14].includes(game.category));
        const dlcsSection = document.getElementById('modal-dlcs');
        if (dlcs.length > 0 && dlcsSection) {
            dlcsSection.style.display = 'block';
            const dlcsList = document.getElementById('modal-dlcs-list');
            if (dlcsList) {
                dlcsList.innerHTML = dlcs.slice(0, 10).map(dlc => {
                    const cover = dlc.cover ? IGDB_API.formatImageUrl(dlc.cover.url, 'cover_small') : 'https://via.placeholder.com/90x120?text=DLC';
                    return `<div class="dlc-item" style="display: inline-block; margin: 10px; text-align: center; width: 90px;"><img src="${cover}" alt="${dlc.name}" style="width: 90px; height: 120px; border-radius: 8px;"><p style="font-size: 0.8rem; margin-top: 5px;">${dlc.name}</p></div>`;
                }).join('');
            }
        }

        // 6. Display top 10 games by rating
        const gamesWithRatings = games.filter(g => g.rating && ![8, 9, 10, 13, 14].includes(g.category));
        const topGamesSection = document.getElementById('modal-top-games');
        if (gamesWithRatings.length > 0 && topGamesSection) {
            topGamesSection.style.display = 'block';
            const topGames = gamesWithRatings.sort((a, b) => b.rating - a.rating).slice(0, 10);
            const topGamesList = document.getElementById('modal-top-games-list');
            if (topGamesList) {
                topGamesList.innerHTML = topGames.map((game, index) => {
                    const cover = game.cover ? IGDB_API.formatImageUrl(game.cover.url, 'cover_small') : 'https://via.placeholder.com/90x120?text=No+Cover';
                    return `<div class="top-game-item" style="display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #eee;"><span class="rank" style="font-size: 1.5rem; font-weight: 700; color: var(--accent-color); margin-right: 15px; min-width: 40px;">#${index + 1}</span><img src="${cover}" alt="${game.name}" style="width: 60px; height: 80px; border-radius: 8px; margin-right: 15px;"><div class="game-info" style="flex: 1;"><p class="game-name" style="font-weight: 600; margin: 0 0 5px 0;">${game.name}</p><p class="game-rating" style="color: #666; margin: 0;">${game.rating.toFixed(1)}</p></div></div>`;
                }).join('');
            }
        }

        // 7. Fill featured games
        if (gamesContainer) {
            if (games.length > 0) {
                gamesContainer.innerHTML = games.slice(0, 10).map(game => {
                    const cover = game.cover ? IGDB_API.formatImageUrl(game.cover.url, 'cover_big') : 'https://via.placeholder.com/150x200?text=Game';
                    return `<div class="game-card-small" style="display: inline-block; margin: 10px; text-align: center; width: 150px;"><img src="${cover}" alt="${game.name}" style="width: 150px; height: 200px; border-radius: 12px;"><p style="font-size: 0.9rem; margin-top: 8px;">${game.name}</p></div>`;
                }).join('');
            } else {
                gamesContainer.innerHTML = '<p style="text-align: center; color: #aaa; padding: 40px;">No hay juegos disponibles</p>';
            }
        }

    } catch (error) {
        console.error('Error loading company details:', error);
        if (gamesContainer) {
            gamesContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #f66;">Error al cargar datos</div>';
        }
    }
}

// Helper: Get website category name
function getWebsiteCategory(category) {
    const categories = {
        1: 'Sitio Web',
        2: 'Wikia',
        3: 'Wikipedia',
        4: 'Twitter',
        5: 'Facebook',
        6: 'YouTube',
        8: 'iPhone',
        9: 'iPad',
        10: 'Android',
        13: 'Steam',
        14: 'Reddit',
        15: 'Itch.io',
        16: 'Epic Games',
        17: 'GOG',
        18: 'Discord'
    };
    return categories[category] || 'Enlace';
}

// Fill games
function fillGames(games) {
    const container = document.getElementById('modal-games');
    container.innerHTML = '';

    if (games && games.length > 0) {
        games.forEach(game => {
            const item = document.createElement('div');
            item.className = 'company-game-item';
            item.innerHTML = `
                <div class="company-game-image" style="background-image: url('${game.image}')"></div>
                <div class="company-game-name">${game.name}</div>
            `;
            container.appendChild(item);
        });
    }
}

// Setup modal handlers
function setupModalHandlers() {
    const modal = document.getElementById('company-modal');
    const closeBtn = document.querySelector('.company-modal-close');

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
}

// Helper: Convert country code to country name
function getCountryName(countryCode) {
    if (!countryCode) return 'N/A';

    const countries = {
        1: 'Europa',
        2: 'América del Norte',
        3: 'Australia',
        4: 'Nueva Zelanda',
        5: 'Japón',
        6: 'China',
        7: 'Asia',
        8: 'Corea del Sur',
        9: 'Brasil',
        10: 'Argentina',
        11: 'Chile',
        12: 'México',
        13: 'Perú',
        14: 'Venezuela',
        15: 'Uruguay',
        16: 'Colombia',
        17: 'Ecuador',
        18: 'Bolivia',
        19: 'Paraguay',
        20: 'Costa Rica',
        21: 'Panamá',
        22: 'Guatemala',
        23: 'Honduras',
        24: 'El Salvador',
        25: 'Nicaragua',
        26: 'Reino Unido',
        27: 'Francia',
        28: 'Alemania',
        29: 'Italia',
        30: 'España',
        31: 'Países Bajos',
        32: 'Bélgica',
        33: 'Suecia',
        34: 'Noruega',
        35: 'Dinamarca',
        36: 'Finlandia',
        37: 'Polonia',
        38: 'República Checa',
        39: 'Rusia',
        40: 'Ucrania',
        41: 'Turquía',
        42: 'Israel',
        43: 'Sudáfrica',
        44: 'Egipto',
        45: 'India',
        46: 'Pakistán',
        47: 'Tailandia',
        48: 'Filipinas',
        49: 'Malasia',
        50: 'Singapur',
        51: 'Indonesia',
        52: 'Vietnam',
        53: 'Hong Kong',
        54: 'Taiwán',
        55: 'Arabia Saudita',
        56: 'Emiratos Árabes Unidos',
        57: 'Canadá',
        58: 'Estados Unidos',
        59: 'Irlanda',
        60: 'Suiza',
        61: 'Austria',
        62: 'Grecia',
        63: 'Portugal',
        64: 'Hungría',
        65: 'Rumanía',
        66: 'Croacia',
        67: 'Eslovaquia',
        68: 'Islandia'
    };

    return countries[countryCode] || `País (${countryCode})`;
}

