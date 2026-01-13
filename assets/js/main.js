// Lógica global (Menú, Búsqueda, Utilidades)

document.addEventListener('DOMContentLoaded', () => {
    console.log('Sitio cargado');
    // Global search implementation
    initializeGlobalSearch();


    // Lógica del Modal de Filtros
    const modal = document.getElementById('filter-modal');
    const btn = document.getElementById('open-filter-btn');
    const span = document.querySelector('.close-btn');

    if (btn && modal && span) {
        btn.onclick = function () {
            modal.style.display = "block";
        }

        span.onclick = function () {
            modal.style.display = "none";
        }

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    // Lógica de Acordeón para Filtros
    const accordions = document.querySelectorAll('.filter-item.accordion .filter-header');
    accordions.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            item.classList.toggle('active');
        });
    });

    // Botón Guardar Selección
    const applyBtn = document.getElementById('apply-filters-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const activeFiltersContainer = document.getElementById('active-filters');
            if (!activeFiltersContainer) return;

            activeFiltersContainer.innerHTML = ''; // Limpiar filtros anteriores

            // Buscar todos los checkboxes marcados dentro del modal
            const checkboxes = modal.querySelectorAll('input[type="checkbox"]:checked');

            checkboxes.forEach(checkbox => {
                // Obtener el texto de la etiqueta asociada
                let labelText = '';
                // Caso 1: Checkbox dentro de .filter-header-simple (Top 100)
                if (checkbox.parentElement.classList.contains('filter-header-simple')) {
                    labelText = checkbox.parentElement.querySelector('span').textContent;
                }
                // Caso 2: Checkbox dentro de .filter-option (Resto de opciones)
                else if (checkbox.parentElement.classList.contains('filter-option')) {
                    labelText = checkbox.parentElement.querySelector('span').textContent;
                }

                if (labelText) {
                    const tag = document.createElement('div');
                    tag.className = 'filter-tag';
                    tag.innerHTML = `
                        ${labelText}
                        <span class="filter-tag-close" onclick="removeFilter(this)">&times;</span>
                    `;
                    // Guardar referencia al checkbox para poder desmarcarlo luego
                    tag.dataset.checkboxId = checkbox.id || ''; // Si tuvieran ID

                    // Agregar evento de cierre personalizado para desmarcar el checkbox
                    tag.querySelector('.filter-tag-close').onclick = function () {
                        checkbox.checked = false;
                        tag.remove();
                        checkTop100Status(); // Verificar estado al eliminar
                    };

                    activeFiltersContainer.appendChild(tag);
                }
            });

            modal.style.display = "none";
            checkTop100Status(); // Verificar estado al aplicar
        });
    }

    // Función para verificar si Top 100 está activo y cambiar la vista de la pagina
    async function checkTop100Status() {
        const activeFiltersContainer = document.getElementById('active-filters');
        const gamesContainer = document.getElementById('games-container');
        const pageTitle = document.querySelector('.page-title');

        if (!activeFiltersContainer || !gamesContainer) return;

        // Buscar si existe la etiqueta "Top 100"
        const tags = activeFiltersContainer.querySelectorAll('.filter-tag');
        let isTop100Active = false;

        tags.forEach(tag => {
            if (tag.textContent.includes('Top 100')) {
                isTop100Active = true;
            }
        });

        if (isTop100Active) {
            // Cambiar a vista Top 100
            gamesContainer.className = 'games-list-top100';
            document.body.classList.add('top100-mode');
            if (pageTitle) {
                pageTitle.textContent = 'Top 100';
                pageTitle.classList.add('top100-active');
            }

            // Renderizar contenido Top 100 REAL desde API
            await renderTop100GamesReal(gamesContainer);
        } else {
            // Restaurar vista Grid Normal
            gamesContainer.className = 'games-grid';
            document.body.classList.remove('top100-mode');
            if (pageTitle) {
                pageTitle.textContent = 'Juegos';
                pageTitle.classList.remove('top100-active');
            }

            // Restaurar contenido Grid (Simulado)
            gamesContainer.innerHTML = `
                <div class="game-card"><h3 class="game-name color-red">Nombre Juego 1</h3><div class="game-tags"><span class="tag"></span><span class="tag"></span></div></div>
                <div class="game-card"><h3 class="game-name color-black">Nombre Juego 2</h3><div class="game-tags"><span class="tag"></span><span class="tag"></span></div></div>
                <div class="game-card"><h3 class="game-name color-purple">Nombre Juego 3</h3><div class="game-tags"><span class="tag"></span><span class="tag"></span></div></div>
                <div class="game-card"><h3 class="game-name color-black">Nombre Juego 4</h3><div class="game-tags"><span class="tag"></span><span class="tag"></span></div></div>
                <div class="game-card"><h3 class="game-name color-red">Nombre Juego 5</h3><div class="game-tags"><span class="tag"></span><span class="tag"></span></div></div>
                <div class="game-card"><h3 class="game-name color-purple">Nombre Juego 6</h3><div class="game-tags"><span class="tag"></span><span class="tag"></span></div></div>
            `;
        }
    }

    // Función para renderizar Top 100 juegos REALES desde la API
    async function renderTop100GamesReal(container) {
        // Mostrar estado de carga
        container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #aaa;"><div style="font-size: 2rem; margin-bottom: 10px;">⏳</div>Cargando Top 100 juegos...</div>';

        try {
            const top100Games = await IGDB_API.getTop100Games();

            if (!top100Games || top100Games.length === 0) {
                container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #aaa;">No se pudieron cargar los juegos</div>';
                return;
            }

            container.innerHTML = '';

            // Renderizar cada juego con formato Top 100
            top100Games.forEach((game, index) => {
                const rank = index + 1;
                const releaseDate = game.first_release_date
                    ? new Date(game.first_release_date * 1000).toLocaleDateString('es-ES')
                    : 'Fecha desconocida';
                const gameName = game.name;
                const rating = game.rating ? `⭐ ${game.rating.toFixed(1)}` : '';
                const coverUrl = game.cover
                    ? IGDB_API.formatImageUrl(game.cover.url, 'cover_big')
                    : 'https://via.placeholder.com/200x300?text=No+Image';

                container.innerHTML += generateTop100Card(rank, releaseDate, gameName, rating, game.id, coverUrl);
            });

            // Agregar event listeners a las tarjetas
            const cards = container.querySelectorAll('.top100-card');
            cards.forEach((card) => {
                card.addEventListener('click', () => {
                    const gameId = card.dataset.gameId;
                    if (gameId && typeof showGameModal === 'function') {
                        showGameModal(parseInt(gameId));
                    }
                });
            });

        } catch (error) {
            console.error('Error loading Top 100:', error);
            container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #ff6b81;">Error al cargar Top 100</div>';
        }
    }

    function generateTop100Card(rank, date, name, rating, gameId, coverUrl) {
        return `
            <div class="top100-card" data-game-id="${gameId || ''}" style="position: relative;">
                <div class="top100-info">
                    <div class="top100-rank" style="display: inline-block; background: rgba(255, 107, 129, 0.95); color: white; font-weight: bold; padding: 5px 10px; border-radius: 5px; font-size: 0.9rem; margin-right: 10px;">
                        #${rank}
                    </div>
                    <span class="top100-date">${date}</span>
                    <span class="top100-name">${name}</span>
                    ${rating ? `<span class="top100-rating" style="color: #fbbf24; margin-left: 10px;">${rating}</span>` : ''}
                </div>
                <div class="top100-img-box" style="background-image: url('${coverUrl}'); background-size: cover; background-position: center;"></div>
                <div class="top100-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </div>
            </div>
        `;
    }
});

// Global Search Functionality
function initializeGlobalSearch() {
    const searchInputs = document.querySelectorAll('.search-bar input[type="text"]');

    searchInputs.forEach(searchInput => {
        let searchTimeout;
        let searchResults = null;

        // Create results dropdown
        const resultsDropdown = document.createElement('div');
        resultsDropdown.className = 'search-results-dropdown';
        resultsDropdown.style.cssText = `
            position: absolute; 
            top: 100%; 
            left: 0; 
            right: 0;
            background: rgba(20, 20, 40, 0.98);
            border: 1px solid rgba(255, 107, 129, 0.3);
            border-radius: 10px;
            max-height: 400px;
            overflow-y: auto;
            display: none;
            z-index: 1000;
            margin-top: 5px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        `;
        searchInput.parentElement.style.position = 'relative';
        searchInput.parentElement.appendChild(resultsDropdown);

        // Search on input
        searchInput.addEventListener('input', async (e) => {
            const query = e.target.value.trim();

            clearTimeout(searchTimeout);

            if (query.length < 2) {
                resultsDropdown.style.display = 'none';
                return;
            }

            searchTimeout = setTimeout(async () => {
                resultsDropdown.innerHTML = '<div style="padding: 15px; color: #aaa;">Buscando...</div>';
                resultsDropdown.style.display = 'block';

                try {
                    const results = await IGDB_API.searchAll(query, 5);
                    displaySearchResults(results, resultsDropdown, query);
                } catch (error) {
                    resultsDropdown.innerHTML = '<div style="padding: 15px; color: #ff6b81;">Error en la búsqueda</div>';
                }
            }, 300);
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.parentElement.contains(e.target)) {
                resultsDropdown.style.display = 'none';
            }
        });
    });
}

function displaySearchResults(results, dropdown, query) {
    const { games, companies, platforms, events } = results;
    const totalResults = games.length + companies.length + platforms.length + events.length;

    if (totalResults === 0) {
        dropdown.innerHTML = '<div style="padding: 15px; color: #aaa;">No se encontraron resultados</div>';
        return;
    }

    let html = '';

    // Games
    if (games.length > 0) {
        html += '<div style="padding: 10px 15px; background: rgba(255, 107, 129, 0.1); font-weight: bold; color: #ff6b81; font-size: 0.85rem; text-transform: uppercase;">Juegos</div>';
        games.forEach(game => {
            const cover = game.cover ? IGDB_API.formatImageUrl(game.cover.url, 'thumb') : 'https://via.placeholder.com/50x70?text=Game';
            html += `
                <div class="search-result-item" style="padding: 10px 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,107,129,0.1)'" onmouseout="this.style.background='transparent'">
                    <img src="${cover}" style="width: 40px; height: 55px; object-fit: cover; border-radius: 4px;">
                    <div>
                        <div style="color: #fff; font-weight: 500;">${game.name}</div>
                        ${game.rating ? `<div style="color: #aaa; font-size: 0.85rem;">⭐ ${game.rating.toFixed(1)}</div>` : ''}
                    </div>
                </div>
            `;
        });
    }

    // Companies
    if (companies.length > 0) {
        html += '<div style="padding: 10px 15px; background: rgba(139, 92, 246, 0.1); font-weight: bold; color: #8b5cf6; font-size: 0.85rem; text-transform: uppercase;">Compañías</div>';
        companies.forEach(company => {
            const logo = company.logo ? IGDB_API.formatImageUrl(company.logo.url, 'thumb') : 'https://via.placeholder.com/50?text=Co';
            html += `
                <div class="search-result-item" style="padding: 10px 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(139,92,246,0.1)'" onmouseout="this.style.background='transparent'">
                    <img src="${logo}" style="width: 40px; height: 40px; object-fit: contain; border-radius: 4px; background: #fff; padding: 2px;">
                    <div>
                        <div style="color: #fff; font-weight: 500;">${company.name}</div>
                        ${company.country ? `<div style="color: #aaa; font-size: 0.85rem;">📍 ${company.country}</div>` : ''}
                    </div>
                </div>
            `;
        });
    }

    // Platforms
    if (platforms.length > 0) {
        html += '<div style="padding: 10px 15px; background: rgba(34, 197, 94, 0.1); font-weight: bold; color: #22c55e; font-size: 0.85rem; text-transform: uppercase;">Plataformas</div>';
        platforms.forEach(platform => {
            html += `
                <div class="search-result-item" style="padding: 10px 15px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(34,197,94,0.1)'" onmouseout="this.style.background='transparent'">
                    <div style="color: #fff; font-weight: 500;">${platform.name}</div>
                </div>
            `;
        });
    }

    // Events
    if (events.length > 0) {
        html += '<div style="padding: 10px 15px; background: rgba(251, 191, 36, 0.1); font-weight: bold; color: #fbbf24; font-size: 0.85rem; text-transform: uppercase;">Eventos</div>';
        events.forEach(event => {
            html += `
                <div class="search-result-item" style="padding: 10px 15px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(251,191,36,0.1)'" onmouseout="this.style.background='transparent'">
                    <div style="color: #fff; font-weight: 500;">${event.name}</div>
                </div>
            `;
        });
    }

    dropdown.innerHTML = html;
}
