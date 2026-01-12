// About Page - PlayStation-Style Carousels

// Technologies data
const technologiesData = [
    {
        id: 1,
        name: "HTML5",
        icon: "🌐",
        description: "Lenguaje de marcado estándar para crear la estructura y el contenido de páginas web. Proporciona elementos semánticos para una mejor accesibilidad y SEO."
    },
    {
        id: 2,
        name: "CSS3",
        icon: "🎨",
        description: "Hojas de estilo en cascada para diseñar y dar formato visual a páginas web. Incluye animaciones, transiciones, gradientes y diseño responsivo."
    },
    {
        id: 3,
        name: "JavaScript (ES6+)",
        icon: "⚡",
        description: "Lenguaje de programación que permite crear contenido dinámico e interactivo en páginas web. Utilizado para carruseles, modales y funcionalidades interactivas."
    },
    {
        id: 4,
        name: "IGDB API",
        icon: "🎮",
        description: "API de base de datos de videojuegos de Internet Games Database, que proporciona información detallada sobre juegos, compañías, plataformas y eventos."
    }
];

// Team members data
const teamData = [
    {
        id: 1,
        name: "Sara",
        role: "Desarrolladora",
        description: "Hola! soy sara. Soy de esas personas que no pueden quedarse quietas si tienen una idea en la cabeza. Me gusta aprender de todo un poco, probar cosas nuevas y ver hasta dónde puedo llegar cuando me propongo algo. Este proyecto es solo una parte de todo lo que me gusta crear."
    },
    {
        id: 2,
        name: "Santiago",
        role: "Desarrollador",
        description: "Soy estudiante de Ingeniería Informática en la Universidad Católica Andrés Bello (UCAB). A mis 19 años, combino mi formación académica con una curiosidad insaciable por entender cómo la tecnología puede resolver problemas reales. Me considero una persona analítica, proactiva y en constante aprendizaje. Mi objetivo no es solo escribir código, sino crear soluciones eficientes e innovadoras. Actualmente, estoy enfocado en fortalecer mis habilidades en desarrollo web y busco oportunidades para aplicar mis conocimientos en proyectos desafiantes."
    },
    {
        id: 3,
        name: "Charbel",
        role: "Desarrollador",
        description: "Soy Charbel."
    }
];

let currentTechIndex = 0;
let currentTeamIndex = 0;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadTechCarousel();
    loadTeamCarousel();
    setupNavigationHandlers();
});

// Load technologies carousel
function loadTechCarousel() {
    const carousel = document.getElementById('tech-carousel');
    carousel.innerHTML = '';

    technologiesData.forEach((tech, index) => {
        const item = document.createElement('div');
        item.className = `carousel-item ${index === currentTechIndex ? 'active' : ''}`;
        item.dataset.index = index;

        item.innerHTML = `
            <div class="tech-card">
                <div class="tech-icon">${tech.icon}</div>
                <div class="tech-card-name">${tech.name}</div>
            </div>
        `;

        item.addEventListener('click', () => selectTech(index));
        carousel.appendChild(item);
    });

    updateTechInfo();
}

// Load team carousel
function loadTeamCarousel() {
    const carousel = document.getElementById('team-carousel');
    carousel.innerHTML = '';

    teamData.forEach((member, index) => {
        const item = document.createElement('div');
        item.className = `carousel-item ${index === currentTeamIndex ? 'active' : ''}`;
        item.dataset.index = index;

        item.innerHTML = `
            <div class="team-card">
                <div class="team-avatar">👤</div>
                <div class="team-card-name">${member.name}</div>
            </div>
        `;

        item.addEventListener('click', () => selectTeam(index));
        carousel.appendChild(item);
    });

    updateTeamInfo();
}

// Select technology
function selectTech(index) {
    currentTechIndex = index;

    const items = document.querySelectorAll('#tech-carousel .carousel-item');
    items.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    updateTechInfo();
}

// Select team member
function selectTeam(index) {
    currentTeamIndex = index;

    const items = document.querySelectorAll('#team-carousel .carousel-item');
    items.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    updateTeamInfo();
}

// Update tech info display
function updateTechInfo() {
    const tech = technologiesData[currentTechIndex];
    document.getElementById('tech-name').textContent = tech.name;
    document.getElementById('tech-description').textContent = tech.description;
}

// Update team info display
function updateTeamInfo() {
    const member = teamData[currentTeamIndex];
    document.getElementById('team-name').textContent = `${member.name} - ${member.role}`;
    document.getElementById('team-description').textContent = member.description;
}

// Setup navigation handlers
function setupNavigationHandlers() {
    // Tech navigation
    document.getElementById('tech-prev').addEventListener('click', () => {
        currentTechIndex = (currentTechIndex - 1 + technologiesData.length) % technologiesData.length;
        selectTech(currentTechIndex);
    });

    document.getElementById('tech-next').addEventListener('click', () => {
        currentTechIndex = (currentTechIndex + 1) % technologiesData.length;
        selectTech(currentTechIndex);
    });

    // Team navigation
    document.getElementById('team-prev').addEventListener('click', () => {
        currentTeamIndex = (currentTeamIndex - 1 + teamData.length) % teamData.length;
        selectTeam(currentTeamIndex);
    });

    document.getElementById('team-next').addEventListener('click', () => {
        currentTeamIndex = (currentTeamIndex + 1) % teamData.length;
        selectTeam(currentTeamIndex);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            // Navigate tech carousel
            currentTechIndex = (currentTechIndex - 1 + technologiesData.length) % technologiesData.length;
            selectTech(currentTechIndex);
        } else if (e.key === 'ArrowRight') {
            // Navigate tech carousel
            currentTechIndex = (currentTechIndex + 1) % technologiesData.length;
            selectTech(currentTechIndex);
        }
    });
}
