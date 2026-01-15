//********************* Juego de busqueda de ODS Objetivos de Desarrollo Sostenible interactivo *********************//

const SDG_DATA = [
    { id: 1, color: '#E5243B', title: 'Fin de la Pobreza' },
    { id: 2, color: '#DDA63A', title: 'Hambre Cero' },
    { id: 3, color: '#4C9F38', title: 'Salud y Bienestar' },
    { id: 4, color: '#C5192D', title: 'Educacion de Calidad' },
    { id: 5, color: '#FF3A21', title: 'Igualdad de Genero' },
    { id: 6, color: '#26BDE2', title: 'Agua Limpia y Saneamiento' },
    { id: 7, color: '#FCC30B', title: 'Energia Asequible' },
    { id: 8, color: '#A21942', title: 'Trabajo Decente' },
    { id: 9, color: '#FD6925', title: 'Industria e Innovacion' },
    { id: 10, color: '#DD1367', title: 'Reduccion de Desigualdades' },
    { id: 11, color: '#FD9D24', title: 'Ciudades Sostenibles' },
    { id: 12, color: '#BF8B2E', title: 'Produccion Responsable' },
    { id: 13, color: '#3F7E44', title: 'Accion por el Clima' },
    { id: 14, color: '#0A97D9', title: 'Vida Submarina' },
    { id: 15, color: '#56C02B', title: 'Vida de Ecosistemas Terrestres' },
    { id: 16, color: '#00689D', title: 'Paz, Justicia e Instituciones' },
    { id: 17, color: '#19486A', title: 'Alianzas para Lograr Objetivos' }
];

class SDGGame {
    constructor() {
        this.foundIDs = JSON.parse(localStorage.getItem('8bitlore_sdg_found')) || [];
        this.totalGoals = 17;
        this.basePath = this.determineBasePath();
        this.init();
    }

    //********************* Determina ruta base segun profundidad de carpetas actual *********************//
    determineBasePath() {
    const path = window.location.pathname;
    if (path.includes('/pages/') && path.split('/').length > 3) {
        return '../../assets/images/';
    } else if (path.includes('/main/')) {
        return '../assets/images/';
    } else {
        return 'assets/images/';
    }
}

    //********************* Inicializa juego creando HUD y generando iconos *********************//
    init() {
    this.createHUD();
    this.spawnIcons();
}

    //********************* Crea interfaz de contador y boton de reinicio *********************//
    createHUD() {
    const hud = document.createElement('div');
    hud.id = 'sdg-counter-hud';
    const missionText = window.getTranslation ? window.getTranslation('sdg_mission') : 'Mision ODS';
    const resetTitle = window.getTranslation ? window.getTranslation('sdg_reset') : 'Reiniciar';

    hud.innerHTML = `
            <div class="sdg-hud-icon"></div>
            <span id="sdg-score-text">${missionText}: ${this.foundIDs.length}/${this.totalGoals}</span>
            <button id="sdg-reset-btn" title="${resetTitle}" style="background: none; border: none; color: #ff00ff; cursor: pointer; font-size: 1.2rem; margin-left: 10px;">↺</button>
        `;
    document.body.appendChild(hud);

    document.getElementById('sdg-reset-btn').addEventListener('click', () => {
        const confirmText = window.getTranslation ? window.getTranslation('sdg_reset_confirm') : 'Reiniciar?';
        if (confirm(confirmText)) {
            localStorage.removeItem('8bitlore_sdg_found');
            location.reload();
        }
    });

    const backdrop = document.createElement('div');
    backdrop.id = 'sdg-reading-backdrop';
    document.body.appendChild(backdrop);

    window.addEventListener('languageChanged', () => this.updateHUD());
}

    //********************* Actualiza texto del HUD con idioma actual *********************//
    updateHUD() {
    const scoreText = document.getElementById('sdg-score-text');
    if (scoreText) {
        const missionText = window.getTranslation ? window.getTranslation('sdg_mission') : 'Mision ODS';
        scoreText.textContent = `${missionText}: ${this.foundIDs.length}/${this.totalGoals}`;
        scoreText.style.color = '#00ffff';
        setTimeout(() => scoreText.style.color = '#fff', 500);
    }

    const resetBtn = document.getElementById('sdg-reset-btn');
    if (resetBtn && window.getTranslation) {
        resetBtn.title = window.getTranslation('sdg_reset');
    }
}

    //********************* Genera y coloca iconos ODS aleatorios en contenedores *********************//
    spawnIcons() {
    const containers = document.querySelectorAll('header, main, section, footer, .card, .hero-content');
    if (containers.length === 0) return;

    const unfound = SDG_DATA.filter(sdg => !this.foundIDs.includes(sdg.id));
    if (unfound.length === 0) return;

    const spawnCount = Math.min(Math.floor(Math.random() * 3) + 2, unfound.length);
    const toSpawn = unfound.sort(() => 0.5 - Math.random()).slice(0, spawnCount);

    toSpawn.forEach(sdg => {
        this.createIconElement(sdg, containers);
    });
}

    //********************* Crea elemento icono con imagen de fondo y posicion aleatoria *********************//
    createIconElement(sdg, containers) {
    const icon = document.createElement('div');
    icon.className = 'hidden-sdg-icon';
    icon.dataset.id = sdg.id;

    const imageUrl = `${this.basePath}ods${sdg.id}.jpg`;
    icon.style.backgroundImage = `url('${imageUrl}')`;
    icon.style.backgroundColor = sdg.color;

    const container = containers[Math.floor(Math.random() * containers.length)];
    const style = window.getComputedStyle(container);
    if (style.position === 'static') container.style.position = 'relative';

    const maxTop = container.offsetHeight - 70;
    const maxLeft = container.offsetWidth - 70;

    icon.style.top = Math.max(20, Math.floor(Math.random() * maxTop)) + 'px';
    icon.style.left = Math.max(20, Math.floor(Math.random() * maxLeft)) + 'px';

    if (container.offsetWidth < 120 || container.offsetHeight < 120) return;

    icon.addEventListener('click', (e) => {
        e.stopPropagation();
        this.startCollectionSequence(sdg, icon);
    });

    container.appendChild(icon);
}

    //********************* Inicia secuencia de zoom lectura y recoleccion de ODS *********************//
    startCollectionSequence(sdg, element) {
    if (element.classList.contains('collecting')) return;
    element.classList.add('collecting');

    const backdrop = document.getElementById('sdg-reading-backdrop');
    backdrop.classList.add('active');
    element.classList.add('sdg-reading-mode');

    setTimeout(() => {
        this.collectSDG(sdg);

        element.classList.remove('sdg-reading-mode');
        backdrop.classList.remove('active');

        element.style.transform = 'scale(0)';
        element.style.opacity = '0';
        setTimeout(() => element.remove(), 300);

    }, 2000);
}

    //********************* Registra ODS recolectado y verifica victoria *********************//
    collectSDG(sdg) {
    if (this.foundIDs.includes(sdg.id)) return;

    this.foundIDs.push(sdg.id);
    localStorage.setItem('8bitlore_sdg_found', JSON.stringify(this.foundIDs));

    this.updateHUD();

    if (this.foundIDs.length === this.totalGoals) {
        setTimeout(() => this.showVictoryModal(), 1000);
    }
}

    //********************* Muestra modal de victoria con todos los ODS recolectados *********************//
    showVictoryModal() {
    const modal = document.createElement('div');
    modal.id = 'sdg-victory-modal';
    modal.className = 'active';

    let gridHTML = '';
    SDG_DATA.forEach(sdg => {
        const img = `${this.basePath}ods${sdg.id}.jpg`;
        gridHTML += `<div class="sdg-final-item" style="background-image: url('${img}'); background-color: ${sdg.color};" title="${sdg.title}"></div>`;
    });

    const title = window.getTranslation ? window.getTranslation('sdg_victory_title') : 'MISION COMPLETADA!';
    const text = window.getTranslation ? window.getTranslation('sdg_victory_text') : 'Has reunido los 17 Objetivos...';
    const btnText = window.getTranslation ? window.getTranslation('sdg_btn_continue') : 'Continuar';

    modal.innerHTML = `
            <div class="sdg-victory-content">
                <h1 class="sdg-victory-title">${title}</h1>
                <p class="sdg-victory-text">${text}</p>
                <div class="sdg-grid-display">
                    ${gridHTML}
                </div>
                <button onclick="document.getElementById('sdg-victory-modal').remove()" style="margin-top: 30px; padding: 15px 40px; font-size: 1.2rem; cursor: pointer; background: linear-gradient(45deg, #ff6b81, #d8b4fe); border: none; color: white; border-radius: 50px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; box-shadow: 0 10px 20px rgba(255, 107, 129, 0.3); transition: transform 0.2s;">${btnText}</button>
            </div>
        `;

    document.body.appendChild(modal);
}
}

document.addEventListener('DOMContentLoaded', () => {
    window.sdgGame = new SDGGame();
});
