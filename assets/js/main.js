// Lógica global (Menú, Búsqueda, Utilidades)

document.addEventListener('DOMContentLoaded', () => {
    console.log('Sitio cargado');
    // Inicializar buscador global aquí

    // Lógica del Modal de Filtros
    const modal = document.getElementById('filter-modal');
    const btn = document.getElementById('open-filter-btn');
    const span = document.querySelector('.close-btn');

    if (btn && modal && span) {
        btn.onclick = function() {
            modal.style.display = "block";
        }

        span.onclick = function() {
            modal.style.display = "none";
        }

        window.onclick = function(event) {
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
                    tag.querySelector('.filter-tag-close').onclick = function() {
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
    function checkTop100Status() {
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
            document.body.classList.add('top100-mode'); // Fondo blanco para el body
            if (pageTitle) {
                pageTitle.textContent = 'Top 100';
                pageTitle.classList.add('top100-active');
            }
            
            // Renderizar contenido Top 100 (Simulado)
            gamesContainer.innerHTML = `
                ${generateTop100Card('2025.01.01', 'Nombre: descripción')}
                ${generateTop100Card('2025.01.01', 'Nombre: descripción')}
                ${generateTop100Card('2025.01.01', 'Nombre: descripción')}
                ${generateTop100Card('2025.01.01', 'Nombre: descripción')}
            `;
        } else {
            // Restaurar vista Grid Normal
            gamesContainer.className = 'games-grid';
            document.body.classList.remove('top100-mode'); // Restaurar fondo original
            if (pageTitle) {
                pageTitle.textContent = 'Juegos';
                pageTitle.classList.remove('top100-active');
            }

            // Restaurar contenido Grid (Simulado - idealmente esto vendría de una API o variable global)
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

    function generateTop100Card(date, name) {
        return `
            <div class="top100-card">
                <div class="top100-info">
                    <span class="top100-date">${date}</span>
                    <span class="top100-name">${name}</span>
                </div>
                <div class="top100-img-box"></div>
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
