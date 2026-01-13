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
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #aaa;">😕 No se encontraron compañías con estos filtros</div>';
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

    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #aaa;"><div style="font-size: 2rem; margin-bottom: 10px;">⏳</div>Cargando compañías...</div>';
}

// Load companies from IGDB API
async function loadCompaniesFromAPI() {
    isLoadingFromAPI = true;

    try {
        console.log('🏢 Loading companies from IGDB API...');
        const apiCompanies = await IGDB_API.getCompanies(12);

        if (apiCompanies && apiCompanies.length > 0) {
            console.log(`✅ Loaded ${apiCompanies.length} companies from API`);

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
            console.warn('⚠️ No companies from API, using fallback data');
            companiesData = fallbackCompaniesData;
            loadCompanyCards();
        }
    } catch (error) {
        console.error('❌ Error loading companies from API:', error);
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

// Show company modal
async function showCompanyModal(company) {
    const modal = document.getElementById('company-modal');

    // Fill modal data
    document.getElementById('modal-company-logo').src = company.logo;
    document.getElementById('modal-company-name').textContent = company.name;
    document.getElementById('modal-founded').textContent = company.founded;
    document.getElementById('modal-country').textContent = company.country;
    document.getElementById('modal-type').textContent = company.type;
    document.getElementById('modal-description').textContent = company.description;

    // Show loading for games
    const gamesContainer = document.getElementById('modal-games');
    gamesContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #aaa;">Cargando juegos...</div>';

    // Load company games from API if not cached
    if ((!company.games || company.games.length === 0) && isLoadingFromAPI) {
        try {
            const companyGames = await IGDB_API.getGamesByCompany(company.id, 10);
            if (companyGames && companyGames.length > 0) {
                company.games = companyGames.map(game => ({
                    name: game.name,
                    image: game.cover ? IGDB_API.formatImageUrl(game.cover.url, 'cover_big') : 'https://via.placeholder.com/150x200?text=Game'
                }));
            }
        } catch (error) {
            console.error('Error loading company games:', error);
        }
    }

    // Fill games
    fillGames(company.games || []);

    // Website link
    if (company.website) {
        document.getElementById('modal-website').href = company.website;
        document.getElementById('modal-website-section').style.display = 'block';
    } else {
        document.getElementById('modal-website-section').style.display = 'none';
    }

    // Show modal
    modal.style.display = 'block';
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
